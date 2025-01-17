import React from 'react';
import { Activity } from '@/types/activity';
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle2 } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

interface ActivityCardActionsProps {
  activity: Activity;
  onClaim?: (activityId: string) => void;
  onEdit?: (activity: Activity) => void;
  showClaimButton: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  onApprove?: () => void;
}

export const ActivityCardActions = ({ 
  activity,
  onClaim,
  onEdit,
  showClaimButton,
  isOwner,
  isAdmin,
  onApprove
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
      {(isOwner || isAdmin) && onEdit && (
        <Button 
          variant="outline" 
          className="w-full rounded-md text-white border-white/20 hover:text-white hover:bg-white/10"
          onClick={() => onEdit(activity)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Bearbeiten
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
    </div>
  );
};