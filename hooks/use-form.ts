import { useState, useCallback } from 'react';
import { validateForm } from '@/lib/validations';
import type { FormState } from '@/types';

interface UseFormOptions<T> {
  initialData: T;
  validators?: Partial<Record<keyof T, (value: any) => { isValid: boolean; error?: string }>>;
  onSubmit?: (data: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  formState: FormState<T>;
  handleChange: (field: keyof T, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearErrors: () => void;
}

export const useForm = <T extends Record<string, any>>({
  initialData,
  validators = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> => {
  const [formState, setFormState] = useState<FormState<T>>({
    data: initialData,
    errors: {},
    isSubmitting: false,
    isValid: true,
  });

  const handleChange = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
      errors: {
        ...prev.errors,
        [field]: undefined,
      },
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error,
      },
      isValid: false,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      errors: {},
      isValid: true,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      data: initialData,
      errors: {},
      isSubmitting: false,
      isValid: true,
    });
  }, [initialData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.isSubmitting) return;

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      if (Object.keys(validators).length > 0) {
        const validation = validateForm(
          formState.data,
          validators as Record<keyof T, (value: any) => { isValid: boolean; error?: string }>
        );

        if (!validation.isValid) {
          setFormState(prev => ({
            ...prev,
            errors: validation.errors,
            isValid: false,
            isSubmitting: false,
          }));
          return;
        }
      }

      if (onSubmit) {
        await onSubmit(formState.data);
      }

      setFormState(prev => ({
        ...prev,
        isValid: true,
        errors: {},
      }));
    } catch (error) {
      console.error('Form submission error:', error);

      if (error && typeof error === 'object' && 'fields' in error) {
        setFormState(prev => ({
          ...prev,
          errors: (error as any).fields,
          isValid: false,
        }));
      }

      throw error;
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.data, formState.isSubmitting, validators, onSubmit]);

  return {
    formState,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldError,
    clearErrors,
  };
};