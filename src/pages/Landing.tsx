import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import playaImg from '../assets/playa.jpg'

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${playaImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-xl mx-4 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Bienvenido a TravelGo</h1>
        <p className="text-slate-600 mb-6">
          Descubrí tu billetera de viajes y comenzá a gestionar tus divisas de forma rápida y segura.
        </p>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="bg-[#2A9BB5] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1f6f96] transition"
        >
          Comenzar
        </button>
      </div>
    </div>
  )
}
