import { Router } from "express";
import { Login, me, Signup } from "../controllers/auth";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

const authRoutes = Router();

authRoutes.post('/login', errorHandler(Login))
authRoutes.post('/signup', errorHandler(Signup))
authRoutes.get('/me', [authMiddleware], errorHandler(me))

export default authRoutes;