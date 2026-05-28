import { StudentRecord, User, Course, Program, TimetableEntry, Message, Notification } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Super Admin', email: 'admin1@uni.edu', role: 'ADMIN1' },
  { id: 'u2', name: 'Registrar Admin', email: 'admin2@uni.edu', role: 'ADMIN2' },
  { id: 'u3', name: 'John Doe', email: 'john@uni.edu', role: 'STUDENT', registrationNumber: 'REG001', phoneNumber: '+1234567890' },
  { id: 'u4', name: 'Jane Smith', email: 'jane@uni.edu', role: 'STUDENT', registrationNumber: 'REG002', phoneNumber: '+1234567891' },
];

export const INITIAL_COURSES: Course[] = [
  { id: 'c1', name: 'Introduction to Computer Science', code: 'CS101', venue: 'Hall A', time: 'Mon 08:00 - 10:00' },
  { id: 'c2', name: 'Calculus I', code: 'MATH101', venue: 'Hall B', time: 'Tue 10:00 - 12:00' },
  { id: 'c3', name: 'Data Structures', code: 'CS201', venue: 'Hall C', time: 'Wed 14:00 - 16:00' },
];

export const INITIAL_PROGRAMS: Program[] = [
  { id: 'p1', name: 'Computer Science', courses: ['c1', 'c3'] },
  { id: 'p2', name: 'Mathematics', courses: ['c2'] },
];

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 's1',
    userId: 'u3',
    registrationNumber: 'REG001',
    fullName: 'John Doe',
    phoneNumber: '+1234567890',
    email: 'john@uni.edu',
    yearOfStudy: 1,
    programId: 'p1',
    studyVenue: 'Library Floor 2',
    studyTime: '18:00 - 20:00',
    homeAddress: '123 University Ave',
    livesWith: 'Parents',
    parents: [{ name: 'Robert Doe', phone: '+111222333', occupation: 'Engineer' }],
    guardians: [],
    emergencyContacts: [
      { name: 'Mike Friend', phone: '+444555666', relationship: 'Friend' },
      { name: 'Sarah Friend', phone: '+777888999', relationship: 'Friend' },
      { name: 'Tom Friend', phone: '+000111222', relationship: 'Friend' },
    ],
    registeredCourses: [INITIAL_COURSES[0], INITIAL_COURSES[2]],
  }
];

export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'all', title: 'Welcome', content: 'Welcome to the University Management System!', timestamp: Date.now(), read: false }
];

class DB {
  private getData<T>(key: string, defaultValue: T): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  private setData<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getUsers() { return this.getData<User[]>('users', INITIAL_USERS); }
  setUsers(users: User[]) { this.setData('users', users); }

  getStudents() { return this.getData<StudentRecord[]>('students', INITIAL_STUDENTS); }
  setStudents(students: StudentRecord[]) { this.setData('students', students); }

  getCourses() { return this.getData<Course[]>('courses', INITIAL_COURSES); }
  setCourses(courses: Course[]) { this.setData('courses', courses); }

  getPrograms() { return this.getData<Program[]>('programs', INITIAL_PROGRAMS); }
  setPrograms(programs: Program[]) { this.setData('programs', programs); }

  getMessages() { return this.getData<Message[]>('messages', INITIAL_MESSAGES); }
  setMessages(messages: Message[]) { this.setData('messages', messages); }

  getNotifications() { return this.getData<Notification[]>('notifications', INITIAL_NOTIFICATIONS); }
  setNotifications(notifications: Notification[]) { this.setData('notifications', notifications); }

  getTimetable() { return this.getData<TimetableEntry[]>('timetable', []); }
  setTimetable(timetable: TimetableEntry[]) { this.setData('timetable', timetable); }
}

export const db = new DB();