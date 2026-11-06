<script lang="ts" setup>
  import { RouterLink } from "vue-router";
  import { config } from "@/config";
</script>

<template>
  <footer class="border-border mt-10 border-t">
    <div
      class="mx-auto grid max-w-5xl grid-cols-1 items-center gap-4 px-6 py-6 sm:grid-cols-3"
    >
      <div class="flex flex-col gap-1">
        <p class="text-text-muted font-mono text-xs">
          Made by students, for students.
        </p>
        <p class="text-text-faint font-mono text-xs">
          In partnership with
          <a
            class="mpu-link text-text-muted underline underline-offset-2 transition-colors duration-150"
            href="https://mpuniversity.us/ryl"
            rel="noopener"
            target="_blank"
            >More Perfect University</a
          >
        </p>
      </div>
      <div
        class="flex justify-start gap-4 sm:justify-center"
        v-if="
          config.social.instagram ||
          config.social.bluesky ||
          config.social.twitter ||
          config.social.tiktok
        "
      >
        <a
          class="text-text-faint transition-colors duration-150 hover:text-text"
          rel="noopener"
          target="_blank"
          v-if="config.social.instagram"
          :href="config.social.instagram"
        >
          <span class="sr-only">Instagram</span>
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="18"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            />
          </svg>
        </a>
        <a
          class="text-text-faint transition-colors duration-150 hover:text-text"
          rel="noopener"
          target="_blank"
          v-if="config.social.bluesky"
          :href="config.social.bluesky"
        >
          <span class="sr-only">Bluesky</span>
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="18"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"
            />
          </svg>
        </a>
        <a
          class="text-text-faint transition-colors duration-150 hover:text-text"
          rel="noopener"
          target="_blank"
          v-if="config.social.twitter"
          :href="config.social.twitter"
        >
          <span class="sr-only">Twitter / X</span>
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="18"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
        </a>
        <a
          class="text-text-faint transition-colors duration-150 hover:text-text"
          rel="noopener"
          target="_blank"
          v-if="config.social.tiktok"
          :href="config.social.tiktok"
        >
          <span class="sr-only">TikTok</span>
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="18"
            viewBox="0 0 24 24"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.45a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.52V6.76a4.84 4.84 0 01-1.03-.07z"
            />
          </svg>
        </a>
      </div>
      <nav class="flex flex-wrap items-center gap-x-6 gap-y-2 sm:justify-end">
        <RouterLink
          class="text-text font-mono text-xs underline-offset-2 transition-colors duration-150 hover:underline"
          to="/privacy"
          >Privacy Policy</RouterLink
        >
        <RouterLink
          class="text-text font-mono text-xs underline-offset-2 transition-colors duration-150 hover:underline"
          to="/terms"
          >Terms of Service</RouterLink
        >
      </nav>
    </div>
  </footer>
</template>

<style scoped>
  .mpu-link:hover {
    color: var(--brand-primary);
  }
</style>
