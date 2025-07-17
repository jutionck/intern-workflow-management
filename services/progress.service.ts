import { httpClient } from '@/lib/http-client'
import { API_ENDPOINTS } from '@/constants'

export interface ProgressEntry {
  id: string
  date: string
  type: 'video' | 'quiz'
  title: string
  category: string
  duration?: string
  score?: number
  totalQuestions?: number
  studentName?: string
}

export const progressService = {
  async getProgressData(userId?: string): Promise<any> {
    const url = userId ? `${API_ENDPOINTS.PROGRESS}?userId=${userId}` : API_ENDPOINTS.PROGRESS
    const response = await httpClient.get(url)
    return response.data
  }
}
