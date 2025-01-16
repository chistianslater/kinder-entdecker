import React from 'react';
import { AccountSection } from './AccountSection';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <AccountSection />
        </div>
      </div>
    </header>
  );
};

export default Header;