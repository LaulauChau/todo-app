import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { CLIENT_PORT, SERVER_URL } = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue()],
    resolve: {
      alias: [{ find: "~", replacement: resolve(__dirname, "src") }],
    },
    server: {
      port: Number(CLIENT_PORT),
      proxy: {
        "/api": {
          changeOrigin: true,
          target: SERVER_URL,
        },
      },
    },
  };
});
