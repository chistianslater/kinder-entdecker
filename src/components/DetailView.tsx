import React, { useState } from 'react';
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
import { X, Edit, Save, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useActivityOwnership } from '@/hooks/useActivityOwnership';
import { useToast } from './ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DetailViewProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DetailView = ({ activity, isOpen, onClose, onSuccess }: DetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState<Activity | null>(null);
  const { toast } = useToast();

  if (!activity) return null;

  const { isAdmin } = useIsAdmin();
  const isOwner = useActivityOwnership(activity.created_by);
  const canEdit = isOwner || isAdmin;

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditedActivity(null);
    } else {
      setIsEditing(true);
      setEditedActivity(activity);
    }
  };

  const handleSave = async () => {
    if (!editedActivity) return;

    try {
      const { error } = await supabase
        .from('activities')
        .update({
          title: editedActivity.title,
          description: editedActivity.description,
          location: editedActivity.location,
          type: editedActivity.type,
          age_range: editedActivity.age_range,
          price_range: editedActivity.price_range,
          opening_hours: editedActivity.opening_hours,
          website_url: editedActivity.website_url,
          ticket_url: editedActivity.ticket_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activity.id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Aktivität wurde erfolgreich aktualisiert.",
      });

      setIsEditing(false);
      setEditedActivity(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating activity:', error);
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[800px] md:max-w-[1000px] lg:max-w-[1200px] overflow-y-auto bg-background">
        <SheetHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-white">
              {editedActivity?.title || activity.title}
            </SheetTitle>
            <div className="flex items-center gap-4">
              {canEdit && (
                isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Speichern
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
                      onClick={handleEditToggle}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Abbrechen
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
                    onClick={handleEditToggle}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Bearbeiten
                  </Button>
                )
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
          <ActivityDetails 
            activity={editedActivity || activity} 
            isEditing={isEditing}
            onChange={setEditedActivity}
          />
          <div className="border-t border-white/10 pt-6">
            <UserContributions activity={activity} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailView;