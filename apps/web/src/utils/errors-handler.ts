import { ZodError } from "zod";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message).join("\n");
  }

  return "An unknown error occurred";
}
