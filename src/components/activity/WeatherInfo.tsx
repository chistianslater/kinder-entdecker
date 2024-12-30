import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';

interface WeatherInfoProps {
  location: string;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ location }) => {
  const { data: weather, isLoading } = useQuery({
    queryKey: ['weather', location],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-weather', {
          body: { location },
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (error) {
          console.error('Weather fetch error:', error);
          return null;
        }
        return data;
      } catch (error) {
        console.error('Weather API error:', error);
        return null;
      }
    },
    enabled: !!location,
    retry: 1,
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-gray-500 animate-pulse">
        <Cloud className="w-4 h-4" />
        <span className="text-sm">...</span>
      </div>
    );
  }

  if (!weather || !weather.main?.temp) {
    return null;
  }

  const getWeatherIcon = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) return <CloudRain className="w-4 h-4" />; // Thunderstorm
    if (weatherId >= 300 && weatherId < 400) return <CloudRain className="w-4 h-4" />; // Drizzle
    if (weatherId >= 500 && weatherId < 600) return <CloudRain className="w-4 h-4" />; // Rain
    if (weatherId >= 600 && weatherId < 700) return <Snowflake className="w-4 h-4" />; // Snow
    if (weatherId >= 700 && weatherId < 800) return <Wind className="w-4 h-4" />; // Atmosphere
    if (weatherId === 800) return <Sun className="w-4 h-4" />; // Clear
    return <Cloud className="w-4 h-4" />; // Clouds
  };

  return (
    <div className="flex items-center gap-1 text-[#94A684]">
      {getWeatherIcon(weather.weather[0].id)}
      <span className="text-sm font-medium">{Math.round(weather.main.temp)}°C</span>
    </div>
  );
};

export default WeatherInfo;