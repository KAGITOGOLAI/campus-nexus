import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { User, Message } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Send, Search, MoreVertical, Paperclip } from 'lucide-react';
import { format } from 'date-fns';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsers(db.getUsers().filter(u => u.id !== user?.id));
    setMessages(db.getMessages());
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedContact]);

  const conversation = messages.filter(m => 
    (m.senderId === user?.id && m.receiverId === selectedContact?.id) ||
    (m.senderId === selectedContact?.id && m.receiverId === user?.id)
  );

  const handleSend = () => {
    if (!newMessage.trim() || !selectedContact || !user) return;

    const msg: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedContact.id,
      content: newMessage,
      timestamp: Date.now()
    };

    const updated = [...messages, msg];
    setMessages(updated);
    db.setMessages(updated);
    setNewMessage('');
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchContact.toLowerCase()));

  return (
    <div className="h-[calc(100vh-140px)] flex gap-4">
      {/* Contacts List */}
      <Card className="w-80 flex flex-col border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <Input 
               placeholder="Search contacts..." 
               className="pl-9 h-10 bg-slate-50 border-none"
               value={searchContact}
               onChange={e => setSearchContact(e.target.value)}
             />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedContact(u)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  selectedContact?.id === u.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Avatar className="w-10 h-10">
                   <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} />
                   <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-left flex-1 min-w-0">
                   <p className="font-bold text-sm truncate">{u.name}</p>
                   <p className="text-xs text-slate-400 truncate">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col border-slate-200 overflow-hidden">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-slate-100">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContact.id}`} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-slate-900">{selectedContact.name}</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400">
                 <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 bg-slate-50/50 p-6 overflow-y-auto" ref={scrollRef}>
              <div className="space-y-6 max-w-4xl mx-auto">
                {conversation.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 pt-20">
                     <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                     <p>No messages yet. Say hello!</p>
                  </div>
                ) : (
                  conversation.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                           <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                             isMe 
                               ? 'bg-indigo-600 text-white rounded-tr-none' 
                               : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                           }`}>
                             {msg.content}
                           </div>
                           <span className="text-[10px] text-slate-400 font-medium px-1">
                             {format(msg.timestamp, 'HH:mm')}
                           </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="max-w-4xl mx-auto flex gap-2">
                <Button variant="ghost" size="icon" className="text-slate-400 shrink-0">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input 
                  placeholder="Type a message..." 
                  className="flex-1 h-11 bg-slate-50 border-none"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button className="bg-indigo-600 h-11 px-6 font-semibold shrink-0" onClick={handleSend}>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
                <MessageSquare className="w-10 h-10 text-indigo-500 opacity-20" />
             </div>
             <p className="font-medium">Select a contact to start messaging</p>
          </div>
        )}
      </Card>
    </div>
  );
};

const MessageSquare = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);