"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

  // Video form state
  const [videoTitle, setVideoTitle] = useState("")
  const [videoDuration, setVideoDuration] = useState("")
  const [videoCategory, setVideoCategory] = useState("")

  // Quiz form state
  const [quizTitle, setQuizTitle] = useState("")
  const [quizScore, setQuizScore] = useState("")
  const [quizTotal, setQuizTotal] = useState("")
  const [quizCategory, setQuizCategory] = useState("")

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

  const submitReport = () => {
    // Here you would typically send the data to your backend
    toast({
      title: "Report Submitted",
      description: "Your daily report has been saved successfully.",
    })

    // Reset form
    setVideos([])
    setQuizzes([])
    setNotes("")
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

      {/* Videos Section */}
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
              <Select value={videoCategory} onValueChange={setVideoCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Development</SelectItem>
                  <SelectItem value="backend">Backend Development</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="design">UI/UX Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
                      <Badge variant="outline">{video.category}</Badge>
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

      {/* Quizzes Section */}
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
              <Select value={quizCategory} onValueChange={setQuizCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Development</SelectItem>
                  <SelectItem value="backend">Backend Development</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="design">UI/UX Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
                      <Badge variant="outline">{quiz.category}</Badge>
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

      {/* Notes Section */}
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

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={submitReport} size="lg" className="min-w-32">
          <Save className="w-4 h-4 mr-2" />
          Submit Report
        </Button>
      </div>
    </div>
  )
}
