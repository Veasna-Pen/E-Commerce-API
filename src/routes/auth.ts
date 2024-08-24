import { Router } from "express";
import { Login, Signup } from "../controllers/auth";
import { errorHandler } from "../error-handler";

const authRoutes = Router();

authRoutes.post('/login', errorHandler(Login))
authRoutes.post('/signup', errorHandler(Signup))

export default authRoutes;