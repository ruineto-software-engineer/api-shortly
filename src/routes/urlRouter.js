import { Router } from "express";
import { deleteUrl, getShortUrl, getUser, postUrl } from "../controllers/urlsController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import urlSchema from "../schemas/urlSchema.js";

const urlRouter = Router();
urlRouter.post('/urls/shorten', validateTokenMiddleware, validateSchemaMiddleware(urlSchema), postUrl);
urlRouter.get('/urls/:shortUrl', getShortUrl);
urlRouter.delete('/urls/:id', validateTokenMiddleware, deleteUrl);
urlRouter.get('/users/:id', getUser);
export default urlRouter;