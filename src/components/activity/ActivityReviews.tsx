import React from 'react';
import { Activity } from '@/types/activity';
import { ReviewForm } from './ReviewForm';

interface ActivityReviewsProps {
  activity: Activity;
}

export const ActivityReviews = ({ activity }: ActivityReviewsProps) => {
  return (
    <div className="space-y-6">
      <ReviewForm activity={activity} />
    </div>
  );
};