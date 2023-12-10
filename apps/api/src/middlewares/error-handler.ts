import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export async function ErrorHandler(
  error: Error | ZodError | unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: error.message,
      errors: error.issues.map((issue) => issue.message),
    });
  }

  if (error instanceof Error) {
    res.status(500).json({
      message: error.message,
    });
  }

  next();
}
