import { httpClient } from '@/lib/http-client';
import { API_ENDPOINTS } from '@/constants';
import type {
  User,
  ApiResponse
} from '@/types';

export class StudentService {
  static async getStudents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
  }): Promise<User[]> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `${API_ENDPOINTS.STUDENTS}?${queryParams.toString()}`;
    const response = await httpClient.get<{ students: User[] }>(endpoint);

    if (response.data && response.data.students) {
      return response.data.students;
    }

    throw new Error('Invalid response format');
  }

  static async getStudentById(id: string): Promise<User> {
    const response = await httpClient.get<User>(`${API_ENDPOINTS.STUDENTS}/${id}`);

    if (response.data) {
      return response.data;
    }

    throw new Error('Invalid response format');
  }

  static async createStudent(studentData: {
    name: string;
    email: string;
    department?: string;
    supervisor?: string;
  }): Promise<User> {
    const response = await httpClient.post<User>(
      API_ENDPOINTS.STUDENTS,
      studentData
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('Invalid response format');
  }

  static async updateStudent(id: string, studentData: Partial<User>): Promise<User> {
    const response = await httpClient.put<User>(
      `${API_ENDPOINTS.STUDENTS}/${id}`,
      studentData
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('Invalid response format');
  }

  static async deleteStudent(id: string): Promise<void> {
    await httpClient.delete(`${API_ENDPOINTS.STUDENTS}/${id}`);
  }

  static async getStudentStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    completed: number;
  }> {
    const response = await httpClient.get<{
      total: number;
      active: number;
      inactive: number;
      completed: number;
    }>(`${API_ENDPOINTS.STUDENTS}/stats`);

    if (response.data) {
      return response.data;
    }

    throw new Error('Invalid response format');
  }
}