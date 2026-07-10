import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from './AuthIcons'
import { GoogleAuthButton } from './GoogleAuthButton'
import ForgotPasswordModal from './ForgotPasswordModal'
import logoImg from '../../assets/PosibleLogo.png'
import type { LoginData, LoginErrors } from '../../hooks/useLoginForm'

interface LoginFormFieldsProps {
  data: LoginData
  errors: LoginErrors
  serverError: string
  loading: boolean
  showGoogleFallback: boolean
  rememberMe: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onRememberMeChange: (checked: boolean) => void
  onSubmit: (e: React.FormEvent) => void
  onGoogleAuth: (result: any) => void
  onGoogleLoadingChange?: (loading: boolean) => void
}

export default function LoginFormFields({
  data,
  errors,
  serverError,
  loading,
  showGoogleFallback,
  rememberMe,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
  onGoogleAuth,
  onGoogleLoadingChange,
}: LoginFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  return (
    <>
      <img src={logoImg} alt="TravelGo" className="w-16 h-16 mb-2 object-contain" />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-3 italic">Iniciar Sesión</h1>
      <p className="text-red-500 text-sm mb-1 h-5 text-center">{serverError || ''}</p>
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
        <div>
          <input
            type="text"
            placeholder="Email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#F26A2E] bg-transparent"
          />
          <p className="text-red-500 text-xs mt-1 h-4">{errors.email || ''}</p>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            autoComplete="current-password"
            value={data.password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#F26A2E] bg-transparent pr-8"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
          <p className="text-red-500 text-xs mt-1 h-4">{errors.password || ''}</p>
        </div>

        <div className="flex items-center justify-between w-full">
          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
              className="w-4 h-4 accent-[#F26A2E]"
            />
            Recordarme
          </label>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-[#F26A2E] hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {showGoogleFallback ? (
          <GoogleAuthButton onAuthenticated={onGoogleAuth} onLoadingChange={onGoogleLoadingChange} />
        ) : (
          <>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F26A2E] text-white py-2 rounded-full font-bold hover:bg-orange-600 transition mt-2 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'INICIAR SESIÓN'}
            </button>
            <GoogleAuthButton onAuthenticated={onGoogleAuth} onLoadingChange={onGoogleLoadingChange} />
          </>
        )}
      </form>

      <ForgotPasswordModal open={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </>
  )
}