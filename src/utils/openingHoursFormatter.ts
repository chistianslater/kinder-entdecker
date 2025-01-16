export const formatOpeningHours = (openingHours: string) => {
  if (!openingHours || openingHours.trim() === '') return null;

  // Split by spaces and filter out empty strings
  const parts = openingHours.split(/\s+/).filter(part => part);
  const formattedSchedule = [];
  
  for (let i = 0; i < parts.length; i++) {
    const day = parts[i].replace(':', ''); // Remove any existing colons from day names
    const hours = parts[i + 1];
    
    if (hours) {
      // Add "Uhr" after the time if it's not "Geschlossen"
      const formattedHours = hours === 'Geschlossen' ? hours : hours + ' Uhr';
      formattedSchedule.push({
        days: day + ':', // Add colon after the day
        hours: formattedHours
      });
      i++; // Skip the next part since we used it as hours
    }
  }

  return formattedSchedule;
};

export const isCurrentlyOpen = (openingHours: string | null) => {
  if (!openingHours) return null;

  const now = new Date();
  const currentDay = now.toLocaleDateString('de-DE', { weekday: 'long' });
  const currentTime = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  const parts = openingHours.split(/\s+/).filter(part => part);
  
  for (let i = 0; i < parts.length; i += 2) {
    const day = parts[i].replace(':', '');
    const hours = parts[i + 1];
    
    if (day.toLowerCase() === currentDay.toLowerCase()) {
      if (hours === 'Geschlossen') return false;
      
      const [start, end] = hours.split('-');
      return currentTime >= start && currentTime <= end;
    }
  }

  return false;
};