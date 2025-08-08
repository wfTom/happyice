import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${API_URL}/users/register`, {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/users/login`, {
    email,
    password,
  });
  return response.data;
};
