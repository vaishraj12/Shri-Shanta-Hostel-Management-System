import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Building, Users, Bed, CheckCircle } from 'lucide-react';

const mockRooms = [
  { id: '1', number: 'A-101', block: 'Block A', capacity: 2, occupants: ['Rahul Sharma', 'Amit Kumar'] },
  { id: '2', number: 'A-102', block: 'Block A', capacity: 2, occupants: ['Priya Singh'] },
  { id: '3', number: 'A-103', block: 'Block A', capacity: 2, occupants: ['Vikram Patel', 'Ravi Verma'] },
  { id: '4', number: 'B-201', block: 'Block B', capacity: 3, occupants: ['Ananya Gupta', 'Meera Joshi', 'Neha Sharma'] },
  { id: '5', number: 'B-202', block: 'Block B', capacity: 3, occupants: ['Kiran Rao'] },
  { id: '6', number: 'B-203', block: 'Block B', capacity: 3, occupants: [] },
  { id: '7', number: 'C-301', block: 'Block C', capacity: 2, occupants: ['Arjun Das', 'Suresh Nair'] },
  { id: '8', number: 'C-302', block: 'Block C', capacity: 2, occupants: ['Deepak Jha'] },
];

const Rooms: React.FC = () => {
  const totalCapacity = mockRooms.reduce((acc, room) => acc + room.capacity, 0);
  const totalOccupied = mockRooms.reduce((acc, room) => acc + room.occupants.length, 0);
  const emptyRooms = mockRooms.filter(room => room.occupants.length === 0).length;
  const fullRooms = mockRooms.filter(room => room.occupants.length === room.capacity).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-display font-bold mb-2">Room Management</h1>
          <p className="text-muted-foreground">View and manage hostel room allocations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total Rooms</span>
            </div>
            <p className="text-3xl font-display font-bold">{mockRooms.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Occupancy</span>
            </div>
            <p className="text-3xl font-display font-bold">{totalOccupied}/{totalCapacity}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">Full Rooms</span>
            </div>
            <p className="text-3xl font-display font-bold">{fullRooms}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Bed className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Empty Rooms</span>
            </div>
            <p className="text-3xl font-display font-bold">{emptyRooms}</p>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
          <h2 className="text-lg font-display font-semibold mb-6">All Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRooms.map((room) => {
              const occupancyPercent = (room.occupants.length / room.capacity) * 100;
              return (
                <div
                  key={room.id}
                  className="p-4 rounded-xl bg-secondary/50 border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{room.number}</p>
                        <p className="text-sm text-muted-foreground">{room.block}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      occupancyPercent === 100
                        ? 'bg-success/15 text-success'
                        : occupancyPercent === 0
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-warning/15 text-warning'
                    }`}>
                      {room.occupants.length}/{room.capacity}
                    </span>
                  </div>
                  
                  {/* Occupancy Bar */}
                  <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full gradient-primary transition-all duration-300"
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>

                  {/* Occupants */}
                  {room.occupants.length > 0 ? (
                    <div className="space-y-1">
                      {room.occupants.map((name, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                            {name.charAt(0)}
                          </div>
                          <span className="text-muted-foreground">{name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No occupants</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Rooms;
