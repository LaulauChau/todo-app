import type { Todo } from "@repo/database";
import { z } from "zod";

import { getErrorMessage } from "~/utils/errors-handler";

const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3),
  description: z.string().nullable(),
  completed: z.boolean(),
  prioritized: z.boolean(),
  userId: z.string().uuid(),
});

const updateTodoSchema = todoSchema.omit({ id: true, userId: true }).partial();

const responseSchema = z.object({
  message: z.string(),
  data: z.array(todoSchema),
});

type Response = z.infer<typeof responseSchema>;

export async function createTodo(data: Omit<Todo, "id" | "userId">): Promise<Response> {
  try {
    const validatedData = todoSchema.omit({ id: true, userId: true }).parse(data);

    const response = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ ...validatedData, description: validatedData.description ?? "" }),
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getTodo(id: string): Promise<{ message: string; data: Todo }> {
  try {
    const validatedData = todoSchema.pick({ id: true }).parse({ id });

    const response = await fetch(`/api/todos/${validatedData.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }

    return responseData as { message: string; data: Todo };
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getTodos(): Promise<Response> {
  try {
    const response = await fetch("/api/todos", {
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

export async function updateTodo(id: string, data: Partial<Todo>) {
  try {
    const validatedId = todoSchema.pick({ id: true }).parse({ id });
    const validatedData = updateTodoSchema.parse(data);

    const response = await fetch(`/api/todos/${validatedId.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...validatedData, description: validatedData.description ?? "" }),
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteTodo(id: string) {
  try {
    const validatedData = todoSchema.pick({ id: true }).parse({ id });

    const response = await fetch(`/api/todos/${validatedData.id}`, {
      method: "DELETE",
      body: JSON.stringify(validatedData),
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message);
    }

    return responseData;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
}
