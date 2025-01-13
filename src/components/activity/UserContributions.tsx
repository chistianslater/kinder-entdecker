import React from 'react';
import { Activity } from '@/types/activity';
import { ActivityReviews } from './ActivityReviews';

interface UserContributionsProps {
  activity: Activity;
}

export const UserContributions = ({ activity }: UserContributionsProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white">Reviews</h3>
        <ActivityReviews activity={activity} />
      </div>
    </div>
  );
};