import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./products";
import usersRoutes from "./users";
import cartRoutes from "./carts";

const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productRoutes);
rootRouter.use("/users", usersRoutes)
rootRouter.use("/carts", cartRoutes)

export default rootRouter;