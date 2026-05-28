import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, BookOpen, CheckCircle, TrendingUp, Bell, MessageSquare, Calendar, Clock } from 'lucide-react';
import { StudentRecord, Notification } from '../types';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalPrograms: 0,
    recentNotifications: [] as Notification[],
  });

  const [studentProfile, setStudentProfile] = useState<StudentRecord | null>(null);

  useEffect(() => {
    if (user?.role === 'STUDENT') {
      const student = db.getStudents().find(s => s.userId === user.id);
      if (student) setStudentProfile(student);
    }

    setStats({
      totalStudents: db.getStudents().length,
      totalCourses: db.getCourses().length,
      totalPrograms: db.getPrograms().length,
      recentNotifications: db.getNotifications().slice(0, 5),
    });
  }, [user]);

  if (user?.role === 'STUDENT' && studentProfile) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Welcome, {studentProfile.fullName}!</h1>
          <p className="text-slate-500">Registration Number: <span className="font-semibold text-indigo-600">{studentProfile.registrationNumber}</span></p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-lg">
             <CardContent className="pt-6">
               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-indigo-100 text-sm font-medium">Year of Study</p>
                   <p className="text-3xl font-bold">{studentProfile.yearOfStudy}</p>
                 </div>
                 <div className="bg-white/20 p-2 rounded-lg"><Calendar className="w-5 h-5 text-white" /></div>
               </div>
             </CardContent>
           </Card>
           
           <Card className="bg-white border-slate-200 shadow-sm">
             <CardContent className="pt-6">
               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-slate-500 text-sm font-medium">Total Courses</p>
                   <p className="text-3xl font-bold text-slate-900">{studentProfile.registeredCourses.length}</p>
                 </div>
                 <div className="bg-indigo-50 p-2 rounded-lg"><BookOpen className="w-5 h-5 text-indigo-600" /></div>
               </div>
             </CardContent>
           </Card>

           <Card className="bg-white border-slate-200 shadow-sm">
             <CardContent className="pt-6">
               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-slate-500 text-sm font-medium">Attendance Rate</p>
                   <p className="text-3xl font-bold text-slate-900">94%</p>
                 </div>
                 <div className="bg-green-50 p-2 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
               </div>
             </CardContent>
           </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <section className="space-y-4">
             <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
               <BookOpen className="w-5 h-5 text-indigo-600" />
               Registered Courses
             </h2>
             <div className="space-y-3">
               {studentProfile.registeredCourses.map((course) => (
                 <motion.div 
                   key={course.id} 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="p-4 bg-white border border-slate-200 rounded-xl flex justify-between items-center group hover:border-indigo-200 transition-colors"
                 >
                   <div>
                     <p className="font-semibold text-slate-900">{course.name}</p>
                     <p className="text-sm text-slate-500">{course.code} • {course.venue}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-medium text-slate-900">{course.time}</p>
                     <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-none text-[10px]">Active</Badge>
                   </div>
                 </motion.div>
               ))}
             </div>
           </section>

           <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                Study Schedule
              </h2>
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Study Venue</p>
                        <p className="text-sm text-slate-500">{studentProfile.studyVenue}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">Daily Study Time</p>
                        <p className="text-sm text-slate-500">{studentProfile.studyTime}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-8">
                <Bell className="w-5 h-5 text-indigo-600" />
                Latest Notifications
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {stats.recentNotifications.map((n, i) => (
                   <div key={n.id} className={`p-4 ${i !== stats.recentNotifications.length - 1 ? 'border-b border-slate-100' : ''}`}>
                      <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{n.content}</p>
                   </div>
                ))}
              </div>
           </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
        <p className="text-slate-500">Real-time statistics for {user?.role === 'ADMIN1' ? 'Super Admin' : 'Admin'}</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Programs', value: stats.totalPrograms, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Unread Messages', value: db.getMessages().length, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-200">
           <CardHeader>
             <CardTitle className="text-lg font-bold">Recent Students</CardTitle>
           </CardHeader>
           <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-y border-slate-100 bg-slate-50/50">
                     <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                     <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Reg #</th>
                     <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Year</th>
                     <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Program</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {db.getStudents().slice(0, 5).map((student) => (
                     <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.fullName}</td>
                       <td className="px-6 py-4 text-sm text-slate-500">{student.registrationNumber}</td>
                       <td className="px-6 py-4 text-sm text-slate-500">{student.yearOfStudy}</td>
                       <td className="px-6 py-4 text-sm text-slate-500">
                          <Badge variant="outline" className="text-[10px] font-semibold border-indigo-100 bg-indigo-50/30 text-indigo-600">
                            {db.getPrograms().find(p => p.id === student.programId)?.name || 'Unknown'}
                          </Badge>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Quick Broadcast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Message Title</label>
                <Input placeholder="e.g. Holiday Announcement" className="h-10 border-slate-200" id="broadcast-title" />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Content</label>
                <textarea 
                  className="w-full h-32 p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                  placeholder="Type your announcement here..."
                  id="broadcast-content"
                />
             </div>
             <Button 
               className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 font-semibold"
               onClick={() => {
                 const title = (document.getElementById('broadcast-title') as HTMLInputElement).value;
                 const content = (document.getElementById('broadcast-content') as HTMLTextAreaElement).value;
                 if (!title || !content) return;
                 
                 const notifications = db.getNotifications();
                 notifications.unshift({
                   id: Date.now().toString(),
                   userId: 'all',
                   title,
                   content,
                   timestamp: Date.now(),
                   read: false
                 });
                 db.setNotifications(notifications);
                 toast.success('Broadcast sent successfully');
                 (document.getElementById('broadcast-title') as HTMLInputElement).value = '';
                 (document.getElementById('broadcast-content') as HTMLTextAreaElement).value = '';
               }}
             >
               Send to Everyone
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};