"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, GraduationCap, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "student"
  department?: string
  supervisor?: string
  status?: "active" | "inactive" | "completed"
}

interface LoginPageProps {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form states
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
  })

  const [studentForm, setStudentForm] = useState({
    email: "",
    password: "",
  })

  // Mock user data
  const mockUsers = {
    admins: [
      {
        id: "admin1",
        email: "admin@company.com",
        password: "admin123",
        name: "System Administrator",
        role: "admin" as const,
      },
      {
        id: "admin2",
        email: "supervisor@company.com",
        password: "super123",
        name: "Sarah Johnson",
        role: "admin" as const,
      },
    ],
    students: [
      {
        id: "student1",
        email: "john.doe@company.com",
        password: "student123",
        name: "John Doe",
        role: "student" as const,
        department: "Frontend Development",
        supervisor: "Sarah Johnson",
        status: "active" as const,
      },
      {
        id: "student2",
        email: "jane.smith@company.com",
        password: "student123",
        name: "Jane Smith",
        role: "student" as const,
        department: "Backend Development",
        supervisor: "Mike Davis",
        status: "active" as const,
      },
      {
        id: "student3",
        email: "alex.johnson@company.com",
        password: "student123",
        name: "Alex Johnson",
        role: "student" as const,
        department: "UI/UX Design",
        supervisor: "Emily Chen",
        status: "active" as const,
      },
    ],
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const admin = mockUsers.admins.find((a) => a.email === adminForm.email && a.password === adminForm.password)

    if (admin) {
      const { password, ...userWithoutPassword } = admin
      onLogin(userWithoutPassword)
      toast({
        title: "Login Successful",
        description: `Welcome back, ${admin.name}!`,
      })
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const student = mockUsers.students.find((s) => s.email === studentForm.email && s.password === studentForm.password)

    if (student) {
      if (student.status === "inactive") {
        setError("Your account is inactive. Please contact your supervisor.")
        setIsLoading(false)
        return
      }

      const { password, ...userWithoutPassword } = student
      onLogin(userWithoutPassword)
      toast({
        title: "Login Successful",
        description: `Welcome back, ${student.name}!`,
      })
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

  const fillDemoCredentials = (type: "admin" | "student") => {
    if (type === "admin") {
      setAdminForm({
        email: "admin@company.com",
        password: "admin123",
      })
    } else {
      setStudentForm({
        email: "john.doe@company.com",
        password: "student123",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Intern Learning Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose your account type to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showPassword ? "text" : "password"}
                        value={studentForm.password}
                        onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Student"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => fillDemoCredentials("student")}
                  >
                    Use Demo Credentials
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In as Admin"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => fillDemoCredentials("admin")}
                  >
                    Use Demo Credentials
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Demo Credentials:</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  <strong>Admin:</strong> admin@company.com / admin123
                </div>
                <div>
                  <strong>Student:</strong> john.doe@company.com / student123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
