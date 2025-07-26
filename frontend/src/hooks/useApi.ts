import { useState, useCallback } from 'react';
import { postUrl, getResults, deleteResult } from '../utils/api';
import { UrlResult } from '../types';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitUrl = useCallback(async (url: string): Promise<UrlResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await postUrl(url);
      return result;
    } catch (err) {
      const message = err.message || 'Failed to submit URL';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResults = useCallback(async (): Promise<UrlResult[]> => {
    setLoading(true);
    setError(null);
    try {
      const results = await getResults();
      return results;
    } catch (err) {
      const message = err.message || 'Failed to fetch results';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeResult = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteResult(id);
    } catch (err) {
      const message = err.message || 'Failed to delete result';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitUrl, fetchResults, removeResult, loading, error };
};