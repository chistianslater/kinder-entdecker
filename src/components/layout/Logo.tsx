import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="/logo.svg" 
        alt="TinyTrails Logo" 
        className="h-8 w-auto"
        onError={(e) => {
          // Fallback to text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <span className="text-2xl font-bold text-primary">TinyTrails</span>
    </Link>
  );
};

export default Logo;