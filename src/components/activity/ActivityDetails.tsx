import React from 'react';
import { MapPin, Clock, Euro, Users, Tag, Navigation, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Activity } from '@/types/activity';
import { ImageGallery } from './ImageGallery';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatOpeningHours, isCurrentlyOpen } from '@/utils/openingHoursFormatter';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { OpeningHoursInput } from './form/OpeningHoursInput';
import { TypeSelector } from './form/type-selector/TypeSelector';
import { AgeRangeSelector } from './form/age-selector/AgeRangeSelector';
import { LocationAutocomplete } from './form/LocationAutocomplete';
import { useForm } from 'react-hook-form';
import { ActivityFormData, activityFormSchema } from './form/types';
import { zodResolver } from '@hookform/resolvers/zod';

interface ActivityDetailsProps {
  activity: Activity;
  isEditing?: boolean;
  onChange?: (activity: Activity) => void;
}

export const ActivityDetails = ({ activity, isEditing, onChange }: ActivityDetailsProps) => {
  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      id: activity.id,
      title: activity.title,
      description: activity.description || '',
      location: activity.location,
      coordinates: activity.coordinates,
      type: Array.isArray(activity.type) ? activity.type : [],
      age_range: activity.age_range || [],
      price_range: activity.price_range || '',
      opening_hours: activity.opening_hours || '',
      website_url: activity.website_url || '',
      ticket_url: activity.ticket_url || '',
      image_url: activity.image_url || '',
    }
  });

  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(activity.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  const handleChange = (field: keyof ActivityFormData, value: any) => {
    if (onChange) {
      onChange({
        ...activity,
        [field]: value
      });
    }
  };

  const formattedHours = activity.opening_hours ? formatOpeningHours(activity.opening_hours) : null;
  const openStatus = activity.opening_hours ? isCurrentlyOpen(activity.opening_hours) : null;

  return (
    <div className="space-y-8">
        {activity.is_business && (
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1 rounded-2xl bg-black/30 backdrop-blur-md border border-white/40"
          >
            <Building2 className="w-4 h-4" />
            Unternehmensbeitrag
          </Badge>
        )}
      </div>

      <ImageGallery activity={activity} />

      {(activity.description || isEditing) && (
        <>
          {isEditing ? (
            <Textarea
              value={activity.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Beschreibung der Aktivität"
              className="min-h-[100px] text-white placeholder:text-gray-400 bg-accent border-accent"
            />
          ) : (
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-white/90 whitespace-pre-wrap">{activity.description}</p>
            </div>
          )}
          <Separator className="bg-accent/20" />
        </>
      )}

      <h3 className="text-lg font-semibold text-primary">Details</h3>
      <div className="grid gap-6">
        <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-3 flex-grow">
            <MapPin className="w-5 h-5 text-primary shrink-0" />
            {isEditing ? (
              <LocationAutocomplete
                value={activity.location}
                onChange={(location, coordinates) => {
                  handleChange('location', location);
                  if (coordinates) {
                    handleChange('coordinates', coordinates);
                  }
                }}
              />
            ) : (
              <span className="text-white">{activity.location}</span>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNavigate}
            className="shrink-0 text-white border-white/20 hover:bg-white/10"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navigation
          </Button>
        </div>

        <Separator className="bg-accent/20" />

        <div className="flex flex-col gap-4 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-white">Öffnungszeiten</span>
            </div>
            {openStatus !== null && !isEditing && (
              <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                openStatus 
                  ? "bg-[#F2FCE2] text-green-700" 
                  : "bg-[#FFDEE2] text-red-700"
              }`}>
                {openStatus ? "Geöffnet" : "Geschlossen"}
              </div>
            )}
          </div>
          {isEditing ? (
            <OpeningHoursInput
              value={activity.opening_hours || ''}
              onChange={(value) => handleChange('opening_hours', value)}
            />
          ) : formattedHours && (
            <div className="pl-8 space-y-1">
              {formattedHours.map((item, index) => (
                <div 
                  key={index} 
                  className="text-sm text-white/90 flex items-start"
                >
                  <span className="w-24 font-normal">{item.days}</span>
                  <span className="font-normal">{item.hours}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-accent/20" />

        <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
          <Euro className="w-5 h-5 text-primary" />
          {isEditing ? (
            <Input
              value={activity.price_range || ''}
              onChange={(e) => handleChange('price_range', e.target.value)}
              placeholder="Preisbereich"
              className="text-white placeholder:text-gray-400 bg-accent border-accent"
            />
          ) : (
            <span className="text-white">{activity.price_range || 'Nicht angegeben'}</span>
          )}
        </div>

        <Separator className="bg-accent/20" />

        <div className="flex flex-col gap-4 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-white">Altersgruppe</span>
          </div>
          {isEditing ? (
            <AgeRangeSelector
              form={form}
              onChange={(value) => handleChange('age_range', value)}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {activity.age_range?.map((age) => (
                <div
                  key={age}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-[#1E2128] text-white"
                >
                  <Users className="h-4 w-4" />
                  {age === 'all' ? 'Alle Jahre' : `${age} Jahre`}
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-accent/20" />

        <div className="flex flex-col gap-4 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-primary" />
            <span className="text-white">Aktivitätstyp</span>
          </div>
          {isEditing ? (
            <TypeSelector
              form={form}
              onChange={(value) => handleChange('type', value)}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {Array.isArray(activity.type) ? activity.type.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-[#1E2128] text-white"
                >
                  <Tag className="h-4 w-4" />
                  {type}
                </div>
              )) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-[#1E2128] text-white">
                  <Tag className="h-4 w-4" />
                  {activity.type}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
