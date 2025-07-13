import axios from 'axios';

export const postUrl = async (url: string) => {
  await axios.post('http://localhost:8080/urls', { url }, {
    headers: { Authorization: 'Bearer your_jwt_token' },
  });
};

export const getResults = async () => {
  const response = await axios.get('http://localhost:8082/results', {
    headers: { Authorization: 'Bearer your_jwt_token' },
  });
  return response.data;
};