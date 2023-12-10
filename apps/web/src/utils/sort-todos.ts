import type { Todo } from "@repo/database";

export function sortTodos(todos: Todo[]): Todo[] {
  return todos.sort((a, b) => {
    // First, sort by prioritization
    if (a.prioritized && !b.prioritized) {
      return -1;
    }
    if (!a.prioritized && b.prioritized) {
      return 1;
    }

    // Then, for todos with the same prioritization status, sort by completion
    // Here, completed todos come first
    if (a.completed && !b.completed) {
      return -1;
    }
    if (!a.completed && b.completed) {
      return 1;
    }

    return 0;
  });
}
