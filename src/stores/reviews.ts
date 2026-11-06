import { defineStore } from "pinia";
import { ref } from "vue";
import { mockReviews } from "@/lib/mockData";
import { isMockMode, supabase } from "@/lib/supabase";
import type { LetterGrade, Review } from "@/types";

function toReview(row: Record<string, unknown>): Review {
  return {
    bathrooms: row.bathrooms as number | undefined,
    bedrooms: row.bedrooms as number | undefined,
    buildingCondition: row.building_condition as LetterGrade,
    comment: row.comment as string,
    createdAt: new Date(row.created_at as string),
    grade: row.grade as LetterGrade,
    id: row.id as string,
    isVerifiedStudent: row.is_verified_student as boolean,
    landlordId: row.landlord_id as string,
    propertyAddress: row.property_address as string | undefined,
    rentAmount: row.rent_amount as number | undefined,
    tags: (row.tags as string[]) ?? [],
    updatedAt: new Date(row.updated_at as string),
    userId: row.user_id as string | null,
    wouldRentAgain: row.would_rent_again as boolean,
  };
}

const FIELD_MAP: Partial<Record<keyof Review, string>> = {
  grade: "grade",
  buildingCondition: "building_condition",
  comment: "comment",
  propertyAddress: "property_address",
  rentAmount: "rent_amount",
  bathrooms: "bathrooms",
  bedrooms: "bedrooms",
  wouldRentAgain: "would_rent_again",
  tags: "tags",
};

function toInsert(data: Omit<Review, "id" | "createdAt" | "updatedAt">) {
  return {
    ...Object.fromEntries(
      (Object.keys(FIELD_MAP) as (keyof Review)[]).map((k) => [
        FIELD_MAP[k],
        (data as Record<string, unknown>)[k],
      ])
    ),
    is_verified_student: data.isVerifiedStudent,
    landlord_id: data.landlordId,
    user_id: data.userId,
  };
}

export const useReviewsStore = defineStore("reviews", () => {
  const reviews = ref<Review[]>([]);
  const loading = ref(false);

  async function fetchByLandlord(landlordId: string) {
    loading.value = true;
    if (isMockMode) {
      reviews.value = mockReviews.filter((r) => r.landlordId === landlordId);
      loading.value = false;
      return;
    }
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("landlord_id", landlordId)
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }
      reviews.value = (data as Record<string, unknown>[]).map(toReview);
    } finally {
      loading.value = false;
    }
  }

  async function fetchById(id: string): Promise<Review | null> {
    if (isMockMode) {
      return mockReviews.find((r) => r.id === id) ?? null;
    }
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) {
      return null;
    }
    return toReview(data as Record<string, unknown>);
  }

  async function fetchAll() {
    loading.value = true;
    if (isMockMode) {
      reviews.value = mockReviews;
      loading.value = false;
      return;
    }
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }
      reviews.value = (data as Record<string, unknown>[]).map(toReview);
    } finally {
      loading.value = false;
    }
  }

  async function fetchCount(): Promise<number> {
    if (isMockMode) {
      return mockReviews.length;
    }
    const { count, error } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true });
    if (error) {
      throw error;
    }
    return count ?? 0;
  }

  async function create(data: Omit<Review, "id" | "createdAt" | "updatedAt">) {
    if (isMockMode) {
      const now = new Date();
      reviews.value = [
        { ...data, id: String(Date.now()), createdAt: now, updatedAt: now },
        ...reviews.value,
      ];
      return;
    }
    const { data: row, error } = await supabase
      .from("reviews")
      .insert(toInsert(data))
      .select()
      .single();
    if (error) {
      throw error;
    }
    reviews.value = [
      toReview(row as Record<string, unknown>),
      ...reviews.value,
    ];
  }

  async function update(id: string, data: Partial<Review>) {
    if (isMockMode) {
      reviews.value = reviews.value.map((r) =>
        r.id === id ? { ...r, ...data, updatedAt: new Date() } : r
      );
      return;
    }
    const patch = Object.fromEntries(
      (Object.keys(FIELD_MAP) as (keyof Review)[])
        .filter((k) => data[k] !== undefined)
        .map((k) => [FIELD_MAP[k], data[k]])
    );
    const { error } = await supabase.from("reviews").update(patch).eq("id", id);
    if (error) {
      throw error;
    }
    reviews.value = reviews.value.map((r) =>
      r.id === id ? { ...r, ...data, updatedAt: new Date() } : r
    );
  }

  async function remove(id: string) {
    if (isMockMode) {
      reviews.value = reviews.value.filter((r) => r.id !== id);
      return;
    }
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      throw error;
    }
    reviews.value = reviews.value.filter((r) => r.id !== id);
  }

  return {
    create,
    fetchAll,
    fetchById,
    fetchByLandlord,
    fetchCount,
    loading,
    remove,
    reviews,
    update,
  };
});
