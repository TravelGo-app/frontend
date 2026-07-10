import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import {
  validateNameField,
  validateEmailField,
  validatePasswordField,
  validateConfirmField,
} from '../utils/authValidators'

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

interface UseRegisterFormOptions {
  onSuccess: (name: string) => void
}

export function useRegisterForm({ onSuccess }: UseRegisterFormOptions) {
  const { login } = useAuth()

  const [registerData, setRegisterData] = useState<RegisterData>({ name: '', email: '', password: '', confirmPassword: '' })
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const validateRegister = (): RegisterErrors => {
    const errors: RegisterErrors = {}
    const name = validateNameField(registerData.name)
    const email = validateEmailField(registerData.email)
    const password = validatePasswordField(registerData.password)
    const confirmPassword = validateConfirmField(registerData.confirmPassword, registerData.password)
    if (name) errors.name = name
    if (email) errors.email = email
    if (password) errors.password = password
    if (confirmPassword) errors.confirmPassword = confirmPassword
    if (!acceptedTerms) errors.terms = 'Debés aceptar los términos y condiciones'
    return errors
  }

  const handleNameChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, name: value }))
    setRegisterErrors((prev) => ({ ...prev, name: validateNameField(value) }))
  }

  const handleEmailChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, email: value }))
    setRegisterErrors((prev) => ({ ...prev, email: validateEmailField(value) }))
  }

  const handlePasswordChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, password: value }))
    setRegisterErrors((prev) => ({
      ...prev,
      password: validatePasswordField(value),
      confirmPassword: registerData.confirmPassword
        ? validateConfirmField(registerData.confirmPassword, value)
        : prev.confirmPassword,
    }))
  }

  const handleConfirmChange = (value: string) => {
    setRegisterData((prev) => ({ ...prev, confirmPassword: value }))
    setRegisterErrors((prev) => ({ ...prev, confirmPassword: validateConfirmField(value, registerData.password) }))
  }

  const handleTermsChange = (checked: boolean) => {
    setAcceptedTerms(checked)
    setRegisterErrors((prev) => ({ ...prev, terms: checked ? undefined : 'Debés aceptar los términos y condiciones' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateRegister()
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors)
      return
    }
    setRegisterErrors({})
    setServerError('')
    setLoading(true)
    try {
      const data = await authService.register(registerData.name, registerData.email, registerData.password)
      login(data.user, data.token)
      onSuccess(data.user.name)
    } catch (err: any) {
      setServerError(err.response?.data?.message || err.response?.data?.error || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  const resetErrors = () => {
    setServerError('')
    setRegisterErrors({})
  }

  return {
    registerData,
    registerErrors,
    serverError,
    loading,
    acceptedTerms,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmChange,
    handleTermsChange,
    handleSubmit,
    resetErrors,
  }
}