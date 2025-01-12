import React from 'react';
import { useState } from 'react';
import { PreferencesTab } from '@/components/dashboard/PreferencesTab';
import { ReviewsTab } from '@/components/dashboard/ReviewsTab';
import { VisitedPlacesTab } from '@/components/dashboard/VisitedPlacesTab';
import { AccountTab } from '@/components/dashboard/AccountTab';
import Header from '@/components/layout/Header';
import { cn } from "@/lib/utils";
import { Home, Settings, Star, MapPin, User } from "lucide-react";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState<string>('preferences');

  const menuItems = [
    { value: 'preferences', label: 'Präferenzen', icon: Settings },
    { value: 'reviews', label: 'Bewertungen', icon: Star },
    { value: 'visited', label: 'Besuchte Orte', icon: MapPin },
    { value: 'account', label: 'Account', icon: User },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'preferences':
        return <PreferencesTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'visited':
        return <VisitedPlacesTab />;
      case 'account':
        return <AccountTab />;
      default:
        return <PreferencesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#eee]">Mein Dashboard</h1>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Zur Startseite</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation Sidebar */}
          <nav className="md:w-64 bg-accent rounded-lg p-4 shadow-md h-fit border border-white/5">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.value}>
                    <button
                      onClick={() => setCurrentTab(item.value)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-[#eee]",
                        currentTab === item.value
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-secondary"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )}
              )}
            </ul>
          </nav>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-accent p-6 rounded-lg shadow-md border border-white/5">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;