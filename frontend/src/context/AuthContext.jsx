// FILE: frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Upsert profile in Firestore users collection
          const docRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(docRef, {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            display_name: firebaseUser.displayName || '',
            avatar_url: firebaseUser.photoURL || ''
          }, { merge: true });
        } catch (e) {
          console.warn('Failed to upsert profile to Firestore:', e.message);
        }
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
