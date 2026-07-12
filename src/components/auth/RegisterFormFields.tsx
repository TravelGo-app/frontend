import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from './AuthIcons'
import TermsModal from './TermsModal'
import logoImg from '../../assets/PosibleLogo.png'
import type { RegisterData, RegisterErrors } from '../../hooks/useRegisterForm'

interface RegisterFormFieldsProps {
  data: RegisterData
  errors: RegisterErrors
  serverError: string
  loading: boolean
  acceptedTerms: boolean
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmChange: (value: string) => void
  onTermsChange: (checked: boolean) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function RegisterFormFields({
  data,
  errors,
  serverError,
  loading,
  acceptedTerms,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmChange,
  onTermsChange,
  onSubmit,
}: RegisterFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  return (
    <>
      <img src={logoImg} alt="TravelGo" className="w-16 h-16 mb-2 object-contain" />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2 italic">Crea tu Cuenta</h1>
      <p className="text-red-500 text-sm mb-1 h-5">{serverError || ''}</p>
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-2">
        <div>
          <input
            type="text"
            placeholder="Nombre"
            autoComplete="name"
            value={data.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent"
          />
          <p className="text-red-500 text-xs mt-1 h-4">{errors.name || ''}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent"
          />
          <p className="text-red-500 text-xs mt-1 h-4">{errors.email || ''}</p>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            autoComplete="new-password"
            value={data.password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent pr-8"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
          <p className="text-red-500 text-xs mt-1 h-4">{errors.password || ''}</p>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            autoComplete="new-password"
            value={data.confirmPassword}
            onChange={(e) => onConfirmChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent pr-8"
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
          <p className="text-red-500 text-xs mt-1 h-4">{errors.confirmPassword || ''}</p>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => onTermsChange(e.target.checked)}
              className="w-4 h-4 accent-[#2A9BB5]"
            />
            Acepto los{' '}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-[#2A9BB5] hover:underline"
            >
              términos y condiciones
            </button>
          </label>
          <p className="text-red-500 text-xs mt-1 h-4">{errors.terms || ''}</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2A9BB5] text-white py-2 rounded-full font-bold hover:bg-teal-600 transition mt-2 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'REGISTRARSE'}
        </button>
      </form>

      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </>
  )
}