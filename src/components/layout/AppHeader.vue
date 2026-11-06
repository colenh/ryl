<script lang="ts" setup>
  import { computed, ref } from "vue";
  import { RouterLink, useRoute, useRouter } from "vue-router";
  import BrandLogo from "@/components/ui/BrandLogo.vue";
  import { useAuthStore } from "@/stores/auth";

  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();

  async function signOut() {
    await auth.logout();
    router.push("/");
  }
  const menuOpen = ref(false);
  const profileOpen = ref(false);
  const profileRef = ref<HTMLElement | null>(null);

  const initials = computed(() => auth.user?.email?.[0]?.toUpperCase() ?? "?");

  function onProfileBlur(e: FocusEvent) {
    if (!profileRef.value?.contains(e.relatedTarget as Node)) {
      profileOpen.value = false;
    }
  }

  const isActive = (path: string) =>
    route.path === path || route.path.startsWith(`${path}/`);

  const navLinks = computed(() => [
    { label: "Resources", to: "/resources" },
    { label: "About", to: "/about" },
    { label: "Contact Us", to: "/contact" },
  ]);

  const fg = "var(--brand-navbar-fg, #ffffff)";
  const fgMuted =
    "color-mix(in srgb, var(--brand-navbar-fg, #ffffff) 70%, transparent)";
  const fgHover =
    "color-mix(in srgb, var(--brand-navbar-fg, #ffffff) 15%, transparent)";
</script>

