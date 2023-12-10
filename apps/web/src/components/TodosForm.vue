<script setup lang="ts">
import type { Todo } from "@repo/database";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

import { createTodo, updateTodo } from "~/services/todos-service";
import { getErrorMessage } from "~/utils/errors-handler";

const props = defineProps<{ todo: Todo | null }>();
const toast = useToast();
const router = useRouter();

const title = ref("");
const description = ref("");
const completed = ref(false);
const prioritized = ref(false);

async function submit(): Promise<void> {
  try {
    if (props.todo === null) {
      await createTodo({
        title: title.value,
        description: description.value,
        completed: completed.value,
        prioritized: prioritized.value,
      });

      toast.success("Todo created successfully");
    } else {
      await updateTodo(props.todo.id, {
        title: title.value,
        description: description.value,
        completed: completed.value,
        prioritized: prioritized.value,
      });

      toast.success("Todo updated successfully");
    }

    await router.push({ name: "todos" });
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  }
}

onMounted(() => {
  if (props.todo === null) {
    return;
  }

  title.value = props.todo.title;
  description.value = props.todo.description || "";
  completed.value = props.todo.completed;
  prioritized.value = props.todo.prioritized;
});
</script>

<template>
  <div class="flex flex-col justify-center px-6 py-12 lg:px-8">
    <h1 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
      {{ props.todo === null ? "Create a new todo" : "Update todo" }}
    </h1>
    <form @submit.prevent="submit" class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          v-model="title"
          class="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium leading-6 text-gray-900"
          >Description</label
        >
        <input
          type="text"
          name="description"
          id="description"
          v-model="description"
          class="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div class="mt-4 flex items-center gap-4">
        <div class="flex items-center">
          <input
            id="completed"
            name="completed"
            type="checkbox"
            v-model="completed"
            class="h-4 w-4 rounded border-gray-300 accent-indigo-600 focus:ring-indigo-500"
          />
          <label for="completed" class="ml-2 block text-sm text-gray-900">Completed</label>
        </div>

        <div class="flex items-center">
          <input
            id="prioritized"
            name="prioritized"
            type="checkbox"
            v-model="prioritized"
            class="h-4 w-4 rounded border-gray-300 accent-indigo-600 focus:ring-indigo-500"
          />
          <label for="prioritized" class="ml-2 block text-sm text-gray-900">Prioritized</label>
        </div>
      </div>

      <div class="mt-6 flex items-center">
        <button
          type="submit"
          class="flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {{ props.todo === null ? "Create" : "Update" }}
        </button>
        <router-link
          :to="{ name: 'todos' }"
          class="ml-4 flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>
