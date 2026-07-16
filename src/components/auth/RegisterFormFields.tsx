import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from './AuthIcons'
import TermsModal from './TermsModal'
import logoImg from '../../assets/PosibleLogo.png'
import type { RegisterData, RegisterErrors, EmailCheckStatus } from '../../hooks/useRegisterForm'

interface RegisterFormFieldsProps {
  data: RegisterData
  errors: RegisterErrors
  serverError: string
  loading: boolean
  acceptedTerms: boolean
  emailCheckStatus: EmailCheckStatus
  isSubmitDisabled: boolean
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmChange: (value: string) => void
  onBirthDateChange: (value: string) => void
  onTermsChange: (checked: boolean) => void
  onSubmit: (e: React.FormEvent) => void
}

const EMAIL_STATUS_TEXT: Record<EmailCheckStatus, { text: string; color: string } | null> = {
  idle: null,
  checking: { text: 'Comprobando disponibilidad...', color: 'text-gray-400' },
  available: { text: 'Correo disponible.', color: 'text-green-600' },
  taken: { text: 'Este correo ya está registrado.', color: 'text-red-500' },
  error: { text: 'No se pudo comprobar el correo.', color: 'text-gray-400' },
}

export default function RegisterFormFields({
  data,
  errors,
  serverError,
  loading,
  acceptedTerms,
  emailCheckStatus,
  isSubmitDisabled,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmChange,
  onBirthDateChange,
  onTermsChange,
  onSubmit,
}: RegisterFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const emailStatus = EMAIL_STATUS_TEXT[emailCheckStatus]

  return (
    <>
      <img src={logoImg} alt="TravelGo" className="w-14 h-14 mb-1 object-contain" />
      <h1 className="text-xl md:text-2xl font-bold text-gray-700 mb-3 italic">Crea tu Cuenta</h1>
      {serverError && <p className="text-red-500 text-sm mb-1 -mt-2">{serverError}</p>}
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-3">
        <div>
          <input
            type="text"
            placeholder="Nombre"
            autoComplete="name"
            value={data.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2.5 focus:outline-none focus:border-[#2A9BB5] bg-transparent"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2.5 focus:outline-none focus:border-[#2A9BB5] bg-transparent"
          />
          {errors.email && !emailStatus ? (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          ) : emailStatus ? (
            <p className={`text-xs mt-1 ${emailStatus.color}`}>{emailStatus.text}</p>
          ) : null}
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            autoComplete="bday"
            value={data.birthDate}
            onChange={(e) => onBirthDateChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2.5 focus:outline-none focus:border-[#2A9BB5] bg-transparent text-gray-700"
          />
          {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            autoComplete="new-password"
            value={data.password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2.5 focus:outline-none focus:border-[#2A9BB5] bg-transparent pr-9"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-2.5 text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            autoComplete="new-password"
            value={data.confirmPassword}
            onChange={(e) => onConfirmChange(e.target.value)}
            className="w-full border-b border-gray-300 px-2 py-2.5 focus:outline-none focus:border-[#2A9BB5] bg-transparent pr-9"
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-1 top-2.5 text-gray-400 hover:text-gray-600">
            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
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
          {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="bg-[#2A9BB5] text-white py-2.5 rounded-full font-bold hover:bg-teal-600 transition mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Cargando...' : 'REGISTRARSE'}
        </button>
      </form>

      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </>
  )
}