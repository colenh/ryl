<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import TagSelector from "@/components/review/TagSelector.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiInput from "@/components/ui/UiInput.vue";
  import UiSelect from "@/components/ui/UiSelect.vue";
  import UiTextarea from "@/components/ui/UiTextarea.vue";
  import { config } from "@/config";
  import { gradeOptions, reviewFormSchema, zodErrors } from "@/lib/schemas";
  import { useAuthStore } from "@/stores/auth";
  import { useReviewsStore } from "@/stores/reviews";

  const router = useRouter();
  const route = useRoute();
  const auth = useAuthStore();
  const reviewsStore = useReviewsStore();

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
  const fetchError = ref("");
  const e = ref<Record<string, string>>({});

  onMounted(async () => {
    try {
      const review = await reviewsStore.fetchById(String(route.params.id));
      if (!review) {
        router.replace("/");
        return;
      }
      if (review.userId !== auth.user?.id && !auth.isAdmin) {
        router.replace("/");
        return;
      }
      grade.value = review.grade;
      buildingCondition.value = review.buildingCondition;
      wouldRentAgain.value = review.wouldRentAgain;
      rentAmount.value =
        review.rentAmount === null ? "" : String(review.rentAmount);
      bedrooms.value = review.bedrooms === null ? "" : String(review.bedrooms);
      bathrooms.value =
        review.bathrooms === null ? "" : String(review.bathrooms);
      propertyAddress.value = review.propertyAddress ?? "";
      comment.value = review.comment;
      tags.value = review.tags ?? [];
    } catch (err) {
      fetchError.value =
        err instanceof Error ? err.message : "Failed to load review.";
    }
  });

  async function submit() {
    e.value = {};
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
      e.value = zodErrors(result);
      return;
    }
    loading.value = true;
    error.value = "";
    try {
      await reviewsStore.update(String(route.params.id), {
        ...result.data,
        tags: tags.value,
        bathrooms: result.data.bathrooms
          ? Number(result.data.bathrooms)
          : undefined,
        bedrooms: result.data.bedrooms
          ? Number(result.data.bedrooms)
          : undefined,
        rentAmount: result.data.rentAmount
          ? Number(result.data.rentAmount)
          : undefined,
      });
      router.back();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to save changes.";
    } finally {
      loading.value = false;
    }
  }
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="mx-auto w-full max-w-5xl flex-1 px-6">
      <div class="pt-8 pb-4">
        <button
          class="text-text-muted hover:text-text font-mono text-xs transition-colors"
          type="button"
          @click="router.back()"
        >
          ← Back
        </button>
      </div>
      <div class="max-w-lg">
        <UiAlert variant="error" v-if="fetchError">{{ fetchError }}</UiAlert>
        <template v-else>
          <h1
            class="font-display text-text text-3xl font-medium tracking-tight"
          >
            Edit review
          </h1>
          <form class="mt-8 flex flex-col gap-6" @submit.prevent="submit">
            <UiAlert variant="error" v-if="error">{{ error }}</UiAlert>
            <UiSelect
              label="Landlord rating"
              required
              v-model="grade"
              :error="e.grade"
              :options="gradeOptions"
            />
            <UiSelect
              label="Building condition"
              required
              v-model="buildingCondition"
              :error="e.buildingCondition"
              :options="gradeOptions"
            />
            <fieldset class="m-0 flex min-w-0 flex-col gap-1.5 border-none p-0">
              <legend class="text-text-muted mb-1.5 font-mono text-xs">
                Would rent again?
              </legend>
              <div class="flex gap-3">
                <label
                  :class="[
                    'flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-(--radius) border cursor-pointer',
                    wouldRentAgain === true
                      ? 'border-green-400 bg-green-50 text-green-700'
                      : 'border-border-strong text-text-muted',
                  ]"
                >
                  <input
                    class="sr-only"
                    name="wra"
                    type="radio"
                    v-model="wouldRentAgain"
                    :value="true"
                  >Yes
                </label>
                <label
                  :class="[
                    'flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-(--radius) border cursor-pointer',
                    wouldRentAgain === false
                      ? 'border-red-400 bg-red-50 text-red-700'
                      : 'border-border-strong text-text-muted',
                  ]"
                >
                  <input
                    class="sr-only"
                    name="wra"
                    type="radio"
                    v-model="wouldRentAgain"
                    :value="false"
                  >No
                </label>
              </div>
              <p class="font-mono text-xs text-red-600" v-if="e.wouldRentAgain">
                {{ e.wouldRentAgain }}
              </p>
            </fieldset>
            <div class="flex gap-4" v-if="config.features.collectRentAmount">
              <UiInput
                class="flex-1"
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
            <UiInput
              label="Property address"
              v-model="propertyAddress"
              :error="e.propertyAddress"
              :placeholder="`123 Main St, Apt 4, ${config.school.location}`"
            />
            <UiTextarea
              label="Your review"
              required
              v-model="comment"
              :error="e.comment"
              :rows="5"
            />
            <TagSelector v-model="tags" />
            <div class="border-border flex items-center gap-3 border-t pt-2">
              <UiButton type="submit" :loading="loading">Save changes</UiButton>
              <UiButton type="button" variant="ghost" @click="router.back()"
                >Cancel</UiButton
              >
            </div>
          </form>
        </template>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
