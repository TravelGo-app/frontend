import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'
import { GoogleLoginButton } from '../components/GoogleLoginButton'
import playaImg from '../assets/playa.jpg'

interface LoginErrors {
  email?: string
  password?: string
}

interface RegisterErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
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

const GoogleButtonMemo = ({ onAuthenticated }: { onAuthenticated: (result: any) => void }) => (
  <div className="flex flex-col items-center gap-2 mt-2">
    <span className="text-gray-400 text-xs">o continuá con</span>
    <div style={{ width: '320px', height: '44px', overflow: 'hidden' }}>
      <GoogleLoginButton onAuthenticated={onAuthenticated} />
    </div>
  </div>
)

export default function Login() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialRegisterMode = location.pathname === '/register'
  const [isRegister, setIsRegister] = useState(initialRegisterMode)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({})
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeName, setWelcomeName] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { login } = useAuth()

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsRegister(true)
    } else if (location.pathname === '/login' || location.pathname === '/') {
      setIsRegister(false)
    }
  }, [location.pathname])

  const handleGoogleAuth = (result: any) => {
    login(result.user, result.token)
    navigate('/dashboard')
  }

  const validateLogin = () => {
    const errors: LoginErrors = {}
    if (!loginData.email) errors.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(loginData.email)) errors.email = 'Email inválido'
    if (!loginData.password) errors.password = 'La contraseña es obligatoria'
    else if (loginData.password.length < 6) errors.password = 'Mínimo 6 caracteres'
    return errors
  }

  const validateRegister = () => {
    const errors: RegisterErrors = {}
    if (!registerData.name) errors.name = 'El nombre es obligatorio'
    else if (registerData.name.length < 3) errors.name = 'Mínimo 3 caracteres'
    if (!registerData.email) errors.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(registerData.email)) errors.email = 'Email inválido'
    if (!registerData.password) errors.password = 'La contraseña es obligatoria'
    else if (registerData.password.length < 6) errors.password = 'Mínimo 6 caracteres'
    if (!registerData.confirmPassword) errors.confirmPassword = 'Confirmá tu contraseña'
    else if (registerData.password !== registerData.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden'
    if (!acceptedTerms) errors.terms = 'Debés aceptar los términos y condiciones'
    return errors
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateLogin()
    if (Object.keys(errors).length > 0) { setLoginErrors(errors); return }
    setLoginErrors({})
    setServerError('')
    setLoading(true)
    try {
      const data = await authService.login(loginData.email, loginData.password)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setServerError(err.response?.data?.message || err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validateRegister()
    if (Object.keys(errors).length > 0) { setRegisterErrors(errors); return }
    setRegisterErrors({})
    setServerError('')
    setLoading(true)
    try {
      const data = await authService.register(registerData.name, registerData.email, registerData.password)
      login(data.user, data.token)
      setWelcomeName(data.user.name)
      setShowWelcome(true)
      setTimeout(() => navigate('/dashboard'), 2500)
    } catch (err: any) {
      setServerError(err.response?.data?.message || err.response?.data?.error || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  if (showWelcome) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: `url(${playaImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#233446] mb-2">¡Bienvenido a TravelGo, {welcomeName}!</h2>
          <p className="text-gray-400 mb-6">Tu cuenta fue creada exitosamente.</p>
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-[#F26A2E] border-t-transparent rounded-full animate-spin"></div>
            Redirigiendo...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${playaImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="relative w-[800px] h-[620px] bg-[#faf9f7] rounded-2xl shadow-2xl overflow-hidden flex">

        {/* FORMULARIO LOGIN */}
        <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-500 ${isRegister ? 'opacity-0 pointer-events-none translate-x-[-100%]' : 'opacity-100 translate-x-0'}`}>
          <h1 className="text-3xl font-bold text-gray-700 mb-4 italic">Iniciar Sesión</h1>
          <p className="text-red-500 text-sm mb-2 h-5">{serverError && !isRegister ? serverError : ''}</p>
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-2">
            <div>
              <input
                type="text"
                placeholder="Email"
                autoComplete="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#F26A2E] bg-transparent"
              />
              <p className="text-red-500 text-xs mt-1 h-4">{loginErrors.email || ''}</p>
            </div>
            <div className="relative">
              <input
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                autoComplete="current-password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#F26A2E] bg-transparent pr-8"
              />
              <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
                {showLoginPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
              <p className="text-red-500 text-xs mt-1 h-4">{loginErrors.password || ''}</p>
            </div>
            <p className="text-sm text-[#F26A2E] cursor-pointer hover:underline text-right">¿Olvidaste tu contraseña?</p>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F26A2E] text-white py-2 rounded-full font-bold hover:bg-orange-600 transition mt-2 disabled:opacity-50"
            >
              INICIAR SESIÓN
            </button>
          </form>
          <GoogleButtonMemo onAuthenticated={handleGoogleAuth} />
        </div>

        {/* FORMULARIO REGISTER */}
        <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-500 ${isRegister ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none translate-x-[100%]'}`}>
          <h1 className="text-3xl font-bold text-gray-700 mb-2 italic">Crea tu Cuenta</h1>
          <p className="text-red-500 text-sm mb-1 h-5">{serverError && isRegister ? serverError : ''}</p>
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-2">
            <div>
              <input
                type="text"
                placeholder="Nombre"
                autoComplete="name"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent"
              />
              <p className="text-red-500 text-xs mt-1 h-4">{registerErrors.name || ''}</p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Email"
                autoComplete="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent"
              />
              <p className="text-red-500 text-xs mt-1 h-4">{registerErrors.email || ''}</p>
            </div>
            <div className="relative">
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                autoComplete="new-password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent pr-8"
              />
              <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
                {showRegisterPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
              <p className="text-red-500 text-xs mt-1 h-4">{registerErrors.password || ''}</p>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmar contraseña"
                autoComplete="new-password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent pr-8"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-1 top-2 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
              <p className="text-red-500 text-xs mt-1 h-4">{registerErrors.confirmPassword || ''}</p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 accent-[#2A9BB5]"
                />
                Acepto los{' '}
                <span className="text-[#2A9BB5] hover:underline">términos y condiciones</span>
              </label>
              <p className="text-red-500 text-xs mt-1 h-4">{registerErrors.terms || ''}</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2A9BB5] text-white py-2 rounded-full font-bold hover:bg-teal-600 transition mt-2 disabled:opacity-50"
            >
              REGISTRARSE
            </button>
          </form>
        </div>

        {/* PANEL DESLIZANTE */}
        <div className={`absolute top-0 w-1/2 h-full flex flex-col items-center justify-center text-white px-10 transition-all duration-500 rounded-2xl ${isRegister ? 'left-0 bg-[#2A9BB5]' : 'left-1/2 bg-[#F26A2E]'}`}>
          {!isRegister ? (
            <>
              <h2 className="text-4xl font-bold italic mb-4">¡Hola!</h2>
              <p className="text-center mb-8 text-white/80">¿Primera vez en TravelGo?</p>
<button
  onClick={() => {
    setIsRegister(true)
    setServerError('')
    setLoginErrors({})
    navigate('/register')
  }}
  className="border-2 border-white text-white px-8 py-2 rounded-full font-bold hover:bg-white hover:text-[#F26A2E] transition"
>
  REGISTRARSE
</button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold italic mb-4">¡Bienvenido!</h2>
              <p className="text-center mb-8 text-white/80">¿Ya tenés cuenta?</p>
              <button onClick={() => { setIsRegister(false); setServerError(''); setRegisterErrors({}); navigate('/login') }} className="border-2 border-white text-white px-8 py-2 rounded-full font-bold hover:bg-white hover:text-[#2A9BB5] transition">
                INICIAR SESIÓN
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}