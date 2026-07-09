import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import beachBg from '../assets/PlayaPrincipal.png'
import creditCard from '../assets/credicard.png'
import possibleLogo from '../assets/PosibleLogo.png'
const beachVideo = new URL('../assets/videoplaya.mp4', import.meta.url).toString()

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const v1Ref = useRef<HTMLVideoElement | null>(null)
  const v2Ref = useRef<HTMLVideoElement | null>(null)
  const [visible, setVisible] = useState<1 | 2>(1)
  const fadingRef = useRef(false)
  const CROSSFADE = 0.8

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // start first video
    v1Ref.current?.play().catch(() => {})
  }, [])

  useEffect(() => {
    const active = () => (visible === 1 ? v1Ref.current : v2Ref.current)
    const other = () => (visible === 1 ? v2Ref.current : v1Ref.current)

    const onTimeUpdate = () => {
      const a = active()
      const b = other()
      if (!a || !b || fadingRef.current) return
      const duration = a.duration
      const currentTime = a.currentTime
      if (!duration || duration === Infinity) return
      if (currentTime >= duration - CROSSFADE) {
        fadingRef.current = true
        try {
          b.currentTime = 0
          b.play().catch(() => {})
        } catch {}
        setVisible((prev) => (prev === 1 ? 2 : 1))
        window.setTimeout(() => {
          try {
            a.pause()
            a.currentTime = 0
          } catch {}
          fadingRef.current = false
        }, CROSSFADE * 1000 + 50)
      }
    }

    const a = active()
    a?.addEventListener('timeupdate', onTimeUpdate)
    return () => a?.removeEventListener('timeupdate', onTimeUpdate)
  }, [visible])

  return (
    <div className="min-h-screen overflow-hidden text-slate-900 relative landing-bg">
      {/* two videos for seamless looping via crossfade (keeps fixed size) */}
      <video
        ref={v1Ref}
        id="bg-v1"
        src={beachVideo}
        autoPlay
        muted
        playsInline
        loop={false}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          opacity: visible === 1 ? 1 : 0,
          transition: `opacity ${CROSSFADE}s linear`,
          pointerEvents: 'none',
          willChange: 'opacity, transform',
        }}
      />
      <video
        ref={v2Ref}
        id="bg-v2"
        src={beachVideo}
        autoPlay={false}
        muted
        playsInline
        loop={false}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
          opacity: visible === 2 ? 1 : 0,
          transition: `opacity ${CROSSFADE}s linear`,
          pointerEvents: 'none',
          willChange: 'opacity, transform',
        }}
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:px-8 lg:py-14 xl:grid-cols-[1.1fr_0.9fr] xl:items-start" style={{ position: 'relative', zIndex: 1 }}>
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
            className="mx-auto h-auto max-h-[76vh] w-full max-w-full rounded-[2rem] object-contain breathing"
          />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 lg:px-8 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          className="feature-card text-left"
          onClick={() => document.getElementById('section-multicurrency')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-orange-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Billetera multimoneda</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Administrá todas tus divisas desde un mismo lugar, sin cambiar de app.</p>
        </button>

        <button
          type="button"
          className="feature-card text-left"
          onClick={() => document.getElementById('section-best-rates')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-emerald-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Mejores tasas de cambio</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Aprovechá las mejores tasas en cada transferencia y evitá sorpresas.</p>
        </button>

        <button
          type="button"
          className="feature-card text-left"
          onClick={() => document.getElementById('section-secure')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-cyan-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Segura y confiable</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Tu dinero protegido con tecnologías de seguridad modernas.</p>
        </button>

        <button
          type="button"
          className="feature-card text-left"
          onClick={() => document.getElementById('section-support')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-violet-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Soporte 24/7</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Soporte disponible siempre que lo necesites, en cualquier momento.</p>
        </button>
      </div>

      {/* Secciones objetivo para cada box */}
      <section id="section-multicurrency" className="landing-section section-multicurrency" aria-label="Billetera multimoneda">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Billetera multimoneda</h3>
          <p className="text-lg text-slate-700">Administrá todas tus divisas desde un mismo lugar, controla saldos, envíos y conversiones con transparencia y rapidez.</p>
        </div>
      </section>

      <section id="section-best-rates" className="landing-section section-best-rates" aria-label="Mejores tasas de cambio">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Mejores tasas de cambio</h3>
          <p className="text-lg text-slate-700">Conecta con las mejores tasas del mercado y obtené transparencia en el proceso de cambio.</p>
        </div>
      </section>

      <section id="section-secure" className="landing-section section-secure" aria-label="Segura y confiable">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Segura y confiable</h3>
          <p className="text-lg text-slate-700">Protecciones de seguridad de nivel bancario y monitoreo constante para tu tranquilidad.</p>
        </div>
      </section>

      <section id="section-support" className="landing-section section-support" aria-label="Soporte 24/7">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Soporte 24/7</h3>
          <p className="text-lg text-slate-700">Atención multicanal y multilingüe siempre disponible para ayudarte.</p>
        </div>
      </section>
      {/* cajas de ejemplo para permitir scroll */}
      <div className="mx-auto max-w-7xl px-6 py-12 space-y-6">
        <div className="feature-card">
          <h3 className="text-xl font-bold">Caja de ejemplo 1</h3>
          <p className="mt-2 text-sm text-slate-600">Contenido de ejemplo: información adicional que se ve al scrollear.</p>
        </div>
        <div className="feature-card">
          <h3 className="text-xl font-bold">Caja de ejemplo 2</h3>
          <p className="mt-2 text-sm text-slate-600">Contenido de ejemplo: otra sección para probar scroll.</p>
        </div>
      </div>
    </div>
  )
}
