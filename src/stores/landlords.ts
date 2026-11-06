import { defineStore } from "pinia";
import { ref } from "vue";
import { mockLandlords } from "@/lib/mockData";
import { isMockMode, supabase } from "@/lib/supabase";
import type { Landlord, LetterGrade } from "@/types";

const GRADES = new Set(["A", "B", "C", "D", "F"]);

function grade(v: unknown): LetterGrade | undefined {
  return GRADES.has(v as string) ? (v as LetterGrade) : undefined;
}

function toLandlord(row: Record<string, unknown>): Landlord {
  return {
    addresses: (row.addresses as string[]) ?? [],
    createdAt: new Date(row.created_at as string),
    gradeAggregate: grade(row.grade_aggregate),
    buildingGrade: grade(row.building_grade),
    id: row.id as string,
    name: row.name as string,
    reviewCount: (row.review_count as number) ?? 0,
    note: row.note ? (row.note as string) : undefined,
    wouldRentAgainPct:
      row.would_rent_again_pct === null
        ? undefined
        : (row.would_rent_again_pct as number),
  };
}

export const useLandlordsStore = defineStore("landlords", () => {
  const landlords = ref<Landlord[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    if (isMockMode) {
      landlords.value = mockLandlords;
      loading.value = false;
      return;
    }
    try {
      const { data, error } = await supabase
        .from("landlords_with_stats")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }
      landlords.value = (data as Record<string, unknown>[]).map(toLandlord);
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: string): Promise<Landlord | null> {
    if (isMockMode) {
      if (!landlords.value.length) {
        await fetchAll();
      }
      return landlords.value.find((l) => l.id === id) ?? null;
    }
    const { data, error } = await supabase
      .from("landlords_with_stats")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) {
      return null;
    }
    return toLandlord(data as Record<string, unknown>);
  }

  async function create(data: {
    name: string;
    addresses?: string[];
  }): Promise<Landlord> {
    const landlord: Landlord = {
      addresses: data.addresses ?? [],
      createdAt: new Date(),
      id: String(Date.now()),
      name: data.name,
      reviewCount: 0,
    };
    if (isMockMode) {
      landlords.value = [landlord, ...landlords.value];
      return landlord;
    }
    const { data: row, error } = await supabase
      .from("landlords")
      .insert({ name: data.name, addresses: data.addresses ?? [] })
      .select()
      .single();
    if (error) {
      throw error;
    }
    if (!row) {
      throw new Error("Failed to create landlord");
    }
    const created = toLandlord({
      ...(row as Record<string, unknown>),
      review_count: 0,
    });
    landlords.value = [created, ...landlords.value];
    return created;
  }

  async function update(
    id: string,
    data: Partial<Pick<Landlord, "name" | "addresses" | "note">>
  ) {
    if (isMockMode) {
      landlords.value = landlords.value.map((l) =>
        l.id === id ? { ...l, ...data } : l
      );
      return;
    }
    const patch: Record<string, unknown> = {};
    if (data.name !== undefined) {
      patch.name = data.name;
    }
    if (data.addresses !== undefined) {
      patch.addresses = data.addresses;
    }
    if (data.note !== undefined) {
      patch.note = data.note || null;
    }
    const { error } = await supabase
      .from("landlords")
      .update(patch)
      .eq("id", id);
    if (error) {
      throw error;
    }
    landlords.value = landlords.value.map((l) =>
      l.id === id ? { ...l, ...data } : l
    );
  }

  async function remove(id: string) {
    if (isMockMode) {
      landlords.value = landlords.value.filter((l) => l.id !== id);
      return;
    }
    const { error } = await supabase.from("landlords").delete().eq("id", id);
    if (error) {
      throw error;
    }
    landlords.value = landlords.value.filter((l) => l.id !== id);
  }

  return { create, fetchAll, fetchById, landlords, loading, remove, update };
});
