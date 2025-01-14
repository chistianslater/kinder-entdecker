import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateActivityForm } from "./CreateActivityForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreateActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateActivityDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateActivityDialogProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isMobile ? 'max-w-full h-[100dvh] p-0 rounded-none' : 'max-w-2xl'} max-h-[90vh]`}
      >
        <DialogHeader className={`${isMobile ? 'px-4 pt-4' : ''}`}>
          <DialogTitle className="text-white">Neue Aktivität erstellen</DialogTitle>
        </DialogHeader>
        <ScrollArea className={`${isMobile ? 'h-[calc(100dvh-4rem)] px-4' : 'h-[calc(90vh-8rem)] pr-4'}`}>
          <CreateActivityForm
            onSuccess={() => {
              onSuccess();
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}