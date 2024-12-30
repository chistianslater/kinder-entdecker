import React from 'react';
import { MapContainer, TileLayer, ZoomControl, MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up default marker icon
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CustomMapProps {
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

const Map: React.FC<CustomMapProps> = ({
  defaultCenter = [51.1657, 10.4515], // Center of Germany
  defaultZoom = 5.5
}) => {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 rounded-lg shadow-md overflow-hidden">
        <MapContainer
          key="map"
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
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