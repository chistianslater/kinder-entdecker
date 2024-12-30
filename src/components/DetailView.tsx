import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MapPin, Star, Clock, Euro, Users, Tag, Calendar, Phone, Mail, Globe, Accessibility, Building2, Ticket, Check } from 'lucide-react';
import { Activity } from './ActivityList';
import { Button } from './ui/button';

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
            src={activity.image} 
            alt={activity.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-yellow-500">
              <Star className="w-5 h-5 fill-current" />
              {activity.rating}
            </span>
            <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm">
              {activity.type}
            </span>
          </div>

          <p className="text-muted-foreground">{activity.description}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{activity.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <span>{activity.openingHours}</span>
            </div>

            <div className="flex items-center gap-3">
              <Euro className="w-5 h-5 text-primary" />
              <span>{activity.price}</span>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span>Altersempfehlung: {activity.ageRange}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Saison: {activity.seasonality.join(", ")}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Einrichtungen</h3>
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
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Kontakt & Links</h3>
            {activity.contact.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href={`tel:${activity.contact.phone}`} className="hover:text-primary">
                  {activity.contact.phone}
                </a>
              </div>
            )}
            {activity.contact.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href={`mailto:${activity.contact.email}`} className="hover:text-primary">
                  {activity.contact.email}
                </a>
              </div>
            )}
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

          {activity.accessibility && (
            <div className="flex items-center gap-2 text-green-600">
              <Accessibility className="w-5 h-5" />
              <span>Barrierefrei zugänglich</span>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailView;