<script lang="ts" setup>
  import { ref } from "vue";
  import { RouterLink } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiInput from "@/components/ui/UiInput.vue";
  import UiTurnstile from "@/components/ui/UiTurnstile.vue";
  import { config } from "@/config";
  import { resetPasswordSchema, zodErrors } from "@/lib/schemas";
  import { verifyTurnstile } from "@/lib/turnstile";
  import { useAuthStore } from "@/stores/auth";

  const email = ref("");
  const loading = ref(false);
  const sent = ref(false);
  const error = ref("");
  const e = ref<Record<string, string>>({});
  const turnstileToken = ref("");

  async function submit() {
    if (config.features.turnstile && !turnstileToken.value) {
      return;
    }
    e.value = {};
    const result = resetPasswordSchema.safeParse({ email: email.value });
    if (!result.success) {
      e.value = zodErrors(result);
      return;
    }
    loading.value = true;
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
      await useAuthStore().sendPasswordReset(email.value);
      sent.value = true;
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again.";
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
          <template v-if="!sent">
            <h1
              class="font-display text-text text-3xl font-medium tracking-tight"
            >
              Reset password
            </h1>
            <p class="text-text-muted mt-2 text-sm">
              We'll send you a link to reset your password.
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
              <UiTurnstile
                @expire="turnstileToken = ''"
                @token="turnstileToken = $event"
              />
              <UiButton
                size="lg"
                type="submit"
                :disabled="config.features.turnstile && !turnstileToken"
                :loading="loading"
                >Send reset link</UiButton
              >
            </form>
            <p class="mt-6 text-center">
              <RouterLink
                class="text-text-muted hover:text-text font-mono text-xs transition-colors"
                to="/login"
                >← Back to sign in</RouterLink
              >
            </p>
          </template>
          <UiAlert title="Email sent" variant="success" v-else>
            Check your inbox for a password reset link.
          </UiAlert>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
