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
  import { registerSchema, zodErrors } from "@/lib/schemas";
  import { verifyTurnstile } from "@/lib/turnstile";
  import { useAuthStore } from "@/stores/auth";

  const email = ref("");
  const password = ref("");
  const loading = ref(false);
  const success = ref(false);
  const error = ref("");
  const e = ref<Record<string, string>>({});
  const turnstileToken = ref("");

  async function submit() {
    if (config.features.turnstile && !turnstileToken.value) {
      return;
    }
    e.value = {};
    const result = registerSchema.safeParse({
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
      await useAuthStore().register(email.value, password.value);
      success.value = true;
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
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
          <template v-if="!success">
            <h1
              class="font-display text-text text-3xl font-medium tracking-tight"
            >
              Create account
            </h1>
            <p class="text-text-muted mt-2 text-sm">
              <template
                v-if="
                  config.features.studentBadge &&
                  config.school.studentEmailDomains.length
                "
              >
                Use your {{ config.school.name }} email to get a Verified
                Student badge on your reviews.
              </template>
              <template v-else>
                An account lets you manage your reviews and edit them later.
              </template>
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
                hint="At least 8 characters."
                label="Password"
                placeholder="••••••••"
                required
                type="password"
                v-model="password"
                :error="e.password"
              />
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
                >Create account</UiButton
              >
            </form>

            <p class="text-text-muted mt-6 text-center font-mono text-xs">
              Already have an account?
              <RouterLink class="text-primary hover:underline" to="/login"
                >Sign in</RouterLink
              >
            </p>
          </template>

          <template v-else>
            <UiAlert title="Check your email" variant="success">
              We sent a verification link to <strong>{{ email }}</strong>. Click
              it to activate your account.
            </UiAlert>
            <RouterLink
              class="text-primary mt-6 inline-block font-mono text-xs transition-colors hover:underline"
              to="/"
            >
              ← Back to landlords
            </RouterLink>
          </template>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
