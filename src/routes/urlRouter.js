import { Router } from "express";
import { getShortUrl, postUrl } from "../controllers/urlsController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRouter = Router();
urlRouter.post('/urls/shorten', validateTokenMiddleware, validateSchemaMiddleware(urlSchema), postUrl);
urlRouter.get('/urls/:shortUrl', getShortUrl);
export default urlRouter;