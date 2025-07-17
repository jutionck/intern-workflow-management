"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Video, FileText, TrendingUp, Clock, LogOut, User } from "lucide-react"
import DailyReportForm from "@/components/daily-report-form"
import ProgressHistory from "@/components/progress-history"
import WorkflowTracker from "@/components/workflow-tracker"

interface StudentDashboardProps {
  user: {
    id: string
    email: string
    name: string
    role: "admin" | "student"
    department?: string
    supervisor?: string
    status?: "active" | "inactive" | "completed"
  }
  onLogout: () => void
}

export default function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data for student dashboard
  const todayStats = {
    videosWatched: 3,
    quizzesCompleted: 2,
    averageScore: 85,
    timeSpent: "4.5 hours",
  }

  const weeklyProgress = {
    videosTarget: 15,
    videosCompleted: 12,
    quizzesTarget: 10,
    quizzesCompleted: 8,
  }

  // Create a mock students array with just the current user for compatibility
  const students = [
    {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department || "Unknown",
      startDate: "2025-01-01",
      supervisor: user.supervisor || "Unknown",
      status: user.status || "active",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user.name} • {user.department} • Supervisor: {user.supervisor}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="daily-report">Daily Report</TabsTrigger>
            <TabsTrigger value="progress">Progress History</TabsTrigger>
            <TabsTrigger value="workflows">My Workflows</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Today's Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Videos Watched</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayStats.videosWatched}</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayStats.quizzesCompleted}</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayStats.averageScore}%</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayStats.timeSpent}</div>
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Video Progress</CardTitle>
                  <CardDescription>
                    {weeklyProgress.videosCompleted} of {weeklyProgress.videosTarget} videos completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={(weeklyProgress.videosCompleted / weeklyProgress.videosTarget) * 100}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Progress: {Math.round((weeklyProgress.videosCompleted / weeklyProgress.videosTarget) * 100)}%
                    </span>
                    <span>{weeklyProgress.videosTarget - weeklyProgress.videosCompleted} remaining</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Quiz Progress</CardTitle>
                  <CardDescription>
                    {weeklyProgress.quizzesCompleted} of {weeklyProgress.quizzesTarget} quizzes completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={(weeklyProgress.quizzesCompleted / weeklyProgress.quizzesTarget) * 100}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Progress: {Math.round((weeklyProgress.quizzesCompleted / weeklyProgress.quizzesTarget) * 100)}%
                    </span>
                    <span>{weeklyProgress.quizzesTarget - weeklyProgress.quizzesCompleted} remaining</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>My Recent Activities</CardTitle>
                <CardDescription>Your latest learning activities from Enigma LMS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed Quiz: JavaScript Fundamentals</p>
                      <p className="text-xs text-muted-foreground">Score: 92% • 2 hours ago</p>
                    </div>
                    <Badge variant="secondary">Quiz</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Watched: React Components Deep Dive</p>
                      <p className="text-xs text-muted-foreground">Duration: 45 minutes • 3 hours ago</p>
                    </div>
                    <Badge variant="outline">Video</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Completed Quiz: HTML & CSS Basics</p>
                      <p className="text-xs text-muted-foreground">Score: 88% • 5 hours ago</p>
                    </div>
                    <Badge variant="secondary">Quiz</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Your internship information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Department</p>
                    <p className="text-lg">{user.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Supervisor</p>
                    <p className="text-lg">{user.supervisor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "completed" ? "secondary" : "destructive"
                      }
                    >
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily-report">
            <DailyReportForm selectedStudent={user.id} students={students} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressHistory selectedStudent={user.id} students={students} />
          </TabsContent>

          <TabsContent value="workflows">
            <WorkflowTracker selectedStudent={user.id} students={students} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
