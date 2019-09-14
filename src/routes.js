import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import UserController from "./app/controllers/userController";
import SessionController from "./app/controllers/sessionController";
import fileController from "./app/controllers/fileController";
import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);

routes.use(authMiddleware);

routes.post("/files", upload.single("file"), fileController.store);

routes.put("/users", UserController.update);

export default routes;
