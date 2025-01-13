import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Activity } from '@/types/activity';
import { ActivityDetails } from './activity/ActivityDetails';
import { UserContributions } from './activity/UserContributions';

interface DetailViewProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailView = ({ activity, isOpen, onClose }: DetailViewProps) => {
  if (!activity) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] overflow-y-auto bg-background">
        <SheetHeader className="relative pb-4">
          <SheetTitle className="text-xl font-semibold text-white">
            {activity.title}
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-8 py-4">
          <ActivityDetails activity={activity} />
          <div className="border-t border-white/10 pt-6">
            <UserContributions activity={activity} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailView;