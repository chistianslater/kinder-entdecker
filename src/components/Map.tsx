import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    let mapInstance: mapboxgl.Map | null = null;

    const initializeMap = () => {
      if (!mapContainer.current) return;

      mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRpYnB5Y2QwMWJqMmtvOW1qZjB0aTd0In0.O8lasM04g-C8wzTz8_IQSQ';

      mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [10.4515, 51.1657], // Center of Germany
        zoom: 5,
      });

      mapInstance.on('load', () => {
        mapInstance?.addControl(new mapboxgl.NavigationControl(), 'top-right');
      });

      setMap(mapInstance);
    };

    initializeMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMap(null);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-soft" />
    </div>
  );
};

export default Map;