<template>
  <header class="sticky top-0 z-50" style="background: var(--brand-navbar)">
    <div
      class="mx-auto grid h-14 max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-6"
    >
      <RouterLink aria-label="Home" class="shrink-0" to="/">
        <BrandLogo class="h-9 w-auto" variant="header" />
      </RouterLink>

      <nav class="hidden items-center justify-center gap-1 sm:flex">
        <RouterLink
          class="rounded-(--radius) px-3 py-1.5 font-sans text-sm transition-colors duration-150 hover:bg-white/10"
          v-for="link in navLinks"
          :key="link.to"
          :style="{
            color: isActive(link.to) ? fg : fgMuted,
            fontWeight: isActive(link.to) ? '600' : '400',
            background: isActive(link.to) ? fgHover : '',
          }"
          :to="link.to"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="hidden shrink-0 items-center justify-end gap-2 sm:flex">
        <template v-if="auth.isLoggedIn">
          <!-- biome-ignore lint/a11y/noNoninteractiveElementInteractions: focus-trap container for profile dropdown -->
          <!-- biome-ignore lint/a11y/useSemanticElements: no semantic equivalent for this focus container pattern -->
          <div
            class="relative"
            role="group"
            tabindex="-1"
            ref="profileRef"
            @blur.capture="onProfileBlur"
          >
            <button
              class="flex items-center gap-1.5 rounded-full p-1 transition-colors duration-150"
              type="button"
              :class="profileOpen ? 'bg-white/20' : 'hover:bg-white/10'"
              @click="profileOpen = !profileOpen"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                style="background: var(--brand-secondary); color: var(--brand-secondary-fg)"
              >
                {{ initials }}
              </span>
            </button>

            <Transition
              enter-active-class="transition-all duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-1"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition-all duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-1"
            >
              <div
                class="border-border absolute top-full right-0 z-50 mt-2 w-52 origin-top-right rounded-(--radius) border bg-white shadow-xl"
                v-if="profileOpen"
              >
                <p
                  class="text-text-faint border-border truncate border-b px-4 pt-3 pb-2 font-mono text-xs"
                >
                  {{ auth.user?.email }}
                </p>
                <div class="py-1">
                  <RouterLink
                    class="text-text hover:bg-surface flex items-center px-4 py-2 text-sm transition-colors duration-100"
                    to="/admin"
                    v-if="auth.isAdmin"
                    @click="profileOpen = false"
                    >Admin panel</RouterLink
                  >
                  <RouterLink
                    class="text-text hover:bg-surface flex items-center px-4 py-2 text-sm transition-colors duration-100"
                    to="/settings"
                    @click="profileOpen = false"
                    >Settings</RouterLink
                  >
                  <div class="border-border mx-3 my-1 border-t" />
                  <button
                    class="w-full px-4 py-2 text-left text-sm text-red-500 transition-colors duration-100 hover:bg-red-50"
                    type="button"
                    @click="
                      signOut();
                      profileOpen = false;
                    "
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </template>
        <template v-else>
          <RouterLink
            class="rounded-(--radius) px-3 py-1.5 font-sans text-sm transition-colors duration-150 hover:bg-white/10"
            to="/login"
            :style="{ color: fg }"
          >
            Log in
          </RouterLink>
          <RouterLink
            class="rounded-(--radius) px-3 py-1.5 font-sans text-sm transition-colors duration-150 hover:opacity-90"
            style="background: var(--brand-signup-bg); color: var(--brand-signup-fg)"
            to="/register"
          >
            Sign up
          </RouterLink>
        </template>
      </div>

      <button
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
        class="-mr-2 col-start-3 justify-self-end p-2 transition-colors duration-150 sm:hidden"
        type="button"
        :aria-expanded="menuOpen"
        :style="{ color: fg }"
        @click="menuOpen = !menuOpen"
      >
        <svg
          aria-hidden="true"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          v-if="!menuOpen"
        >
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg
          aria-hidden="true"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          v-else
        >
          <path
            d="M6 18L18 6M6 6l12 12"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        class="fixed inset-0 top-14 z-40 flex flex-col overflow-y-auto sm:hidden"
        id="mobile-menu"
        v-if="menuOpen"
        :style="{ background: 'var(--brand-navbar)' }"
      >
        <nav class="flex flex-col px-6 pt-6 pb-4">
          <RouterLink
            class="font-display border-b py-3 text-2xl font-medium transition-opacity duration-100 hover:opacity-70"
            v-for="link in navLinks"
            :key="link.to"
            :style="{ color: fg, borderColor: fgHover }"
            :to="link.to"
            @click="menuOpen = false"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="mt-auto flex flex-col gap-1 px-6 pt-4 pb-8">
          <template v-if="!auth.isLoggedIn">
            <RouterLink
              class="rounded-(--radius) px-4 py-3 text-center font-sans text-sm font-semibold transition-opacity duration-100 hover:opacity-90"
              style="background: var(--brand-signup-bg); color: var(--brand-signup-fg)"
              to="/register"
              @click="menuOpen = false"
            >
              Sign up
            </RouterLink>
            <RouterLink
              class="py-2.5 text-center font-sans text-sm transition-opacity duration-100 hover:opacity-70"
              to="/login"
              :style="{ color: fgMuted }"
              @click="menuOpen = false"
            >
              Log in
            </RouterLink>
          </template>
          <template v-else>
            <div
              class="mb-2 flex items-center gap-3 pb-4"
              :style="{ borderBottom: `1px solid ${fgHover}` }"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style="background: var(--brand-navbar-fg); color: var(--brand-navbar)"
              >
                {{ initials }}
              </span>
              <p class="truncate font-mono text-xs" :style="{ color: fgMuted }">
                {{ auth.user?.email }}
              </p>
            </div>
            <RouterLink
              class="flex items-center justify-between py-3 font-sans text-sm transition-opacity duration-100 hover:opacity-70"
              to="/admin"
              v-if="auth.isAdmin"
              :style="{ color: fg }"
              @click="menuOpen = false"
            >
              Admin panel
              <svg
                aria-hidden="true"
                class="h-4 w-4 opacity-40"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </RouterLink>
            <RouterLink
              class="flex items-center justify-between py-3 font-sans text-sm transition-opacity duration-100 hover:opacity-70"
              to="/settings"
              :style="{ color: fg }"
              @click="menuOpen = false"
            >
              Settings
              <svg
                aria-hidden="true"
                class="h-4 w-4 opacity-40"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </RouterLink>
            <button
              class="mt-1 w-full py-3 text-left font-sans text-sm font-medium transition-opacity duration-100 hover:opacity-80"
              style="color: var(--brand-secondary)"
              type="button"
              @click="
                signOut();
                menuOpen = false;
              "
            >
              Sign out
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>
