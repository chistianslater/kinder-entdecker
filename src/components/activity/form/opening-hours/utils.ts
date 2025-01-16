export const DAYS = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag'
];

export const MAX_SLOTS_PER_DAY = 2;

export interface TimeSlot {
  open: string;
  close: string;
}

export interface DaySchedule {
  day: string;
  slots: TimeSlot[];
}

export const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeString);
    }
  }
  return options;
};

export const parseTimeSlots = (timePart: string): TimeSlot[] => {
  if (timePart.toLowerCase() === 'geschlossen') {
    return [];
  }
  return timePart.split(',').slice(0, MAX_SLOTS_PER_DAY).map(slot => {
    const [open, close] = slot.trim().split('-').map(t => t.trim());
    return { 
      open: open || '09:00', 
      close: close || '17:00' 
    };
  });
};

export const parseOpeningHours = (value: string): DaySchedule[] => {
  if (!value) {
    return DAYS.map(day => ({ day, slots: [] }));
  }

  const scheduleMap = new Map(
    DAYS.map(day => [day, { day, slots: [] as TimeSlot[] }])
  );

  value.split('\n').forEach(line => {
    const [days, times] = line.split(':').map(part => part.trim());
    if (!times) return;

    const timeSlots = parseTimeSlots(times);
    days.split(',').forEach(day => {
      const trimmedDay = day.trim();
      const schedule = scheduleMap.get(trimmedDay);
      if (schedule) {
        schedule.slots = timeSlots;
      }
    });
  });

  return Array.from(scheduleMap.values());
};

export const formatSchedule = (schedule: DaySchedule[]): string => {
  return schedule
    .map(({ day, slots }) => {
      if (slots.length === 0) {
        return `${day}: Geschlossen`;
      }
      const timeRanges = slots
        .map(slot => `${slot.open}-${slot.close}`)
        .join(', ');
      return `${day}: ${timeRanges}`;
    })
    .join('\n');
};