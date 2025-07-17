import { httpClient } from '@/lib/http-client'
import { API_ENDPOINTS } from '@/constants'

export interface WorkflowTask {
  id?: string
  title: string
  type: 'video' | 'quiz'
  completed?: boolean
  score?: number
  totalQuestions?: number
  duration?: string
}

export interface Workflow {
  id?: string
  title: string
  description: string
  category: string
  status?: string
  dueDate?: string
  tasks: WorkflowTask[]
}

export interface CreateWorkflowData {
  title: string
  description: string
  category: string
  dueDate?: string
  tasks: WorkflowTask[]
  assignedUsers: string[]
}

export const workflowService = {
  async getWorkflows(userId?: string): Promise<any> {
    const url = userId ? `${API_ENDPOINTS.WORKFLOWS}?userId=${userId}` : API_ENDPOINTS.WORKFLOWS
    const response = await httpClient.get(url)
    return response.data
  },

  async createWorkflow(data: CreateWorkflowData): Promise<any> {
    const response = await httpClient.post(API_ENDPOINTS.WORKFLOWS, data)
    return response.data
  }
}
