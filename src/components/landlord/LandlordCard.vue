<script lang="ts" setup>
  import { RouterLink } from "vue-router";
  import UiLetterGrade from "@/components/ui/UiLetterGrade.vue";
  import type { Landlord } from "@/types";

  defineProps<{ landlord: Landlord }>();
</script>

<template>
  <RouterLink
    class="border-border hover:border-border-strong hover:bg-surface group flex items-center gap-5 rounded-(--radius) border px-5 py-5 transition-colors duration-150"
    :to="`/landlord/${landlord.id}`"
  >
    <UiLetterGrade
      class="shrink-0"
      size="lg"
      v-if="landlord.gradeAggregate"
      :grade="landlord.gradeAggregate"
    />
    <span
      class="border-border text-text-faint inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-(--radius) border font-mono text-2xl font-bold"
      v-else
      >—</span
    >

    <div class="min-w-0 flex-1">
      <p
        class="text-text group-hover:text-primary truncate text-base font-semibold transition-colors duration-150"
      >
        {{ landlord.name }}
      </p>
      <p
        class="text-text-faint mt-0.5 flex min-w-0 items-center gap-1 font-mono text-xs"
      >
        <span class="truncate">{{
          landlord.addresses?.[0]?.split(",")[0]
        }}</span>
        <span class="shrink-0" v-if="(landlord.addresses?.length ?? 0) > 1"
          >· +{{ landlord.addresses!.length - 1 }}
          more</span
        >
      </p>
      <p
        class="text-text-muted mt-2 text-xs"
        v-if="landlord.wouldRentAgainPct !== null"
      >
        {{ landlord.wouldRentAgainPct }}% would rent again ·
        <span class="text-text-faint"
          >{{ landlord.reviewCount }}
          {{ landlord.reviewCount === 1 ? "review" : "reviews" }}</span
        >
      </p>
    </div>

    <svg
      aria-hidden="true"
      class="text-text-faint h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </RouterLink>
</template>
