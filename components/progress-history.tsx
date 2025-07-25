"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Video, FileText, TrendingUp, Filter } from "lucide-react"
import { progressService, ProgressEntry } from "@/services/progress.service"

interface HistoryEntry {
  id: string
  date: string
  type: "video" | "quiz"
  title: string
  category: string
  duration?: string
  score?: number
  totalQuestions?: number
  studentName?: string
}

interface ProgressHistoryProps {
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

export default function ProgressHistory({ selectedStudent, students }: ProgressHistoryProps) {
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [historyData, setHistoryData] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true)
        const userId = selectedStudent === "all" ? undefined : selectedStudent
        const response = await progressService.getProgressData(userId)
        setHistoryData(response.progressData || [])
      } catch (error) {
        console.error('Failed to fetch progress data:', error)
        setHistoryData([])
      } finally {
        setLoading(false)
      }
    }

    fetchProgressData()
  }, [selectedStudent])

  const currentStudent = selectedStudent === "all" ? null : students.find((s) => s.id === selectedStudent)
  const isAllStudents = selectedStudent === "all"

  const filteredHistory = historyData.filter((entry) => {
    const typeMatch = filterType === "all" || entry.type === filterType
    const categoryMatch = filterCategory === "all" || entry.category === filterCategory
    return typeMatch && categoryMatch
  })

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
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Learning Progress History</CardTitle>
          <CardDescription>
            {isAllStudents
              ? "View learning history for all students"
              : `View learning history for ${currentStudent?.name || "selected student"}`}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="video">Videos Only</SelectItem>
                  <SelectItem value="quiz">Quizzes Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="frontend">Frontend Development</SelectItem>
                  <SelectItem value="backend">Backend Development</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="design">UI/UX Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>Showing {filteredHistory.length} activities</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-4">
            {filteredHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {entry.type === "video" ? (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Video className="w-5 h-5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{entry.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{getCategoryLabel(entry.category)}</Badge>
                      {isAllStudents && entry.studentName && <Badge variant="secondary">{entry.studentName}</Badge>}
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(entry.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {entry.type === "video" ? (
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">{entry.duration}</div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <div className={`font-medium ${getScoreColor(entry.score!, entry.totalQuestions!)}`}>
                        {entry.score}/{entry.totalQuestions}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((entry.score! / entry.totalQuestions!) * 100)}% Score
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold">{filteredHistory.filter((h) => h.type === "video").length}</p>
              </div>
              <Video className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold">{filteredHistory.filter((h) => h.type === "quiz").length}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    filteredHistory
                      .filter((h) => h.type === "quiz")
                      .reduce((acc, quiz) => acc + (quiz.score! / quiz.totalQuestions!) * 100, 0) /
                      filteredHistory.filter((h) => h.type === "quiz").length,
                  )}
                  %
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
