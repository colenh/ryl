<script lang="ts" setup>
  import { useId } from "vue";

  defineProps<{
    modelValue?: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    error?: string;
    hint?: string;
    required?: boolean;
  }>();
  defineEmits<{ "update:modelValue": [string] }>();
  const id = useId();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-text-muted font-mono text-xs" v-if="label" :for="id">
      {{ label }}<span class="ml-0.5 text-red-500" v-if="required">*</span>
    </label>
    <textarea
      :class="[
        'w-full rounded-(--radius) border bg-surface text-sm text-text px-3 py-2 resize-y',
        'placeholder:text-text-faint',
        'transition-colors duration-150',
        error
          ? 'border-red-400 focus:border-red-500'
          : 'border-border-strong focus:border-primary',
        'outline-none focus:ring-2 focus:ring-primary/20',
      ]"
      :id="id"
      :placeholder="placeholder"
      :required="required"
      :rows="rows ?? 4"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
    />
    <p class="font-mono text-xs text-red-600" v-if="error">{{ error }}</p>
    <p class="text-text-faint font-mono text-xs" v-else-if="hint">{{ hint }}</p>
  </div>
</template>
