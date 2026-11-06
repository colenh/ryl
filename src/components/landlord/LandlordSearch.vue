<script lang="ts" setup>
  defineProps<{ modelValue: string; placeholder?: string }>();
  defineEmits<{ "update:modelValue": [string] }>();
</script>

<template>
  <div class="relative">
    <svg
      aria-hidden="true"
      class="text-text-faint pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" stroke-linecap="round" />
    </svg>
    <input
      class="border-border-strong text-text placeholder:text-text-faint focus:border-primary focus:ring-primary/20 w-full rounded-(--radius) border bg-white py-2.5 pr-4 pl-9 text-sm transition-colors duration-150 outline-none focus:ring-2"
      type="search"
      :placeholder="placeholder ?? 'Search landlords...'"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    >
  </div>
</template>
