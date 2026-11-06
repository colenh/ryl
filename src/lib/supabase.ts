import { createClient } from "@supabase/supabase-js";

export const isMockMode = !(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const supabase = createClient(
  (import.meta.env.VITE_SUPABASE_URL as string) ?? "http://localhost",
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ?? "mock"
);
