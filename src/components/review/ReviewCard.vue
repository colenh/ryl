<script lang="ts" setup>
  import UiBadge from "@/components/ui/UiBadge.vue";
  import UiLetterGrade from "@/components/ui/UiLetterGrade.vue";
  import { useAuthStore } from "@/stores/auth";
  import type { Review } from "@/types";

  const _props = defineProps<{
    review: Review;
    editable?: boolean;
  }>();
  defineEmits<{ edit: []; delete: [] }>();

  const auth = useAuthStore();

  function formatDate(d: Date) {
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  }
</script>

<template>
  <article class="flex gap-5 py-6">
    <div class="flex w-14 shrink-0 flex-col gap-2">
      <div class="flex flex-col gap-0.5">
        <span
          class="text-text-muted font-mono text-[10px] font-bold tracking-wider uppercase"
          >Landlord</span
        >
        <UiLetterGrade size="lg" :grade="review.grade" />
      </div>
      <div class="flex flex-col gap-0.5">
        <span
          class="text-text-muted font-mono text-[10px] font-bold tracking-wider uppercase"
          >Building</span
        >
        <UiLetterGrade size="lg" :grade="review.buildingCondition" />
      </div>
    </div>

    <div class="flex min-w-0 flex-1 gap-4">
      <div class="flex min-w-0 flex-1 flex-col gap-2.5">
        <div class="flex flex-col gap-2">
          <p
            class="text-text truncate text-sm font-semibold"
            v-if="review.propertyAddress"
          >
            {{ review.propertyAddress }}
          </p>
          <div class="flex flex-wrap items-center gap-1.5">
            <UiBadge :variant="review.wouldRentAgain ? 'success' : 'error'">
              {{
                review.wouldRentAgain
                  ? "Would rent again"
                  : "Would not rent again"
              }}
            </UiBadge>
            <UiBadge variant="student" v-if="review.isVerifiedStudent"
              >Verified Student</UiBadge
            >
          </div>
        </div>
        <p
          class="text-text-faint font-mono text-xs"
          v-if="review.rentAmount || review.bedrooms || review.bathrooms"
        >
          <template v-if="review.rentAmount"
            >${{ review.rentAmount }}/mo</template
          ><template v-if="review.bedrooms"> · {{ review.bedrooms }}bd</template
          ><template v-if="review.bathrooms">
            · {{ review.bathrooms }}ba</template
          >
        </p>
        <p class="text-text text-sm leading-relaxed">{{ review.comment }}</p>
        <div class="flex flex-wrap gap-1.5" v-if="review.tags.length">
          <UiBadge variant="muted" v-for="tag in review.tags" :key="tag">{{
            tag
          }}</UiBadge>
        </div>
      </div>
      <div class="flex shrink-0 flex-col items-end gap-1">
        <p class="text-text-faint font-mono text-xs">
          {{ formatDate(review.createdAt) }}
        </p>
        <div
          class="flex gap-2"
          v-if="editable && (auth.isAdmin || review.userId === auth.user?.id)"
        >
          <button
            class="text-text-faint hover:text-primary font-mono text-xs transition-colors"
            type="button"
            @click="$emit('edit')"
          >
            Edit
          </button>
          <button
            class="text-text-faint font-mono text-xs transition-colors hover:text-red-600"
            type="button"
            @click="$emit('delete')"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
