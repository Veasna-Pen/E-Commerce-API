import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./products";

const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productRoutes);

export default rootRouter;