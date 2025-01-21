import React from 'react';
import { Activity } from '@/types/activity';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trash2 } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface ActivityCardActionsProps {
  activity: Activity;
  onClaim?: (activityId: string) => void;
  showClaimButton: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  onApprove?: () => void;
  onDelete?: () => void;
}

export const ActivityCardActions = ({ 
  activity,
  onClaim,
  showClaimButton,
  isOwner,
  isAdmin,
  onApprove,
  onDelete
}: ActivityCardActionsProps) => {
  const { toast } = useToast();

  const handleApprove = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('activities')
        .update({ 
          approved_at: new Date().toISOString(),
          approved_by: user.id
        })
        .eq('id', activity.id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Aktivität wurde erfolgreich genehmigt.",
      });

      if (onApprove) onApprove();
    } catch (error) {
      console.error('Error approving activity:', error);
      toast({
        title: "Fehler",
        description: "Aktivität konnte nicht genehmigt werden.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activity.id);

      if (error) throw error;

      toast({
        title: "Erfolg",
        description: "Aktivität wurde erfolgreich gelöscht.",
      });

      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({
        title: "Fehler",
        description: "Aktivität konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 pt-0 flex gap-2">
      {showClaimButton && onClaim && (
        <Button 
          variant="outline" 
          className="w-full rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
          onClick={() => onClaim(activity.id)}
        >
          Als Geschäft beanspruchen
        </Button>
      )}
      {isAdmin && !activity.approved_at && (
        <Button 
          variant="outline" 
          className="w-full rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
          onClick={handleApprove}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Genehmigen
        </Button>
      )}
      {isAdmin && (
        <Button 
          variant="outline" 
          className="w-full rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Löschen
        </Button>
      )}
    </div>
  );
};