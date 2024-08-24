import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

interface AuthenticatedRequest extends Request {
    user?: any; 
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });

        if (!user) {
            return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
};

export default authMiddleware;
