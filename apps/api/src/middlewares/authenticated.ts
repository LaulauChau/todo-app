import type { NextFunction, Request, Response } from "express";

import { AuthService } from "~/services/auth.service";
import { UsersService } from "~/services/users.service";
import { UtilsService } from "~/services/utils.service";

const utilsService = new UtilsService();
const usersService = new UsersService(utilsService);
const authService = new AuthService(utilsService, usersService);

export async function authenticated(req: Request, res: Response, next: NextFunction) {
  const { auth } = req.cookies;

  if (!auth) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await authService.verifyToken(auth);
    return next();
  } catch (error: unknown) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
