
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import HomeIcon from "@/app/icons/HomeIcon";
import LeadIcon from "@/app/icons/LeadIcon";
import { WebcamIcon } from "lucide-react";
import PageHeader from "@/app/components/ReusableComponents/PageHeader";

interface WebinarsProps {
  // Add any props here if needed in the future
}

const Webinars: React.FC<WebinarsProps> = () => {
  const tabItems = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
  ];

  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<HomeIcon className="w-6 h-6" />}
        mainIcon={<WebcamIcon className="w-6 h-6" />}
        rightIcon={<LeadIcon className="w-6 h-6" />}
        heading="The home to all your webinars"
        placeholder="Search webinars..."
      >
        <TabsList className="bg-transparent space-x-3">
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`bg-secondary px-8 py-4 ${
                tab.value === 'all' ? 'opacity-50 data-[state=active]:opacity-100' : ''
              }`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </PageHeader>
      
      {/* Add your tab content here */}
      {/* <TabsContent value="all">All Webinars</TabsContent>
      <TabsContent value="upcoming">Upcoming Webinars</TabsContent>
      <TabsContent value="past">Past Webinars</TabsContent> */}
    </Tabs>
  );
};

export default Webinars;