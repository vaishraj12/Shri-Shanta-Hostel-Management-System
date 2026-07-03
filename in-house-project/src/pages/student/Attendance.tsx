import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { mockAttendance } from '@/data/mockData';
import { CalendarCheck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Attendance: React.FC = () => {
  const [markedToday, setMarkedToday] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const handleMarkAttendance = () => {
    setMarkedToday(true);
    toast.success('Attendance marked!', {
      description: 'Your presence has been recorded for today.',
    });
  };

  const attendanceStats = {
    present: mockAttendance.filter(a => a.status === 'present').length,
    absent: mockAttendance.filter(a => a.status === 'absent').length,
    leave: mockAttendance.filter(a => a.status === 'leave').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-display font-bold mb-2">Attendance</h1>
          <p className="text-muted-foreground">Track and mark your daily attendance</p>
        </div>

        {/* Mark Attendance Card */}
        <div className="bg-card rounded-xl border border-border p-8 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto mb-6 flex items-center justify-center">
            <CalendarCheck className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-display font-semibold mb-2">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
          <p className="text-muted-foreground mb-6">
            {markedToday ? 'You have marked your attendance for today' : 'Mark your attendance for today'}
          </p>
          <Button
            variant={markedToday ? 'secondary' : 'gradient'}
            size="xl"
            disabled={markedToday}
            onClick={handleMarkAttendance}
            className="min-w-48"
          >
            {markedToday ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Marked Present
              </>
            ) : (
              'Mark Present'
            )}
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-success/10 rounded-xl p-6 text-center border border-success/20">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-3xl font-display font-bold text-success">{attendanceStats.present}</p>
            <p className="text-sm text-muted-foreground">Days Present</p>
          </div>
          <div className="bg-destructive/10 rounded-xl p-6 text-center border border-destructive/20">
            <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-3xl font-display font-bold text-destructive">{attendanceStats.absent}</p>
            <p className="text-sm text-muted-foreground">Days Absent</p>
          </div>
          <div className="bg-warning/10 rounded-xl p-6 text-center border border-warning/20">
            <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-3xl font-display font-bold text-warning">{attendanceStats.leave}</p>
            <p className="text-sm text-muted-foreground">On Leave</p>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
          <h2 className="text-lg font-display font-semibold mb-6">Attendance History</h2>
          <div className="space-y-3">
            {mockAttendance.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-4">
                  {record.status === 'present' ? (
                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                  ) : record.status === 'absent' ? (
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-destructive" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <StatusBadge status={record.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
