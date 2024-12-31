import React from 'react';
import { Link } from 'react-router-dom';
import AccountSection from './AccountSection';
import ViewToggle from './ViewToggle';

const Header = () => {
  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
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