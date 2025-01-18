import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Activity } from "@/types/activity";
import { CreateActivityForm } from "./CreateActivityForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface EditActivityDialogProps {
  activity: Activity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditActivityDialog({
  activity,
  open,
  onOpenChange,
  onSuccess,
}: EditActivityDialogProps) {
  const isMobile = useIsMobile();

  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-full h-[100dvh] p-0 rounded-none' : 'max-w-2xl'} max-h-[90vh] bg-background`}>
        <DialogHeader className={`${isMobile ? 'px-4 pt-4' : ''}`}>
          <DialogTitle className="text-white">Aktivität bearbeiten</DialogTitle>
        </DialogHeader>
        <ScrollArea className={`${isMobile ? 'h-[calc(100dvh-4rem)]' : 'h-[calc(90vh-8rem)]'}`}>
          <div className={`${isMobile ? 'px-4 pb-4' : 'px-6 pb-6'}`}>
            <CreateActivityForm
              initialData={activity}
              onSuccess={handleSuccess}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}