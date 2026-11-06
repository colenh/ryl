<script lang="ts" setup>
  import { RouterLink } from "vue-router";
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
          About us
        </h1>
        <p class="text-text-muted mt-3 text-sm">
          A community-driven platform for {{ config.school.location }} tenants.
        </p>
      </section>

      <div class="divide-border flex flex-col divide-y pt-4 pb-0">
        <div class="flex flex-col gap-3 py-8">
          <h2 class="font-display text-text text-xl font-medium">
            Why this exists
          </h2>
          <p class="text-text-muted text-sm leading-relaxed text-pretty">
            Signing a lease is one of the biggest financial decisions a student
            makes, and most of the time it comes down to luck. A landlord can
            look great on paper and turn out to be slow on repairs, difficult
            about the deposit, or impossible to reach. Rate Your Landlord gives
            {{ config.school.name }} tenants a place to share honest experiences
            so future renters can make a better-informed decision before they
            sign.
          </p>
        </div>

        <div class="flex flex-col gap-3 py-8">
          <h2 class="font-display text-text text-xl font-medium">
            How it works
          </h2>
          <p class="text-text-muted text-sm leading-relaxed text-pretty">
            Think Rate My Professor, but for your landlord. Search for a
            landlord by name or address, read what other tenants have said, and
            leave your own review. All submissions are anonymous and secure.
          </p>
        </div>

        <div class="flex flex-col gap-3 py-8">
          <h2 class="font-display text-text text-xl font-medium">
            Who runs it
          </h2>
          <p class="text-text-muted text-sm leading-relaxed text-pretty">
            This site is run by students at {{ config.school.name }},
            independent of the university. It is built in partnership with
            <a
              class="text-primary underline underline-offset-2 hover:opacity-75"
              href="https://mpuniversity.us/ryl/"
              rel="noopener noreferrer"
              target="_blank"
              >More Perfect University</a
            >, which provided the original code and technical tools. Students
            independently manage the project, its outreach, and its activities.
            Have a question or want to get involved? Reach out on the
            <RouterLink
              class="text-primary underline underline-offset-2 hover:opacity-75"
              to="/contact"
              >contact page</RouterLink
            >.
          </p>
        </div>

        <div class="flex flex-col gap-3 py-8">
          <h2 class="font-display text-text text-xl font-medium">Disclaimer</h2>
          <p class="text-text-muted text-sm leading-relaxed text-pretty">
            Reviews are submitted by tenants and reflect their personal
            experiences. We do not verify individual reviews, and nothing on
            this site constitutes legal or professional advice. If you believe a
            review about you is inaccurate, contact us and we will look into it.
            Landlords may request removal of reviews that violate our
            <RouterLink
              class="text-primary underline underline-offset-2 hover:opacity-75"
              to="/terms"
              >Terms of Service</RouterLink
            >.
          </p>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
