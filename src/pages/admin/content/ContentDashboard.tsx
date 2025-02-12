import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import FAQOverview from './FAQOverview';
import NewsOverview from './NewsOverview';

const ContentDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Content-Verwaltung</h1>
      
      <Tabs defaultValue="faqs">
        <TabsList>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faqs">
          <FAQOverview />
        </TabsContent>
        
        <TabsContent value="news">
          <NewsOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentDashboard;