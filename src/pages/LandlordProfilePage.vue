<script lang="ts" setup>
  import { onMounted, ref, watch } from "vue";
  import { RouterLink, useRoute, useRouter } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import ReviewCard from "@/components/review/ReviewCard.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiLetterGrade from "@/components/ui/UiLetterGrade.vue";
  import { config } from "@/config";
  import { useLandlordsStore } from "@/stores/landlords";
  import { useReviewsStore } from "@/stores/reviews";
  import type { Landlord } from "@/types";

  const route = useRoute();
  const router = useRouter();
  const landlordsStore = useLandlordsStore();
  const reviewsStore = useReviewsStore();

  async function deleteReview(id: string) {
    // biome-ignore lint/suspicious/noAlert: easier
    if (window.confirm("Delete this review? This cannot be undone.")) {
      try {
        await reviewsStore.remove(id);
      } catch {
        // biome-ignore lint/suspicious/noAlert: easier
        window.alert("Failed to delete review. Please try again.");
      }
    }
  }

  const landlord = ref<Landlord | null>(null);
  const loading = ref(true);
  const reviewsError = ref(false);
  const landlordError = ref(false);

  async function load(id: string) {
    landlord.value = null;
    loading.value = true;
    reviewsError.value = false;
    landlordError.value = false;
    try {
      const fetched = await landlordsStore.fetchById(id);
      if (fetched) {
        try {
          await reviewsStore.fetchByLandlord(id);
        } catch {
          reviewsError.value = true;
        }
      }
      landlord.value = fetched;
    } catch {
      landlordError.value = true;
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => load(route.params.id as string));
  watch(
    () => route.params.id,
    (id) => {
      if (id) {
        load(id as string);
      }
    }
  );

  watch(landlord, (l) => {
    document.title = l
      ? `${l.name} - RYL ${config.school.shortName}`
      : `RYL ${config.school.shortName}`;
  });
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />

    <main class="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
      <div class="pt-8 pb-4">
        <RouterLink
          class="text-text-muted hover:text-text font-mono text-xs transition-colors"
          to="/"
        >
          ← All Landlords
        </RouterLink>
      </div>

      <template v-if="landlord">
        <section class="border-border border-b pb-8">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1
                class="font-display text-text text-3xl font-medium tracking-tight sm:text-4xl"
              >
                {{ landlord.name }}
              </h1>
              <div
                class="mt-1 flex flex-col gap-0.5"
                v-if="landlord.addresses?.filter((a) => a.trim()).length"
              >
                <p
                  class="text-text-faint font-mono text-xs"
                  v-for="addr in landlord.addresses.filter((a) => a.trim())"
                  :key="addr"
                >
                  {{ addr }}
                </p>
              </div>
              <p
                class="text-text-muted mt-2 max-w-prose text-sm"
                v-if="landlord.note"
              >
                <span class="font-semibold">Note:</span> {{ landlord.note }}
              </p>
            </div>
            <RouterLink :to="`/review/add?landlord=${landlord.id}`">
              <UiButton>Write a review</UiButton>
            </RouterLink>
          </div>

          <div class="mt-8 flex flex-wrap gap-8">
            <div class="flex flex-col gap-1.5">
              <span class="text-text-muted font-mono text-xs"
                >Overall grade</span
              >
              <div class="flex items-center gap-2">
                <UiLetterGrade
                  size="lg"
                  v-if="landlord.gradeAggregate"
                  :grade="landlord.gradeAggregate"
                />
                <span class="text-text-faint font-mono text-sm" v-else>—</span>
              </div>
            </div>

            <div
              aria-hidden="true"
              class="bg-border hidden w-px self-stretch sm:block"
            />

            <div class="flex flex-col gap-1.5">
              <span class="text-text-muted font-mono text-xs"
                >Building condition</span
              >
              <div class="flex items-center gap-2">
                <UiLetterGrade
                  size="lg"
                  v-if="landlord.buildingGrade"
                  :grade="landlord.buildingGrade"
                />
                <span class="text-text-faint font-mono text-sm" v-else>—</span>
              </div>
            </div>

            <div
              aria-hidden="true"
              class="bg-border hidden w-px self-stretch sm:block"
            />

            <div class="flex flex-col gap-1.5">
              <span class="text-text-muted font-mono text-xs"
                >Would rent again</span
              >
              <p
                class="font-display text-text text-2xl font-medium"
                v-if="landlord.wouldRentAgainPct !== null"
              >
                {{ landlord.wouldRentAgainPct }}%
              </p>
              <span class="text-text-faint font-mono text-sm" v-else>—</span>
            </div>

            <div
              aria-hidden="true"
              class="bg-border hidden w-px self-stretch sm:block"
            />

            <div class="flex flex-col gap-1.5">
              <span class="text-text-muted font-mono text-xs">Reviews</span>
              <p class="font-display text-text text-2xl font-medium">
                {{ landlord.reviewCount }}
              </p>
            </div>
          </div>
        </section>

        <section class="py-8">
          <UiAlert variant="error" v-if="reviewsError">
            Could not load reviews. Please try again later.
          </UiAlert>

          <h2
            class="text-text-muted mb-0 font-mono text-xs"
            v-if="reviewsStore.reviews.length > 1"
          >
            {{ reviewsStore.reviews.length }} reviews
          </h2>

          <div
            class="divide-border divide-y"
            v-if="reviewsStore.reviews.length"
          >
            <ReviewCard
              editable
              v-for="review in reviewsStore.reviews"
              :key="review.id"
              :review="review"
              @delete="deleteReview(review.id)"
              @edit="router.push(`/review/${review.id}/edit`)"
            />
          </div>

          <div class="py-16 text-center" v-else>
            <p class="text-text-muted text-sm">No reviews yet.</p>
            <RouterLink
              class="text-primary mt-2 inline-block font-mono text-xs underline-offset-2 hover:underline"
              :to="`/review/add?landlord=${landlord.id}`"
            >
              Be the first to review
            </RouterLink>
          </div>
        </section>
      </template>

      <div class="py-20 text-center" v-else-if="loading">
        <p class="text-text-faint font-mono text-xs">Loading...</p>
      </div>

      <div
        class="flex flex-1 flex-col items-center justify-center py-24 text-center"
        v-else
      >
        <template v-if="landlordError">
          <UiAlert variant="error">
            Could not load this page. Please try again later.
          </UiAlert>
        </template>
        <template v-else>
          <p
            class="font-display text-8xl font-medium tracking-tight"
            style="color: var(--brand-primary); opacity: 0.12;"
          >
            ?
          </p>
          <h2
            class="font-display text-text mt-2 text-3xl font-medium tracking-tight"
          >
            Landlord not found
          </h2>
          <p class="text-text-muted mt-2 max-w-xs text-sm">
            This landlord may have been removed or the link is incorrect.
          </p>
        </template>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
