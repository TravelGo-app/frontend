import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import beachBg from '../assets/PlayaPrincipal.png'
import creditCard from '../assets/credicard.png'
import possibleLogo from '../assets/PosibleLogo.png'

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
      className="min-h-screen overflow-hidden text-slate-900"
      style={{ backgroundImage: `url(${beachBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:px-8 lg:py-14 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
        <div className="space-y-8 xl:max-w-xl xl:-mt-8">
          <div className="mt-4 flex items-center gap-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
            <img src={possibleLogo} alt="Logo TravelGo" className="h-20 w-auto sm:h-24 xl:h-28" />
            <span>
              <span className="text-slate-950">Travel</span>
              <span className="text-orange-500">Go</span>
            </span>
          </div>

          <div className="space-y-6 xl:-mt-8">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Tu dinero,
              <span className="block text-orange-500">dondequiera que vayas</span>
            </h1>
            <p className="max-w-lg text-lg leading-8 text-slate-900">
              La billetera inteligente para viajeros. Enviá, cambiá y administrá tu dinero en varias monedas sin fronteras, con seguridad y sin comisiones ocultas.
            </p>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-600 px-16 py-5 text-xl font-extrabold text-white shadow-2xl hover:from-orange-500 hover:to-orange-700 transform hover:scale-105 transition"
            >
              Empezar
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl xl:max-w-[42rem] xl:flex xl:items-center xl:-mt-10">
          <img
            src={creditCard}
            alt="Tarjeta TravelGo"
            className="mx-auto h-auto max-h-[76vh] w-full max-w-full rounded-[2rem] object-contain"
          />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 lg:px-8 sm:grid-cols-2 xl:grid-cols-4">
        <div className="feature-card">
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-orange-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Billetera multimoneda</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Administrá todas tus divisas desde un mismo lugar, sin cambiar de app.</p>
        </div>

        <div className="feature-card">
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-emerald-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Mejores tasas de cambio</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Aprovechá las mejores tasas en cada transferencia y evitá sorpresas.</p>
        </div>

        <div className="feature-card">
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-cyan-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Segura y confiable</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Tu dinero protegido con tecnologías de seguridad modernas.</p>
        </div>

        <div className="feature-card">
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-violet-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Soporte 24/7</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Soporte disponible siempre que lo necesites, en cualquier momento.</p>
        </div>
      </div>
    </div>
  )
}
