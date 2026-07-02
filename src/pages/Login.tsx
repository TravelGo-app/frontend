import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.login(loginData.email, loginData.password)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.register(registerData.name, registerData.email, registerData.password)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-[800px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">

        {/* FORMULARIO LOGIN */}
        <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-500 ${isRegister ? 'opacity-0 pointer-events-none translate-x-[-100%]' : 'opacity-100 translate-x-0'}`}>
          <h1 className="text-3xl font-bold text-gray-700 mb-6 italic">
            Iniciar Sesión
          </h1>
          {error && !isRegister && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-orange-400 bg-transparent"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-orange-400 bg-transparent"
            />
            <p className="text-sm text-[#2A9BB5] cursor-pointer hover:underline text-right">
              ¿Olvidaste tu contraseña?
            </p>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F26A2E] text-white py-2 rounded-full font-bold hover:bg-orange-600 transition mt-2 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'INICIAR SESIÓN'}
            </button>
          </form>
        </div>

        {/* FORMULARIO REGISTER */}
        <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-500 ${isRegister ? 'opacity-100 translate-x-0' : 'opacity-0 pointer-events-none translate-x-[100%]'}`}>
          <h1 className="text-3xl font-bold text-gray-700 mb-6 italic">
            Crea tu Cuenta
          </h1>
          {error && isRegister && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              className="border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              className="border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              className="border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#2A9BB5] bg-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2A9BB5] text-white py-2 rounded-full font-bold hover:bg-teal-600 transition mt-2 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'REGISTRARSE'}
            </button>
          </form>
        </div>

        {/* PANEL DESLIZANTE */}
        <div className={`absolute top-0 w-1/2 h-full bg-[#2A9BB5] flex flex-col items-center justify-center text-white px-10 transition-all duration-500 rounded-2xl ${isRegister ? 'left-0' : 'left-1/2'}`}>
          {!isRegister ? (
            <>
              <h2 className="text-4xl font-bold italic mb-4">¡Hola!</h2>
              <p className="text-center mb-8 text-white/80">¿Primera vez en TravelGo?</p>
              <button
                onClick={() => { setIsRegister(true); setError('') }}
                className="border-2 border-white text-white px-8 py-2 rounded-full font-bold hover:bg-white hover:text-[#2A9BB5] transition"
              >
                REGISTRARSE
              </button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold italic mb-4">¡Bienvenido!</h2>
              <p className="text-center mb-8 text-white/80">¿Ya tenés cuenta?</p>
              <button
                onClick={() => { setIsRegister(false); setError('') }}
                className="border-2 border-white text-white px-8 py-2 rounded-full font-bold hover:bg-white hover:text-[#2A9BB5] transition"
              >
                INICIAR SESIÓN
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}