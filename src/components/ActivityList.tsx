import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Euro, Users, Tag, Calendar, Building2, User, Check, Globe } from 'lucide-react';
import DetailView from './DetailView';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Activity {
  id: number;
  title: string;
  description: string;
  location: string;
  rating: number;
  price: string;
  type: "Indoor" | "Outdoor";
  ageRange: string;
  image: string;
  facilities: string[];
  openingHours: string;
  maxGroupSize: number;
  seasonality: string[];
  accessibility: boolean;
  website?: string;
  contact: {
    phone?: string;
    email?: string;
  };
  is_business: boolean;
  is_verified: boolean;
  website_url?: string;
  ticket_url?: string;
  claimed_by?: string;
  created_by?: string;
}

const ActivityList = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [userBusinessProfile, setUserBusinessProfile] = useState<any>(null);

  useEffect(() => {
    fetchActivities();
    checkBusinessProfile();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
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

  const checkBusinessProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setUserBusinessProfile(data);
    }
  };

  const handleClaimActivity = async (activityId: number) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ claimed_by: userBusinessProfile.user_id, is_business: true })
        .eq('id', activityId);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Aktivität erfolgreich beansprucht.",
      });

      fetchActivities();
    } catch (error) {
      console.error('Error claiming activity:', error);
      toast({
        title: "Fehler",
        description: "Aktivität konnte nicht beansprucht werden.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4">Lädt Aktivitäten...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {activities.map((activity) => (
        <Card 
          key={activity.id} 
          className="p-6 hover:shadow-soft transition-shadow cursor-pointer"
          onClick={() => setSelectedActivity(activity)}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <img 
              src={activity.image} 
              alt={activity.title}
              className="w-full md:w-48 h-48 object-cover rounded-lg"
            />
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{activity.title}</h3>
                    {activity.is_business && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Building2 className="w-3 h-3 mr-1" />
                        Business
                      </span>
                    )}
                    {activity.is_verified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        Verifiziert
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-5 h-5 fill-current" />
                    {activity.rating}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    {activity.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Euro className="w-4 h-4 text-primary" />
                    {activity.price}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    {activity.openingHours}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    {activity.ageRange}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-primary" />
                    {activity.type}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    {activity.seasonality.join(", ")}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {activity.facilities.map((facility, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
                
                {userBusinessProfile && !activity.claimed_by && !activity.is_business && (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClaimActivity(activity.id);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Als Unternehmen beanspruchen
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}

      <DetailView 
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={() => setSelectedActivity(null)}
      />
    </div>
  );
};

export default ActivityList;