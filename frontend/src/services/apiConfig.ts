// frontend/src/services/apiConfig.ts

export const API_BASE_URL = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5000/api';
export const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:8000/api';
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('atlascapital:token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}