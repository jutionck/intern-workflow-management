export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  supervisor?: string;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = 'admin' | 'student';

export type UserStatus = 'active' | 'inactive' | 'completed';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPageProps {
  onLogin: (user: User) => void;
}

export interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
