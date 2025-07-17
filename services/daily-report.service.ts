import { httpClient } from '@/lib/http-client'
import { API_ENDPOINTS } from '@/constants'

export interface DailyReportData {
  notes?: string
  videoEntries?: VideoEntry[]
  quizEntries?: QuizEntry[]
}

export interface VideoEntry {
  title: string
  duration: string
  category: string
}

export interface QuizEntry {
  title: string
  score: number
  totalQuestions: number
  category: string
}

export interface DailyReport {
  id: string
  userId: string
  date: string
  notes?: string
  user: {
    id: string
    name: string
    email: string
  }
  videoEntries: VideoEntry[]
  quizEntries: QuizEntry[]
  createdAt: string
  updatedAt: string
}

export const dailyReportService = {
  async createDailyReport(data: DailyReportData): Promise<any> {
    const response = await httpClient.post(API_ENDPOINTS.DAILY_REPORTS, data)
    return response.data
  },

  async getDailyReports(userId?: string): Promise<any> {
    const url = userId ? `${API_ENDPOINTS.DAILY_REPORTS}?userId=${userId}` : API_ENDPOINTS.DAILY_REPORTS
    const response = await httpClient.get(url)
    return response.data
  }
}
