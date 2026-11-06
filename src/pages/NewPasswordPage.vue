<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { RouterLink } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiInput from "@/components/ui/UiInput.vue";
  import { useAuthStore } from "@/stores/auth";

  const auth = useAuthStore();

  const status = ref<"loading" | "ready" | "expired">(
    auth.isLoggedIn ? "ready" : "loading"
  );

  if (status.value === "loading") {
    const timer = setTimeout(() => {
      if (status.value === "loading") {
        status.value = "expired";
      }
    }, 3000);
    const stop = watch(
      () => auth.isLoggedIn,
      (v) => {
        if (v) {
          status.value = "ready";
          clearTimeout(timer);
          stop();
        }
      }
    );
  }

  const password = ref("");
  const loading = ref(false);
  const error = ref("");
  const done = ref(false);

  async function submit() {
    if (password.value.length < 8) {
      error.value = "Password must be at least 8 characters.";
      return;
    }
    loading.value = true;
    error.value = "";
    try {
      await auth.updatePassword(password.value);
      done.value = true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update password.";
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="flex flex-1 items-center justify-center px-6">
      <div class="w-full max-w-sm py-16">
        <p
          class="text-text-muted font-mono text-xs"
          v-if="status === 'loading'"
        >
          Loading...
        </p>

        <template v-else-if="status === 'expired'">
          <h1
            class="font-display text-text text-3xl font-medium tracking-tight"
          >
            Link expired
          </h1>
          <p class="text-text-muted mt-2 text-sm">
            This link has expired or already been used.
          </p>
          <RouterLink
            class="text-primary mt-6 inline-block font-mono text-xs underline underline-offset-2 transition-opacity hover:opacity-70"
            to="/reset-password"
          >
            Request a new link →
          </RouterLink>
        </template>

        <template v-else-if="done">
          <UiAlert title="Password updated" variant="success">
            Your password has been changed. You can now sign in.
          </UiAlert>
          <RouterLink
            class="text-primary mt-6 inline-block font-mono text-xs underline underline-offset-2 transition-opacity hover:opacity-70"
            to="/"
          >
            ← Back to home
          </RouterLink>
        </template>

        <template v-else>
          <h1
            class="font-display text-text text-3xl font-medium tracking-tight"
          >
            Set new password
          </h1>
          <p class="text-text-muted mt-2 text-sm">
            Choose a strong password you don't use elsewhere.
          </p>
          <form class="mt-8 flex flex-col gap-4" @submit.prevent="submit">
            <UiAlert variant="error" v-if="error">{{ error }}</UiAlert>
            <UiInput
              hint="At least 8 characters."
              label="New password"
              placeholder="••••••••"
              required
              type="password"
              v-model="password"
            />
            <UiButton
              size="lg"
              type="submit"
              :disabled="!password"
              :loading="loading"
              >Set password</UiButton
            >
          </form>
        </template>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
