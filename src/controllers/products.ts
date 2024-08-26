import { Request, Response } from "express";
import { prismaClient } from "..";
import { ProductSchema } from "../schema/product";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {

    ProductSchema.parse(req.body)

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(",")
        }
    })

    res.json(product)
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body

        if (product.tags) {
            product.tags = product.tags.join(",")
        }

        const updateProduct = await prismaClient.product.update({
            where: {
                id: req.params.id
            },
            data: product
        })

        res.json(updateProduct)

    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {

        const { id } = req.params

        const deleteProduct = await prismaClient.product.delete({
            where: {
                id: id
            }
        })

        res.json(deleteProduct)

    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const listProducts = async (req: Request, res: Response) => {

    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = parseInt(req.query.take as string, 10) || 5;
    const search = req.query.search as string || '';

    const count = await prismaClient.product.count({
        where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }
    });

    const products = await prismaClient.product.findMany({
        where: {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        },
        skip: skip,
        take: take,
    });


    res.json({
        count,
        data: products,
        skip,
        take
    })

}

export const getProductId = async (req: Request, res: Response) => {
    try {

        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: req.params.id
            }
        })

        res.json(product)

    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
}