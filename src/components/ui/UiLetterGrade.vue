<script lang="ts" setup>
  import { computed } from "vue";
  import type { LetterGrade } from "@/types";

  const props = defineProps<{
    grade: LetterGrade;
    size?: "sm" | "md" | "lg";
  }>();

  const style = computed(
    () =>
      ({
        A: { bg: "#dcfce7", border: "#86efac", text: "#15803d" },
        B: { bg: "#ecfccb", border: "#bef264", text: "#4d7c0f" },
        C: { bg: "#fef9c3", border: "#fde047", text: "#a16207" },
        D: { bg: "#ffedd5", border: "#fdba74", text: "#c2410c" },
        F: { bg: "#fee2e2", border: "#fca5a5", text: "#b91c1c" },
      })[props.grade]
  );
</script>

<template>
  <span
    :class="[
      'inline-flex items-center justify-center font-mono font-bold border rounded-(--radius)',
      size === 'lg'
        ? 'w-12 h-12 text-2xl'
        : size === 'sm'
          ? 'w-6 h-6 text-xs'
          : 'w-8 h-8 text-base',
    ]"
    :style="{
      backgroundColor: style.bg,
      color: style.text,
      borderColor: style.border,
    }"
  >
    {{ grade }}
  </span>
</template>
