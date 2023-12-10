import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { AuthController } from "~/controllers/auth.controller";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = loginSchema.extend({
  name: z.string(),
});

export class AuthRouter {
  public readonly router = Router();

  constructor(private readonly authController: AuthController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { auth } = req.cookies;

        const user = await this.authController.me(auth);

        res.status(200).json({ message: "User data retrieved successfully", data: user });
      } catch (error: unknown) {
        next(error);
      }
    });

    this.router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = loginSchema.parse(req.body);

        const { accessToken } = await this.authController.login(email, password);

        res
          .cookie("auth", accessToken, {
            httpOnly: true,
            secure: String(process.env.NODE_ENV) === "production",
          })
          .status(200)
          .json({ message: "Login successful" });
      } catch (error: unknown) {
        next(error);
      }
    });

    this.router.post("/logout", async (_: Request, res: Response, next: NextFunction) => {
      try {
        res.clearCookie("auth").status(200).json({ message: "Logout successful" });
      } catch (error: unknown) {
        next(error);
      }
    });

    this.router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { name, email, password } = registerSchema.parse(req.body);

        const { accessToken } = await this.authController.register(name, email, password);

        res
          .cookie("auth", accessToken, {
            httpOnly: true,
            secure: String(process.env.NODE_ENV) === "production",
          })
          .status(201)
          .json({ message: "Registration successful" });
      } catch (error: unknown) {
        next(error);
      }
    });
  }
}
