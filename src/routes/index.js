import { Router } from "express";
import authRouter from "./authRouter.js";
import urlRouter from "./urlRouter.js";
import userRouter from "./userRouter.js";

const router = Router();
router.use(authRouter);
router.use(userRouter);
router.use(urlRouter);

export default router;