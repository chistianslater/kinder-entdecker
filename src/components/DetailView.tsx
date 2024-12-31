import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Activity } from '@/types/activity';
import { ActivityDetails } from './activity/ActivityDetails';
import { ActivityReviews } from './activity/ActivityReviews';
import { MediaUpload } from './activity/MediaUpload';

interface DetailViewProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailView = ({ activity, isOpen, onClose }: DetailViewProps) => {
  if (!activity) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-none overflow-y-auto">
        <SheetHeader className="relative pb-4">
          <SheetTitle className="text-xl font-semibold">
            {activity.title}
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-8 py-4">
          <ActivityDetails activity={activity} />
          <div className="border-t pt-6">
            <MediaUpload activity={activity} />
          </div>
          <div className="border-t pt-6">
            <ActivityReviews activity={activity} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailView;