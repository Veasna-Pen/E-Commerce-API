import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addAddress, deleteAddress, listAddress } from "../controllers/users";

const usersRoutes: Router = Router();

usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress))
usersRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress))
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress))

export default usersRoutes;