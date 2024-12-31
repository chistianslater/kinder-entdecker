import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-soft p-6 rounded-b-3xl">
      <div className="container mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12c3-2 6-3 9-3s6 1 9 3" />
              <path d="M3 6c3-2 6-3 9-3s6 1 9 3" />
              <path d="M3 18c3-2 6-3 9-3s6 1 9 3" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">TinyTrails</h1>
            <p className="text-muted-foreground mt-1">Entdecke Abenteuer für die ganze Familie</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;