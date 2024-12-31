import React from 'react';
import { Link } from 'react-router-dom';
import { AccountSection } from './AccountSection';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            TinyTrails
          </Link>
          <AccountSection />
        </div>
      </div>
    </header>
  );
};

export default Header;