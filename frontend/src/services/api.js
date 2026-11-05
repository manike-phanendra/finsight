import axios from 'axios';
import { clientApiHandler, initClientStore } from './clientStorage';

// Pre-initialize client store
initClientStore();

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
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

// Hybrid resilient client that falls back to clientApiHandler if backend is offline or unrouted
const api = {
  get: async (url, config = {}) => {
    try {
      const res = await axiosInstance.get(url, config);
      // If server returned HTML (e.g. index.html rewrite), fallback to client handler
      if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
        return await clientApiHandler('get', url, {}, config.params);
      }
      return res;
    } catch (err) {
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
      // If explicit user-facing error like 400 with message from real backend, rethrow
      if (err.response && err.response.data && err.response.data.message && err.response.status === 400) {
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
      response = await clientApiHandler('delete', url, {}, config.params);
    }
    notifyDataChanged(url, 'delete');
    return response;
  },
};

export default api;
