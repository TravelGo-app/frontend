import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import playaImg from '../assets/PlayaPrincipal.png'

interface PasswordErrors {
  password?: string
  confirmPassword?: string
}

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

export default function SetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<PasswordErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { token } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e: PasswordErrors = {}
    if (!password) e.password = 'La contraseña es obligatoria'
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (!confirmPassword) e.confirmPassword = 'Confirmá tu contraseña'
    else if (password !== confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setServerError('')
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Error al configurar la contraseña')
      navigate('/dashboard')
    } catch (err: any) {
      setServerError(err.message || 'Error al configurar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${playaImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-[#faf9f7] rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#233446] mb-2 text-center">Configurar contraseña</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Tu cuenta fue creada con Google. Creá una contraseña para poder ingresar también con tu email.
        </p>

        {serverError && <p className="text-red-500 text-sm mb-4 text-center">{serverError}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent pr-8"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            <p className="text-red-500 text-xs mt-1 h-4">{errors.password || ''}</p>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent pr-8"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            <p className="text-red-500 text-xs mt-1 h-4">{errors.confirmPassword || ''}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#2A9BB5] text-white py-2 rounded-full font-bold hover:bg-teal-600 transition mt-2 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Configurar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}