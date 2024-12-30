import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Activity } from '@/types/activity';
import { useToast } from "@/components/ui/use-toast";
import { Filters } from '@/components/FilterBar';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Standort nicht verfügbar",
            description: "Bitte aktivieren Sie die Standortfreigabe für die Entfernungsfilterung.",
            variant: "destructive",
          });
        }
      );
    }
  }, []);

  const fetchActivities = async () => {
    try {
      console.log('Fetching activities...');
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
      
      console.log('Activities fetched:', data);
      setActivities(data || []);
      setFilteredActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Fehler",
        description: "Aktivitäten konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: Filters) => {
    let filtered = [...activities];

    if (filters.type && filters.type !== 'both') {
      filtered = filtered.filter(activity => activity.type === filters.type);
    }

    if (filters.ageRange && filters.ageRange !== 'all') {
      filtered = filtered.filter(activity => activity.age_range?.includes(filters.ageRange || ''));
    }

    if (filters.priceRange) {
      filtered = filtered.filter(activity => {
        switch (filters.priceRange) {
          case 'free':
            return activity.price_range?.toLowerCase().includes('kostenlos');
          case 'low':
            return activity.price_range?.toLowerCase().includes('günstig');
          case 'medium':
            return activity.price_range?.toLowerCase().includes('mittel');
          case 'high':
            return activity.price_range?.toLowerCase().includes('teuer');
          default:
            return true;
        }
      });
    }

    if (filters.category) {
      filtered = filtered.filter(activity => 
        activity.type.toLowerCase().includes(filters.category?.toLowerCase() || '')
      );
    }

    // Apply distance filter if user location is available
    if (filters.distance && filters.distance !== 'all' && userLocation) {
      const maxDistance = parseInt(filters.distance);
      filtered = filtered.filter(activity => {
        if (!activity.coordinates) return false;
        
        // Parse coordinates from the point type
        const coords = activity.coordinates as unknown as { x: number; y: number };
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          coords.y, // latitude
          coords.x  // longitude
        );
        
        return distance <= maxDistance;
      });
    }

    setFilteredActivities(filtered);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    filteredActivities,
    loading,
    handleFiltersChange,
    fetchActivities
  };
};