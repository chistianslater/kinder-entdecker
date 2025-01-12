import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBusinessProfile = () => {
  const { data: businessProfile } = useQuery({
    queryKey: ['businessProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching business profile:', error);
        return null;
      }

      return data;
    },
  });

  return { businessProfile };
};