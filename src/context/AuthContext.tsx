import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authService } from '../services/api'

interface User {
  id: string | number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (user: User, token: string, rememberMe?: boolean) => void
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const getStoredToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = getStoredToken()
    if (savedToken) {
      setToken(savedToken)
      // Llamada a backend con fallback: si la petición queda bloqueada,
      // forzamos `loading = false` pasado un timeout seguro.
      const fallback = window.setTimeout(() => {
        setLoading(false)
      }, 7000)

      authService
        .me()
        .then((data) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => {
          clearTimeout(fallback)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  // rememberMe = true -> localStorage (persiste entre sesiones del navegador)
  // rememberMe = false -> sessionStorage (se borra al cerrar la pestaña/navegador)
  const login = (user: User, token: string, rememberMe: boolean = true) => {
    setUser(user)
    setToken(token)
    if (rememberMe) {
      localStorage.setItem('token', token)
      sessionStorage.removeItem('token')
    } else {
      sessionStorage.setItem('token', token)
      localStorage.removeItem('token')
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}