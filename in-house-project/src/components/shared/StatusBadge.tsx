import React from 'react';
import { cn } from '@/lib/utils';

type Status = 'pending' | 'approved' | 'rejected' | 'in-progress' | 'resolved' | 'present' | 'absent' | 'leave';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  pending: 'bg-warning/15 text-warning border-warning/30',
  approved: 'bg-success/15 text-success border-success/30',
  rejected: 'bg-destructive/15 text-destructive border-destructive/30',
  'in-progress': 'bg-primary/15 text-primary border-primary/30',
  resolved: 'bg-success/15 text-success border-success/30',
  present: 'bg-success/15 text-success border-success/30',
  absent: 'bg-destructive/15 text-destructive border-destructive/30',
  leave: 'bg-warning/15 text-warning border-warning/30',
};

const statusLabels: Record<Status, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  present: 'Present',
  absent: 'Absent',
  leave: 'On Leave',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
