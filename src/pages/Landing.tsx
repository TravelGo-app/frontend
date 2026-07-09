import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import creditCard from '../assets/credicard.png'
import possibleLogo from '../assets/PosibleLogo.png'
const beachVideo = new URL('../assets/videoplaya.mp4', import.meta.url).toString()

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const v1Ref = useRef<HTMLVideoElement | null>(null)
  const v2Ref = useRef<HTMLVideoElement | null>(null)
  const [visible, setVisible] = useState<1 | 2>(1)
  const [activeSection, setActiveSection] = useState<string>('')
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
    const sections = [
      'section-multicurrency',
      'section-best-rates',
      'section-secure',
      'section-support',
    ]
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting)
        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      {
        threshold: 0.7,
        rootMargin: '-10% 0px -10% 0px',
      },
    )

    sections.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
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
    <div className="min-h-screen overflow-x-hidden text-slate-900 relative landing-bg landing-scroll-container">
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
      <div className="watermark-cover" aria-hidden="true" />
      <section className="landing-screen landing-hero-screen mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:px-8 lg:py-14 xl:grid-cols-[1.1fr_0.9fr] xl:items-start landing-hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        <div className="space-y-8 xl:max-w-xl xl:-mt-8 hero-copy">
          <div className="mt-4 flex flex-col items-start gap-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:flex-row sm:items-center sm:justify-center xl:justify-start sm:text-5xl xl:text-6xl">
            <img src={possibleLogo} alt="Logo TravelGo" className="h-20 w-auto sm:h-24 xl:h-28" />
            <span>
              <span className="text-slate-950">Travel</span>
              <span className="text-orange-500">Go</span>
            </span>
          </div>

          <div className="space-y-6 xl:-mt-8">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Tu dinero,
              <span className="block text-orange-500">dondequiera que vayas</span>
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-900 sm:text-lg md:text-xl">
              La billetera inteligente para viajeros. Enviá, cambiá y administrá tu dinero en varias monedas sin fronteras, con seguridad y sin comisiones ocultas.
            </p>
          </div>

          <div className="flex justify-start sm:justify-center xl:justify-start">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-600 px-10 py-4 text-base sm:px-14 sm:py-5 sm:text-xl font-extrabold text-white shadow-2xl hover:from-orange-500 hover:to-orange-700 transform hover:scale-105 transition"
            >
              Empezar
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl xl:max-w-[42rem] xl:flex xl:items-center xl:-mt-10 hero-image">
          <img
            src={creditCard}
            alt="Tarjeta TravelGo"
            className="mx-auto h-auto max-h-[76vh] w-full max-w-full rounded-[2rem] object-contain breathing"
          />
        </div>
      </section>

      <section className="landing-screen landing-feature-screen mx-auto grid w-full max-w-7xl gap-6 px-6 lg:px-8 feature-boxes-grid">
        <button
          type="button"
          className="feature-card text-left"
          onClick={() => document.getElementById('section-multicurrency')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-orange-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Billetera multimoneda</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Controlá tus balances en ARS, USD, EUR, BRL y CLP desde un solo dashboard.</p>
        </button>

        <button
          type="button"
          className="feature-card text-left"
          onClick={() => document.getElementById('section-best-rates')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-emerald-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Tasas en tiempo real</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Vea conversiones con tasas actualizadas desde la API y elija el mejor momento para cambiar.</p>
        </button>

        <button
          type="button"
          className="feature-card text-left"
          onClick={() => document.getElementById('section-secure')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-cyan-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Seguridad avanzada</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">JWT, rutas protegidas y sesión segura para resguardar cada operación.</p>
        </button>

        <button
          type="button"
          className="feature-card text-left"
          onClick={() => document.getElementById('section-support')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex items-center gap-3">
            <div className="feature-accent bg-violet-400 shadow-sm" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-700">Acceso inmediato</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Registrate rápido o ingresá con Google y llega al dashboard en segundos.</p>
        </button>
      </section>

      {/* Secciones objetivo para cada box */}
      <section id="section-multicurrency" className={`landing-section section-multicurrency ${activeSection === 'section-multicurrency' ? 'section-active' : ''}`} aria-label="Billetera multimoneda">
        <div className="max-w-4xl mx-auto px-6 py-20 section-content">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Billetera multimoneda</h3>
          <p className="text-lg text-slate-700">TravelGo te permite gestionar saldos en ARS, USD, EUR, BRL y CLP desde una sola aplicación. Podés ver tus balances, enviar dinero y mantener el control de todas tus divisas sin cambiar de plataforma.</p>
        </div>
      </section>

      <section id="section-best-rates" className={`landing-section section-best-rates ${activeSection === 'section-best-rates' ? 'section-active' : ''}`} aria-label="Mejores tasas de cambio">
        <div className="max-w-4xl mx-auto px-6 py-20 section-content">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Tasas en tiempo real</h3>
          <p className="text-lg text-slate-700">Nuestra app consulta tasas actualizadas desde la API y muestra conversiones reales para que puedas elegir el mejor momento para cambiar o transferir. El cálculo se hace al instante para tus monedas favoritas.</p>
        </div>
      </section>

      <section id="section-secure" className={`landing-section section-secure ${activeSection === 'section-secure' ? 'section-active' : ''}`} aria-label="Segura y confiable">
        <div className="max-w-4xl mx-auto px-6 py-20 section-content">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Segura y confiable</h3>
          <p className="text-lg text-slate-700">Autenticación segura con JWT, rutas protegidas y token en localStorage para mantener tu sesión activa. La app valida email y contraseña, y protege cada operación con buenas prácticas de seguridad.</p>
        </div>
      </section>

      <section id="section-support" className={`landing-section section-support ${activeSection === 'section-support' ? 'section-active' : ''}`} aria-label="Acceso inmediato">
        <div className="max-w-4xl mx-auto px-6 py-20 section-content">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Acceso inmediato</h3>
          <p className="text-lg text-slate-700">Registrate con email o ingresá rápidamente usando Google. Desde el primer momento tenés acceso al dashboard, wallet y todas las herramientas para gestionar tu dinero durante tu viaje.</p>
        </div>
      </section>
    </div>
  )
}
