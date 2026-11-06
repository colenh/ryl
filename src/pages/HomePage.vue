<script lang="ts" setup>
  import { computed, onMounted, ref } from "vue";
  import { RouterLink } from "vue-router";
  import LandlordCard from "@/components/landlord/LandlordCard.vue";
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import BrandLogo from "@/components/ui/BrandLogo.vue";
  import UiAlert from "@/components/ui/UiAlert.vue";
  import { config } from "@/config";
  import { useLandlordsStore } from "@/stores/landlords";

  const search = ref("");
  const store = useLandlordsStore();

  const fetchError = ref(false);

  onMounted(async () => {
    try {
      await store.fetchAll();
    } catch {
      fetchError.value = true;
    }
  });

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) {
      return store.landlords;
    }
    return store.landlords.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.addresses?.some((a) => a.toLowerCase().includes(q))
    );
  });
</script>

<template>
  <AppHeader />

  <main>
    <section
      class="border-b border-border"
      :style="
        config.brand.heroImage
          ? `background: linear-gradient(rgba(0,0,0,0.72),rgba(0,0,0,0.72)),url('${config.brand.heroImage}') center/cover;`
          : `background: linear-gradient(rgba(255,255,255,0.35),rgba(255,255,255,0.35)),url('/hero-texture.jpg') center/cover;`
      "
    >
      <div class="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div class="flex flex-col items-center text-center gap-6">
          <BrandLogo
            class="w-full max-w-xl h-auto"
            variant="homepage"
            :light-text="!!config.brand.heroImage"
          />

          <p
            :class="
              config.brand.heroImage
                ? 'text-base text-white/90'
                : 'text-base text-text-muted'
            "
            :style="
              config.brand.heroImage
                ? 'text-shadow: 0 1px 6px rgba(0,0,0,0.7)'
                : ''
            "
          >
            How would your landlord act if everyone was watching?
          </p>

          <div class="w-full max-w-2xl">
            <div class="relative">
              <svg
                aria-hidden="true"
                class="absolute left-4 top-[calc(50%-1.5px)] -translate-y-1/2 w-4 h-4 pointer-events-none text-white/70 z-10"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-4.35-4.35m0 0A7 7 0 1 0 6.65 6.65a7 7 0 0 0 10 10z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <input
                placeholder="Search by landlord name or address..."
                type="text"
                v-model="search"
                :class="[
                  'search-input w-full pl-11 py-3.5 text-sm rounded-(--radius) transition-colors duration-150',
                  config.brand.heroImage
                    ? 'search-input--hero placeholder:text-white/70'
                    : '',
                  search ? 'pr-10' : 'pr-4',
                ]"
                :style="
                  config.brand.heroImage
                    ? 'background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: rgba(255,255,255,1); backdrop-filter: blur(4px);'
                    : 'background: var(--brand-search-bg); border: 1px solid transparent; color: rgba(255,255,255,0.9);'
                "
              >
              <button
                aria-label="Clear search"
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/70 hover:text-white transition-colors duration-150"
                type="button"
                v-if="search"
                @click="search = ''"
              >
                <svg
                  aria-hidden="true"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p
              :class="
                config.brand.heroImage
                  ? 'mt-6 text-sm text-white/80'
                  : 'mt-6 text-sm text-text-muted'
              "
            >
              Can't find your landlord?
              <RouterLink
                class="font-semibold underline-offset-2 transition-opacity duration-150 hover:opacity-70"
                to="/landlord/add"
                :style="
                  config.brand.heroImage
                    ? 'color: var(--brand-hero-link); text-decoration: underline;'
                    : 'color: var(--brand-primary); text-decoration: underline;'
                "
                >Add them now →</RouterLink
              >
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 pt-8 pb-0">
      <p aria-atomic="true" aria-live="polite" class="sr-only">
        {{
          store.loading
            ? ""
            : `${filtered.length} landlord${filtered.length === 1 ? "" : "s"} found`
        }}
      </p>
      <UiAlert class="mb-4" variant="error" v-if="fetchError">
        Could not load landlords. Please try again later.
      </UiAlert>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        v-if="!store.loading && filtered.length"
      >
        <LandlordCard
          v-for="landlord in filtered"
          :key="landlord.id"
          :landlord="landlord"
        />
      </div>

      <div class="py-16 text-center" v-if="store.loading">
        <p class="font-mono text-xs text-text-faint">Loading...</p>
      </div>

      <div class="py-16 text-center" v-else-if="!filtered.length && search">
        <p class="text-sm text-text-muted">
          No landlords found for "{{ search }}".
        </p>
        <RouterLink
          class="mt-3 inline-block font-mono text-xs text-primary hover:underline underline-offset-2"
          to="/landlord/add"
        >
          Add "{{ search }}" as a new landlord
        </RouterLink>
      </div>
      <div
        class="py-16 text-center"
        v-else-if="!(filtered.length || fetchError)"
      >
        <p class="text-sm text-text-muted">No landlords yet.</p>
        <RouterLink
          class="mt-3 inline-block font-mono text-xs text-primary hover:underline underline-offset-2"
          to="/landlord/add"
          >Be the first to add one →</RouterLink
        >
      </div>
    </section>
  </main>

  <AppFooter />
</template>

<style scoped>
  .search-input:hover:not(:focus-within) {
    background: #273549 !important;
  }
  .search-input:focus-within {
    background: #1e293b !important;
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px rgba(0, 0, 0, 0.3) !important;
  }
  .search-input--hero:hover:not(:focus-within) {
    background: rgba(255, 255, 255, 0.22) !important;
  }
  .search-input--hero:focus-within {
    background: rgba(255, 255, 255, 0.2) !important;
    border-color: rgba(255, 255, 255, 0.7) !important;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5) !important;
  }
</style>
