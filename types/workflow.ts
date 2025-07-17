export interface DailyReport {
  id: string;
  userId: string;
  date: Date;
  activities: string;
  learningProgress: string;
  challenges?: string;
  nextDayPlans?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportStatus = 'draft' | 'submitted' | 'reviewed' | 'approved';

export interface DailyReportFormData {
  activities: string;
  learningProgress: string;
  challenges?: string;
  nextDayPlans?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  category: WorkflowCategory;
  status: WorkflowStatus;
  dueDate: Date;
  assignedBy: string;
  completedTasks: number;
  totalTasks: number;
  tasks: WorkflowTask[];
}

export type WorkflowCategory = 'frontend' | 'backend' | 'fullstack' | 'design' | 'other';

export type WorkflowStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue';

export interface WorkflowTask {
  id: string;
  title: string;
  type: TaskType;
  completed: boolean;
  score?: number;
  totalQuestions?: number;
  duration?: string;
}

export type TaskType = 'video' | 'quiz' | 'assignment' | 'reading';

export interface ProgressEntry {
  id: string;
  date: Date;
  videoWatched: number;
  quizCompleted: number;
  averageScore: number;
  timeSpent: number;
}
