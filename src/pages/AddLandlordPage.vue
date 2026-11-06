<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { useRouter } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import TagSelector from "@/components/review/TagSelector.vue";
  import AddressAutocomplete from "@/components/ui/AddressAutocomplete.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiInput from "@/components/ui/UiInput.vue";
  import UiSelect from "@/components/ui/UiSelect.vue";
  import UiTextarea from "@/components/ui/UiTextarea.vue";
  import { config } from "@/config";
  import {
    gradeOptions,
    landlordFormSchema,
    reviewFormSchema,
    zodErrors,
  } from "@/lib/schemas";
  import { useAuthStore } from "@/stores/auth";
  import { useLandlordsStore } from "@/stores/landlords";
  import { useReviewsStore } from "@/stores/reviews";
  import type { Landlord, LetterGrade } from "@/types";

  const router = useRouter();
  const auth = useAuthStore();
  const landlordsStore = useLandlordsStore();
  const reviewsStore = useReviewsStore();

  const name = ref("");
  const address = ref("");
  const loading = ref(false);
  const error = ref("");
  const e1 = ref<Record<string, string>>({});
  const newLandlord = ref<Landlord | null>(null);
  const dupLandlord = ref<Landlord | null>(null);
  const similarLandlords = ref<Landlord[]>([]);

  watch(name, () => {
    similarLandlords.value = [];
  });

  const GENERIC = new Set([
    "apartments",
    "apartment",
    "apts",
    "properties",
    "property",
    "management",
    "realty",
    "llc",
    "inc",
    "ltd",
    "co",
    "group",
    "corp",
    "homes",
    "home",
    "house",
    "houses",
    "rentals",
    "rental",
    "real",
    "estate",
    "living",
    ...config.school.location
      .toLowerCase()
      .split(/\W+/u)
      .filter((w) => w.length >= 3),
    ...config.school.name
      .toLowerCase()
      .split(/\W+/u)
      .filter((w) => w.length >= 3),
    config.school.shortName.toLowerCase(),
  ]);
  const nameReg = /\W+/u;
  function sigWords(n: string): string[] {
    return n
      .toLowerCase()
      .split(nameReg)
      .filter((w) => w.length >= 3 && !GENERIC.has(w));
  }

  async function submitLandlord() {
    e1.value = {};
    dupLandlord.value = null;
    error.value = "";
    const wasConfirming = similarLandlords.value.length > 0;
    similarLandlords.value = [];
    const result = landlordFormSchema.safeParse({
      address: address.value,
      name: name.value,
    });
    if (!result.success) {
      e1.value = zodErrors(result);
      return;
    }
    if (!landlordsStore.landlords.length) {
      await landlordsStore.fetchAll();
    }
    const lowerName = name.value.trim().toLowerCase();
    const lowerAddr = address.value.trim().toLowerCase();
    const nameDup = landlordsStore.landlords.find(
      (l) => l.name.toLowerCase() === lowerName
    );
    if (nameDup) {
      dupLandlord.value = nameDup;
      e1.value.name = "A landlord with this name already exists.";
      return;
    }
    if (lowerAddr) {
      const addrDup = landlordsStore.landlords.find((l) =>
        l.addresses?.some((a) => a.toLowerCase() === lowerAddr)
      );
      if (addrDup) {
        dupLandlord.value = addrDup;
        e1.value.address =
          "This address is already listed under another landlord.";
        return;
      }
    }
    if (!wasConfirming) {
      const inputWords = sigWords(name.value.trim());
      const similar = landlordsStore.landlords.filter((l) => {
        const lw = sigWords(l.name);
        return inputWords.some((w) => lw.includes(w));
      });
      if (similar.length) {
        similarLandlords.value = similar;
        return;
      }
    }
    loading.value = true;
    try {
      newLandlord.value = await landlordsStore.create({
        addresses: address.value.trim() ? [address.value.trim()] : undefined,
        name: name.value.trim(),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      error.value =
        msg.includes("duplicate") || msg.includes("unique")
          ? "A landlord with this name already exists."
          : msg || "Failed to add landlord.";
    } finally {
      loading.value = false;
    }
  }

  const grade = ref("");
  const buildingCondition = ref("");
  const wouldRentAgain = ref<boolean | null>(null);
  const rentAmount = ref("");
  const bedrooms = ref("");
  const bathrooms = ref("");
  const propertyAddress = ref("");
  const comment = ref("");
  const tags = ref<string[]>([]);
  const reviewLoading = ref(false);
  const reviewError = ref("");
  const e2 = ref<Record<string, string>>({});

  async function submitReview() {
    e2.value = {};
    const result = reviewFormSchema.safeParse({
      bathrooms: bathrooms.value,
      bedrooms: bedrooms.value,
      buildingCondition: buildingCondition.value,
      comment: comment.value,
      grade: grade.value,
      propertyAddress: propertyAddress.value,
      rentAmount: rentAmount.value,
      wouldRentAgain: wouldRentAgain.value,
    });
    if (!result.success) {
      e2.value = zodErrors(result);
      return;
    }
    reviewLoading.value = true;
    reviewError.value = "";
    try {
      await reviewsStore.create({
        bathrooms: result.data.bathrooms
          ? Number(result.data.bathrooms)
          : undefined,
        bedrooms: result.data.bedrooms
          ? Number(result.data.bedrooms)
          : undefined,
        buildingCondition: result.data.buildingCondition as LetterGrade,
        comment: result.data.comment,
        grade: result.data.grade as LetterGrade,
        // shortcut: isVerifiedStudent is client-enforced; config.ts owns the domains so a DB trigger would duplicate them
        isVerifiedStudent: auth.user?.isVerifiedStudent ?? false,
        landlordId: newLandlord.value!.id,
        propertyAddress: result.data.propertyAddress || undefined,
        rentAmount: result.data.rentAmount
          ? Number(result.data.rentAmount)
          : undefined,
        tags: tags.value,
        userId: auth.user?.id ?? null,
        wouldRentAgain: result.data.wouldRentAgain as boolean,
      });
      router.push(`/landlord/${newLandlord.value?.id}`);
    } catch (err) {
      reviewError.value =
        err instanceof Error ? err.message : "Failed to submit review.";
    } finally {
      reviewLoading.value = false;
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

        <UiAlert variant="warning" v-if="auth.user && !auth.user.emailVerified">
          Please verify your email before adding a landlord. Check your inbox
          for a confirmation link.
        </UiAlert>

        <template v-else-if="!newLandlord">
          <div>
            <h1
              class="font-display text-text text-3xl font-medium tracking-tight"
            >
              Add a landlord
            </h1>
            <p class="text-text-muted mt-2 text-sm">
              Don't see your landlord listed? Add them so you and others can
              leave reviews.
            </p>

            <form
              class="mt-8 flex flex-col gap-5"
              @submit.prevent="submitLandlord"
            >
              <UiAlert variant="error" v-if="error">{{ error }}</UiAlert>
              <UiAlert variant="warning" v-if="dupLandlord">
                This landlord may already be listed.
                <RouterLink
                  class="font-semibold underline underline-offset-2"
                  :to="`/landlord/${dupLandlord.id}`"
                  >View {{ dupLandlord.name }} →</RouterLink
                >
              </UiAlert>
              <UiAlert variant="warning" v-if="similarLandlords.length">
                Similar landlords already exist, make sure this isn't a
                duplicate:
                <span v-for="(l, i) in similarLandlords" :key="l.id">
                  <RouterLink
                    class="font-semibold underline underline-offset-2"
                    :to="`/landlord/${l.id}`"
                    >{{
                      l.name
                    }}</RouterLink
                  ><span v-if="i < similarLandlords.length - 1">, </span>
                </span>
              </UiAlert>

              <UiInput
                hint="Use the full legal or business name if known."
                label="Landlord name"
                placeholder="Riverside Properties LLC"
                required
                v-model="name"
                :error="e1.name"
              />

              <AddressAutocomplete
                hint="The address of a property this landlord manages. More can be added later."
                label="Property address (optional)"
                v-model="address"
                :error="e1.address"
                :placeholder="`123 Main St, ${config.school.location}`"
              />

              <div class="flex items-center gap-3 pt-2">
                <UiButton
                  type="submit"
                  :disabled="!name.trim()"
                  :loading="loading"
                  >{{
                    similarLandlords.length ? "Add anyway" : "Add landlord"
                  }}</UiButton
                >
                <UiButton type="button" variant="ghost" @click="router.back()"
                  >Cancel</UiButton
                >
              </div>
            </form>
          </div>
        </template>

        <template v-else>
          <div>
            <p class="mb-1 font-mono text-xs text-green-600">
              Added successfully
            </p>
            <h1
              class="font-display text-text text-3xl font-medium tracking-tight"
            >
              Leave a review
            </h1>
            <p class="text-text-muted mt-2 text-sm">
              You just added
              <span class="text-text font-semibold">{{ newLandlord.name }}</span
              >. Want to leave the first review?
            </p>

            <form
              class="mt-8 flex flex-col gap-6"
              @submit.prevent="submitReview"
            >
              <UiAlert variant="error" v-if="reviewError">{{
                reviewError
              }}</UiAlert>

              <UiSelect
                label="Landlord rating"
                placeholder="Select a grade"
                required
                v-model="grade"
                :error="e2.grade"
                :options="gradeOptions"
              />

              <UiSelect
                label="Building condition"
                placeholder="Select a grade"
                required
                v-model="buildingCondition"
                :error="e2.buildingCondition"
                :options="gradeOptions"
              />

              <fieldset
                class="m-0 flex min-w-0 flex-col gap-1.5 border-none p-0"
              >
                <legend class="text-text-muted mb-1.5 font-mono text-xs">
                  Would you rent from this landlord again?
                  <span class="text-red-500">*</span>
                </legend>
                <div class="flex gap-3">
                  <label
                    :class="[
                      'flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-(--radius) border cursor-pointer transition-colors duration-150',
                      wouldRentAgain === true
                        ? 'border-green-400 bg-green-50 text-green-700'
                        : 'border-border-strong text-text-muted hover:border-border-strong',
                    ]"
                  >
                    <input
                      class="sr-only"
                      name="wouldRentAgain"
                      type="radio"
                      v-model="wouldRentAgain"
                      :value="true"
                    >
                    Yes
                  </label>
                  <label
                    :class="[
                      'flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-(--radius) border cursor-pointer transition-colors duration-150',
                      wouldRentAgain === false
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-border-strong text-text-muted hover:border-border-strong',
                    ]"
                  >
                    <input
                      class="sr-only"
                      name="wouldRentAgain"
                      type="radio"
                      v-model="wouldRentAgain"
                      :value="false"
                    >
                    No
                  </label>
                </div>
                <p
                  class="font-mono text-xs text-red-600"
                  v-if="e2.wouldRentAgain"
                >
                  {{ e2.wouldRentAgain }}
                </p>
              </fieldset>

              <div class="flex gap-4" v-if="config.features.collectRentAmount">
                <UiInput
                  class="flex-1"
                  hint="Optional."
                  label="Monthly rent ($)"
                  placeholder="950"
                  type="number"
                  v-model="rentAmount"
                  :error="e2.rentAmount"
                />
                <UiInput
                  class="w-28"
                  label="Bedrooms"
                  placeholder="2"
                  type="number"
                  v-model="bedrooms"
                  :error="e2.bedrooms"
                />
                <UiInput
                  class="w-28"
                  label="Bathrooms"
                  placeholder="1"
                  type="number"
                  v-model="bathrooms"
                  :error="e2.bathrooms"
                />
              </div>

              <AddressAutocomplete
                hint="The unit you rented. Optional."
                label="Property address"
                v-model="propertyAddress"
                :error="e2.propertyAddress"
                :placeholder="`123 Main St, Apt 4, ${config.school.location}`"
              />

              <UiTextarea
                label="Your review"
                placeholder="Tell future tenants what they should know..."
                required
                v-model="comment"
                :error="e2.comment"
                :rows="5"
              />

              <TagSelector v-model="tags" />

              <div class="border-border flex items-center gap-3 border-t pt-2">
                <UiButton
                  type="submit"
                  :disabled="
                    !(grade && buildingCondition && comment.trim()) ||
                    wouldRentAgain === null
                  "
                  :loading="reviewLoading"
                >
                  Submit review
                </UiButton>
                <UiButton
                  type="button"
                  variant="ghost"
                  @click="router.push(`/landlord/${newLandlord?.id}`)"
                >
                  Skip for now
                </UiButton>
              </div>
            </form>
          </div>
        </template>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
