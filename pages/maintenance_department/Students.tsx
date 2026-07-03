import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Users, Search, Mail, Phone, Building } from 'lucide-react';

const mockStudents = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@student.edu', phone: '+91 98765 43210', room: 'A-101', block: 'Block A' },
  { id: '2', name: 'Amit Kumar', email: 'amit@student.edu', phone: '+91 98765 43211', room: 'A-101', block: 'Block A' },
  { id: '3', name: 'Priya Singh', email: 'priya@student.edu', phone: '+91 98765 43212', room: 'A-102', block: 'Block A' },
  { id: '4', name: 'Vikram Patel', email: 'vikram@student.edu', phone: '+91 98765 43213', room: 'A-103', block: 'Block A' },
  { id: '5', name: 'Ananya Gupta', email: 'ananya@student.edu', phone: '+91 98765 43214', room: 'B-201', block: 'Block B' },
  { id: '6', name: 'Meera Joshi', email: 'meera@student.edu', phone: '+91 98765 43215', room: 'B-201', block: 'Block B' },
  { id: '7', name: 'Arjun Das', email: 'arjun@student.edu', phone: '+91 98765 43216', room: 'C-301', block: 'Block C' },
  { id: '8', name: 'Neha Sharma', email: 'neha@student.edu', phone: '+91 98765 43217', room: 'B-201', block: 'Block B' },
];

const Students: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.room.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-display font-bold mb-2">Students</h1>
          <p className="text-muted-foreground">View and manage hostel residents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-primary/10 rounded-xl p-6 text-center border border-primary/20">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-display font-bold text-primary">{mockStudents.length}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
          <div className="bg-card rounded-xl p-6 text-center border border-border">
            <p className="text-3xl font-display font-bold">3</p>
            <p className="text-sm text-muted-foreground">Blocks</p>
          </div>
          <div className="bg-card rounded-xl p-6 text-center border border-border">
            <p className="text-3xl font-display font-bold">8</p>
            <p className="text-sm text-muted-foreground">Active Rooms</p>
          </div>
        </div>

        {/* Search and List */}
        <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email, or room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {student.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {student.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-16 md:ml-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
                    <Building className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{student.room}</span>
                    <span className="text-xs text-muted-foreground">• {student.block}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No students found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Students;
