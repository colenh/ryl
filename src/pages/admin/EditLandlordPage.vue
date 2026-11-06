<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import AddressAutocomplete from "@/components/ui/AddressAutocomplete.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiInput from "@/components/ui/UiInput.vue";
  import UiTextarea from "@/components/ui/UiTextarea.vue";
  import { optionalAddress } from "@/lib/schemas";
  import { useLandlordsStore } from "@/stores/landlords";

  const route = useRoute();
  const router = useRouter();
  const store = useLandlordsStore();

  const name = ref("");
  const note = ref("");
  const addresses = ref<string[]>([""]);
  const loading = ref(false);
  const error = ref("");
  const addressErrors = ref<string[]>([]);
  const notFound = ref(false);

  onMounted(async () => {
    try {
      const landlord = await store.fetchById(route.params.id as string);
      if (!landlord) {
        notFound.value = true;
        return;
      }
      name.value = landlord.name;
      note.value = landlord.note ?? "";
      addresses.value = landlord.addresses?.length
        ? [...landlord.addresses]
        : [""];
    } catch {
      notFound.value = true;
    }
  });

  function addAddress() {
    addresses.value.push("");
  }

  function removeAddress(i: number) {
    addresses.value.splice(i, 1);
    if (!addresses.value.length) {
      addresses.value.push("");
    }
  }

  async function submit() {
    if (!name.value.trim()) {
      return;
    }
    addressErrors.value = addresses.value.map((a) => {
      const r = optionalAddress.safeParse(a.trim());
      return r.success ? "" : (r.error.issues[0]?.message ?? "Invalid address");
    });
    if (addressErrors.value.some(Boolean)) {
      return;
    }
    loading.value = true;
    error.value = "";
    try {
      const cleaned = addresses.value.map((a) => a.trim()).filter(Boolean);
      await store.update(route.params.id as string, {
        addresses: cleaned,
        name: name.value.trim(),
        note: note.value.trim(),
      });
      router.push("/admin");
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to save.";
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="flex flex-1 items-center justify-center px-6">
      <div class="w-full max-w-lg py-16">
        <div class="mb-6">
          <button
            class="text-text-muted hover:text-text font-mono text-xs transition-colors"
            type="button"
            @click="router.back()"
          >
            ← Back
          </button>
        </div>

        <div v-if="notFound">
          <p class="text-text-muted text-sm">Landlord not found.</p>
        </div>

        <div v-else>
          <h1
            class="font-display text-text text-3xl font-medium tracking-tight"
          >
            Edit landlord
          </h1>

          <form class="mt-8 flex flex-col gap-5" @submit.prevent="submit">
            <UiAlert variant="error" v-if="error">{{ error }}</UiAlert>

            <UiInput
              hint="Use the full legal or business name if known."
              label="Landlord name"
              placeholder="Riverside Properties LLC"
              required
              v-model="name"
            />

            <UiTextarea
              hint="Optional admin note visible on the landlord's profile."
              label="Admin note"
              placeholder="e.g. Owns several properties under different names."
              v-model="note"
              :rows="3"
            />

            <div class="flex flex-col gap-2">
              <span class="text-text-muted font-mono text-xs">Addresses</span>
              <div class="flex gap-2" v-for="(_, i) in addresses" :key="i">
                <AddressAutocomplete
                  class="flex-1"
                  v-model="addresses[i]"
                  :error="addressErrors[i]"
                  :placeholder="`Address ${i + 1}`"
                />
                <button
                  aria-label="Remove address"
                  class="text-text-faint px-1 font-mono text-xs transition-colors hover:text-red-600"
                  type="button"
                  @click="removeAddress(i)"
                >
                  ✕
                </button>
              </div>
              <button
                class="text-primary mt-1 self-start font-mono text-xs underline-offset-2 hover:underline"
                type="button"
                @click="addAddress"
              >
                + Add address
              </button>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <UiButton
                type="submit"
                :disabled="!name.trim()"
                :loading="loading"
                >Save changes</UiButton
              >
              <UiButton type="button" variant="ghost" @click="router.back()"
                >Cancel</UiButton
              >
            </div>
          </form>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
