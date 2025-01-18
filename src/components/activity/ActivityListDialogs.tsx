import React from 'react';
import { Activity } from '@/types/activity';
import DetailView from '../DetailView';
import { CreateActivityDialog } from './CreateActivityDialog';
import { EditActivityDialog } from './EditActivityDialog';

interface ActivityListDialogsProps {
  selectedActivity: Activity | null;
  showCreateDialog: boolean;
  activityToEdit: Activity | null;
  onCloseDetail: () => void;
  onCreateDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ActivityListDialogs = ({
  selectedActivity,
  showCreateDialog,
  activityToEdit,
  onCloseDetail,
  onCreateDialogChange,
  onEditDialogChange,
  onSuccess,
}: ActivityListDialogsProps) => {
  const handleEdit = (activity: Activity) => {
    onEditDialogChange(true);
  };

  return (
    <>
      <DetailView 
        activity={selectedActivity}
        isOpen={selectedActivity !== null}
        onClose={onCloseDetail}
        onEdit={handleEdit}
      />

      <CreateActivityDialog
        open={showCreateDialog}
        onOpenChange={onCreateDialogChange}
        onSuccess={onSuccess}
      />

      {activityToEdit && (
        <EditActivityDialog
          activity={activityToEdit}
          open={!!activityToEdit}
          onOpenChange={(open) => !open && onEditDialogChange(open)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};

export default ActivityListDialogs;