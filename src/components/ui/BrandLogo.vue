<script lang="ts" setup>
  import { computed } from "vue";
  import { config } from "@/config";
  import FittedSvgText from "./FittedSvgText.vue";

  const props = defineProps<{
    variant: "header" | "homepage";
    lightText?: boolean;
  }>();

  const pennant = "var(--brand-pennant)";
  const stripe = "var(--brand-pennant-fg)";
  const headerFg = "var(--brand-navbar-fg, #ffffff)";
  const homeFg = computed(() =>
    props.lightText ? "#ffffff" : "var(--brand-primary)"
  );
  const pennantFg = "var(--brand-pennant-fg)";
</script>

<template>
  <svg
    focusable="false"
    font-family="'GT America Condensed', 'Helvetica Neue Condensed Bold', 'Arial Narrow', sans-serif"
    font-weight="700"
    height="420"
    role="img"
    viewBox="0 0 1114 420"
    width="1114"
    xmlns="http://www.w3.org/2000/svg"
    v-if="variant === 'header'"
  >
    <path d="M495 39 L1060 150 L495 266 Z" :fill="pennant" />
    <path d="M495 39 L515 43 L515 262 L495 266 Z" :fill="headerFg" />
    <FittedSvgText
      text="RYL"
      :fill="headerFg"
      :font-size="290"
      :max-width="450"
      :x="10"
      :y="254"
    />
    <FittedSvgText
      :fill="headerFg"
      :font-size="112"
      :max-width="1090"
      :text="config.school.name"
      :x="10"
      :y="371"
    />
  </svg>

  <svg
    focusable="false"
    font-family="'GT America Condensed', 'Helvetica Neue Condensed Bold', 'Arial Narrow', sans-serif"
    font-weight="700"
    height="346"
    role="img"
    viewBox="0 0 1502 346"
    width="1502"
    xmlns="http://www.w3.org/2000/svg"
    v-else
  >
    <path d="M765 20 L1500 173 L765 325 Z" :fill="pennant" />
    <path d="M765 20 L792 26 L792 319 L765 325 Z" :fill="stripe" />
    <FittedSvgText
      text="RATE YOUR"
      :fill="homeFg"
      :font-size="166"
      :max-width="735"
      :x="0"
      :y="141"
    />
    <FittedSvgText
      text="LANDLORD"
      :fill="homeFg"
      :font-size="166"
      :max-width="735"
      :x="0"
      :y="323"
    />
    <FittedSvgText
      :fill="pennantFg"
      :font-size="130"
      :max-width="460"
      :text="config.school.shortName"
      :x="812"
      :y="220"
    />
  </svg>
</template>
