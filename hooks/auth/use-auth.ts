import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '@/services';
import { tokenStorage, userStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import type { User, LoginCredentials } from '@/types';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = userStorage.get();
        const token = tokenStorage.get();

        if (storedUser && token) {
          try {
            const currentUser = await AuthService.getCurrentUser();
            setUser(currentUser);
          } catch {
            tokenStorage.remove();
            userStorage.remove();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      const authResponse = await AuthService.login(credentials);

      tokenStorage.set(authResponse.token);
      userStorage.set(authResponse.user);

      setUser(authResponse.user);

      toast({
        title: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        description: `Welcome back, ${authResponse.user.name}!`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : ERROR_MESSAGES.INVALID_CREDENTIALS;

      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      tokenStorage.remove();
      userStorage.remove();
      setUser(null);
      setIsLoading(false);

      toast({
        title: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
        description: 'You have been logged out successfully.',
      });
    }
  }, [toast]);

  const refreshAuth = useCallback(async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      userStorage.set(currentUser);
    } catch (error) {
      console.error('Error refreshing auth:', error);
      await logout();
    }
  }, [logout]);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
  };
};