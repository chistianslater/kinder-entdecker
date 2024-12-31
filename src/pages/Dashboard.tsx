import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreferencesTab } from '@/components/dashboard/PreferencesTab';
import { ReviewsTab } from '@/components/dashboard/ReviewsTab';
import { VisitedPlacesTab } from '@/components/dashboard/VisitedPlacesTab';
import { AccountTab } from '@/components/dashboard/AccountTab';
import Header from '@/components/layout/Header';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-secondary/30">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Mein Dashboard</h1>
        
        <Tabs defaultValue="preferences" className="space-y-4">
          <TabsList className="bg-white">
            <TabsTrigger value="preferences">Präferenzen</TabsTrigger>
            <TabsTrigger value="reviews">Bewertungen</TabsTrigger>
            <TabsTrigger value="visited">Besuchte Orte</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="bg-white p-6 rounded-lg shadow-md">
            <PreferencesTab />
          </TabsContent>

          <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow-md">
            <ReviewsTab />
          </TabsContent>

          <TabsContent value="visited" className="bg-white p-6 rounded-lg shadow-md">
            <VisitedPlacesTab />
          </TabsContent>

          <TabsContent value="account" className="bg-white p-6 rounded-lg shadow-md">
            <AccountTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;