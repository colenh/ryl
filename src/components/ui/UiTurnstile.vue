<script lang="ts" setup>
  // biome-ignore-start lint/suspicious/noExplicitAny: turnstile
  import { onMounted, onUnmounted, ref } from "vue";
  import { config } from "@/config";

  const emit = defineEmits<{ token: [string]; expire: [] }>();
  const container = ref<HTMLElement>();
  let widgetId: string | undefined;

  function loadScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).turnstile) {
        resolve();
        return;
      }
      const existing = document.querySelector("script[data-cf-turnstile]");
      if (existing) {
        const check = setInterval(() => {
          if ((window as any).turnstile) {
            clearInterval(check);
            resolve();
          }
        }, 50);
        setTimeout(() => {
          clearInterval(check);
          resolve();
        }, 5000);
        return;
      }
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.dataset.cfTurnstile = "1";
      s.onload = () => resolve();
      document.head.appendChild(s);
    });
  }

  onMounted(async () => {
    if (!(config.features.turnstile && container.value)) {
      return;
    }
    await loadScript();
    const ts = (window as any).turnstile;
    widgetId = ts.render(container.value, {
      appearance: "always",
      callback: (token: string) => emit("token", token),
      "expired-callback": () => emit("expire"),
      sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      theme: "auto",
    });
  });

  onUnmounted(() => {
    if (widgetId !== undefined) {
      (window as any).turnstile?.remove(widgetId);
    }
  });

  function reset() {
    if (widgetId !== undefined) {
      (window as any).turnstile?.reset(widgetId);
    }
  }

  defineExpose({ reset });
  // biome-ignore-end lint/suspicious/noExplicitAny: turnstile
</script>

<template>
  <div class="flex" v-if="config.features.turnstile">
    <div ref="container" />
  </div>
</template>
