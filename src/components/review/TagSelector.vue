<script lang="ts" setup>
  import { config } from "@/config";

  defineProps<{ modelValue: string[] }>();
  defineEmits<{ "update:modelValue": [string[]] }>();

  function toggle(
    tag: string,
    current: string[],
    emit: (tags: string[]) => void
  ) {
    emit(
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );
  }
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <span class="text-text-muted font-mono text-xs"
      >Tags <span class="text-text-faint">(optional)</span></span
    >
    <div class="flex flex-wrap gap-2">
      <label
        v-for="tag in config.reviewTags"
        :key="tag"
        :class="[
          'flex items-center gap-1.5 font-mono text-xs px-2.5 py-1.5 rounded-(--radius) border cursor-pointer transition-colors duration-150 select-none',
          modelValue.includes(tag)
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-white border-border-strong text-text-muted hover:border-primary/30 hover:text-text',
        ]"
      >
        <input
          class="sr-only"
          type="checkbox"
          :checked="modelValue.includes(tag)"
          @change="
            toggle(tag, modelValue, (tags) => $emit('update:modelValue', tags))
          "
        >
        {{ tag }}
      </label>
    </div>
  </div>
</template>
