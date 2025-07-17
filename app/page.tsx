'use client';

import { useState, useEffect } from 'react';
import LoginPage from '@/components/auth/login-page';
import AdminDashboard from '@/components/admin-dashboard';
import StudentDashboard from '@/components/student-dashboard';
import { userStorage } from '@/lib/storage';
import { USER_ROLES } from '@/constants';
import type { User } from '@/types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = userStorage.get();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    userStorage.set(userData);
  };

  const handleLogout = () => {
    setUser(null);
    userStorage.remove();
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.role === USER_ROLES.ADMIN) {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  } else {
    return <StudentDashboard user={user} onLogout={handleLogout} />;
  }
}
