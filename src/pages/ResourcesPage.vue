<script lang="ts" setup>
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import { config } from "@/config";
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="mx-auto w-full max-w-5xl flex-1 px-6">
      <section class="border-border border-b pt-14 pb-10">
        <h1 class="font-display text-text text-4xl font-medium tracking-tight">
          Tenant resources
        </h1>
        <p class="text-text-muted mt-3 max-w-lg text-sm">
          Helpful information, legal aid, and support for tenants in
          {{ config.school.location }}.
        </p>
      </section>

      <div class="flex flex-col gap-8 py-10">
        <section v-for="cat in config.resources" :key="cat.category">
          <h2 class="text-text-muted mb-4 font-mono text-xs">
            {{ cat.category }}
          </h2>
          <div
            class="divide-border border-border divide-y rounded-(--radius) border"
          >
            <a
              class="hover:bg-surface group flex items-start justify-between gap-4 px-4 py-4 transition-colors duration-150"
              rel="noopener"
              target="_blank"
              v-for="link in cat.links"
              :key="link.url"
              :href="link.url"
            >
              <div>
                <p
                  class="text-text group-hover:text-primary text-sm font-medium transition-colors duration-150"
                >
                  {{ link.title }}
                </p>
                <p class="text-text-muted mt-0.5 font-mono text-xs">
                  {{ link.description }}
                </p>
              </div>
              <svg
                aria-hidden="true"
                class="text-text-faint mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
          </div>
        </section>

        <p class="text-text-faint max-w-2xl font-mono text-xs">
          <span class="font-semibold">Disclaimer:</span>
          The information on this page is for educational purposes only and does
          not constitute legal advice. Please consult a qualified attorney or
          legal aid organization for advice regarding your specific situation.
        </p>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
