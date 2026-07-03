import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockLeaveRequests } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Leave: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const myLeaves = mockLeaveRequests.filter(l => l.studentId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Leave request submitted!', {
      description: 'Your request will be reviewed by the admin.',
    });
    setIsOpen(false);
    setFormData({ startDate: '', endDate: '', reason: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between animate-slide-up">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Leave Management</h1>
            <p className="text-muted-foreground">Apply for leave and track your requests</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">Apply for Leave</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain your reason for leave..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gradient" className="flex-1">
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <p className="text-3xl font-display font-bold text-foreground">
              {myLeaves.filter(l => l.status === 'approved').length}
            </p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <p className="text-3xl font-display font-bold text-warning">
              {myLeaves.filter(l => l.status === 'pending').length}
            </p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <p className="text-3xl font-display font-bold text-destructive">
              {myLeaves.filter(l => l.status === 'rejected').length}
            </p>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </div>
        </div>

        {/* Leave Requests List */}
        <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
          <h2 className="text-lg font-display font-semibold mb-6">My Leave Requests</h2>
          {mockLeaveRequests.length > 0 ? (
            <div className="space-y-4">
              {mockLeaveRequests.map((leave) => (
                <div
                  key={leave.id}
                  className="p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{leave.studentName}</p>
                        <p className="text-sm text-muted-foreground">Room {leave.roomNumber}</p>
                      </div>
                    </div>
                    <StatusBadge status={leave.status} />
                  </div>
                  <div className="pl-13">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{leave.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No leave requests yet</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leave;
