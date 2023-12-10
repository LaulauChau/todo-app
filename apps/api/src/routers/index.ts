import { Router } from "express";

import { AuthController } from "~/controllers/auth.controller";
import { TodosController } from "~/controllers/todos.controller";
import { authenticated } from "~/middlewares/authenticated";
import { AuthService } from "~/services/auth.service";
import { TodosService } from "~/services/todos.service";
import { UsersService } from "~/services/users.service";
import { UtilsService } from "~/services/utils.service";
import { AuthRouter } from "./auth.router";
import { TodosRouter } from "./todos.router";

const utilsService = new UtilsService();
const usersService = new UsersService(utilsService);
const authService = new AuthService(utilsService, usersService);
const todosService = new TodosService();

const authController = new AuthController(authService, usersService);
const todosController = new TodosController(todosService);

const authRouter = new AuthRouter(authController);
const todosRouter = new TodosRouter(authService, todosController);

export const router = Router();

router.use("/auth", authRouter.router);
router.use("/todos", authenticated, todosRouter.router);
