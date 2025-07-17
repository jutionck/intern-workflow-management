import { STORAGE_KEYS } from '@/constants';

export const storage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error setting localStorage:', error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

export const tokenStorage = {
  get: (): string | null => storage.getItem(STORAGE_KEYS.TOKEN),
  set: (token: string): boolean => storage.setItem(STORAGE_KEYS.TOKEN, token),
  remove: (): boolean => storage.removeItem(STORAGE_KEYS.TOKEN),
};

export const userStorage = {
  get: (): any | null => {
    const userData = storage.getItem(STORAGE_KEYS.USER);
    try {
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },
  set: (user: any): boolean => {
    try {
      return storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      return false;
    }
  },
  remove: (): boolean => storage.removeItem(STORAGE_KEYS.USER),
};
