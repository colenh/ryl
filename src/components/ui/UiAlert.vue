<script lang="ts" setup>
  defineProps<{
    variant?: "success" | "error" | "info" | "warning";
    title?: string;
  }>();
</script>

<template>
  <div
    role="alert"
    :class="[
      'rounded-(--radius) border px-4 py-3 flex gap-3',
      variant === 'success'
        ? 'bg-green-50 border-green-200 text-green-800'
        : variant === 'error'
          ? 'bg-red-50 border-red-200 text-red-800'
          : variant === 'warning'
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-blue-50 border-blue-200 text-blue-800',
    ]"
  >
    <svg
      aria-hidden="true"
      class="mt-0.5 h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      v-if="variant === 'success'"
    >
      <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <svg
      aria-hidden="true"
      class="mt-0.5 h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      v-else-if="variant === 'error'"
    >
      <path
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg
      aria-hidden="true"
      class="mt-0.5 h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      v-else-if="variant === 'warning'"
    >
      <path
        d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <svg
      aria-hidden="true"
      class="mt-0.5 h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      v-else
    >
      <path
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <div>
      <p class="text-sm font-semibold" v-if="title">{{ title }}</p>
      <div class="text-sm"><slot /></div>
    </div>
  </div>
</template>
