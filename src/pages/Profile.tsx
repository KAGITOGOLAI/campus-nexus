import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { StudentRecord } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { User, MapPin, Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      const s = db.getStudents().find(x => x.userId === user.id);
      if (s) setStudent({ ...s });
    }
  }, [user]);

  const handleSave = () => {
    if (!student) return;
    setLoading(true);
    const students = db.getStudents();
    const idx = students.findIndex(s => s.id === student.id);
    if (idx !== -1) {
      students[idx] = student;
      db.setStudents(students);
      toast.success('Profile updated successfully');
    }
    setLoading(false);
  };

  if (user?.role !== 'STUDENT') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <User className="w-16 h-16 mb-4 opacity-10" />
        <p>This profile editor is only for students.</p>
        <p className="text-sm">Admins can manage profiles in the Students directory.</p>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
        <p className="text-slate-500">Manage your personal details and study preferences</p>
      </header>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Contact & Living Information</CardTitle>
          <CardDescription>Update where you live and your contact number</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-500" /> Full Name
                </Label>
                <Input value={student.fullName} disabled className="bg-slate-50 border-slate-100" />
             </div>
             <div className="space-y-2">
                <Label>Registration Number</Label>
                <Input value={student.registrationNumber} disabled className="bg-slate-50 border-slate-100" />
             </div>
             <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  value={student.phoneNumber} 
                  onChange={e => setStudent({...student, phoneNumber: e.target.value})}
                  className="border-slate-200"
                />
             </div>
             <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={student.email} disabled className="bg-slate-50 border-slate-100" />
             </div>
          </div>

          <div className="space-y-2">
             <Label className="flex items-center gap-2">
               <MapPin className="w-4 h-4 text-indigo-500" /> Home Address
             </Label>
             <Input 
               value={student.homeAddress} 
               onChange={e => setStudent({...student, homeAddress: e.target.value})}
               className="border-slate-200"
             />
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Study Preferences</CardTitle>
          <CardDescription>Update where and when you prefer to study</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" /> Preferred Study Venue
                </Label>
                <Input 
                  value={student.studyVenue} 
                  onChange={e => setStudent({...student, studyVenue: e.target.value})}
                  className="border-slate-200"
                  placeholder="e.g. Main Library, Floor 3"
                />
             </div>
             <div className="space-y-2">
                <Label>Study Time Range</Label>
                <Input 
                  value={student.studyTime} 
                  onChange={e => setStudent({...student, studyTime: e.target.value})}
                  className="border-slate-200"
                  placeholder="e.g. 18:00 - 21:00"
                />
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset Changes</Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]" onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
};