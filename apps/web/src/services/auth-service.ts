import { z } from "zod";

import { getErrorMessage } from "~/utils/errors-handler";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(3),
});

const responseSchema = z.object({
  message: z.string(),
});

type Response = z.infer<typeof responseSchema>;

export async function login(email: string, password: string): Promise<Response> {
  try {
    const validatedData = loginSchema.parse({ email, password });

    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(validatedData),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return responseSchema.parse(data);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
}

export async function logout(): Promise<Response> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return responseSchema.parse(data);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
}

export async function me(): Promise<Response> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return responseSchema.parse(data);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
}

export async function register(name: string, email: string, password: string): Promise<Response> {
  try {
    const validatedData = registerSchema.parse({ name, email, password });

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(validatedData),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return responseSchema.parse(data);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
}
