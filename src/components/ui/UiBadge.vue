<script lang="ts" setup>
  defineProps<{
    variant?: "default" | "student" | "success" | "error" | "muted";
  }>();
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-mono text-xs px-1.5 py-0.5 rounded-(--radius) border',
      variant === 'student'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : variant === 'success'
          ? 'bg-green-50 text-green-700 border-green-200'
          : variant === 'error'
            ? 'bg-red-50 text-red-700 border-red-200'
            : variant === 'muted'
              ? 'bg-surface text-text-muted border-border'
              : 'bg-surface text-text border-border',
    ]"
  >
    <slot />
  </span>
</template>
