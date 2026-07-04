// FILE: frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { supabase } from '../services/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Upsert profile in Supabase profiles table
        await supabase.from('profiles').upsert({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          display_name: firebaseUser.displayName,
          avatar_url: firebaseUser.photoURL
        }, { onConflict: 'id', ignoreDuplicates: true });
      }
      setUser(firebaseUser);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
