import { Router } from "express";
import { Login } from "../controllers/auth";

const authRoutes = Router();

authRoutes.get('/login', Login)

export default authRoutes;