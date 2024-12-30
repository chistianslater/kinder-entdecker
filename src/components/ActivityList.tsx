import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Clock, Euro, Users, Tag, Calendar } from 'lucide-react';
import DetailView from './DetailView';

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
}

const activities: Activity[] = [
  {
    id: 1,
    title: "Abenteuer Spielplatz Waldpark",
    description: "Großer Naturspielplatz mit Klettermöglichkeiten, Wasserspielbereich und Sandkästen. Perfekt für aktive Kinder, die gerne die Natur erkunden. Mit Picknickbereich und schattigen Plätzen für die Eltern.",
    location: "Waldstraße 123, 60323 Frankfurt am Main",
    rating: 4.8,
    price: "Kostenlos",
    type: "Outdoor",
    ageRange: "3-12 Jahre",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
    facilities: ["Toiletten", "Parkplätze", "Picknickbereich", "Trinkwasserbrunnen"],
    openingHours: "Täglich von Sonnenaufgang bis Sonnenuntergang",
    maxGroupSize: 30,
    seasonality: ["Frühling", "Sommer", "Herbst"],
    accessibility: true,
    contact: {
      phone: "069-123456",
      email: "waldpark@frankfurt.de"
    }
  },
  {
    id: 2,
    title: "Indoor Spielparadies Regenbogen",
    description: "Klimatisierte Spielhalle mit verschiedenen Bereichen für alle Altersgruppen. Kletterwand, Bällebad, Softplay-Bereich und separate Kleinkinderecke. Café mit gesunden Snacks für die ganze Familie.",
    location: "Spielstraße 42, 80339 München",
    rating: 4.5,
    price: "€€",
    type: "Indoor",
    ageRange: "1-10 Jahre",
    image: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    facilities: ["Café", "Wickelraum", "Kindergeburtstage", "WLAN"],
    openingHours: "Mo-Fr: 10-19 Uhr, Sa-So: 9-20 Uhr",
    maxGroupSize: 50,
    seasonality: ["Ganzjährig"],
    accessibility: true,
    website: "www.spielparadies-regenbogen.de",
    contact: {
      phone: "089-987654",
      email: "info@spielparadies-regenbogen.de"
    }
  },
];

const ActivityList = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

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
                  <h3 className="text-xl font-semibold">{activity.title}</h3>
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