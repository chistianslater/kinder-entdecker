import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useBusinessProfile = () => {
  const [userBusinessProfile, setUserBusinessProfile] = useState<any>(null);

  useEffect(() => {
    checkBusinessProfile();
  }, []);

  const checkBusinessProfile = async () => {
    try {
      console.log('Checking business profile...');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('User found:', user.id);
        const { data, error } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching business profile:', error);
          throw error;
        }

        console.log('Business profile:', data);
        setUserBusinessProfile(data);
      }
    } catch (error) {
      console.error('Error checking business profile:', error);
    }
  };

  return { userBusinessProfile };
};