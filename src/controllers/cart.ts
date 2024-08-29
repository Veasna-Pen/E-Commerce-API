import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartItemSchema } from "../schema/cart";
import { Product } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode, HttpException } from "../exceptions/root";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addItemToCart = async (req: Request, res: Response) => {
    const validatedData = CreateCartItemSchema.parse(req.body)

    let product: Product

    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }

    // Check if the cart item already exists for the user
    const existingCartItem = await prismaClient.cartItem.findFirst({
        where: {
            userId: req.user?.id,
            productId: validatedData.productId
        }
    });

    if (!req.user?.id) {
        throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
    }

    if (existingCartItem) {
        const updatedCartItem = await prismaClient.cartItem.update({
            where: { id: existingCartItem.id },
            data: {
                quantity: existingCartItem.quantity + 1,
            }
        });

        res.json(updatedCartItem)

    } else {
        const cart = await prismaClient.cartItem.create({
            data: {
                userId: req.user?.id,
                productId: product?.id,
                quantity: validatedData.quantity
            }
        })

        res.json(cart)
    }


}

export const deleteItemFromCart = async (req: Request, res: Response) => {

    const cartItemId = req.params.id;
    const cartItem = await prismaClient.cartItem.findUnique({
        where: { id: cartItemId }
    });

    if (!cartItem) {
        throw new BadRequestsException("Cart item not found", ErrorCode.PRODUCT_NOT_FOUND);
    }

    if (cartItem.userId !== req.user?.id) {
        throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
    } 
    
    await prismaClient.cartItem.delete({
        where: {
            id: req.params.id
        }
    })
    res.json(cartItem)

}

export const changeQuantity = async (req: Request, res: Response) => {
    const validatedData = ChangeQuantitySchema.parse(req.body)

    const updateCart = await prismaClient.cartItem.update({
        where: {
            id: req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    })

    res.json(updateCart)
}

export const getUserCartItem = async (req: Request, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user?.id
        },
        include: {
            product: true
        }
    })

    res.json(cart)
}