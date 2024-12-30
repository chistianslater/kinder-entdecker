import React from 'react';
import { Activity } from '@/types/activity';
import { ReviewForm } from './ReviewForm';
import { MediaUpload } from './MediaUpload';

interface ActivityReviewsProps {
  activity: Activity;
}

export const ActivityReviews = ({ activity }: ActivityReviewsProps) => {
  return (
    <div className="space-y-6">
      <ReviewForm activity={activity} />
      <div className="border-t pt-6">
        <MediaUpload activity={activity} />
      </div>
    </div>
  );
};