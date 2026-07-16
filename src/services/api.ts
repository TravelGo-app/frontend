import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return {
      user: response.data.user,
      token: response.data.token
    }
  },

  register: async (name: string, email: string, password: string, birthDate: string) => {
    const response = await api.post('/auth/register', { name, email, password, birthDate })
    return {
      user: response.data.user,
      token: response.data.token
    }
  },

  me: async () => {
    const response = await api.get('/auth/me')
    return {
      user: response.data.user
    }
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', {
      email: email.trim().toLowerCase(),
    })
    return {
      message: response.data.message
    }
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
    })
    return {
      message: response.data.message,
      user: response.data.user,
    }
  }
}

export default api