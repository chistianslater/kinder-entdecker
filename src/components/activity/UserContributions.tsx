import React from 'react';
import { Activity } from '@/types/activity';
import { MediaUpload } from './MediaUpload';
import { ActivityReviews } from './ActivityReviews';

interface UserContributionsProps {
  activity: Activity;
}

export const UserContributions = ({ activity }: UserContributionsProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <ActivityReviews activity={activity} />
      </div>
      
      <div className="border-t pt-6">
        <MediaUpload activity={activity} />
      </div>
    </div>
  );
};