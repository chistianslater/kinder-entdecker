import React from 'react';
import { Link } from 'react-router-dom';
import tinytrailsLogo from '/tinytrails.svg';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src={tinytrailsLogo}
        alt="TinyTrails Logo" 
        className="h-12 w-auto"
      />
    </Link>
  );
};

export default Logo;