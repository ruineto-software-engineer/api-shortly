import { Router } from "express";
import { createUser, getUser, getUserShortUrls, getUsersRanking } from "../controllers/userController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import userSchema from "../schemas/userSchema.js";

const userRouter = Router();
userRouter.post('/users', validateSchemaMiddleware(userSchema), createUser);
userRouter.get('/users', validateTokenMiddleware, getUser);
userRouter.get('/users/ranking', getUsersRanking);
userRouter.get('/users/:id', getUserShortUrls);
export default userRouter;