<script lang="ts" setup>
  import { onMounted, ref, watch } from "vue";

  const props = defineProps<{
    text: string;
    x: number;
    y: number;
    fontSize: number;
    maxWidth: number;
    fill: string;
  }>();

  const measureEl = ref<SVGTextElement>();
  const textLength = ref<number | undefined>();

  function measure() {
    if (!measureEl.value) {
      return;
    }
    const w = measureEl.value.getComputedTextLength();
    textLength.value = w > props.maxWidth ? props.maxWidth : undefined;
  }

  onMounted(() => {
    measure();
    document.fonts.ready.then(measure);
  });

  watch(() => [props.text, props.maxWidth], measure);
</script>

<template>
  <g aria-hidden="true">
    <text
      visibility="hidden"
      ref="measureEl"
      :fill="fill"
      :font-size="fontSize"
      :x="x"
      :y="y"
    >
      {{ text }}
    </text>
    <text
      :fill="fill"
      :font-size="fontSize"
      :lengthAdjust="textLength ? 'spacingAndGlyphs' : undefined"
      :textLength="textLength"
      :x="x"
      :y="y"
    >
      {{ text }}
    </text>
  </g>
</template>
