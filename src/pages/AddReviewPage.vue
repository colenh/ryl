<script lang="ts" setup>
  import { computed, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
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
  import { gradeOptions, reviewFormSchema, zodErrors } from "@/lib/schemas";
  import { useAuthStore } from "@/stores/auth";
  import { useLandlordsStore } from "@/stores/landlords";
  import { useReviewsStore } from "@/stores/reviews";
  import type { LetterGrade } from "@/types";

  const router = useRouter();
  const route = useRoute();
  const auth = useAuthStore();
  const landlordsStore = useLandlordsStore();
  const reviewsStore = useReviewsStore();

  const landlordQueryId = route.query.landlord as string | undefined;
  const selectedLandlordId = ref(landlordQueryId ?? "");

  onMounted(async () => {
    try {
      if (landlordQueryId) {
        const found = await landlordsStore.fetchById(landlordQueryId);
        if (found && !landlordsStore.landlords.some((l) => l.id === found.id)) {
          landlordsStore.landlords = [found, ...landlordsStore.landlords];
        }
      } else {
        await landlordsStore.fetchAll();
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load landlords.";
    }
  });

  const selectedLandlord = computed(
    () =>
      landlordsStore.landlords.find((l) => l.id === selectedLandlordId.value) ??
      null
  );
  const landlordOptions = computed(() =>
    landlordsStore.landlords.map((l) => ({ label: l.name, value: l.id }))
  );

  const grade = ref("");
  const buildingCondition = ref("");
  const wouldRentAgain = ref<boolean | null>(null);
  const rentAmount = ref("");
  const bedrooms = ref("");
  const bathrooms = ref("");
  const propertyAddress = ref("");
  const comment = ref("");
  const tags = ref<string[]>([]);
  const loading = ref(false);
  const error = ref("");
  const e = ref<Record<string, string>>({});

  async function submit() {
    e.value = {};
    if (!selectedLandlordId.value) {
      e.value.landlordId = "Please select a landlord";
      return;
    }
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
      e.value = { ...e.value, ...zodErrors(result) };
      return;
    }
    loading.value = true;
    error.value = "";
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
        landlordId: selectedLandlordId.value,
        propertyAddress: result.data.propertyAddress || undefined,
        rentAmount: result.data.rentAmount
          ? Number(result.data.rentAmount)
          : undefined,
        tags: tags.value,
        userId: auth.user?.id ?? null,
        wouldRentAgain: result.data.wouldRentAgain as boolean,
      });
      router.push(`/landlord/${selectedLandlordId.value}`);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to submit review.";
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

        <UiAlert variant="warning" v-if="auth.user && !auth.user.emailVerified">
          Please verify your email before submitting a review. Check your inbox
          for a confirmation link.
        </UiAlert>

        <div v-else>
          <h1
            class="font-display text-text text-3xl font-medium tracking-tight"
          >
            Write a review
          </h1>
          <p class="text-text-muted mt-2 text-sm">
            Your review helps other students make informed decisions.
          </p>

          <form class="mt-8 flex flex-col gap-6" @submit.prevent="submit">
            <UiAlert variant="error" v-if="error">{{ error }}</UiAlert>

            <template v-if="landlordQueryId">
              <div class="flex flex-col gap-1.5">
                <span class="text-text-muted font-mono text-xs">Landlord</span>
                <p class="text-text font-mono text-sm">
                  {{ selectedLandlord?.name ?? "..." }}
                </p>
              </div>
            </template>
            <template v-else>
              <UiSelect
                label="Landlord"
                placeholder="Select a landlord"
                required
                v-model="selectedLandlordId"
                :error="e.landlordId"
                :options="landlordOptions"
              />
            </template>

            <UiSelect
              label="Landlord rating"
              placeholder="Select a grade"
              required
              v-model="grade"
              :error="e.grade"
              :options="gradeOptions"
            />

            <UiSelect
              label="Building condition"
              placeholder="Select a grade"
              required
              v-model="buildingCondition"
              :error="e.buildingCondition"
              :options="gradeOptions"
            />

            <fieldset class="m-0 flex min-w-0 flex-col gap-1.5 border-none p-0">
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
              <p class="font-mono text-xs text-red-600" v-if="e.wouldRentAgain">
                {{ e.wouldRentAgain }}
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
                :error="e.rentAmount"
              />
              <UiInput
                class="w-28"
                label="Bedrooms"
                placeholder="2"
                type="number"
                v-model="bedrooms"
                :error="e.bedrooms"
              />
              <UiInput
                class="w-28"
                label="Bathrooms"
                placeholder="1"
                type="number"
                v-model="bathrooms"
                :error="e.bathrooms"
              />
            </div>

            <AddressAutocomplete
              hint="The unit you rented. Optional."
              label="Property address"
              v-model="propertyAddress"
              :error="e.propertyAddress"
              :placeholder="`123 Main St, Apt 4, ${config.school.location}`"
            />

            <UiTextarea
              label="Your review"
              placeholder="Tell future tenants what they should know..."
              required
              v-model="comment"
              :error="e.comment"
              :rows="5"
            />

            <TagSelector v-model="tags" />

            <div class="border-border flex items-center gap-3 border-t pt-2">
              <UiButton type="submit" :loading="loading">
                Submit review
              </UiButton>
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
