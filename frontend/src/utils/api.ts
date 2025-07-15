import axios from 'axios';
import { UrlResult } from './index';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postUrl = async (url: string): Promise<UrlResult> => {
  try {
    const response = await axiosInstance.post('/urls', { url });
    console.log('postUrl Response:', response.data);
    return response.data;
  } catch (err) {
    const message = axios.isAxiosError(err) && err.response?.data?.error
      ? `Failed to submit URL: ${err.response.status} - ${err.response.data.error}`
      : `Failed to submit URL: ${err.message}`;
    console.error('postUrl Error:', message);
    throw new Error(message);
  }
};

export const getResults = async (): Promise<UrlResult[]> => {
  try {
    const response = await axiosInstance.get('/results');
    console.log('getResults Response:', response.data);
    return response.data;
  } catch (err) {
    const message = axios.isAxiosError(err) && err.response?.data?.error
      ? `Failed to fetch results: ${err.response.status} - ${err.response.data.error}`
      : `Failed to fetch results: ${err.message}`;
    console.error('getResults Error:', message);
    throw new Error(message);
  }
};

export const deleteResult = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/results/${id}`);
  } catch (err) {
    const message = axios.isAxiosError(err) && err.response?.data?.error
      ? `Failed to delete result: ${err.response.status} - ${err.response.data.error}`
      : `Failed to delete result: ${err.message}`;
    console.error('deleteResult Error:', err);
    throw new Error(message);
  }
};