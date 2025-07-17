"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/auth/login-page"
import AdminDashboard from "@/components/admin-dashboard"
import StudentDashboard from "@/components/student-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Video, FileText, TrendingUp, Clock, Users } from "lucide-react"
import DailyReportForm from "@/components/daily-report-form"
import ProgressHistory from "@/components/progress-history"
import WorkflowTracker from "@/components/workflow-tracker"
import StudentManagement from "@/components/student-management"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "student"
  department?: string
  supervisor?: string
  status?: "active" | "inactive" | "completed"
}

interface Student {
  id: string
  name: string
  email: string
  department: string
  startDate: string
  supervisor: string
  status: "active" | "inactive" | "completed"
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStudent, setSelectedStudent] = useState<string>("all")

  // Mock students data
  const students: Student[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Frontend Development",
      startDate: "2025-01-01",
      supervisor: "Sarah Johnson",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "Backend Development",
      startDate: "2025-01-01",
      supervisor: "Mike Davis",
      status: "active",
    },
    {
      id: "3",
      name: "Alex Johnson",
      email: "alex.johnson@company.com",
      department: "UI/UX Design",
      startDate: "2024-12-15",
      supervisor: "Emily Chen",
      status: "active",
    },
    {
      id: "4",
      name: "Maria Garcia",
      email: "maria.garcia@company.com",
      department: "Database",
      startDate: "2024-12-01",
      supervisor: "John Smith",
      status: "completed",
    },
  ]

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const getStatsForStudent = (studentId: string) => {
    if (studentId === "all") {
      return {
        videosWatched: 15,
        quizzesCompleted: 12,
        averageScore: 87,
        timeSpent: "18.5 hours",
        activeStudents: students.filter((s) => s.status === "active").length,
        completedStudents: students.filter((s) => s.status === "completed").length,
      }
    } else {
      // Individual student stats
      return {
        videosWatched: 3,
        quizzesCompleted: 2,
        averageScore: 85,
        timeSpent: "4.5 hours",
        activeStudents: 1,
        completedStudents: 0,
      }
    }
  }

  const currentStats = getStatsForStudent(selectedStudent)
  const isAllStudents = selectedStudent === "all"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (user.role === "admin") {
    return (
      <AdminDashboard user={user} onLogout={handleLogout}>
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Intern Learning Management</h1>
                  <p className="text-gray-600 mt-2">
                    {isAllStudents
                      ? `Managing ${students.length} intern students`
                      : `Tracking progress for ${students.find((s) => s.id === selectedStudent)?.name}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students Overview</SelectItem>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - {student.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="daily-report">Daily Report</TabsTrigger>
                <TabsTrigger value="progress">Progress History</TabsTrigger>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {isAllStudents ? "Total Videos" : "Videos Watched"}
                      </CardTitle>
                      <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentStats.videosWatched}</div>
                      <p className="text-xs text-muted-foreground">{isAllStudents ? "All students" : "Today"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {isAllStudents ? "Total Quizzes" : "Quizzes Completed"}
                      </CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentStats.quizzesCompleted}</div>
                      <p className="text-xs text-muted-foreground">{isAllStudents ? "All students" : "Today"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{currentStats.averageScore}%</div>
                      <p className="text-xs text-muted-foreground">{isAllStudents ? "All students" : "This week"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {isAllStudents ? "Active Students" : "Time Spent"}
                      </CardTitle>
                      {isAllStudents ? (
                        <Users className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isAllStudents ? currentStats.activeStudents : currentStats.timeSpent}
                      </div>
                      <p className="text-xs text-muted-foreground">{isAllStudents ? "Currently active" : "Today"}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Students Overview Table (when "All Students" is selected) */}
                {isAllStudents && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Students Overview</CardTitle>
                      <CardDescription>Current status of all intern students</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {students.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-medium">{student.name}</h3>
                                <p className="text-sm text-gray-500">{student.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-medium">{student.department}</p>
                                <p className="text-xs text-gray-500">Supervisor: {student.supervisor}</p>
                              </div>
                              <Badge
                                variant={
                                  student.status === "active"
                                    ? "default"
                                    : student.status === "completed"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {student.status}
                              </Badge>
                              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student.id)}>
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Individual Student Progress (when specific student is selected) */}
                {!isAllStudents && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Weekly Video Progress</CardTitle>
                        <CardDescription>12 of 15 videos completed</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Progress value={80} className="mb-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress: 80%</span>
                          <span>3 remaining</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Weekly Quiz Progress</CardTitle>
                        <CardDescription>8 of 10 quizzes completed</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Progress value={80} className="mb-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress: 80%</span>
                          <span>2 remaining</span>
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
                        ? "Latest activities from all students"
                        : "Your latest learning activities from Enigma LMS"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {isAllStudents ? "John Doe completed" : "Completed"} Quiz: JavaScript Fundamentals
                          </p>
                          <p className="text-xs text-muted-foreground">Score: 92% • 2 hours ago</p>
                        </div>
                        <Badge variant="secondary">Quiz</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {isAllStudents ? "Jane Smith watched" : "Watched"}: React Components Deep Dive
                          </p>
                          <p className="text-xs text-muted-foreground">Duration: 45 minutes • 3 hours ago</p>
                        </div>
                        <Badge variant="outline">Video</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {isAllStudents ? "Alex Johnson completed" : "Completed"} Quiz: HTML & CSS Basics
                          </p>
                          <p className="text-xs text-muted-foreground">Score: 88% • 5 hours ago</p>
                        </div>
                        <Badge variant="secondary">Quiz</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students">
                <StudentManagement students={students} />
              </TabsContent>

              <TabsContent value="daily-report">
                <DailyReportForm selectedStudent={selectedStudent} students={students} />
              </TabsContent>

              <TabsContent value="progress">
                <ProgressHistory selectedStudent={selectedStudent} students={students} />
              </TabsContent>

              <TabsContent value="workflows">
                <WorkflowTracker selectedStudent={selectedStudent} students={students} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AdminDashboard>
    )
  } else {
    return <StudentDashboard user={user} onLogout={handleLogout} />
  }
}
