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
import { X, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useActivityOwnership } from '@/hooks/useActivityOwnership';

interface DetailViewProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (activity: Activity) => void;
}

const DetailView = ({ activity, isOpen, onClose, onEdit }: DetailViewProps) => {
  if (!activity) return null;

  const { isAdmin } = useIsAdmin();
  const isOwner = useActivityOwnership(activity.created_by);
  const canEdit = (isOwner || isAdmin) && onEdit;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit && activity) {
      onEdit(activity);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] overflow-y-auto bg-background">
        <SheetHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-white">
              {activity.title}
            </SheetTitle>
            <div className="flex items-center gap-4">
              {canEdit && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
                  onClick={handleEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Bearbeiten
                </Button>
              )}
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 rounded-full hover:bg-white/10"
                >
                  <X className="h-4 w-4 text-white" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </div>
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