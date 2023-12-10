import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { TodosController } from "~/controllers/todos.controller";
import { AuthService } from "~/services/auth.service";

const createSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  prioritized: z.boolean().optional(),
});

const findAllSchema = z.object({
  skip: z.number().optional(),
  take: z.number().optional(),
  cursor: z.string().optional(),
  where: z.string().optional(),
  orderBy: z.string().optional(),
});

const findOneSchema = z.object({
  id: z.string().uuid(),
});

const updateSchema = createSchema.partial();

export class TodosRouter {
  public readonly router = Router();

  constructor(
    private readonly authService: AuthService,
    private readonly todosController: TodosController,
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = createSchema.parse(req.body);
        const user = await this.authService.verifyToken(req.cookies.auth);

        const todo = await this.todosController.create({
          ...data,
          user: { connect: { id: user.id } },
        });

        res.status(201).json({ message: "Todo created", data: todo });
      } catch (error: unknown) {
        next(error);
      }
    });

    this.router.get("/", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { skip, take, cursor, where, orderBy } = findAllSchema.parse(req.query);
        const user = await this.authService.verifyToken(req.cookies.auth);

        const todos = await this.todosController.findAll({
          skip: skip ? Number(skip) : undefined,
          take: take ? Number(take) : undefined,
          cursor: cursor ? JSON.parse(String(cursor)) : undefined,
          where: where ? JSON.parse(String(where)) : undefined,
          orderBy: orderBy ? JSON.parse(String(orderBy)) : undefined,
          userId: user.id,
        });

        res.status(200).json({ message: "Todos found", data: todos });
      } catch (error: unknown) {
        next(error);
      }
    });

    this.router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = findOneSchema.parse(req.params);

        const todo = await this.todosController.findOne({ id });

        res.status(200).json({ message: "Todo found", data: todo });
      } catch (error: unknown) {
        next(error);
      }
    });

    this.router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = findOneSchema.parse(req.params);
        const data = updateSchema.parse(req.body);

        const todo = await this.todosController.update({ where: { id }, data });

        res.status(200).json({ message: "Todo updated", data: todo });
      } catch (error: unknown) {
        next(error);
      }
    });

    this.router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = findOneSchema.parse(req.params);

        const todo = await this.todosController.delete({ id });

        res.status(200).json({ message: "Todo deleted", data: todo });
      } catch (error: unknown) {
        next(error);
      }
    });
  }
}
