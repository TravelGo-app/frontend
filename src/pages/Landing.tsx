import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import beachBg from '../assets/PlayaPrincipal.png'

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
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 lg:px-8 lg:py-16 xl:flex-row xl:items-center">
        <div className="space-y-8 xl:max-w-xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/80 backdrop-blur-sm">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-400" />
            TravelGo · Tu wallet de viaje
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Your money,
              <span className="block text-orange-500">anywhere you go</span>
            </h1>
            <p className="max-w-lg text-lg leading-8 text-slate-600">
              La billetera inteligente para viajeros. Enviá, cambiá y administrá tu dinero en varias monedas sin fronteras, con seguridad y sin comisiones ocultas.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-10 py-3 text-base font-semibold text-white shadow-lg shadow-orange-200/50 transition hover:bg-orange-600"
            >
              Empezar
            </button>
            <button
              type="button"
              onClick={() => navigate('/about-us')}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-10 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Conocé más
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200/70">
              <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Multi-currency wallet</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Administrá todas tus divisas desde un mismo lugar, sin cambiar de app.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200/70">
              <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Best exchange rates</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Aprovechá las mejores tasas en cada transferencia y evitá sorpresas.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200/70">
              <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Secure & reliable</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Tu dinero protegido con tecnologías de seguridad modernas.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-200/70">
              <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">24/7 support</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Soporte disponible siempre que lo necesites, en cualquier momento.</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl xl:max-w-[42rem]">
          <div className="absolute -left-10 top-10 h-52 w-52 rounded-full bg-orange-200/60 blur-3xl" />
          <div className="absolute -right-12 bottom-12 h-44 w-44 rounded-full bg-sky-200/60 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/90 p-8 shadow-[0_45px_120px_-40px_rgba(15,23,42,0.35)]">
            <div className="relative rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-600 p-8 text-white shadow-inner shadow-slate-900/20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Total balance</p>
                  <p className="mt-3 text-4xl font-semibold">$8,420.35</p>
                </div>
                <div className="rounded-3xl bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-100">USD</div>
              </div>
              <div className="grid gap-4 text-sm text-slate-200">
                <div className="flex items-center justify-between rounded-3xl bg-white/10 p-4">
                  <span>USD</span>
                  <span>$2,450.35</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-white/10 p-4">
                  <span>EUR</span>
                  <span>€1,250.00</span>
                </div>
                <div className="flex items-center justify-between rounded-3xl bg-white/10 p-4">
                  <span>COP</span>
                  <span>$4,720,000</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.75rem] bg-slate-100 p-5 shadow-lg shadow-slate-200/60">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Quick Actions</span>
                <span className="text-slate-400">View all</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <button className="rounded-3xl bg-white px-3 py-3 text-xs font-semibold text-slate-700 shadow-sm">Exchange</button>
                <button className="rounded-3xl bg-white px-3 py-3 text-xs font-semibold text-slate-700 shadow-sm">Send</button>
                <button className="rounded-3xl bg-white px-3 py-3 text-xs font-semibold text-slate-700 shadow-sm">Receive</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
