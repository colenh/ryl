<script lang="ts" setup>
  import { useId } from "vue";

  defineProps<{
    modelValue?: string;
    label?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
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
    <select
      :class="[
        'w-full rounded-(--radius) border bg-surface text-sm text-text px-3 py-2',
        'transition-colors duration-150',
        error ? 'border-red-400' : 'border-border-strong focus:border-primary',
        'outline-none focus:ring-2 focus:ring-primary/20',
      ]"
      :id="id"
      :required="required"
      :value="modelValue"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
    >
      <option disabled value="" v-if="placeholder" :selected="!modelValue">
        {{ placeholder }}
      </option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p class="font-mono text-xs text-red-600" v-if="error">{{ error }}</p>
  </div>
</template>
