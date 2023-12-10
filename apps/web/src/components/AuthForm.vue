<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

import { login, register } from "~/services/auth-service";
import { getErrorMessage } from "~/utils/errors-handler";

const props = defineProps<{ type: "login" | "register" }>();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");

const toast = useToast();

async function submit(): Promise<void> {
  try {
    if (props.type === "login") {
      await login(email.value, password.value);
    } else {
      if (password.value !== passwordConfirmation.value) {
        toast.error("Passwords do not match");
      }

      await register(name.value, email.value, password.value);
    }

    await router.push({ name: "todos", params: { action: "list" } });
  } catch (error: unknown) {
    toast.error(getErrorMessage(error));
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {{ props.type === "login" ? "Sign in to your account" : "Create a new account" }}
      </h1>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="submit">
        <div v-if="props.type === 'register'">
          <label for="name" class="block text-sm font-medium leading-6 text-gray-900"> Name</label>
          <input
            type="text"
            name="name"
            id="name"
            v-model="name"
            class="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            v-model="email"
            class="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label
          >
          <input
            type="password"
            name="password"
            id="password"
            v-model="password"
            class="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>

        <div v-if="props.type === 'register'">
          <label
            for="password_confirmation"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Confirm Password</label
          >
          <input
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            v-model="passwordConfirmation"
            class="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>

        <button
          type="submit"
          class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {{ props.type === "login" ? "Sign in" : "Sign up" }}
        </button>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        {{ props.type === "login" ? "Don't have an account yet? " : "Already have an account? " }}
        <router-link
          :to="{ name: 'auth', params: { type: props.type === 'login' ? 'register' : 'login' } }"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          {{ props.type === "login" ? "Sign up" : "Sign in" }}
        </router-link>
      </p>
    </div>
  </div>
</template>
