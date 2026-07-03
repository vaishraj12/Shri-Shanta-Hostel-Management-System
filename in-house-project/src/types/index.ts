export type UserRole = 'student' | 'admin' | 'warden';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roomNumber?: string;
  hostelBlock?: string;
}

export interface Room {
  id: string;
  number: string;
  block: string;
  capacity: number;
  occupants: string[];
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: 'electrical' | 'plumbing' | 'furniture' | 'cleaning' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface MessMenuItem {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}
