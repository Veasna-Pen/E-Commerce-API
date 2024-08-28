import { Request, Response } from "express";
import { AddressSchema, ChangeUserRoleSchema, UpdateUserSchema } from "../schema/user";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body)

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user?.id
        }
    })
    res.json(address)
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: req.params.id,
            }
        })
        res.json({ success: true })
    } catch (error) {
        throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const listAddress = async (req: Request, res: Response) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: req.user?.id
        }
    })

    res.json(addresses)
}

export const updateUser = async (req: Request, res: Response) => {
    const validatedData = UpdateUserSchema.parse(req.body)
    let shippingAddress: Address
    let billingAddress: Address

    if (validatedData.defaulShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaulShippingAddress
                }
            })
        } catch (error) {
            throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND)
        }

        if (shippingAddress.userId != req.user?.id) {
            throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }

    if (validatedData.defaultBillingAddress) {
        try {

            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            })
        } catch (error) {
            throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND)
        }
        if (billingAddress.userId != req.user?.id) {
            throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_DOES_NOT_BELONG)
        }
    }

    const updateUser = await prismaClient.user.update({
        where: {
            id: req.user?.id
        },
        data: validatedData
    })

    res.json(updateUser)
}

export const listUsers = async (req: Request, res: Response) => {

    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = parseInt(req.query.take as string, 10) || 5;
    const search = req.query.search as string || '';

    const count = await prismaClient.user.count({
        where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } }
            ]
        }
    });


    const users = await prismaClient.user.findMany({
        where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
            ]
        },
        skip: skip,
        take: take,
        select: {
            id: true,
            name: true,
            email: true,
            defaulShippingAddress: true,
            defaultBillingAddress: true
        }
    });

    res.json({
        count,
        data: users,
        skip,
        take
    })

}

export const getUserId = async (req: Request, res: Response) => {
    try {

        const user = await prismaClient.user.findFirst({
            where: {
                id: req.params.id
            },
            include: {
                addresses: true
            }
        })

        if (!user) {
            throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
        }

        res.json(user)

    } catch (error) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    }
}

export const changeUserRole = async (req: Request, res: Response) => {
    try {

        const { role } = ChangeUserRoleSchema.parse(req.body);

        const user = await prismaClient.user.update({
            where: {
                id: req.params.id
            },
            data: {
                role: role
            }
        })

        res.json(user)
    } catch (error) {
        throw new BadRequestsException("Role not found", ErrorCode.UNPROCESSABLE_ENTITY)
    }
}