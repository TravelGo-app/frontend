import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import possibleLogo from '../assets/PosibleLogo.png'
import creditCard from '../assets/credicard.png'
import secureVideo from '../assets/VideoCandado.mp4'
import onlyCreditCard from '../assets/OnlyCredicard.png'
import celularTasas from '../assets/celulartazas.png'
import phoneTrip from '../assets/phoneTrip.png'
const beachVideo = new URL('../assets/Playafondo.mp4', import.meta.url).toString()

export default function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const v1Ref = useRef<HTMLVideoElement | null>(null)
  const v2Ref = useRef<HTMLVideoElement | null>(null)
  const [visible, setVisible] = useState<1 | 2>(1)
  const [activeSection, setActiveSection] = useState<string>('section-feature-boxes')
  const [multicurrencyRotation, setMulticurrencyRotation] = useState({ x: 0, y: 0 })
  const [secureRotation, setSecureRotation] = useState({ x: 0, y: 0 })
  const [isMulticurrencyVisible, setIsMulticurrencyVisible] = useState(false)
  const [isSecureVisible, setIsSecureVisible] = useState(false)
  const multicurrencyMediaRef = useRef<HTMLDivElement | null>(null)
  const secureMediaRef = useRef<HTMLDivElement | null>(null)
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
    const sectionIds = [
      'section-feature-boxes',
      'section-multicurrency',
      'section-best-rates',
      'section-secure',
      'section-support',
    ]
    const container = document.querySelector('.landing-scroll-container')

    const getActiveSection = () => {
      const sections = sectionIds
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null)

      const positiveSections = sections
        .map((section) => ({ section, top: section.getBoundingClientRect().top }))
        .filter(({ top }) => top >= 0)

      const closest = positiveSections.length > 0
        ? positiveSections.reduce<{ section: HTMLElement; top: number } | null>((current, candidate) => {
            if (!current || candidate.top < current.top) {
              return candidate
            }
            return current
          }, null)
        : sections
            .map((section) => ({ section, top: section.getBoundingClientRect().top }))
            .filter(({ top }) => top < 0)
            .reduce<{ section: HTMLElement; top: number } | null>((current, candidate) => {
              if (!current || candidate.top > current.top) {
                return candidate
              }
              return current
            }, null)

      if (closest?.section?.id && closest.section.id !== activeSection) {
        setActiveSection(closest.section.id)
      }
    }

    getActiveSection()
    container?.addEventListener('scroll', getActiveSection, { passive: true })
    window.addEventListener('resize', getActiveSection)

    return () => {
      container?.removeEventListener('scroll', getActiveSection)
      window.removeEventListener('resize', getActiveSection)
    }
  }, [activeSection])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === multicurrencyMediaRef.current) {
          setIsMulticurrencyVisible(entry.isIntersecting)
          if (!entry.isIntersecting) {
            setMulticurrencyRotation({ x: 0, y: 0 })
          }
        }

        if (entry.target === secureMediaRef.current) {
          setIsSecureVisible(entry.isIntersecting)
          if (!entry.isIntersecting) {
            setSecureRotation({ x: 0, y: 0 })
          }
        }
      })
    }, { threshold: 0.25 })

    if (multicurrencyMediaRef.current) {
      observer.observe(multicurrencyMediaRef.current)
    }

    if (secureMediaRef.current) {
      observer.observe(secureMediaRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handlePointerMove = (event: MouseEvent) => {
      if (isMulticurrencyVisible && multicurrencyMediaRef.current) {
        const rect = multicurrencyMediaRef.current.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5

        setMulticurrencyRotation({
          x: y * -10,
          y: x * 10,
        })
      }

      if (isSecureVisible && secureMediaRef.current) {
        const rect = secureMediaRef.current.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5

        setSecureRotation({
          x: y * -10,
          y: x * 10,
        })
      }
    }

    window.addEventListener('mousemove', handlePointerMove)

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
    }
  }, [isMulticurrencyVisible, isSecureVisible])

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

      <section id="section-feature-boxes" className={`landing-screen landing-section landing-feature-screen mx-auto w-full px-6 py-16 lg:px-8 ${activeSection === 'section-feature-boxes' ? 'section-active' : ''}`}>
        <div className={`mx-auto w-full max-w-[1440px] section-content rounded-[2.5rem] border border-slate-200/70 bg-white/95 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.08)] backdrop-blur-sm ${activeSection === 'section-feature-boxes' ? 'section-visible' : ''}`}>
          <div className="grid gap-10 lg:grid-cols-[0.6fr_0.4fr] lg:items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-slate-800">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-200 text-cyan-700">🟦</span>
                TODO LO QUE NECESITÁS
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
                  Una wallet pensada
                  <span className="block text-orange-500">para tu viaje</span>
                </h2>
                <p className="text-lg leading-8 text-slate-600">Tecnología, seguridad y facilidad en un solo lugar. Gestioná tu dinero en el exterior de forma simple, rápida y segura.</p>
              </div>
            </div>
            <div className="feature-cards grid gap-8 xl:gap-10 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => document.getElementById('section-multicurrency')?.scrollIntoView({ behavior: 'smooth' })}
                className="group feature-card rounded-[1.5rem] bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="feature-accent-bar accent-orange mb-4" />
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600 text-xl">💳</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">Billetera multimoneda</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">Controlá tus balances en ARS, USD, EUR, BRL y CLP desde un solo dashboard.</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => document.getElementById('section-best-rates')?.scrollIntoView({ behavior: 'smooth' })}
                className="group feature-card rounded-[1.5rem] bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="feature-accent-bar accent-green mb-4" />
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xl">📈</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">Tasas en tiempo real</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">Vea conversiones con tasas actualizadas desde la API y elija el mejor momento para cambiar.</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => document.getElementById('section-secure')?.scrollIntoView({ behavior: 'smooth' })}
                className="group feature-card rounded-[1.5rem] bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="feature-accent-bar accent-cyan mb-4" />
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 text-xl">🛡️</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">Seguridad avanzada</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">JWT, rutas protegidas y sesión segura para resguardar cada operación.</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => document.getElementById('section-support')?.scrollIntoView({ behavior: 'smooth' })}
                className="group feature-card rounded-[1.5rem] bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,0.06)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="feature-accent-bar accent-violet mb-4" />
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600 text-xl">⚡</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-900">Acceso inmediato</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">Registrate rápido o ingresá con Google y llega al dashboard en segundos.</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Secciones objetivo para cada box */}
      <section id="section-multicurrency" className={`landing-section section-multicurrency ${activeSection === 'section-multicurrency' ? 'section-active' : ''}`} aria-label="Billetera multimoneda">
        <div className="mx-auto max-w-[1440px] px-10 lg:px-14 py-20 section-content" style={{ maxWidth: '1440px' }}>
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6 max-w-xl">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-white/90">
                <span className="rounded-full bg-white/20 px-3 py-1 text-white">Nuevo</span>
                <span className="text-white/80">Todo tu dinero, en un solo lugar</span>
              </div>
              <h3 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">Billetera Multimoneda</h3>
              <p className="max-w-xl text-lg leading-8 text-white/90">Gestioná tus saldos en ARS, USD, EUR, BRL y CLP desde una sola aplicación.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-4 shadow-[0_15px_35px_rgba(255,255,255,0.12)] backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white text-lg">🌐</span>
                    <span className="text-sm font-semibold text-white">30+ monedas</span>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-4 shadow-[0_15px_35px_rgba(255,255,255,0.12)] backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white text-lg">⚡</span>
                    <span className="text-sm font-semibold text-white">Tipo de cambio en tiempo real</span>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-4 shadow-[0_15px_35px_rgba(255,255,255,0.12)] backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white text-lg">🔒</span>
                    <span className="text-sm font-semibold text-white">Seguridad de nivel bancario</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={multicurrencyMediaRef}
              className="mx-auto flex items-center justify-center overflow-hidden multicurrency-card-wrapper"
              style={{
                perspective: '1000px',
                transform: `perspective(1000px) rotateX(${multicurrencyRotation.x}deg) rotateY(${multicurrencyRotation.y}deg)`,
                transition: 'transform 0.2s ease-out',
              }}
            >
              <img
                src={onlyCreditCard}
                alt="Tarjeta TravelGo"
                className="w-full h-auto object-contain multicurrency-card-image"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="section-best-rates" className={`landing-section section-best-rates ${activeSection === 'section-best-rates' ? 'section-active' : ''}`} aria-label="Mejores tasas de cambio">
        <div className="mx-auto max-w-[1440px] px-10 lg:px-14 py-20 section-content" style={{ maxWidth: '1440px' }}>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                <span className="text-orange-500">⚡</span>
                <span>En tiempo real</span>
              </div>
              <h3 className="text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">Tasas en tiempo real</h3>
              <p className="max-w-lg text-lg leading-8 text-slate-700">Nuestra app consulta tasas actualizadas desde la API y muestra conversiones reales para que puedas elegir el mejor momento para cambiar o transferir.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                  <p className="text-sm font-semibold text-slate-950">Actualización al instante</p>
                  <p className="mt-2 text-sm text-slate-600">Datos en tiempo real desde fuentes confiables.</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                  <p className="text-sm font-semibold text-slate-950">Conversiones precisas</p>
                  <p className="mt-2 text-sm text-slate-600">Cálculos exactos al momento, sin demoras.</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-4 shadow-[0_15px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:col-span-2">
                  <p className="text-sm font-semibold text-slate-950">Mejor momento para ti</p>
                  <p className="mt-2 text-sm text-slate-600">Compara y elige cuando más te convenga.</p>
                </div>
              </div>
            </div>
            <div className="relative mx-auto max-w-xl lg:max-w-2xl">
              <div className="overflow-hidden rounded-[2rem] p-4 bg-transparent shadow-none">
                <img
                  src={celularTasas}
                  alt="Celular con tasas en tiempo real"
                  className="w-full h-auto rounded-[1.5rem] object-cover breathing"
                  style={{ maxHeight: '860px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="section-secure" className={`landing-section section-secure ${activeSection === 'section-secure' ? 'section-active' : ''}`} aria-label="Segura y confiable">
        <div className="mx-auto max-w-[1440px] px-10 lg:px-14 py-20 section-content" style={{ maxWidth: '1440px' }}>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm border border-white/15">
                <span className="text-orange-500">🛡️</span>
                <span>Tu seguridad, nuestra prioridad</span>
              </div>
              <h3 className="text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
                Segura y <span className="text-orange-500">confiable</span>
              </h3>
              <p className="max-w-xl text-lg leading-8 text-slate-700">Autenticación segura con JWT, rutas protegidas y token en localStorage para mantener tu sesión activa. La app valida email y contraseña, y protege cada operación con buenas prácticas de seguridad.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-5 shadow-[0_15px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600">🛡️</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Autenticación segura (JWT)</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-5 shadow-[0_15px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-900">🔒</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Rutas protegidas</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-5 shadow-[0_15px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">🔑</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Token en localStorage</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 px-4 py-5 shadow-[0_15px_35px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">✉️</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Validación de email y contraseña</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              ref={secureMediaRef}
              className="mx-auto flex items-center justify-center overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/5 shadow-2xl"
              style={{
                perspective: '1000px',
                transform: `perspective(1000px) rotateX(${secureRotation.x}deg) rotateY(${secureRotation.y}deg)`,
                transition: 'transform 0.2s ease-out',
                maxWidth: '560px',
              }}
            >
              <video
                src={secureVideo}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-contain"
                style={{ maxHeight: '420px' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="section-support" className={`landing-section section-support ${activeSection === 'section-support' ? 'section-active' : ''}`} aria-label="Acceso inmediato">
        <div className="mx-auto max-w-[1440px] px-10 lg:px-14 py-20 section-content" style={{ maxWidth: '1440px' }}>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-6 max-w-xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-slate-950/10 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,23,42,0.12)] border border-white/10 backdrop-blur-sm">
                <span className="text-cyan-300">⚡</span>
                <span>Empezá en segundos</span>
              </div>
              <h3 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                Acceso <span className="text-cyan-300">inmediato</span>
              </h3>
              <p className="max-w-lg text-lg leading-8 text-slate-200">Registrate con email o ingresá rápidamente usando Google. Desde el primer momento tenés acceso al dashboard, wallet y todas las herramientas para gestionar tu dinero durante tu viaje.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <button type="button" className="group flex items-center gap-3 rounded-[1.75rem] border border-white/15 bg-slate-950/15 px-5 py-4 text-left transition hover:bg-slate-950/30">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cyan-300/15 text-cyan-300">✉️</span>
                  <div>
                    <p className="text-base font-semibold text-white">Registro con email</p>
                  </div>
                </button>
                <button type="button" className="group flex items-center gap-3 rounded-[1.75rem] border border-white/15 bg-slate-950/15 px-5 py-4 text-left transition hover:bg-slate-950/30">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">G</span>
                  <div>
                    <p className="text-base font-semibold text-white">Ingresá con Google</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="relative mx-auto max-w-xl lg:max-w-2xl">
              <div className="overflow-hidden rounded-[2rem] bg-transparent p-0">
                <img
                  src={phoneTrip}
                  alt="Celular Trip"
                  className="w-full h-auto rounded-[1.5rem] object-cover breathing"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
