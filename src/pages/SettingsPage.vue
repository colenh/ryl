<script lang="ts" setup>
  import { ref } from "vue";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiInput from "@/components/ui/UiInput.vue";
  import { useAuthStore } from "@/stores/auth";

  const auth = useAuthStore();

  const email = ref(auth.user?.email ?? "");
  const emailLoading = ref(false);
  const emailSuccess = ref(false);
  const emailError = ref("");

  async function saveEmail() {
    if (!email.value.trim() || email.value === auth.user?.email) {
      return;
    }
    emailLoading.value = true;
    emailError.value = "";
    emailSuccess.value = false;
    try {
      await auth.updateEmail(email.value.trim());
      emailSuccess.value = true;
    } catch (err) {
      emailError.value =
        err instanceof Error ? err.message : "Failed to update email.";
    } finally {
      emailLoading.value = false;
    }
  }

  const newPassword = ref("");
  const passwordLoading = ref(false);
  const passwordSuccess = ref(false);
  const passwordError = ref("");

  async function savePassword() {
    if (!newPassword.value) {
      return;
    }
    if (newPassword.value.length < 8) {
      passwordError.value = "Password must be at least 8 characters.";
      return;
    }
    passwordLoading.value = true;
    passwordError.value = "";
    passwordSuccess.value = false;
    try {
      await auth.updatePassword(newPassword.value);
      passwordSuccess.value = true;
      newPassword.value = "";
    } catch (err) {
      passwordError.value =
        err instanceof Error ? err.message : "Failed to update password.";
    } finally {
      passwordLoading.value = false;
    }
  }

  const deleteConfirm = ref("");
  const deleteLoading = ref(false);
  const deleteError = ref("");

  async function deleteAccount() {
    if (deleteConfirm.value !== "delete my account") {
      return;
    }
    deleteLoading.value = true;
    deleteError.value = "";
    try {
      await auth.deleteAccount();
      window.location.href = "/";
    } catch (err) {
      deleteError.value =
        err instanceof Error ? err.message : "Failed to delete account.";
    } finally {
      deleteLoading.value = false;
    }
  }
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="mx-auto w-full max-w-2xl flex-1 px-6">
      <section class="border-border border-b pt-14 pb-6">
        <p class="text-text-muted mb-1 font-mono text-xs">Account</p>
        <h1 class="font-display text-text text-3xl font-medium tracking-tight">
          Settings
        </h1>
      </section>

      <div class="flex flex-col gap-10 py-10">
        <div class="flex flex-col gap-4">
          <div>
            <h2 class="text-text text-base font-semibold">Email address</h2>
            <p class="text-text-muted mt-0.5 text-sm">
              Used for sign-in and notifications.
            </p>
          </div>
          <UiAlert variant="success" v-if="emailSuccess"
            >Check your new inbox to verify the address before it takes
            effect.</UiAlert
          >
          <UiAlert variant="error" v-if="emailError">{{ emailError }}</UiAlert>
          <form class="flex items-end gap-3" @submit.prevent="saveEmail">
            <UiInput
              class="flex-1"
              label="Email"
              required
              type="email"
              v-model="email"
            />
            <UiButton
              type="submit"
              :disabled="!email.trim() || email === auth.user?.email"
              :loading="emailLoading"
              >Save</UiButton
            >
          </form>
        </div>

        <div class="border-border border-t" />

        <div class="flex flex-col gap-4">
          <div>
            <h2 class="text-text text-base font-semibold">Password</h2>
            <p class="text-text-muted mt-0.5 text-sm">
              Choose a strong password you don't use elsewhere.
            </p>
          </div>
          <UiAlert variant="success" v-if="passwordSuccess"
            >Password updated.</UiAlert
          >
          <UiAlert variant="error" v-if="passwordError">{{
            passwordError
          }}</UiAlert>
          <form class="flex flex-col gap-4" @submit.prevent="savePassword">
            <UiInput
              hint="At least 8 characters."
              label="New password"
              required
              type="password"
              v-model="newPassword"
            />
            <div>
              <UiButton
                type="submit"
                :disabled="!newPassword"
                :loading="passwordLoading"
                >Update password</UiButton
              >
            </div>
          </form>
        </div>

        <div class="border-border border-t" />

        <div class="flex flex-col gap-4">
          <div>
            <h2 class="text-base font-semibold text-red-600">Delete account</h2>
            <p class="text-text-muted mt-0.5 text-sm">
              Permanently deletes your account and all reviews you've written.
              This cannot be undone.
            </p>
          </div>
          <UiAlert variant="error" v-if="deleteError">{{
            deleteError
          }}</UiAlert>
          <form class="flex flex-col gap-4" @submit.prevent="deleteAccount">
            <UiInput
              label="Type 'delete my account' to confirm"
              placeholder="delete my account"
              v-model="deleteConfirm"
            />
            <div>
              <UiButton
                class="bg-red-600! text-white! hover:bg-red-700!"
                type="submit"
                :disabled="deleteConfirm !== 'delete my account'"
                :loading="deleteLoading"
                >Delete my account</UiButton
              >
            </div>
          </form>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
