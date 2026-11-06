<script lang="ts" setup>
  import { onMounted, ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiBadge from "@/components/ui/UiBadge.vue";
  import UiLetterGrade from "@/components/ui/UiLetterGrade.vue";
  import { useLandlordsStore } from "@/stores/landlords";
  import { useReviewsStore } from "@/stores/reviews";
  import type { Landlord } from "@/types";

  const route = useRoute();
  const router = useRouter();
  const landlordsStore = useLandlordsStore();
  const reviewsStore = useReviewsStore();

  const landlord = ref<Landlord | null>(null);
  const fetchError = ref(false);

  async function load(id: string) {
    landlord.value = null;
    fetchError.value = false;
    try {
      const fetched = await landlordsStore.fetchById(id);
      await reviewsStore.fetchByLandlord(id);
      landlord.value = fetched;
    } catch {
      fetchError.value = true;
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
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="mx-auto w-full max-w-5xl flex-1 px-6">
      <section class="border-border border-b pt-14 pb-6">
        <p class="text-text-muted mb-1 font-mono text-xs">
          <button
            class="hover:text-text transition-colors"
            type="button"
            @click="router.push('/admin')"
          >
            Admin
          </button>
        </p>
        <h1 class="font-display text-text text-3xl font-medium tracking-tight">
          {{ landlord?.name ?? "Reviews" }}
        </h1>
        <p class="text-text-muted mt-1 text-sm" v-if="landlord">
          {{ reviewsStore.reviews.length }}
          {{ reviewsStore.reviews.length === 1 ? "review" : "reviews" }}
        </p>
      </section>

      <div class="py-6">
        <UiAlert class="mb-4" variant="error" v-if="fetchError">
          Could not load reviews. Please refresh the page.
        </UiAlert>

        <div class="py-10 text-center" v-if="reviewsStore.loading">
          <p class="text-text-faint font-mono text-xs">Loading...</p>
        </div>

        <div class="py-10 text-center" v-else-if="!reviewsStore.reviews.length">
          <p class="text-text-muted text-sm">
            No reviews yet for this landlord.
          </p>
        </div>

        <div
          class="border-border overflow-hidden rounded-(--radius) border"
          v-else
        >
          <div class="divide-border divide-y">
            <div
              class="hover:bg-surface flex items-start gap-4 px-4 py-4 transition-colors duration-150"
              v-for="review in reviewsStore.reviews"
              :key="review.id"
            >
              <UiLetterGrade size="sm" :grade="review.grade" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-text-faint font-mono text-xs">
                    {{
                      new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(review.createdAt)
                    }}
                  </span>
                  <UiBadge variant="student" v-if="review.isVerifiedStudent"
                    >Student</UiBadge
                  >
                  <span
                    class="text-text-faint font-mono text-xs"
                    v-if="review.propertyAddress"
                    >· {{ review.propertyAddress }}</span
                  >
                </div>
                <p class="text-text mt-1.5 line-clamp-3 text-sm">
                  {{ review.comment }}
                </p>
                <div
                  class="mt-2 flex flex-wrap gap-1.5"
                  v-if="review.tags.length"
                >
                  <span
                    class="text-text-faint bg-surface rounded-(--radius) px-2 py-0.5 font-mono text-xs"
                    v-for="tag in review.tags"
                    :key="tag"
                    >{{
                      tag
                    }}</span
                  >
                </div>
              </div>
              <button
                class="shrink-0 font-mono text-xs text-red-600 underline-offset-2 hover:underline"
                type="button"
                @click="deleteReview(review.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
