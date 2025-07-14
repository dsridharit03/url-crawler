import axios from 'axios';
import { UrlResult } from './index';

const API_BASE_URL = 'http://localhost:8082';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.qQSekbR5BFKQPc3_7gUiDY6Q9y7RojKzvBTLJ9jGtec"; // 🔁 Replace with dynamic token in production

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export const postUrl = async (url: string): Promise<UrlResult> => {
  try {
    const response = await axiosInstance.post('/urls', { url });
    return response.data;
  } catch (err) {
    const message = axios.isAxiosError(err) && err.response?.data?.error
      ? `Failed to submit URL: ${err.response.data.error}`
      : 'Failed to submit URL';
    throw new Error(message);
  }
};

export const getResults = async (): Promise<UrlResult[]> => {
  try {
    const response = await axiosInstance.get('/results');
    return response.data;
  } catch (err) {
    const message = axios.isAxiosError(err) && err.response?.data?.error
      ? `Failed to fetch results: ${err.response.data.error}`
      : 'Failed to fetch results';
    throw new Error(message);
  }
};

export const deleteResult = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/results/${id}`);
  } catch (err) {
    const message = axios.isAxiosError(err) && err.response?.data?.error
      ? `Failed to delete result: ${err.response.data.error}`
      : 'Failed to delete result';
    throw new Error(message);
  }
};