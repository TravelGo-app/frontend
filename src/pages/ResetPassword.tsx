import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/api'
import { validateNewPasswordField, validateConfirmField } from '../utils/authValidators'
import playaImg from '../assets/PlayaPrincipal.png'
import logoImg from '../assets/PosibleLogo.png'

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [confirmError, setConfirmError] = useState<string | undefined>()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordError(validateNewPasswordField(value))
    if (confirmPassword) {
      setConfirmError(validateConfirmField(confirmPassword, value))
    }
  }

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value)
    setConfirmError(validateConfirmField(value, password))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    const pError = validateNewPasswordField(password)
    const cError = validateConfirmField(confirmPassword, password)
    if (pError || cError) {
      setPasswordError(pError)
      setConfirmError(cError)
      return
    }

    setServerError('')
    setLoading(true)
    try {
      await authService.resetPassword(token, password)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (err: any) {
      const status = err.response?.status
      if (status === 400) {
        setServerError('El link es inválido o venció. Solicitá uno nuevo.')
      } else {
        setServerError(err.response?.data?.error || err.response?.data?.message || 'No se pudo actualizar la contraseña')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${playaImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-[#faf9f7] rounded-2xl shadow-2xl p-8 sm:p-10 max-w-sm w-full flex flex-col items-center">
        <img src={logoImg} alt="TravelGo" className="w-16 h-16 mb-3 object-contain" />

        {!token ? (
          <>
            <h1 className="text-xl font-bold text-gray-700 mb-3 italic text-center">Link inválido</h1>
            <p className="text-gray-500 text-sm text-center mb-6">Link inválido o incompleto.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#F26A2E] text-white py-2 px-6 rounded-full font-bold hover:bg-orange-600 transition"
            >
              Volver a iniciar sesión
            </button>
          </>
        ) : success ? (
          <>
            <div className="text-5xl mb-3">✅</div>
            <h1 className="text-xl font-bold text-gray-700 mb-2 italic text-center">¡Listo!</h1>
            <p className="text-gray-500 text-sm text-center mb-4">
              Contraseña actualizada correctamente. Iniciá sesión con tu nueva contraseña.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-[#F26A2E] border-t-transparent rounded-full animate-spin"></div>
              Redirigiendo...
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-gray-700 mb-1 italic text-center">Nueva contraseña</h1>
            <p className="text-gray-500 text-sm text-center mb-4">Ingresá tu nueva contraseña para TravelGo.</p>
            <p className="text-red-500 text-sm mb-1 h-5 text-center">{serverError}</p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nueva contraseña"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#F26A2E] bg-transparent pr-8"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
                <p className="text-red-500 text-xs mt-1 h-4">{passwordError || ''}</p>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmar contraseña"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmChange(e.target.value)}
                  className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#F26A2E] bg-transparent pr-8"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
                <p className="text-red-500 text-xs mt-1 h-4">{confirmError || ''}</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#F26A2E] text-white py-2 rounded-full font-bold hover:bg-orange-600 transition mt-2 disabled:opacity-50"
              >
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}