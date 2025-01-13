import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Activity } from '@/types/activity';
import { ActivityDetails } from './activity/ActivityDetails';
import { UserContributions } from './activity/UserContributions';
import { X } from 'lucide-react';

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
          <SheetClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4 text-white" />
            <span className="sr-only">Close</span>
          </SheetClose>
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