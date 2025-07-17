import { API_BASE_URL, ERROR_MESSAGES } from '@/constants';
import { tokenStorage } from '@/lib/storage';
import type { ApiResponse } from '@/types';

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class HttpClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async createRequest(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<Request> {
    const { requiresAuth = true, headers = {}, ...restConfig } = config;

    const url = `${this.baseURL}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    if (requiresAuth) {
      const token = tokenStorage.get();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    return new Request(url, {
      ...restConfig,
      headers: requestHeaders,
    });
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = ERROR_MESSAGES.SERVER_ERROR;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
      }

      throw new ApiError(
        errorMessage,
        response.status,
        response.statusText
      );
    }

    try {
      const data = await response.json();
      return data;
    } catch {
      throw new ApiError('Invalid response format');
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const request = await this.createRequest(endpoint, {
        ...config,
        method: 'GET',
      });

      const response = await fetch(request);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const request = await this.createRequest(endpoint, {
        ...config,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });

      const response = await fetch(request);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const request = await this.createRequest(endpoint, {
        ...config,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });

      const response = await fetch(request);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const request = await this.createRequest(endpoint, {
        ...config,
        method: 'DELETE',
      });

      const response = await fetch(request);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }
}

export const httpClient = new HttpClient();