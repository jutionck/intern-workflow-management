'use client';

import React from 'react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, GraduationCap, Shield } from 'lucide-react';
import { useForm } from '@/hooks/use-form';
import { validateEmail, validatePassword } from '@/lib/validations';
import { USER_ROLES } from '@/constants';
import type { LoginPageProps, LoginCredentials } from '@/types';

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');

  // Form for admin login
  const adminForm = useForm<LoginCredentials>({
    initialData: { email: '', password: '' },
    validators: {
      email: validateEmail,
      password: validatePassword,
    },
    onSubmit: handleAdminLogin,
  });

  // Form for student login
  const studentForm = useForm<LoginCredentials>({
    initialData: { email: '', password: '' },
    validators: {
      email: validateEmail,
      password: validatePassword,
    },
    onSubmit: handleStudentLogin,
  });

  async function handleAdminLogin(credentials: LoginCredentials) {
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role !== USER_ROLES.ADMIN) {
        throw new Error('Access denied. Admin credentials required.');
      }

      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      setError(errorMessage);
      throw error;
    }
  }

  async function handleStudentLogin(credentials: LoginCredentials) {
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.user.role !== USER_ROLES.STUDENT) {
        throw new Error('Access denied. Student credentials required.');
      }

      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
      setError(errorMessage);
      throw error;
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <GraduationCap className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Intern Learning Portal
          </h1>
          <p className='text-gray-600 mt-2'>Sign in to access your dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='student' className='space-y-4'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger
                  value='student'
                  className='flex items-center gap-2'
                >
                  <GraduationCap className='w-4 h-4' />
                  Student
                </TabsTrigger>
                <TabsTrigger value='admin' className='flex items-center gap-2'>
                  <Shield className='w-4 h-4' />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value='student'>
                <form onSubmit={studentForm.handleSubmit} className='space-y-4'>
                  <div>
                    <Label htmlFor='student-email'>Email</Label>
                    <Input
                      id='student-email'
                      type='email'
                      value={studentForm.formState.data.email}
                      onChange={(e) =>
                        studentForm.handleChange('email', e.target.value)
                      }
                      placeholder='Enter your email'
                      required
                    />
                    {studentForm.formState.errors.email && (
                      <p className='text-sm text-red-600 mt-1'>
                        {studentForm.formState.errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='student-password'>Password</Label>
                    <div className='relative'>
                      <Input
                        id='student-password'
                        type={showPassword ? 'text' : 'password'}
                        value={studentForm.formState.data.password}
                        onChange={(e) =>
                          studentForm.handleChange('password', e.target.value)
                        }
                        placeholder='Enter your password'
                        required
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    {studentForm.formState.errors.password && (
                      <p className='text-sm text-red-600 mt-1'>
                        {studentForm.formState.errors.password}
                      </p>
                    )}
                  </div>

                  {error && (
                    <Alert variant='destructive'>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type='submit' 
                    className='w-full' 
                    disabled={studentForm.formState.isSubmitting}
                  >
                    {studentForm.formState.isSubmitting ? 'Signing in...' : 'Sign In as Student'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value='admin'>
                <form onSubmit={adminForm.handleSubmit} className='space-y-4'>
                  <div>
                    <Label htmlFor='admin-email'>Email</Label>
                    <Input
                      id='admin-email'
                      type='email'
                      value={adminForm.formState.data.email}
                      onChange={(e) =>
                        adminForm.handleChange('email', e.target.value)
                      }
                      placeholder='Enter your email'
                      required
                    />
                    {adminForm.formState.errors.email && (
                      <p className='text-sm text-red-600 mt-1'>
                        {adminForm.formState.errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor='admin-password'>Password</Label>
                    <div className='relative'>
                      <Input
                        id='admin-password'
                        type={showPassword ? 'text' : 'password'}
                        value={adminForm.formState.data.password}
                        onChange={(e) =>
                          adminForm.handleChange('password', e.target.value)
                        }
                        placeholder='Enter your password'
                        required
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                    {adminForm.formState.errors.password && (
                      <p className='text-sm text-red-600 mt-1'>
                        {adminForm.formState.errors.password}
                      </p>
                    )}
                  </div>

                  {error && (
                    <Alert variant='destructive'>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type='submit' 
                    className='w-full' 
                    disabled={adminForm.formState.isSubmitting}
                  >
                    {adminForm.formState.isSubmitting ? 'Signing in...' : 'Sign In as Admin'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
