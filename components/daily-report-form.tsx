"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, FileText, Plus, Trash2, X, Save } from "lucide-react"
import { dailyReportService, VideoEntry as ServiceVideoEntry, QuizEntry as ServiceQuizEntry } from "@/services/daily-report.service"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  value: string
}

interface VideoEntry {
  id: string
  title: string
  duration: string
  category: string
}

interface QuizEntry {
  id: string
  title: string
  score: number
  totalQuestions: number
  category: string
}

interface DailyReportFormProps {
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

export default function DailyReportForm({ selectedStudent, students }: DailyReportFormProps) {
  const { toast } = useToast()
  const [videos, setVideos] = useState<VideoEntry[]>([])
  const [quizzes, setQuizzes] = useState<QuizEntry[]>([])
  const [notes, setNotes] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [videoTitle, setVideoTitle] = useState("")
  const [videoDuration, setVideoDuration] = useState("")
  const [videoCategory, setVideoCategory] = useState("")

  const [quizTitle, setQuizTitle] = useState("")
  const [quizScore, setQuizScore] = useState("")
  const [quizTotal, setQuizTotal] = useState("")
  const [quizCategory, setQuizCategory] = useState("")

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        } else {
          // Fallback categories if API fails
          setCategories([
            { id: '1', name: 'Frontend Development', value: 'frontend' },
            { id: '2', name: 'Backend Development', value: 'backend' },
            { id: '3', name: 'Database', value: 'database' },
            { id: '4', name: 'DevOps', value: 'devops' },
            { id: '5', name: 'UI/UX Design', value: 'design' },
            { id: '6', name: 'Other', value: 'other' }
          ])
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
        // Set fallback categories
        setCategories([
          { id: '1', name: 'Frontend Development', value: 'frontend' },
          { id: '2', name: 'Backend Development', value: 'backend' },
          { id: '3', name: 'Database', value: 'database' },
          { id: '4', name: 'DevOps', value: 'devops' },
          { id: '5', name: 'UI/UX Design', value: 'design' },
          { id: '6', name: 'Other', value: 'other' }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  const currentStudent = selectedStudent === "all" ? null : students.find((s) => s.id === selectedStudent)
  const isAllStudents = selectedStudent === "all"

  if (isAllStudents) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please select a specific student to submit a daily report.</p>
        </CardContent>
      </Card>
    )
  }

  const getCategoryName = (value: string) => {
    const category = categories.find(cat => cat.value === value)
    return category ? category.name : value
  }

  const addVideo = () => {
    if (videoTitle && videoDuration && videoCategory) {
      const newVideo: VideoEntry = {
        id: Date.now().toString(),
        title: videoTitle,
        duration: videoDuration,
        category: videoCategory,
      }
      setVideos([...videos, newVideo])
      setVideoTitle("")
      setVideoDuration("")
      setVideoCategory("")
    }
  }

  const addQuiz = () => {
    if (quizTitle && quizScore && quizTotal && quizCategory) {
      const newQuiz: QuizEntry = {
        id: Date.now().toString(),
        title: quizTitle,
        score: Number.parseInt(quizScore),
        totalQuestions: Number.parseInt(quizTotal),
        category: quizCategory,
      }
      setQuizzes([...quizzes, newQuiz])
      setQuizTitle("")
      setQuizScore("")
      setQuizTotal("")
      setQuizCategory("")
    }
  }

  const removeVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id))
  }

  const removeQuiz = (id: string) => {
    setQuizzes(quizzes.filter((q) => q.id !== id))
  }

  const submitReport = async () => {
    try {
      const videoEntries: ServiceVideoEntry[] = videos.map(v => ({
        title: v.title,
        duration: v.duration,
        category: v.category
      }))

      const quizEntries: ServiceQuizEntry[] = quizzes.map(q => ({
        title: q.title,
        score: q.score,
        totalQuestions: q.totalQuestions,
        category: q.category
      }))

      await dailyReportService.createDailyReport({
        notes,
        videoEntries,
        quizEntries
      })

      toast({
        title: "Report Submitted",
        description: "Your daily report has been saved successfully.",
      })

      setVideos([])
      setQuizzes([])
      setNotes("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Learning Report</CardTitle>
          <CardDescription>
            {currentStudent ? `Report for ${currentStudent.name} - ` : ""}Report your daily activities from Enigma LMS -
            videos watched and quizzes completed
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Videos Watched</CardTitle>
          <CardDescription>Add videos you watched on Enigma LMS today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="video-title">Video Title</Label>
              <Input
                id="video-title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter video title"
              />
            </div>
            <div>
              <Label htmlFor="video-duration">Duration</Label>
              <Input
                id="video-duration"
                value={videoDuration}
                onChange={(e) => setVideoDuration(e.target.value)}
                placeholder="e.g., 45 minutes"
              />
            </div>
            <div>
              <Label htmlFor="video-category">Category</Label>
              <Select value={videoCategory} onValueChange={setVideoCategory} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Loading categories..." : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.value}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addVideo} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </div>
          </div>

          {videos.length > 0 && (
            <div className="space-y-2">
              <Label>Added Videos:</Label>
              {videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{video.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{getCategoryName(video.category)}</Badge>
                      <span className="text-sm text-muted-foreground">{video.duration}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeVideo(video.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quizzes Completed</CardTitle>
          <CardDescription>Add quizzes you completed on Enigma LMS today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="quiz-title">Quiz Title</Label>
              <Input
                id="quiz-title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <Label htmlFor="quiz-score">Your Score</Label>
              <Input
                id="quiz-score"
                type="number"
                value={quizScore}
                onChange={(e) => setQuizScore(e.target.value)}
                placeholder="e.g., 8"
              />
            </div>
            <div>
              <Label htmlFor="quiz-total">Total Questions</Label>
              <Input
                id="quiz-total"
                type="number"
                value={quizTotal}
                onChange={(e) => setQuizTotal(e.target.value)}
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <Label htmlFor="quiz-category">Category</Label>
              <Select value={quizCategory} onValueChange={setQuizCategory} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder={loading ? "Loading categories..." : "Select category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.value}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={addQuiz} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Quiz
              </Button>
            </div>
          </div>

          {quizzes.length > 0 && (
            <div className="space-y-2">
              <Label>Added Quizzes:</Label>
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{quiz.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{getCategoryName(quiz.category)}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Score: {quiz.score}/{quiz.totalQuestions} (
                        {Math.round((quiz.score / quiz.totalQuestions) * 100)}%)
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeQuiz(quiz.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>Any additional comments or observations about today's learning</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any additional notes, challenges faced, or key learnings..."
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={submitReport} size="lg" className="min-w-32">
          <Save className="w-4 h-4 mr-2" />
          Submit Report
        </Button>
      </div>
    </div>
  )
}
