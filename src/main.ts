import { createPinia } from "pinia";
import { createApp } from "vue";
import { applyTheme } from "@/lib/theme";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import App from "./App.vue";
import "./style.css";

applyTheme();

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router).mount("#app");

useAuthStore()
  .init()
  .catch(() => {});
