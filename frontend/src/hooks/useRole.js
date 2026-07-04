// FILE: frontend/src/hooks/useRole.js
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
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
    
    supabase.from('profiles').select('role').eq('id', user.uid).single()
      .then(({ data }) => { 
        setRole(data?.role ?? 'viewer'); 
        setLoading(false); 
      })
      .catch(() => {
        setRole('viewer');
        setLoading(false);
      });
  }, [user]);

  return { role, loading };
};
