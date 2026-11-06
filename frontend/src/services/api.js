import axios from 'axios';
import { clientApiHandler, initClientStore } from './clientStorage';

// Pre-initialize client store
initClientStore();

export const getApiBase = () => {
  let customUrl = '';
  if (typeof window !== 'undefined') {
    customUrl = localStorage.getItem('finsight_api_url') || '';
  }
  const envUrl = import.meta.env.VITE_API_URL || '';
  const target = (customUrl || envUrl || '').trim().replace(/\/$/, '');

  if (!target) return '/api';
  return target.endsWith('/api') ? target : `${target}/api`;
};

const axiosInstance = axios.create({
  baseURL: getApiBase(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBase();
    const token = localStorage.getItem('finsight_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const notifyDataChanged = (url, method) => {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('finsight_data_changed', { detail: { url, method } }));
    } catch (e) {}
  }
};

// Hybrid resilient client: calls backend API first; falls back seamlessly if backend is offline or network fails
const api = {
  get: async (url, config = {}) => {
    try {
      const res = await axiosInstance.get(url, config);
      // If server returned HTML (e.g. index.html SPA rewrite), fallback to client handler
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        return await clientApiHandler('get', url, {}, config.params);
      }
      return res;
    } catch (err) {
      // If backend responded with client error (400, 401, 403, 404, 422), propagate it
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        throw err;
      }
      return await clientApiHandler('get', url, {}, config.params);
    }
  },

  post: async (url, data = {}, config = {}) => {
    let response;
    try {
      const res = await axiosInstance.post(url, data, config);
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        response = await clientApiHandler('post', url, data, config.params);
      } else {
        response = res;
      }
    } catch (err) {
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        throw err;
      }
      response = await clientApiHandler('post', url, data, config.params);
    }
    notifyDataChanged(url, 'post');
    return response;
  },

  put: async (url, data = {}, config = {}) => {
    let response;
    try {
      const res = await axiosInstance.put(url, data, config);
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        response = await clientApiHandler('put', url, data, config.params);
      } else {
        response = res;
      }
    } catch (err) {
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        throw err;
      }
      response = await clientApiHandler('put', url, data, config.params);
    }
    notifyDataChanged(url, 'put');
    return response;
  },

  delete: async (url, config = {}) => {
    let response;
    try {
      const res = await axiosInstance.delete(url, config);
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        response = await clientApiHandler('delete', url, {}, config.params);
      } else {
        response = res;
      }
    } catch (err) {
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        throw err;
      }
      response = await clientApiHandler('delete', url, {}, config.params);
    }
    notifyDataChanged(url, 'delete');
    return response;
  },
};

export default api;
