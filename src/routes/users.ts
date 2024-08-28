import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { addAddress, changeUserRole, deleteAddress, getUserId, listAddress, listUsers, updateUser } from "../controllers/users";
import adminMiddleware from "../middlewares/admin";

const usersRoutes: Router = Router();

usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress))
usersRoutes.delete('/address/:id', [authMiddleware], errorHandler(deleteAddress))
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress))
usersRoutes.put('/', [authMiddleware], errorHandler(updateUser))
usersRoutes.get('/', [authMiddleware, adminMiddleware], errorHandler(listUsers))
usersRoutes.get('/:id', [authMiddleware, adminMiddleware], errorHandler(getUserId))
usersRoutes.put('/role/:id', [authMiddleware, adminMiddleware], errorHandler(changeUserRole))

export default usersRoutes;