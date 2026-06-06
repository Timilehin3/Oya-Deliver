import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import supabase, { supabaseConfigured } from '../supabase/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Prefer Clerk for frontend auth; fall back to unauthenticated state
  let clerk = null;
  try {
    clerk = useUser();
  } catch (e) {
    clerk = null;
  }

  useEffect(() => {
    let mounted = true;
    const syncProfile = async () => {
      setLoading(true);
      if (clerk && clerk.isLoaded) {
        if (!clerk.isSignedIn) {
          if (mounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
          return;
        }

        const clerkUser = clerk.user;
        const email = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.email || clerkUser?.emailAddresses?.[0]?.emailAddress;
        const clerkId = clerkUser?.id;

        setUser({ uid: clerkId, email, name: clerkUser?.fullName });

        if (!supabaseConfigured || !supabase) {
          if (mounted) setLoading(false);
          return;
        }

        // Try to fetch existing profile by clerk id or email, create if missing
        const { data: byId } = await supabase.from('users').select('*').eq('clerk_id', clerkId).single();
        if (byId) {
          if (mounted) setProfile(byId);
          if (mounted) setLoading(false);
          return;
        }

        const { data: byEmail } = await supabase.from('users').select('*').eq('email', email).single();
        if (byEmail) {
          // update clerk_id if missing
          if (!byEmail.clerk_id) {
            await supabase.from('users').update({ clerk_id: clerkId }).eq('id', byEmail.id);
            byEmail.clerk_id = clerkId;
          }
          if (mounted) setProfile(byEmail);
          if (mounted) setLoading(false);
          return;
        }

        // Create new profile
        const newProfile = {
          clerk_id: clerkId,
          name: clerkUser?.fullName || '',
          email: email || '',
          phone: clerkUser?.phoneNumber || '',
          role: 'user',
          address: {},
          created_at: new Date().toISOString(),
        };
        const { data: inserted } = await supabase.from('users').insert(newProfile).select().single();
        if (mounted) setProfile(inserted || newProfile);
        if (mounted) setLoading(false);
        return;
      }

      // No Clerk available — clear state
      if (mounted) {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    };

    syncProfile();
    return () => {
      mounted = false;
    };
  }, [clerk]);

  const login = () => {
    return Promise.reject(new Error('Use Clerk sign-in UI for frontend authentication'));
  };

  const register = () => {
    return Promise.reject(new Error('Use Clerk sign-up UI for frontend authentication'));
  };

  const logout = async () => {
    // Clerk handles frontend session; sign-out is managed by Clerk UI (UserButton)
    setUser(null);
    setProfile(null);
    return Promise.resolve();
  };

  const updateUserProfile = async (updates) => {
    if (!user || !supabaseConfigured || !supabase) return;
    // Update by clerk_id if present, otherwise by email
    const clerkId = user.uid;
    const identifier = clerkId ? { clerk_id: clerkId } : { email: user.email };
    const query = clerkId ? supabase.from('users').update(updates).eq('clerk_id', clerkId) : supabase.from('users').update(updates).eq('email', user.email);
    const { data } = await query.select().single();
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
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
