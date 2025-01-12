import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from 'lucide-react';

interface AccountAvatarProps {
  avatarUrl?: string | null;
  onAvatarUpdate?: () => void;
  className?: string;
}

export const AccountAvatar = ({ avatarUrl, className }: AccountAvatarProps) => {
  return (
    <Avatar className={`h-12 w-12 ${className}`}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt="Profile" />
      ) : (
        <AvatarFallback>
          <User className="h-6 w-6" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};