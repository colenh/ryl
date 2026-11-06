<script lang="ts" setup>
  import { ref } from "vue";
  import { RouterLink, useRoute, useRouter } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiInput from "@/components/ui/UiInput.vue";
  import UiTurnstile from "@/components/ui/UiTurnstile.vue";
  import { config } from "@/config";
  import { loginSchema, zodErrors } from "@/lib/schemas";
  import { verifyTurnstile } from "@/lib/turnstile";
  import { useAuthStore } from "@/stores/auth";

  const route = useRoute();
  const router = useRouter();
  const email = ref("");
  const password = ref("");
  const loading = ref(false);
  const error = ref("");
  const e = ref<Record<string, string>>({});
  const turnstileToken = ref("");

  async function submit() {
    if (config.features.turnstile && !turnstileToken.value) {
      return;
    }
    e.value = {};
    const result = loginSchema.safeParse({
      email: email.value,
      password: password.value,
    });
    if (!result.success) {
      e.value = zodErrors(result);
      return;
    }
    loading.value = true;
    error.value = "";
    if (
      config.features.turnstile &&
      !(await verifyTurnstile(turnstileToken.value))
    ) {
      error.value = "Verification failed. Please try again.";
      turnstileToken.value = "";
      loading.value = false;
      return;
    }
    try {
      await useAuthStore().login(email.value, password.value);
      const redirect =
        typeof route.query.redirect === "string" ? route.query.redirect : "/";
      router.push(redirect);
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.";
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
        <div>
          <h1
            class="font-display text-text text-3xl font-medium tracking-tight"
          >
            Sign in
          </h1>
          <p class="text-text-muted mt-2 text-sm">
            Your experience helps the next tenant decide.
          </p>

          <form class="mt-8 flex flex-col gap-4" @submit.prevent="submit">
            <UiAlert variant="error" v-if="error">{{ error }}</UiAlert>

            <UiInput
              label="Email"
              required
              type="email"
              v-model="email"
              :error="e.email"
              :placeholder="`you@${config.school.studentEmailDomains[0] ?? 'school.edu'}`"
            />
            <UiInput
              label="Password"
              placeholder="••••••••"
              required
              type="password"
              v-model="password"
              :error="e.password"
            />

            <div class="flex items-center justify-between pt-1">
              <RouterLink
                class="text-text-muted hover:text-text font-mono text-xs"
                to="/reset-password"
              >
                Forgot password?
              </RouterLink>
            </div>

            <UiTurnstile
              @expire="turnstileToken = ''"
              @token="turnstileToken = $event"
            />
            <UiButton
              class="w-full"
              size="lg"
              type="submit"
              :disabled="config.features.turnstile && !turnstileToken"
              :loading="loading"
              >Sign in</UiButton
            >
          </form>

          <p class="text-text-muted mt-6 text-center font-mono text-xs">
            Don't have an account?
            <RouterLink
              class="text-primary font-semibold underline underline-offset-2 hover:opacity-75"
              to="/register"
              >Register</RouterLink
            >
          </p>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
