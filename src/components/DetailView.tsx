import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MapPin, Clock, Euro, Users, Tag, Phone, Mail, Globe, Building2, Ticket, Check } from 'lucide-react';
import { Activity } from '@/types/activity';

interface DetailViewProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailView = ({ activity, isOpen, onClose }: DetailViewProps) => {
  if (!activity) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle className="text-2xl font-bold">{activity.title}</SheetTitle>
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
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <img 
            src={activity.image_url || '/placeholder.svg'} 
            alt={activity.title}
            className="w-full h-64 object-cover rounded-lg"
          />

          <p className="text-muted-foreground">{activity.description}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{activity.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span>{activity.opening_hours}</span>
            </div>

            <div className="flex items-center gap-3">
              <Euro className="w-5 h-5 text-primary" />
              <span>{activity.price_range}</span>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span>Altersempfehlung: {activity.age_range}</span>
            </div>

            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-primary" />
              <span>{activity.type}</span>
            </div>
          </div>

          {(activity.website_url || activity.ticket_url) && (
            <div className="space-y-3">
              <h3 className="font-semibold">Links</h3>
              {activity.website_url && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <a href={activity.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Website besuchen
                  </a>
                </div>
              )}
              {activity.ticket_url && (
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-primary" />
                  <a href={activity.ticket_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Tickets kaufen
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailView;