// FILE: frontend/src/hooks/useRole.js
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { 
      setRole(null); 
      setLoading(false); 
      return; 
    }
    
    const docRef = doc(db, 'profiles', user.uid);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setRole(docSnap.data().role ?? 'viewer');
        } else {
          setRole('viewer');
        }
        setLoading(false);
      })
      .catch(() => {
        setRole('viewer');
        setLoading(false);
      });
  }, [user]);

  return { role, loading };
};
