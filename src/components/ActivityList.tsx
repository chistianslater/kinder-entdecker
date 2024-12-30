import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Star, Clock, Euro } from 'lucide-react';

interface Activity {
  id: number;
  title: string;
  description: string;
  location: string;
  rating: number;
  price: string;
  type: string;
  ageRange: string;
  image: string;
}

const activities: Activity[] = [
  {
    id: 1,
    title: "Abenteuer Spielplatz Waldpark",
    description: "Großer Naturspielplatz mit Klettermöglichkeiten und Wasserspielbereich",
    location: "Frankfurt am Main",
    rating: 4.5,
    price: "Kostenlos",
    type: "Outdoor",
    ageRange: "3-12 Jahre",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23"
  },
  {
    id: 2,
    title: "Indoor Spielparadies Regenbogen",
    description: "Klimatisierte Spielhalle mit verschiedenen Bereichen für alle Altersgruppen",
    location: "München",
    rating: 4.2,
    price: "€€",
    type: "Indoor",
    ageRange: "2-10 Jahre",
    image: "https://images.unsplash.com/photo-1501286353178-1ec881214838"
  },
];

const ActivityList = () => {
  return (
    <div className="space-y-4 p-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-4 hover:shadow-soft transition-shadow cursor-pointer">
          <div className="flex gap-4">
            <img 
              src={activity.image} 
              alt={activity.title}
              className="w-32 h-32 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{activity.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {activity.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {activity.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Euro className="w-4 h-4" />
                  {activity.price}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {activity.ageRange}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityList;