import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

import "~/assets/css/main.css";
import App from "./App.vue";
import { me } from "./services/auth-service";
import AuthView from "./views/AuthView.vue";
import TodosView from "./views/TodosView.vue";

const routes = [
  { path: "/", redirect: "/auth/login" },
  { path: "/auth/:type", name: "auth", component: AuthView },
  {
    path: "/todos",
    component: TodosView,
    children: [
      { path: "", redirect: "/todos/list" },
      { path: "list", name: "todos", component: TodosView },
      { path: "edit/:id?", name: "todos-edit", component: TodosView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  try {
    await me();

    // User is authenticated but trying to access the auth route
    if (to.name === "auth") {
      return { name: "todos" };
    }
  } catch (error) {
    // User is not authenticated
    if (to.name !== "auth") {
      return { name: "auth", params: { type: "login" } };
    }
  }

  return true;
});

createApp(App).use(router).use(ToastPlugin).mount("#app");
