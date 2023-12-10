<script setup lang="ts">
import type { Todo } from "@repo/database";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";

import TodosForm from "~/components/TodosForm.vue";
import { getTodo } from "~/services/todos-service";
import { getErrorMessage } from "~/utils/errors-handler";

const emit = defineEmits(["revalidate"]);
const todo = ref<Todo | null>(null);
const loading = ref(false);
const route = useRoute();
const id = computed(() => route.params.id);
const toast = useToast();

async function fetchTodo(): Promise<void> {
  if (id.value === undefined) {
    return;
  }

  loading.value = true;

  try {
    const { data } = await getTodo(String(id.value));

    todo.value = {
      ...data,
      description: data.description || null,
    };
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  } finally {
    loading.value = false;
  }
}

onMounted(fetchTodo);
</script>

<template>
  <TodosForm :todo="todo" v-if="!loading" />
</template>
