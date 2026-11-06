<script lang="ts" setup>
  import { computed, onMounted, ref } from "vue";
  import { RouterLink } from "vue-router";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import UiButton from "@/components/ui/UiButton.vue";
  import UiLetterGrade from "@/components/ui/UiLetterGrade.vue";
  import { isMockMode, supabase } from "@/lib/supabase";
  import { useLandlordsStore } from "@/stores/landlords";
  import { useReviewsStore } from "@/stores/reviews";

  const store = useLandlordsStore();
  const reviewsStore = useReviewsStore();
  const fetchError = ref(false);
  const userCount = ref<number | null>(null);
  const reviewCount = ref<number | null>(null);

  onMounted(async () => {
    try {
      await Promise.all([
        store.fetchAll(),
        reviewsStore.fetchCount().then((n) => {
          reviewCount.value = n;
        }),
      ]);
    } catch {
      fetchError.value = true;
    }
    if (!isMockMode) {
      const { data } = await supabase.rpc("get_user_count");
      if (typeof data === "number") {
        userCount.value = data;
      }
    }
  });

  const stats = computed(() => [
    { label: "Landlords", value: String(store.landlords.length) },
    {
      label: "Reviews",
      value: reviewCount.value === null ? "—" : String(reviewCount.value),
    },
    {
      label: "Registered users",
      value: userCount.value === null ? "—" : String(userCount.value),
    },
  ]);

  async function deleteLandlord(id: string) {
    // biome-ignore lint/suspicious/noAlert: easier
    const confirmed = window.confirm(
      "Delete this landlord and all their reviews? This cannot be undone."
    );
    if (!confirmed) {
      return;
    }
    try {
      await store.remove(id);
    } catch {
      // biome-ignore lint/suspicious/noAlert: easier
      window.alert("Failed to delete landlord. Please try again.");
    }
  }
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="mx-auto w-full max-w-5xl flex-1 px-6">
      <section
        class="border-border flex items-end justify-between border-b pt-14 pb-6"
      >
        <h1 class="font-display text-text text-3xl font-medium tracking-tight">
          Admin
        </h1>
        <RouterLink to="/landlord/add">
          <UiButton size="sm">+ Add landlord</UiButton>
        </RouterLink>
      </section>

      <UiAlert class="mt-8" variant="error" v-if="fetchError">
        Could not load data. Please refresh the page.
      </UiAlert>

      <div
        class="border-border bg-border mt-8 mb-6 grid grid-cols-2 gap-px overflow-hidden rounded-(--radius) border sm:grid-cols-3"
      >
        <div class="bg-white px-5 py-5" v-for="stat in stats" :key="stat.label">
          <p class="text-text-muted font-mono text-xs">{{ stat.label }}</p>
          <p class="font-display text-text mt-1 text-3xl font-medium">
            {{ stat.value }}
          </p>
        </div>
      </div>

      <div class="pb-6">
        <div class="border-border overflow-hidden rounded-(--radius) border">
          <div
            class="border-border bg-surface hidden grid-cols-[1fr_72px_72px_120px] border-b px-4 py-2.5 sm:grid"
          >
            <span class="text-text-muted font-mono text-xs">Name</span>
            <span class="text-text-muted text-center font-mono text-xs"
              >Grade</span
            >
            <span class="text-text-muted text-center font-mono text-xs"
              >Reviews</span
            >
            <span class="text-text-muted text-right font-mono text-xs"
              >Actions</span
            >
          </div>
          <div class="divide-border divide-y">
            <div
              class="hover:bg-surface flex flex-col gap-2 px-4 py-3 transition-colors duration-150 sm:grid sm:grid-cols-[1fr_72px_72px_120px] sm:items-center"
              v-for="landlord in store.landlords"
              :key="landlord.id"
            >
              <div>
                <RouterLink
                  class="text-text hover:text-primary text-sm font-medium transition-colors"
                  :to="`/landlord/${landlord.id}`"
                >
                  {{ landlord.name }}
                </RouterLink>
                <p
                  class="text-text-faint mt-0.5 font-mono text-xs"
                  v-if="landlord.addresses?.length"
                >
                  {{ landlord.addresses[0] }}
                  {{
                    landlord.addresses.length > 1
                      ? ` +${landlord.addresses.length - 1}`
                      : ""
                  }}
                </p>
              </div>
              <div class="flex items-center gap-4 sm:contents">
                <div class="flex sm:justify-center">
                  <UiLetterGrade
                    size="sm"
                    v-if="landlord.gradeAggregate"
                    :grade="landlord.gradeAggregate"
                  />
                  <span class="text-text-faint font-mono text-xs" v-else
                    >--</span
                  >
                </div>
                <RouterLink
                  class="text-primary font-mono text-xs underline underline-offset-2 sm:block sm:text-center"
                  :to="`/admin/landlord/${landlord.id}/reviews`"
                  >{{ landlord.reviewCount }}
                  reviews</RouterLink
                >
                <div class="ml-auto flex gap-3 sm:ml-0 sm:justify-end">
                  <RouterLink
                    class="text-primary py-1.5 font-mono text-xs underline-offset-2 hover:underline"
                    :to="`/admin/landlord/${landlord.id}/edit`"
                    >Edit</RouterLink
                  >
                  <button
                    class="py-1.5 font-mono text-xs text-red-600 underline-offset-2 hover:underline"
                    type="button"
                    @click="deleteLandlord(landlord.id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
