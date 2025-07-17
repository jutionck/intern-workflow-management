'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StudentService } from '@/services/student.service';
import { User as UserType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Video,
  FileText,
  TrendingUp,
  Clock,
  Users,
  LogOut,
  Settings,
} from 'lucide-react';
import DailyReportForm from '@/components/daily-report-form';
import ProgressHistory from '@/components/progress-history';
import WorkflowTracker from '@/components/workflow-tracker';
import StudentManagement from '@/components/student-management';
import ReportGenerator from '@/components/report-generator';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  department?: string;
  supervisor?: string;
  status?: 'active' | 'inactive' | 'completed';
}

interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  startDate: string;
  supervisor: string;
  status: 'active' | 'inactive' | 'completed';
  stats?: {
    videosWatched: number;
    quizzesCompleted: number;
    averageScore: number;
  };
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({
  user,
  onLogout,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const students = await StudentService.getStudents();
        const studentData = students.map((student: any) => ({
          id: student.id,
          name: student.name,
          email: student.email,
          department: student.department || 'Not specified',
          startDate: student.startDate || new Date().toISOString().split('T')[0],
          supervisor: student.supervisor || 'Not assigned',
          status: student.status as 'active' | 'inactive' | 'completed'
        }));
        setStudents(studentData);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getStatsForStudent = (studentId: string) => {
    if (studentId === 'all') {
      return {
        videosWatched: students.reduce((total, student) => total + (student.stats?.videosWatched || 0), 0),
        quizzesCompleted: students.reduce((total, student) => total + (student.stats?.quizzesCompleted || 0), 0),
        averageScore: students.length > 0 ? Math.round(students.reduce((total, student) => total + (student.stats?.averageScore || 0), 0) / students.length) : 0,
        timeSpent: '0 hours',
        activeStudents: students.filter((s) => s.status === 'active').length,
        completedStudents: students.filter((s) => s.status === 'completed').length,
      };
    } else {
      const student = students.find((s) => s.id === studentId);
      return {
        videosWatched: student?.stats?.videosWatched || 0,
        quizzesCompleted: student?.stats?.quizzesCompleted || 0,
        averageScore: student?.stats?.averageScore || 0,
        timeSpent: '0 hours',
        activeStudents: 1,
        completedStudents: 0,
      };
    }
  };

  const currentStats = getStatsForStudent(selectedStudent);
  const isAllStudents = selectedStudent === 'all';

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-7xl mx-auto'>
        <header className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Admin Dashboard
              </h1>
              <p className='text-gray-600 mt-2'>
                Welcome back, {user.name} •{' '}
                {isAllStudents
                  ? `Managing ${students.length} intern students`
                  : `Viewing ${
                      students.find((s) => s.id === selectedStudent)?.name
                    }`}
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
              >
                <SelectTrigger className='w-64'>
                  <SelectValue placeholder='Select student' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Students Overview</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant='outline' size='sm'>
                <Settings className='w-4 h-4 mr-2' />
                Settings
              </Button>
              <Button variant='outline' size='sm' onClick={onLogout}>
                <LogOut className='w-4 h-4 mr-2' />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-6'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='students'>Students</TabsTrigger>
            <TabsTrigger value='daily-report'>Daily Report</TabsTrigger>
            <TabsTrigger value='progress'>Progress History</TabsTrigger>
            <TabsTrigger value='workflows'>Workflows</TabsTrigger>
            <TabsTrigger value='reports'>Reports</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            {/* Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {isAllStudents ? 'Total Videos' : 'Videos Watched'}
                  </CardTitle>
                  <Video className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {currentStats.videosWatched}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {isAllStudents ? 'All students' : 'Today'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {isAllStudents ? 'Total Quizzes' : 'Quizzes Completed'}
                  </CardTitle>
                  <FileText className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {currentStats.quizzesCompleted}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {isAllStudents ? 'All students' : 'Today'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Average Score
                  </CardTitle>
                  <TrendingUp className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {currentStats.averageScore}%
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {isAllStudents ? 'All students' : 'This week'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {isAllStudents ? 'Active Students' : 'Time Spent'}
                  </CardTitle>
                  {isAllStudents ? (
                    <Users className='h-4 w-4 text-muted-foreground' />
                  ) : (
                    <Clock className='h-4 w-4 text-muted-foreground' />
                  )}
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {isAllStudents
                      ? currentStats.activeStudents
                      : currentStats.timeSpent}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {isAllStudents ? 'Currently active' : 'Today'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Students Overview Table (when "All Students" is selected) */}
            {isAllStudents && (
              <Card>
                <CardHeader>
                  <CardTitle>Students Overview</CardTitle>
                  <CardDescription>
                    Current status of all intern students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading students...
                    </div>
                  ) : students.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No students found. Students will appear here after registration.
                    </div>
                  ) : (
                    <div className='space-y-4'>
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'
                      >
                        <div className='flex items-center space-x-4'>
                          <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                            <span className='text-blue-600 font-medium'>
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className='font-medium'>{student.name}</h3>
                            <p className='text-sm text-gray-500'>
                              {student.email}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center space-x-4'>
                          <div className='text-right'>
                            <p className='text-sm font-medium'>
                              {student.department}
                            </p>
                            <p className='text-xs text-gray-500'>
                              Supervisor: {student.supervisor}
                            </p>
                          </div>
                          <Badge
                            variant={
                              student.status === 'active'
                                ? 'default'
                                : student.status === 'completed'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {student.status}
                          </Badge>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => setSelectedStudent(student.id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Individual Student Progress (when specific student is selected) */}
            {!isAllStudents && (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Video Progress</CardTitle>
                    <CardDescription>
                      {currentStats.videosWatched} videos completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={0} className='mb-2' />
                    <div className='flex justify-between text-sm text-muted-foreground'>
                      <span>Progress: 0%</span>
                      <span>No data available</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Quiz Progress</CardTitle>
                    <CardDescription>
                      {currentStats.quizzesCompleted} quizzes completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={0} className='mb-2' />
                    <div className='flex justify-between text-sm text-muted-foreground'>
                      <span>Progress: 0%</span>
                      <span>No data available</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  {isAllStudents
                    ? 'Latest activities from all students'
                    : 'Latest activities from selected student'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading recent activities...
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent activities available. Activities will appear here when students submit daily reports.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='students'>
            <StudentManagement students={students} />
          </TabsContent>

          <TabsContent value='daily-report'>
            <DailyReportForm
              selectedStudent={selectedStudent}
              students={students}
            />
          </TabsContent>

          <TabsContent value='progress'>
            <ProgressHistory
              selectedStudent={selectedStudent}
              students={students}
            />
          </TabsContent>

          <TabsContent value='workflows'>
            <WorkflowTracker
              selectedStudent={selectedStudent}
              students={students}
            />
          </TabsContent>

          <TabsContent value='reports'>
            <ReportGenerator students={students} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
