import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Shield, BookOpen, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email);
      toast.success('Successfully logged in');
      navigate('/');
    } catch (error) {
      toast.error('User not found. Try admin1@uni.edu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">University Portal</CardTitle>
            <CardDescription className="text-slate-500">
              Sign in to manage student information
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">University Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@uni.edu"
                  className="pl-4 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 transition-all font-semibold shadow-md" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-xs text-slate-400">Demo Accounts:</p>
          <div className="flex flex-wrap justify-center gap-2">
             <button onClick={() => setEmail('admin1@uni.edu')} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] hover:bg-slate-50 transition-colors">Admin 1</button>
             <button onClick={() => setEmail('admin2@uni.edu')} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] hover:bg-slate-50 transition-colors">Admin 2</button>
             <button onClick={() => setEmail('john@uni.edu')} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] hover:bg-slate-50 transition-colors">Student</button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};