import { createContext, useContext, useEffect, useState } from "react";
import supabase, { supabaseConfigured } from "../supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = async (session) => {
    if (!supabaseConfigured || !supabase || !session?.user) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const authUser = session.user;
    const email = authUser.email || "";
    const name =
      authUser.user_metadata?.full_name || authUser.user_metadata?.name || "";
    const uid = authUser.id;

    setUser({ uid, email, name });

    let existing = null;
    if (uid) {
      const { data: byId } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", uid)
        .maybeSingle();
      existing = byId;
    }

    if (!existing && email) {
      const { data: byEmail } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      existing = byEmail;
    }

    if (existing) {
      if (!existing.auth_id && uid) {
        await supabase
          .from("users")
          .update({ auth_id: uid })
          .eq("id", existing.id);
        existing.auth_id = uid;
      }
      setProfile(existing);
      setLoading(false);
      return;
    }

    const newProfile = {
      auth_id: uid,
      email,
      name,
      phone: authUser.user_metadata?.phone || "",
      role: "user",
      address: {},
      created_at: new Date().toISOString(),
    };
    const { data: inserted } = await supabase
      .from("users")
      .insert(newProfile)
      .select()
      .maybeSingle();
    setProfile(inserted || newProfile);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    const loadSession = async () => {
      if (!supabaseConfigured || !supabase) {
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) await syncProfile(session);
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        await syncProfile(session);
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!supabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data?.session) {
      await syncProfile(data.session);
    }
    return data;
  };

  const register = async ({ name, email, password, phone }) => {
    if (!supabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
        },
      },
    });

    if (error) throw error;

    if (data?.user?.id) {
      await supabase
        .from("users")
        .upsert(
          {
            auth_id: data.user.id,
            email,
            name,
            phone,
            role: "user",
            address: {},
          },
          { onConflict: ["email"] }
        )
        .select()
        .maybeSingle();
    }

    if (data?.session) {
      await syncProfile(data.session);
    }

    return data;
  };

  const logout = async () => {
    if (!supabaseConfigured || !supabase) {
      setUser(null);
      setProfile(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateUserProfile = async (updates) => {
    if (!user || !supabaseConfigured || !supabase) return;
    const authId = user.uid;
    const query = authId
      ? supabase.from("users").update(updates).eq("auth_id", authId)
      : supabase.from("users").update(updates).eq("email", user.email);
    const { data } = await query.select().maybeSingle();
    if (data) setProfile(data);
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUserProfile,
    supabaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
