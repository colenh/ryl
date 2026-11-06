<script lang="ts" setup>
  import { onMounted, ref, watch } from "vue";
  import { RouterLink } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";

  import { useAuthStore } from "@/stores/auth";

  const auth = useAuthStore();
  const status = ref<"loading" | "success" | "error">("loading");

  onMounted(() => {
    if (window.location.hash.includes("error=")) {
      status.value = "error";
      return;
    }
    if (auth.isLoggedIn) {
      status.value = "success";
      return;
    }
    const timer = setTimeout(() => {
      if (status.value === "loading") {
        status.value = "error";
      }
    }, 3000);
    const stop = watch(
      () => auth.isLoggedIn,
      (v) => {
        if (v) {
          status.value = "success";
          clearTimeout(timer);
          stop();
        }
      }
    );
  });
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main
      class="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center"
    >
      <p class="text-text-muted font-mono text-xs" v-if="status === 'loading'">
        Verifying...
      </p>

      <template v-else-if="status === 'success'">
        <div
          class="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style="background: color-mix(in srgb, var(--brand-primary) 10%, transparent);"
        >
          <svg
            aria-hidden="true"
            class="h-10 w-10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            style="color: var(--brand-primary);"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h1 class="font-display text-text text-4xl font-medium tracking-tight">
          You're verified.
        </h1>
        <p class="text-text-muted mt-3 text-sm">Your account is active.</p>
        <RouterLink
          class="mt-8 inline-flex items-center justify-center rounded-(--radius) px-5 py-3 font-mono text-sm font-semibold transition-colors duration-150"
          style="background: var(--brand-primary); color: var(--brand-primary-fg);"
          to="/"
          >Browse landlords</RouterLink
        >
      </template>

      <template v-else>
        <div
          class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50"
        >
          <svg
            aria-hidden="true"
            class="h-10 w-10 text-red-500"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h1 class="font-display text-text text-4xl font-medium tracking-tight">
          Link expired.
        </h1>
        <p class="text-text-muted mt-3 max-w-xs text-sm">
          This link has expired or already been used.
        </p>
        <RouterLink
          class="text-primary mt-8 font-mono text-xs underline underline-offset-2 transition-opacity duration-150 hover:opacity-70"
          to="/register"
        >
          Back to sign up →
        </RouterLink>
      </template>
    </main>
    <AppFooter />
  </div>
</template>
