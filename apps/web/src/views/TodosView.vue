<script setup lang="ts">
import type { Todo } from "@repo/database";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";

import TodosList from "~/components/TodosList.vue";
import { getTodos } from "~/services/todos-service";
import { getErrorMessage } from "~/utils/errors-handler";
import { sortTodos } from "~/utils/sort-todos";
import TodosFormView from "./TodosFormView.vue";

const todos = ref<Todo[]>([]);
const route = useRoute();
const name = computed(() => route.name);
const toast = useToast();

async function fetchTodos(): Promise<void> {
  try {
    const data = await getTodos();

    todos.value = sortTodos(
      data.data.map((todo) => ({
        ...todo,
        description: todo.description || null,
      })) as Todo[],
    );
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  }
}

async function revalidate(): Promise<void> {
  await fetchTodos();
}

onMounted(fetchTodos);

watch(() => route.name, revalidate);
</script>

<template>
  <TodosList :todos="todos" @revalidate="revalidate" v-if="name === 'todos'" />
  <TodosFormView v-else-if="name === 'todos-edit'" />
</template>
