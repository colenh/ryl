<script lang="ts" setup>
  import { RouterLink } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main
      class="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center"
    >
      <p
        class="font-display text-8xl font-medium tracking-tight"
        style="color: var(--brand-primary); opacity: 0.15;"
      >
        404
      </p>
      <h1
        class="font-display text-text mt-2 text-3xl font-medium tracking-tight"
      >
        Page not found.
      </h1>
      <p class="text-text-muted mt-3 max-w-xs text-sm">
        This page doesn't exist or was moved. Try searching for your landlord
        from the home page.
      </p>
      <RouterLink
        class="text-primary mt-8 font-mono text-xs underline underline-offset-2 transition-opacity duration-150 hover:opacity-70"
        to="/"
      >
        ← Back to home
      </RouterLink>
    </main>
    <AppFooter />
  </div>
</template>
