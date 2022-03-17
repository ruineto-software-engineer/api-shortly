import { Router } from "express";
import { postUrl } from "../controllers/urlsController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRouter = Router();
urlRouter.use(validateTokenMiddleware);
urlRouter.post('/urls/shorten', validateSchemaMiddleware(urlSchema), postUrl);
export default urlRouter;