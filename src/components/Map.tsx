import React, { useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

// Fix for default marker icons in Leaflet with Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center?: L.LatLngExpression;
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ 
  center = [51.1657, 10.4515] as L.LatLngExpression, // Center of Germany
  zoom = 5.5 
}) => {
  // Ensure Leaflet elements are properly cleaned up
  useEffect(() => {
    return () => {
      // Cleanup function
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 rounded-lg shadow-md overflow-hidden">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          maxBounds={[
            [47, -5] as L.LatLngTuple, // Southwest bounds
            [56, 25] as L.LatLngTuple  // Northeast bounds
          ]}
        >
          <ZoomControl position="topright" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;