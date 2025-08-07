import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, LoadingState } from '../types';

interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    try {
      const response = await apiCall();
      setData(response.data);
      onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setLoading({ isLoading: false, error: errorMessage });
      onError?.(error as Error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, isLoading: false }));
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    data,
    loading: loading.isLoading,
    error: loading.error,
    refetch,
    execute
  };
}

export function useApiMutation<TData, TVariables>(
  apiCall: (variables: TVariables) => Promise<ApiResponse<TData>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(variables);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return {
    mutate,
    loading,
    error
  };
}