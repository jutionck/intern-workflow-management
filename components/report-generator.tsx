"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Download, Video, TrendingUp, Clock, BarChart3, FileSpreadsheet } from "lucide-react"
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

interface ReportGeneratorProps {
  students: Student[]
}

interface ReportData {
  student: Student
  videosWatched: number
  quizzesCompleted: number
  averageScore: number
  timeSpent: string
  completionRate: number
  lastActivity: string
  workflowsCompleted: number
  totalWorkflows: number
}

export default function ReportGenerator({ students }: ReportGeneratorProps) {
  const { toast } = useToast()
  const [selectedStudent, setSelectedStudent] = useState<string>("all")
  const [reportType, setReportType] = useState<string>("summary")
  const [dateRange, setDateRange] = useState<string>("last-30-days")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeDetails, setIncludeDetails] = useState(true)
  const [exportFormat, setExportFormat] = useState<string>("pdf")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)

  // Mock report data
  const generateMockReportData = (): ReportData[] => {
    return students.map((student) => ({
      student,
      videosWatched: Math.floor(Math.random() * 20) + 5,
      quizzesCompleted: Math.floor(Math.random() * 15) + 3,
      averageScore: Math.floor(Math.random() * 30) + 70,
      timeSpent: `${Math.floor(Math.random() * 40) + 10} hours`,
      completionRate: Math.floor(Math.random() * 40) + 60,
      lastActivity: `${Math.floor(Math.random() * 7) + 1} days ago`,
      workflowsCompleted: Math.floor(Math.random() * 5) + 1,
      totalWorkflows: Math.floor(Math.random() * 3) + 3,
    }))
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    // Simulate report generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const reportData = generateMockReportData()
    const filteredData =
      selectedStudent === "all" ? reportData : reportData.filter((d) => d.student.id === selectedStudent)

    const report = {
      title:
        selectedStudent === "all"
          ? "All Students Report"
          : `${students.find((s) => s.id === selectedStudent)?.name} Report`,
      generatedAt: new Date().toISOString(),
      dateRange,
      reportType,
      data: filteredData,
      summary: {
        totalStudents: filteredData.length,
        totalVideos: filteredData.reduce((sum, d) => sum + d.videosWatched, 0),
        totalQuizzes: filteredData.reduce((sum, d) => sum + d.quizzesCompleted, 0),
        averageScore: Math.round(filteredData.reduce((sum, d) => sum + d.averageScore, 0) / filteredData.length),
        totalTimeSpent: `${filteredData.reduce((sum, d) => sum + Number.parseInt(d.timeSpent), 0)} hours`,
        averageCompletionRate: Math.round(
          filteredData.reduce((sum, d) => sum + d.completionRate, 0) / filteredData.length,
        ),
      },
    }

    setGeneratedReport(report)
    setIsGenerating(false)

    toast({
      title: "Report Generated",
      description: "Your report has been generated successfully.",
    })
  }

  const handleExportReport = (format: string) => {
    if (!generatedReport) return

    // Simulate export functionality
    const fileName = `${generatedReport.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.${format}`

    toast({
      title: "Export Started",
      description: `Exporting report as ${format.toUpperCase()}...`,
    })

    // In a real application, you would generate and download the actual file
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Report exported as ${fileName}`,
      })
    }, 1500)
  }

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case "last-7-days":
        return "Last 7 Days"
      case "last-30-days":
        return "Last 30 Days"
      case "last-90-days":
        return "Last 90 Days"
      case "custom":
        return "Custom Range"
      default:
        return "Last 30 Days"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Report Generator
          </CardTitle>
          <CardDescription>Generate comprehensive reports for student progress and performance</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Configure your report settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="student-select">Student Selection</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="detailed">Detailed Report</SelectItem>
                    <SelectItem value="performance">Performance Analysis</SelectItem>
                    <SelectItem value="progress">Progress Tracking</SelectItem>
                    <SelectItem value="workflow">Workflow Completion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-range">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateRange === "custom" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Report Options</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                  <Label htmlFor="include-charts" className="text-sm">
                    Include Charts & Graphs
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-details" checked={includeDetails} onCheckedChange={setIncludeDetails} />
                  <Label htmlFor="include-details" className="text-sm">
                    Include Detailed Breakdown
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="export-format">Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="html">HTML Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateReport} className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Report Preview/Results */}
        <div className="lg:col-span-2 space-y-6">
          {!generatedReport ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Generated</h3>
                <p className="text-gray-500">
                  Configure your report settings and click "Generate Report" to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Report Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {generatedReport.title}
                      </CardTitle>
                      <CardDescription>
                        Generated on {formatDate(generatedReport.generatedAt)} •{" "}
                        {getDateRangeLabel(generatedReport.dateRange)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("pdf")}>
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("xlsx")}>
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportReport("csv")}>
                        <FileText className="w-4 h-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Summary Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{generatedReport.summary.totalStudents}</div>
                      <p className="text-sm text-gray-600">Total Students</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{generatedReport.summary.totalVideos}</div>
                      <p className="text-sm text-gray-600">Videos Watched</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{generatedReport.summary.totalQuizzes}</div>
                      <p className="text-sm text-gray-600">Quizzes Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{generatedReport.summary.averageScore}%</div>
                      <p className="text-sm text-gray-600">Average Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{generatedReport.summary.totalTimeSpent}</div>
                      <p className="text-sm text-gray-600">Total Time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {generatedReport.summary.averageCompletionRate}%
                      </div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Student Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Performance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedReport.data.map((studentData: ReportData) => (
                      <div key={studentData.student.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {studentData.student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium">{studentData.student.name}</h3>
                              <p className="text-sm text-gray-500">{studentData.student.department}</p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              studentData.student.status === "active"
                                ? "default"
                                : studentData.student.status === "completed"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {studentData.student.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Video className="w-4 h-4 text-blue-500 mr-1" />
                              <span className="font-medium">{studentData.videosWatched}</span>
                            </div>
                            <p className="text-xs text-gray-600">Videos</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <FileText className="w-4 h-4 text-green-500 mr-1" />
                              <span className="font-medium">{studentData.quizzesCompleted}</span>
                            </div>
                            <p className="text-xs text-gray-600">Quizzes</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                              <span className="font-medium">{studentData.averageScore}%</span>
                            </div>
                            <p className="text-xs text-gray-600">Avg Score</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Clock className="w-4 h-4 text-orange-500 mr-1" />
                              <span className="font-medium">{studentData.timeSpent}</span>
                            </div>
                            <p className="text-xs text-gray-600">Time Spent</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completion Rate</span>
                            <span>{studentData.completionRate}%</span>
                          </div>
                          <Progress value={studentData.completionRate} />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>
                              Workflows: {studentData.workflowsCompleted}/{studentData.totalWorkflows}
                            </span>
                            <span>Last activity: {studentData.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
