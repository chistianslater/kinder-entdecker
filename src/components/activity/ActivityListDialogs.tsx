import React from 'react';
import { Activity } from '@/types/activity';
import DetailView from '@/components/DetailView';
import { CreateActivityDialog } from './CreateActivityDialog';
import { EditActivityDialog } from './EditActivityDialog';

interface ActivityListDialogsProps {
  selectedActivity: Activity | null;
  onCloseDetail: () => void;
  isEditDialogOpen: boolean;
  onEditDialogChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ActivityListDialogs = ({
  selectedActivity,
  onCloseDetail,
  isEditDialogOpen,
  onEditDialogChange,
  onSuccess,
}: ActivityListDialogsProps) => {
  return (
    <>
      <DetailView
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={onCloseDetail}
        onSuccess={onSuccess}
      />

      <CreateActivityDialog
        open={false}
        onOpenChange={() => {}}
        onSuccess={onSuccess}
      />

      {selectedActivity && (
        <EditActivityDialog
          activity={selectedActivity}
          open={isEditDialogOpen}
          onOpenChange={onEditDialogChange}
          onSuccess={() => {
            onSuccess();
            onCloseDetail();
          }}
        />
      )}
    </>
  );
};