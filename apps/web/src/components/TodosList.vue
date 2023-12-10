<script setup lang="ts">
import { StarIcon as OutlineStarIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { StarIcon as SolidStartIcon } from "@heroicons/vue/24/solid";
import type { Todo } from "@repo/database";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

import { logout } from "~/services/auth-service";
import { deleteTodo, updateTodo } from "~/services/todos-service";
import { getErrorMessage } from "~/utils/errors-handler";

const props = defineProps<{ todos: Todo[] }>();
const emit = defineEmits(["revalidate"]);
const toast = useToast();
const router = useRouter();

async function remove(todo: Todo) {
  try {
    await deleteTodo(todo.id);

    emit("revalidate");
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  }
}

async function update(id: string, data: Partial<Todo>) {
  try {
    await updateTodo(id, data);

    emit("revalidate");
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  }
}

async function edit(id: string) {
  await router.push({ name: "todos-edit", params: { id } });
}

async function logoutUser() {
  await logout();

  await router.push({ name: "auth", params: { type: "login" } });
}
</script>

<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Todos</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all your todos.</p>
      </div>
      <div class="mt-4 flex items-center gap-6 sm:ml-16 sm:mt-0 sm:flex-none">
        <router-link
          :to="{ name: 'todos-edit' }"
          class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add Todo
        </router-link>
        <button
          type="button"
          class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-600 hover:text-white"
          @click="logoutUser"
        >
          Log out
        </button>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Prioritized
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Title
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Completed
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody v-if="props.todos.length" class="divide-y divide-gray-200">
              <tr v-for="todo in props.todos" :key="todo.id" class="hover:bg-gray-50">
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <button
                    type="button"
                    @click="update(todo.id, { prioritized: !todo.prioritized })"
                  >
                    <span class="sr-only">Prioritize</span>
                    <OutlineStarIcon v-if="!todo.prioritized" class="h-5 w-5 text-gray-400" />
                    <SolidStartIcon v-else class="h-5 w-5 text-yellow-400" />
                  </button>
                </td>
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                >
                  {{ todo.title }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    :checked="todo.completed"
                    @click="update(todo.id, { completed: !todo.completed })"
                    class="accent-indigo-600"
                  />
                </td>
                <td class="space-x-4 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <button
                    type="button"
                    class="text-gray-400 hover:text-indigo-600"
                    title="Edit"
                    @click="edit(todo.id)"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    class="text-gray-400 hover:text-red-600"
                    title="Delete"
                    @click="remove(todo)"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tbody v-else class="divide-y divide-gray-200">
              <tr>
                <td colspan="3" class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  No todos found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
