import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import { validateEmailField, validatePasswordField } from '../utils/authValidators'

export interface LoginData {
  email: string
  password: string
}

export interface LoginErrors {
  email?: string
  password?: string
}

export function useLoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' })
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showGoogleFallback, setShowGoogleFallback] = useState(false)
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const validateLogin = (): LoginErrors => {
    const errors: LoginErrors = {}
    const email = validateEmailField(loginData.email)
    const password = validatePasswordField(loginData.password)
    if (email) errors.email = email
    if (password) errors.password = password
    return errors
  }

  const handleEmailChange = (value: string) => {
    setLoginData((prev) => ({ ...prev, email: value }))
    setLoginErrors((prev) => ({ ...prev, email: validateEmailField(value) }))
  }

  const handlePasswordChange = (value: string) => {
    setLoginData((prev) => ({ ...prev, password: value }))
    setLoginErrors((prev) => ({ ...prev, password: validatePasswordField(value) }))
  }

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked)
  }

  const handleGoogleAuth = (result: any) => {
    login(result.user, result.token, rememberMe)
    // Algunos endpoints devuelven `requiresPasswordSetup`, otros `isNewUser`.
    // Manejar ambos para compatibilidad.
    if (result.requiresPasswordSetup || result.isNewUser) {
      navigate('/configurar-password')
    } else {
      navigate('/dashboard')
    }
  }

  const handleGoogleLoadingChange = (isLoading: boolean) => {
    setGoogleAuthLoading(isLoading)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateLogin()
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors)
      return
    }
    setLoginErrors({})
    setServerError('')
    setShowGoogleFallback(false)
    setLoading(true)
    try {
      const data = await authService.login(loginData.email, loginData.password)
      login(data.user, data.token, rememberMe)
      navigate('/dashboard')
    } catch (err: any) {
      const status = err.response?.status
      if (status === 409) {
        setShowGoogleFallback(true)
        setServerError('Esta cuenta fue creada con Google. Iniciá sesión con Google y configurá una contraseña para poder ingresar también con email.')
      } else {
        setServerError(err.response?.data?.message || err.response?.data?.error || 'Error al iniciar sesión')
      }
    } finally {
      setLoading(false)
    }
  }

  const resetErrors = () => {
    setServerError('')
    setLoginErrors({})
    setShowGoogleFallback(false)
  }

  return {
    loginData,
    loginErrors,
    serverError,
    loading,
    showGoogleFallback,
    googleAuthLoading,
    rememberMe,
    handleEmailChange,
    handlePasswordChange,
    handleRememberMeChange,
    handleGoogleAuth,
    handleGoogleLoadingChange,
    handleSubmit,
    resetErrors,
  }
}