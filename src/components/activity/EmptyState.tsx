import React from 'react';

const EmptyState = () => {
  return (
    <div className="p-8 text-center">
      <p className="text-lg text-muted-foreground">
        Keine Aktivitäten gefunden. Versuche andere Filter-Einstellungen.
      </p>
    </div>
  );
};

export default EmptyState;