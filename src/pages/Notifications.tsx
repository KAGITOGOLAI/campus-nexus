import React from 'react';
import { db } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Bell, Clock, Info, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState(db.getNotifications());

  const userNotifications = notifications.filter(n => n.userId === 'all' || n.userId === user?.id);

  const markAllRead = () => {
    const updated = notifications.map(n => 
      (n.userId === 'all' || n.userId === user?.id) ? { ...n, read: true } : n
    );
    db.setNotifications(updated);
    setNotifications(updated);
    toast.success('All notifications marked as read');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500">Stay updated with university announcements</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          Mark all as read
        </Button>
      </header>

      <div className="space-y-4">
        {userNotifications.length === 0 ? (
          <Card className="border-dashed border-slate-200 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400">
               <Bell className="w-12 h-12 mb-4 opacity-10" />
               <p>No notifications found</p>
            </CardContent>
          </Card>
        ) : (
          userNotifications.sort((a, b) => b.timestamp - a.timestamp).map((n) => (
            <Card key={n.id} className={`border-slate-200 transition-all ${!n.read ? 'border-l-4 border-l-indigo-500 shadow-md' : 'opacity-80'}`}>
              <CardContent className="p-5 flex gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!n.read ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                  {n.title.toLowerCase().includes('welcome') ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h3>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(n.timestamp, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{n.content}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};