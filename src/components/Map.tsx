import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite
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
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

const Map: React.FC<MapProps> = ({
  defaultCenter = [51.1657, 10.4515], // Center of Germany
  defaultZoom = 5.5
}) => {
  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 rounded-lg shadow-md overflow-hidden">
        <MapContainer
          center={defaultCenter as L.LatLngExpression}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          scrollWheelZoom={true}
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