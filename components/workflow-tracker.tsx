"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Circle, Clock, Target, Calendar, Users } from "lucide-react"
import { workflowService, Workflow as ServiceWorkflow, WorkflowTask as ServiceWorkflowTask } from "@/services/workflow.service"

interface WorkflowTask {
  id: string
  title: string
  type: "video" | "quiz"
  completed: boolean
  score?: number
  totalQuestions?: number
  duration?: string
}

interface Workflow {
  id: string
  title: string
  description: string
  category: string
  status: "not-started" | "in-progress" | "completed"
  dueDate: string
  assignedBy: string
  tasks: WorkflowTask[]
  completedTasks: number
  totalTasks: number
}

interface WorkflowTrackerProps {
  selectedStudent: string
  students: Array<{
    id: string
    name: string
    email: string
    department: string
    startDate: string
    supervisor: string
    status: "active" | "inactive" | "completed"
  }>
}

export default function WorkflowTracker({ selectedStudent, students }: WorkflowTrackerProps) {
  const [activeTab, setActiveTab] = useState("active")
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true)
        const userId = selectedStudent === "all" ? undefined : selectedStudent
        const response = await workflowService.getWorkflows(userId)
        setWorkflows(response.workflows || [])
      } catch (error) {
        console.error('Failed to fetch workflows:', error)
        setWorkflows([])
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [selectedStudent])

  const currentStudent = selectedStudent === "all" ? null : students.find((s) => s.id === selectedStudent)
  const isAllStudents = selectedStudent === "all"

  const activeWorkflows = workflows.filter((w) => w.status === "in-progress")
  const upcomingWorkflows = workflows.filter((w) => w.status === "not-started")
  const completedWorkflows = workflows.filter((w) => w.status === "completed")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "not-started":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      case "not-started":
        return "Not Started"
      default:
        return "Unknown"
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      frontend: "Frontend Development",
      backend: "Backend Development",
      database: "Database",
      devops: "DevOps",
      design: "UI/UX Design",
      other: "Other",
    }
    return labels[category] || category
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const WorkflowCard = ({ workflow }: { workflow: Workflow }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{workflow.title}</CardTitle>
            <CardDescription className="mt-1">{workflow.description}</CardDescription>
          </div>
          <Badge variant="secondary" className={`${getStatusColor(workflow.status)} text-white`}>
            {getStatusLabel(workflow.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {getCategoryLabel(workflow.category)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Due: {formatDate(workflow.dueDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {workflow.assignedBy}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>
                {workflow.completedTasks}/{workflow.totalTasks} tasks completed
              </span>
            </div>
            <Progress value={(workflow.completedTasks / workflow.totalTasks) * 100} />
          </div>

          {workflow.status === "in-progress" && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Upcoming Tasks:</h4>
              {workflow.tasks
                .filter((task) => !task.completed)
                .slice(0, 3)
                .map((task) => (
                  <div key={task.id} className="flex items-center gap-2 text-sm">
                    <Circle className="w-4 h-4 text-gray-400" />
                    <span>{task.title}</span>
                    <Badge variant="outline">
                      {task.type}
                    </Badge>
                  </div>
                ))}
            </div>
          )}

          {workflow.status === "not-started" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {getDaysUntilDue(workflow.dueDate) > 0
                  ? `${getDaysUntilDue(workflow.dueDate)} days until due date`
                  : "Due date has passed"}
              </span>
            </div>
          )}

          {workflow.status === "completed" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>All tasks completed successfully</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Learning Workflows</CardTitle>
          <CardDescription>
            {isAllStudents
              ? "Track learning paths for all students"
              : `Track assigned learning paths for ${currentStudent?.name || "selected student"}`}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeWorkflows.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingWorkflows.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedWorkflows.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeWorkflows.length > 0 ? (
            activeWorkflows.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No active workflows at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingWorkflows.length > 0 ? (
            upcomingWorkflows.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No upcoming workflows scheduled.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedWorkflows.length > 0 ? (
            completedWorkflows.map((workflow) => <WorkflowCard key={workflow.id} workflow={workflow} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No completed workflows yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
