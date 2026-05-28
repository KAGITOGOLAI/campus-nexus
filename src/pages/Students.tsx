import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { StudentRecord, Course, Program } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Search, Plus, Filter, Eye, Edit, MapPin, UserCheck, Users, ShieldAlert, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';

export const Students: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Student State
  const [newStudent, setNewStudent] = useState<Partial<StudentRecord>>({
    fullName: '',
    registrationNumber: '',
    phoneNumber: '',
    email: '',
    yearOfStudy: 1,
    programId: '',
    studyVenue: '',
    studyTime: '',
    homeAddress: '',
    livesWith: '',
    parents: [{ name: '', phone: '', occupation: '' }],
    guardians: [],
    emergencyContacts: [
      { name: '', phone: '', relationship: '' },
      { name: '', phone: '', relationship: '' },
      { name: '', phone: '', relationship: '' },
    ]
  });

  useEffect(() => {
    setStudents(db.getStudents());
    setPrograms(db.getPrograms());
  }, []);

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phoneNumber.includes(searchTerm)
  );

  const handleAddStudent = () => {
    if (!newStudent.fullName || !newStudent.registrationNumber || !newStudent.programId) {
      toast.error('Please fill required fields');
      return;
    }

    const program = programs.find(p => p.id === newStudent.programId);
    const allCourses = db.getCourses();
    const courses = allCourses.filter(c => program?.courses.includes(c.id));

    const student: StudentRecord = {
      ...newStudent as StudentRecord,
      id: Date.now().toString(),
      userId: 'u-' + Date.now(),
      registeredCourses: courses,
    };

    const updated = [...students, student];
    setStudents(updated);
    db.setStudents(updated);
    
    // Create a mock user for this student
    const users = db.getUsers();
    users.push({
      id: student.userId,
      name: student.fullName,
      email: student.email || `${student.registrationNumber.toLowerCase()}@uni.edu`,
      role: 'STUDENT',
      registrationNumber: student.registrationNumber,
      phoneNumber: student.phoneNumber
    });
    db.setUsers(users);

    setIsAddOpen(false);
    toast.success('Student added and enrolled in program courses');
  };

  const canEdit = user?.role === 'ADMIN1';
  const canViewAll = user?.role === 'ADMIN1' || user?.role === 'ADMIN2';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Directory</h1>
          <p className="text-slate-500">Manage and search student information</p>
        </div>
        {canEdit && (
          <Button onClick={() => setIsAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Student
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name, phone or registration number..." 
            className="pl-10 h-10 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-10 px-4">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="border-slate-200 hover:shadow-lg transition-all group overflow-hidden">
            <CardHeader className="pb-4 relative">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                    {student.fullName.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">{student.fullName}</CardTitle>
                    <p className="text-xs text-slate-500">{student.registrationNumber}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none">Year {student.yearOfStudy}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-6">
               <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Program</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Course Venue</div>
                  <div className="text-xs font-semibold text-slate-700">
                    {programs.find(p => p.id === student.programId)?.name || 'N/A'}
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    {student.registeredCourses[0]?.venue || 'TBA'}
                  </div>
               </div>
               
               <div className="pt-4 flex gap-2">
                 <Button 
                   variant="secondary" 
                   className="flex-1 bg-slate-100 text-slate-900 hover:bg-slate-200 text-xs h-8"
                   onClick={() => {
                     setSelectedStudent(student);
                     setIsViewOpen(true);
                   }}
                 >
                   <Eye className="w-3.5 h-3.5 mr-1.5" />
                   View Details
                 </Button>
                 {canEdit && (
                   <Button variant="outline" className="h-8 w-8 p-0">
                     <Edit className="w-3.5 h-3.5" />
                   </Button>
                 )}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
          <DialogHeader className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-indigo-100 shadow-xl">
                 {selectedStudent?.fullName.charAt(0)}
               </div>
               <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">{selectedStudent?.fullName}</DialogTitle>
                  <p className="text-slate-500 font-medium">Student Profile • {selectedStudent?.registrationNumber}</p>
               </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <UserCheck className="w-4 h-4" /> Academic Status
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                       <div className="flex justify-between">
                         <span className="text-slate-500 text-sm">Program</span>
                         <span className="font-semibold text-slate-900">{programs.find(p => p.id === selectedStudent?.programId)?.name}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-slate-500 text-sm">Year of Study</span>
                         <span className="font-semibold text-slate-900">{selectedStudent?.yearOfStudy}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-slate-500 text-sm">Study Venue</span>
                         <span className="font-semibold text-slate-900">{selectedStudent?.studyVenue}</span>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Contact & Living
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                       <div className="flex justify-between">
                         <span className="text-slate-500 text-sm">Phone</span>
                         <span className="font-semibold text-indigo-600">{selectedStudent?.phoneNumber}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-slate-500 text-sm">Lives With</span>
                         <span className="font-semibold text-slate-900">{selectedStudent?.livesWith}</span>
                       </div>
                       <div className="flex flex-col gap-1">
                         <span className="text-slate-500 text-sm">Home Address</span>
                         <span className="font-semibold text-slate-900">{selectedStudent?.homeAddress}</span>
                       </div>
                    </div>
                 </section>
              </div>

              {/* Family Info - Only visible to Admins */}
              {canViewAll && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-4 h-4" /> Parents & Guardians
                    </h3>
                    <div className="space-y-3">
                      {selectedStudent?.parents.map((p, i) => (
                        <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="font-bold text-slate-900 text-sm">{p.name} (Parent)</p>
                          <p className="text-xs text-slate-500">{p.occupation} • {p.phone}</p>
                        </div>
                      ))}
                      {selectedStudent?.guardians.map((g, i) => (
                        <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="font-bold text-slate-900 text-sm">{g.name} (Guardian)</p>
                          <p className="text-xs text-slate-500 text-indigo-600">{g.phone}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Emergency Contacts
                    </h3>
                    <div className="space-y-3">
                      {selectedStudent?.emergencyContacts.map((c, i) => (
                        <div key={i} className="bg-orange-50/30 p-3 rounded-lg border border-orange-100">
                          <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.relationship} • <span className="text-orange-600 font-medium">{c.phone}</span></p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* Courses */}
              <section className="space-y-4">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <BookOpen className="w-4 h-4" /> Enrolled Courses
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {selectedStudent?.registeredCourses.map((course) => (
                     <div key={course.id} className="p-4 bg-white border border-slate-200 rounded-xl">
                        <p className="font-bold text-slate-900">{course.name}</p>
                        <p className="text-xs text-slate-500 mb-2">{course.code}</p>
                        <div className="flex justify-between items-center text-xs">
                           <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-medium">{course.venue}</span>
                           <span className="text-slate-400">{course.time}</span>
                        </div>
                     </div>
                   ))}
                 </div>
              </section>
            </div>
          </ScrollArea>
          
          <DialogFooter className="p-4 bg-white border-t border-slate-100 sm:justify-end gap-2">
             <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
             <Button className="bg-indigo-600">Download Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-6 border-b">
            <DialogTitle>Enroll New Student</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={newStudent.fullName} onChange={e => setNewStudent({...newStudent, fullName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Registration Number</Label>
                    <Input value={newStudent.registrationNumber} onChange={e => setNewStudent({...newStudent, registrationNumber: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={newStudent.phoneNumber} onChange={e => setNewStudent({...newStudent, phoneNumber: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Program</Label>
                    <Select onValueChange={val => setNewStudent({...newStudent, programId: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <Label className="text-indigo-600 font-bold">Emergency Contacts (3 Required)</Label>
                  {[0, 1, 2].map(idx => (
                    <div key={idx} className="grid grid-cols-3 gap-2">
                      <Input placeholder="Name" value={newStudent.emergencyContacts?.[idx].name} onChange={e => {
                        const contacts = [...(newStudent.emergencyContacts || [])];
                        contacts[idx].name = e.target.value;
                        setNewStudent({...newStudent, emergencyContacts: contacts});
                      }} />
                      <Input placeholder="Phone" value={newStudent.emergencyContacts?.[idx].phone} onChange={e => {
                        const contacts = [...(newStudent.emergencyContacts || [])];
                        contacts[idx].phone = e.target.value;
                        setNewStudent({...newStudent, emergencyContacts: contacts});
                      }} />
                      <Input placeholder="Relationship" value={newStudent.emergencyContacts?.[idx].relationship} onChange={e => {
                        const contacts = [...(newStudent.emergencyContacts || [])];
                        contacts[idx].relationship = e.target.value;
                        setNewStudent({...newStudent, emergencyContacts: contacts});
                      }} />
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Home Address</Label>
                    <Input value={newStudent.homeAddress} onChange={e => setNewStudent({...newStudent, homeAddress: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lives With</Label>
                    <Input value={newStudent.livesWith} onChange={e => setNewStudent({...newStudent, livesWith: e.target.value})} />
                  </div>
               </div>
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 border-t">
             <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
             <Button className="bg-indigo-600" onClick={handleAddStudent}>Register Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};