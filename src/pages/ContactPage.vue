<script lang="ts" setup>
  import { ref } from "vue";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiInput from "@/components/ui/UiInput.vue";
  import UiTextarea from "@/components/ui/UiTextarea.vue";
  import UiTurnstile from "@/components/ui/UiTurnstile.vue";
  import { config } from "@/config";
  import { contactSchema, zodErrors } from "@/lib/schemas";
  import { verifyTurnstile } from "@/lib/turnstile";

  const email = ref("");
  const message = ref("");
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
    const result = contactSchema.safeParse({
      email: email.value,
      message: message.value,
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
      const res = await fetch(import.meta.env.VITE_FORMSPREE_URL, {
        body: JSON.stringify({
          email: email.value,
          message: message.value,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      sent.value = true;
    } catch {
      error.value = "Something went wrong. Try emailing us directly.";
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
      <template v-if="!config.features.contactForm">
        <div
          class="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center"
        >
          <h1
            class="font-display text-text text-3xl font-medium tracking-tight"
          >
            Get in touch
          </h1>
          <p class="text-text-muted mt-3 max-w-xs text-sm">
            Questions or feedback? Send us an email and we'll get back to you.
          </p>
          <a
            class="text-primary mt-6 font-mono text-sm underline underline-offset-2 transition-opacity duration-150 hover:opacity-70"
            :href="`mailto:${config.contact.email}`"
            >{{
              config.contact.email
            }}</a
          >
        </div>
      </template>

      <template v-else>
        <section class="border-border border-b pt-14 pb-10">
          <h1
            class="font-display text-text text-4xl font-medium tracking-tight"
          >
            Contact us
          </h1>
          <p class="text-text-muted mt-3 text-sm">
            Questions, feedback, or anything else. You can also email us
            directly:
            <a
              class="text-primary font-mono text-xs underline-offset-2 hover:underline"
              :href="`mailto:${config.contact.email}`"
              >{{
                config.contact.email
              }}</a
            >
          </p>
        </section>

        <div class="py-10">
          <template v-if="!sent">
            <form class="flex flex-col gap-5" @submit.prevent="submit">
              <UiAlert variant="error" v-if="error">{{ error }}</UiAlert>
              <UiInput
                label="Your email"
                name="Email"
                required
                type="email"
                v-model="email"
                :error="e.email"
                :placeholder="`you@${config.school.studentEmailDomains[0] ?? 'school.edu'}`"
              />
              <UiTextarea
                label="Message"
                name="Message"
                placeholder="..."
                required
                v-model="message"
                :error="e.message"
                :rows="5"
              />
              <UiTurnstile
                @expire="turnstileToken = ''"
                @token="turnstileToken = $event"
              />
              <div>
                <UiButton
                  type="submit"
                  :disabled="
                    !(email && message.trim()) ||
                    (config.features.turnstile && !turnstileToken)
                  "
                  :loading="loading"
                  >Send message</UiButton
                >
              </div>
            </form>
          </template>
          <UiAlert title="Message sent" variant="success" v-else
            >We'll get back to you at {{ email }}.</UiAlert
          >
        </div>
      </template>
    </main>
    <AppFooter />
  </div>
</template>
