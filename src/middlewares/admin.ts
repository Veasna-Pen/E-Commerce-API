import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";

interface AdminAuthenticatedRequest extends Request {
    user?: any; 
}

const adminMiddleware = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user

    if (user?.role == 'ADMIN') {
        next()
    } else {
        next(new UnauthorizedException("Unauthorized access to this action", ErrorCode.UNAUTHORIZED))
    }
}

export default adminMiddleware;