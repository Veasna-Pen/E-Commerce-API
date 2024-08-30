import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const createOrder = async (req: Request, res: Response) => {
    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user?.id,
            },
            include: {
                product: true
            }
        })

        if (cartItems.length == 0) {
            return res.json({ message: "cart is empty" });
        }

        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0)

        const address = await tx.address.findFirst({
            where: {
                id: req.user?.defaulShippingAddress!
            }
        })

        const order = await tx.order.create({
            data: {
                userId: req.user?.id!,
                netAmount: price,
                address: address!.formattedAddress,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })

        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        })

        await tx.cartItem.deleteMany({
            where: {
                userId: req.user?.id
            }
        })

        return res.json(order)
    })
}

export const listOrders = async (req: Request, res: Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user?.id
        }
    })

    res.json(orders)
}

export const cancelOrder = async (req: Request, res: Response) => {

    const { id } = req.params
    const userId = req.user?.id

    try {
        const result = await prismaClient.$transaction(async (tx) => {

            const order = await tx.order.findUnique({
                where: {
                    id
                }
            })

            if (!order) {
                throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
            }

            if (order.userId !== userId) {
                throw new UnauthorizedException("You are not allowed to cancel this order", ErrorCode.UNAUTHORIZED);
            }

            const updatedOrder = await tx.order.update({
                where: {
                    id
                },
                data: {
                    status: "CANCELLED"
                }
            })

            await tx.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: "CANCELLED"
                }
            })

            return updatedOrder;
        })

        res.json(result)
    } catch (error) {
        throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND)
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })

        res.json(order)
    } catch (error) {
        throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listAllOrders = async (req: Request, res: Response) => {

    let whereClause = {}
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = parseInt(req.query.take as string, 10) || 5;

    const status = req.query.status

    if (status) {
        whereClause = {
            status
        }
    }

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip,
        take
    })

    res.json(orders)
}

export const changeStatus = async (req: Request, res: Response) => {
    try {
        const result = await prismaClient.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: {
                    id: req.params.id,
                },
                data: {
                    status: req.body.status,
                },
            });

            if (!order) {
                throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND);
            }

            await tx.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: req.body.status,
                },
            });

            return order;
        });

        res.json(result);
    } catch (err) {
        throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listUserOrders = async (req: Request, res: Response) => {

    const skip = parseInt(req.query.skip as string, 10) || 0;
    const take = parseInt(req.query.take as string, 10) || 5;

    let whereClause: any = {
        userId: req.params.id
    }

    const status = req.params.status
    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip,
        take
    })

    res.json(orders)
}