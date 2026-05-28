export type UserRole = 'ADMIN1' | 'ADMIN2' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registrationNumber?: string;
  phoneNumber?: string;
}

export interface ParentInfo {
  name: string;
  phone: string;
  occupation: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  venue: string;
  time: string;
}

export interface Program {
  id: string;
  name: string;
  courses: string[]; // Course IDs
}

export interface StudentRecord {
  id: string;
  userId: string;
  registrationNumber: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  yearOfStudy: number;
  programId: string;
  studyVenue: string;
  studyTime: string;
  homeAddress: string;
  livesWith: string;
  parents: ParentInfo[];
  guardians: ParentInfo[];
  emergencyContacts: EmergencyContact[]; // At least 3
  registeredCourses: Course[];
}

export interface TimetableEntry {
  courseCode: string;
  venue: string;
  time: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  userId: string; // 'all' for global
  title: string;
  content: string;
  timestamp: number;
  read: boolean;
}