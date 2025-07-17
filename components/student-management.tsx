"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Mail, Calendar, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  email: string
  department: string
  startDate: string
  supervisor: string
  status: "active" | "inactive" | "completed"
}

interface StudentManagementProps {
  students: Student[]
}

export default function StudentManagement({ students: initialStudents }: StudentManagementProps) {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    supervisor: "",
    status: "active" as const,
  })

  const departments = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "UI/UX Design",
    "Database",
    "DevOps",
    "Mobile Development",
    "Data Science",
    "Quality Assurance",
  ]

  const supervisors = [
    "Sarah Johnson",
    "Mike Davis",
    "Emily Chen",
    "John Smith",
    "Lisa Wang",
    "David Brown",
    "Anna Martinez",
  ]

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      supervisor: "",
      status: "active",
    })
  }

  const handleAddStudent = () => {
    if (!formData.name || !formData.email || !formData.department || !formData.supervisor) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      supervisor: formData.supervisor,
      status: formData.status,
      startDate: new Date().toISOString().split("T")[0],
    }

    setStudents([...students, newStudent])
    resetForm()
    setIsAddDialogOpen(false)

    toast({
      title: "Student Added",
      description: `${newStudent.name} has been added successfully.`,
    })
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      email: student.email,
      department: student.department,
      supervisor: student.supervisor,
      status: student.status,
    })
  }

  const handleUpdateStudent = () => {
    if (!editingStudent) return

    const updatedStudents = students.map((student) =>
      student.id === editingStudent.id ? { ...student, ...formData } : student,
    )

    setStudents(updatedStudents)
    setEditingStudent(null)
    resetForm()

    toast({
      title: "Student Updated",
      description: `${formData.name}'s information has been updated.`,
    })
  }

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    setStudents(students.filter((s) => s.id !== studentId))

    toast({
      title: "Student Removed",
      description: `${student?.name} has been removed from the system.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "inactive":
        return "destructive"
      default:
        return "default"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>Manage intern students and their information</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter the details for the new intern student.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter student's full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supervisor">Supervisor *</Label>
                    <Select
                      value={formData.supervisor}
                      onValueChange={(value) => setFormData({ ...formData, supervisor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {supervisors.map((supervisor) => (
                          <SelectItem key={supervisor} value={supervisor}>
                            {supervisor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "inactive" | "completed") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddStudent}>Add Student</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Students List */}
      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-lg">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {student.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {student.supervisor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Started: {formatDate(student.startDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      {student.department}
                    </Badge>
                    <br />
                    <Badge variant={getStatusColor(student.status)}>{student.status}</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog
                      open={editingStudent?.id === student.id}
                      onOpenChange={(open) => !open && setEditingStudent(null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Student</DialogTitle>
                          <DialogDescription>Update the student's information.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-name">Full Name *</Label>
                            <Input
                              id="edit-name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-email">Email Address *</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-department">Department *</Label>
                            <Select
                              value={formData.department}
                              onValueChange={(value) => setFormData({ ...formData, department: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-supervisor">Supervisor *</Label>
                            <Select
                              value={formData.supervisor}
                              onValueChange={(value) => setFormData({ ...formData, supervisor: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {supervisors.map((supervisor) => (
                                  <SelectItem key={supervisor} value={supervisor}>
                                    {supervisor}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                              value={formData.status}
                              onValueChange={(value: "active" | "inactive" | "completed") =>
                                setFormData({ ...formData, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingStudent(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleUpdateStudent}>Update Student</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.status === "active").length}
              </div>
              <p className="text-sm text-gray-600">Active Students</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {students.filter((s) => s.status === "completed").length}
              </div>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{students.length}</div>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
