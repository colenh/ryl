import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { config } from "@/config";
import { isMockMode, supabase } from "@/lib/supabase";
import type { User } from "@/types";

function toUser(sbUser: {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  created_at: string;
}): User {
  const email = sbUser.email ?? "";
  return {
    createdAt: new Date(sbUser.created_at),
    email,
    emailVerified: !!sbUser.email_confirmed_at,
    id: sbUser.id,
    isVerifiedStudent: config.school.studentEmailDomains.some((d) =>
      email.endsWith(`@${d}`)
    ),
  };
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const isAdmin = ref(false);

  const isLoggedIn = computed(() => user.value !== null);

  let resolveReady: (() => void) | undefined;
  const readyPromise = new Promise<void>((r) => {
    resolveReady = r;
  });
  function waitUntilReady() {
    return readyPromise;
  }

  async function checkAdmin(userId: string) {
    const { data, error } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!error) {
      isAdmin.value = !!data;
    }
  }

  async function init() {
    if (isMockMode) {
      resolveReady?.();
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      user.value = toUser(session.user);
      await checkAdmin(session.user.id);
    }
    resolveReady?.();

    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession?.user) {
        user.value = toUser(newSession.user);
        await checkAdmin(newSession.user.id);
      } else {
        user.value = null;
        isAdmin.value = false;
      }
    });
  }

  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string) {
    loading.value = true;
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${config.legal.siteUrl}/verify-email` },
      });
      if (error) {
        throw error;
      }
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function sendPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${config.legal.siteUrl}/new-password`,
    });
    if (error) {
      throw error;
    }
  }

  async function updateEmail(email: string) {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) {
      throw error;
    }
    if (user.value) {
      user.value = { ...user.value, email, emailVerified: false };
    }
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      throw error;
    }
  }

  async function deleteAccount() {
    const { error } = await supabase.rpc("delete_user");
    if (error) {
      throw error;
    }
    await supabase.auth.signOut({ scope: "local" });
  }

  return {
    deleteAccount,
    init,
    isAdmin,
    isLoggedIn,
    loading,
    login,
    logout,
    register,
    sendPasswordReset,
    updateEmail,
    updatePassword,
    user,
    waitUntilReady,
  };
});
