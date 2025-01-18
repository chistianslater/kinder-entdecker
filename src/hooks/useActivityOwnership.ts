import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useActivityOwnership = (createdBy: string | null) => {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!createdBy) {
        setIsOwner(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsOwner(createdBy === user.id);
      }
    };
    checkOwnership();
  }, [createdBy]);

  return isOwner;
};