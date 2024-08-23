import { Router } from "express";
import { Login, Signup } from "../controllers/auth";

const authRoutes = Router();

authRoutes.get('/login', Login)
authRoutes.post('/signup', Signup)

export default authRoutes;