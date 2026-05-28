import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Course, TimetableEntry } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Upload, CheckCircle, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const Timetable: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    setTimetable(db.getTimetable());
  }, []);

  const handleParse = () => {
    try {
      const lines = rawText.split(String.fromCharCode(10)).filter(l => l.trim());
      const entries: TimetableEntry[] = lines.map(line => {
        const [code, venue, time] = line.split(',').map(s => s.trim());
        if (!code || !venue || !time) throw new Error('Invalid format');
        return { courseCode: code, venue, time };
      });

      setTimetable(entries);
      db.setTimetable(entries);
      
      const courses = db.getCourses();
      entries.forEach(entry => {
        const idx = courses.findIndex(c => c.code === entry.courseCode);
        if (idx !== -1) {
          courses[idx].venue = entry.venue;
          courses[idx].time = entry.time;
        }
      });
      db.setCourses(courses);
      
      toast.success(`Successfully parsed ${entries.length} timetable entries`);
      setRawText('');
    } catch (e) {
      toast.error('Parsing failed. Use format: CS101, Hall A, Mon 08:00');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Timetable Management</h1>
        <p className="text-slate-500">Upload and sync course venues and schedules</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-slate-200">
          <CardHeader>
            <CardTitle>Bulk Upload</CardTitle>
            <CardDescription>Paste CSV data (Code, Venue, Time)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder={"CS101, Hall A, Mon 08:00 | MATH101, Room 302, Tue 10:00"} 
              className="h-64 font-mono text-xs"
              value={rawText}
              onChange={e => setRawText(e.target.value)}
            />
            <Button className="w-full bg-indigo-600" onClick={handleParse}>
              <Upload className="w-4 h-4 mr-2" />
              Sync Schedules
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-slate-200">
           <CardHeader>
             <CardTitle>Current Master Schedule</CardTitle>
             <CardDescription>Live venue and time mappings</CardDescription>
           </CardHeader>
           <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timetable.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                         No schedule data uploaded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    timetable.map((entry, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-bold">{entry.courseCode}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {entry.venue}
                          </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {entry.time}
                          </div>
                        </TableCell>
                        <TableCell>
                           <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
           </CardContent>
        </Card>
      </div>
    </div>
  );
};