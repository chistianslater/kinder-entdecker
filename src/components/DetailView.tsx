import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="relative pb-4">
          <Button
            onClick={onClose}
            variant="outline"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 rounded-full border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
          <SheetTitle className="text-xl font-semibold pr-12">
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