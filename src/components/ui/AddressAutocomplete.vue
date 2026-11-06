<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
  import { config } from "@/config";

  const COUNTRY_SUFFIX_RE = /, United States$/u;

  const STATE_ABBR: Record<string, string> = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
    "District of Columbia": "DC",
  };
  const STATE_NAME_RE = new RegExp(
    `\\b(${Object.keys(STATE_ABBR)
      .sort((a, b) => b.length - a.length)
      .join("|")})\\b`,
    "gu"
  );

  function abbreviateStates(s: string): string {
    return s.replace(STATE_NAME_RE, (m) => STATE_ABBR[m] ?? m);
  }

  const props = defineProps<{
    modelValue?: string;
    label?: string;
    placeholder?: string;
    error?: string;
    hint?: string;
    required?: boolean;
  }>();
  const emit = defineEmits<{ "update:modelValue": [string] }>();

  const id = useId();
  const query = ref(props.modelValue ?? "");
  const suggestions = ref<string[]>([]);
  const open = ref(false);
  const loading = ref(false);
  const activeIdx = ref(-1);
  let debounce: ReturnType<typeof setTimeout> | null = null;
  let token = "";
  let proximity = "";

  onMounted(() => {
    if (
      !(
        config.features.addressAutocomplete && import.meta.env.VITE_MAPBOX_TOKEN
      )
    ) {
      return;
    }
    token = import.meta.env.VITE_MAPBOX_TOKEN;
    const { longitude, latitude } = config.school.coordinates;
    proximity = `${longitude},${latitude}`;
  });

  watch(
    () => props.modelValue,
    (v) => {
      if (v !== query.value) {
        query.value = v ?? "";
      }
    }
  );

  async function onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    query.value = val;
    emit("update:modelValue", val);
    activeIdx.value = -1;

    if (debounce) {
      clearTimeout(debounce);
    }
    if (!token || val.length < 3) {
      suggestions.value = [];
      open.value = false;
      return;
    }

    debounce = setTimeout(async () => {
      loading.value = true;
      try {
        const bbox = config.school.searchBounds.join(",");
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(val)}.json?access_token=${token}&proximity=${proximity}&types=address&country=US&limit=6&bbox=${bbox}`;
        const res = await fetch(url);
        const data = (await res.json()) as {
          features: { place_name: string }[];
        };
        suggestions.value =
          data.features
            ?.map((f) =>
              abbreviateStates(f.place_name.replace(COUNTRY_SUFFIX_RE, ""))
            )
            .filter(Boolean) ?? [];
        open.value = suggestions.value.length > 0;
      } catch {
        suggestions.value = [];
        open.value = false;
      } finally {
        loading.value = false;
      }
    }, 280);
  }

  function select(addr: string) {
    query.value = addr;
    emit("update:modelValue", addr);
    suggestions.value = [];
    open.value = false;
    activeIdx.value = -1;
  }

  function onKeydown(e: KeyboardEvent) {
    if (!open.value) {
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIdx.value = Math.min(
        activeIdx.value + 1,
        suggestions.value.length - 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIdx.value = Math.max(activeIdx.value - 1, 0);
    } else if (e.key === "Enter" && activeIdx.value >= 0) {
      e.preventDefault();
      select(suggestions.value[activeIdx.value]);
    } else if (e.key === "Escape") {
      open.value = false;
      activeIdx.value = -1;
    }
  }

  onBeforeUnmount(() => {
    if (debounce) {
      clearTimeout(debounce);
    }
  });
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-text-muted font-mono text-xs" v-if="label" :for="id">
      {{ label }}<span class="ml-0.5 text-red-500" v-if="required">*</span>
    </label>
    <div class="relative">
      <input
        autocomplete="off"
        type="text"
        :class="[
          'block w-full rounded-(--radius) border bg-surface text-sm text-text px-3 py-2',
          'placeholder:text-text-faint transition-colors duration-150',
          'outline-none focus:ring-2 focus:ring-primary/20',
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-border-strong focus:border-primary',
          loading ? 'pr-8' : '',
        ]"
        :id="id"
        :placeholder="placeholder"
        :required="required"
        :value="query"
        @blur="open = false"
        @input="onInput"
        @keydown="onKeydown"
      >
      <div
        class="pointer-events-none absolute inset-y-0 right-2.5 flex items-center"
        v-if="loading"
      >
        <svg
          aria-hidden="true"
          class="text-text-faint h-3.5 w-3.5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div
        class="border-border absolute z-50 mt-1 w-full overflow-hidden rounded-(--radius) border bg-white shadow-lg"
        v-if="open && suggestions.length"
      >
        <button
          class="w-full cursor-pointer px-3 py-2.5 text-left text-sm transition-colors duration-75"
          type="button"
          v-for="(s, i) in suggestions"
          :key="s"
          :class="
            activeIdx === i
              ? 'bg-surface text-text'
              : 'text-text-muted hover:bg-surface hover:text-text'
          "
          @click="select(s)"
          @mousedown.prevent
        >
          {{ s }}
        </button>
      </div>
    </div>
    <p class="font-mono text-xs text-red-600" v-if="error">{{ error }}</p>
    <p class="text-text-faint font-mono text-xs" v-else-if="hint">{{ hint }}</p>
  </div>
</template>
