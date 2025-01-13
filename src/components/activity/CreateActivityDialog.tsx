import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateActivityForm } from "./CreateActivityForm";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-white">Neue Aktivität erstellen</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
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