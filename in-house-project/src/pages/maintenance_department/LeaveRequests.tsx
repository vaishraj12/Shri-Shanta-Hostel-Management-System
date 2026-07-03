import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockLeaveRequests } from '@/data/mockData';
import { Calendar, Check, X, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { LeaveRequest } from '@/types';

const LeaveRequests: React.FC = () => {
  const [leaves, setLeaves] = useState(mockLeaveRequests);

  const handleApprove = (id: string) => {
    setLeaves(leaves.map(l => 
      l.id === id ? { ...l, status: 'approved' as const } : l
    ));
    toast.success('Leave request approved');
  };

  const handleReject = (id: string) => {
    setLeaves(leaves.map(l => 
      l.id === id ? { ...l, status: 'rejected' as const } : l
    ));
    toast.success('Leave request rejected');
  };

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const processedLeaves = leaves.filter(l => l.status !== 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-display font-bold mb-2">Leave Requests</h1>
          <p className="text-muted-foreground">Review and manage student leave applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-warning/10 rounded-xl p-6 text-center border border-warning/20">
            <p className="text-3xl font-display font-bold text-warning">{pendingLeaves.length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="bg-success/10 rounded-xl p-6 text-center border border-success/20">
            <p className="text-3xl font-display font-bold text-success">
              {leaves.filter(l => l.status === 'approved').length}
            </p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </div>
          <div className="bg-destructive/10 rounded-xl p-6 text-center border border-destructive/20">
            <p className="text-3xl font-display font-bold text-destructive">
              {leaves.filter(l => l.status === 'rejected').length}
            </p>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingLeaves.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
            <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Pending Requests ({pendingLeaves.length})
            </h2>
            <div className="space-y-4">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 rounded-xl bg-warning/5 border border-warning/20"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{leave.studentName}</p>
                        <p className="text-sm text-muted-foreground">Room {leave.roomNumber}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mt-2 text-muted-foreground">{leave.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-16 md:ml-0">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(leave.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(leave.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Requests */}
        <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
          <h2 className="text-lg font-display font-semibold mb-6">All Leave Requests</h2>
          <div className="space-y-3">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center border border-border">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{leave.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      Room {leave.roomNumber} • {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <StatusBadge status={leave.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaveRequests;
