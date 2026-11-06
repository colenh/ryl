<script lang="ts" setup>
  defineProps<{
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
  }>();
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 font-mono font-semibold rounded-(--radius) transition-colors duration-150 focus-visible:outline-2',
      size === 'sm'
        ? 'text-xs px-3 py-2'
        : size === 'lg'
          ? 'text-sm px-5 py-3'
          : 'text-xs px-4 py-2.5',
      variant === 'secondary'
        ? 'border border-border-strong text-text hover:bg-surface disabled:opacity-50'
        : variant === 'ghost'
          ? 'text-text-muted hover:bg-surface hover:text-text disabled:opacity-40'
          : variant === 'danger'
            ? 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
            : 'bg-primary text-primary-fg hover:bg-primary-hover disabled:opacity-50',
      (disabled || loading) && 'cursor-not-allowed',
    ]"
    :disabled="disabled || loading"
    :type="type ?? 'button'"
  >
    <svg
      aria-hidden="true"
      class="h-3.5 w-3.5 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      v-if="loading"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        fill="currentColor"
      />
    </svg>
    <slot />
  </button>
</template>
