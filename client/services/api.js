import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  
  baseURL: 'http://10.213.203.154:3000',
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;