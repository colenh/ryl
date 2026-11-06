<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from "vue";

  const SHOW_AFTER = 400;
  const GAP = 24;

  const visible = ref(false);
  const bottom = ref(GAP);
  let ticking = false;

  function update() {
    ticking = false;
    visible.value = window.scrollY > SHOW_AFTER;
    const footer = document.querySelector("footer");
    const lift = footer
      ? Math.max(0, window.innerHeight - footer.getBoundingClientRect().top)
      : 0;
    bottom.value = GAP + lift;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function scrollToTop() {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ behavior: reduce ? "auto" : "smooth", top: 0 });
  }

  onMounted(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", update);
  });
</script>

<template>
  <button
    aria-label="Back to top"
    class="fixed right-6 z-30 flex size-10 items-center justify-center rounded-(--radius) bg-primary text-primary-fg hover:bg-primary-hover transition-[opacity,translate] duration-200 ease-out-expo motion-reduce:transition-none"
    type="button"
    :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'"
    :inert="!visible"
    :style="{ bottom: `${bottom}px` }"
    @click="scrollToTop"
  >
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  </button>
</template>
