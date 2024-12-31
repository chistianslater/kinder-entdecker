import React from 'react';
import { useState } from 'react';
import { PreferencesTab } from '@/components/dashboard/PreferencesTab';
import { ReviewsTab } from '@/components/dashboard/ReviewsTab';
import { VisitedPlacesTab } from '@/components/dashboard/VisitedPlacesTab';
import { AccountTab } from '@/components/dashboard/AccountTab';
import Header from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState<string>('preferences');

  const menuItems = [
    { value: 'preferences', label: 'Präferenzen' },
    { value: 'reviews', label: 'Bewertungen' },
    { value: 'visited', label: 'Besuchte Orte' },
    { value: 'account', label: 'Account' },
  ];

  const getCurrentTabLabel = () => {
    return menuItems.find(item => item.value === currentTab)?.label || 'Präferenzen';
  };

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
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Mein Dashboard</h1>
        <div className="mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full max-w-xl rounded-full border-gray-200 bg-white py-6 justify-between hover:bg-gray-50"
              >
                <span className="truncate text-lg">{getCurrentTabLabel()}</span>
                <ChevronDown className="h-5 w-5 opacity-50 flex-shrink-0 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-full max-w-xl rounded-2xl mt-2 p-2 border-gray-200 bg-white"
            >
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => setCurrentTab(item.value)}
                  className="truncate rounded-xl py-3 px-4 text-lg hover:bg-gray-50"
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;