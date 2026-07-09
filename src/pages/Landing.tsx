import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const beachVideo = new URL('../assets/videoplaya.mp4', import.meta.url).toString()
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

  const v1Ref = useRef<HTMLVideoElement | null>(null)
  const v2Ref = useRef<HTMLVideoElement | null>(null)
  const [visible, setVisible] = useState<1 | 2>(1)
  const fadingRef = useRef(false)
  const CROSSFADE = 0.9 // segundos

  useEffect(() => {
    const active = () => (visible === 1 ? v1Ref.current : v2Ref.current)
    const other = () => (visible === 1 ? v2Ref.current : v1Ref.current)

    const onTimeUpdate = () => {
      const a = active()
      const b = other()
      if (!a || !b || fadingRef.current) return
      const { currentTime, duration } = a
      if (!duration || duration === Infinity) return
      if (currentTime >= duration - CROSSFADE) {
        fadingRef.current = true
        b.currentTime = 0
        b.play().catch(() => {})
        // trigger crossfade by switching visible flag; CSS transition handles opacity
        setVisible((prev) => (prev === 1 ? 2 : 1))
        // after crossfade finish, pause the previous
        setTimeout(() => {
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

  useEffect(() => {
    // ensure both videos attempt autoplay (muted)
    v1Ref.current?.play().catch(() => {})
    v2Ref.current?.play().catch(() => {})
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">
      <video
        ref={v1Ref}
        src={beachVideo}
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          opacity: visible === 1 ? 1 : 0,
          transition: `opacity ${CROSSFADE}s linear`,
        }}
      />
      <video
        ref={v2Ref}
        src={beachVideo}
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
          opacity: visible === 2 ? 1 : 0,
          transition: `opacity ${CROSSFADE}s linear`,
        }}
      />
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
            className="mx-auto h-auto max-h-[76vh] w-full max-w-full rounded-[2rem] object-contain breathing"
          />
        </div>
      </div>

      <div className="features-scroll">
        <section className="feature-section feat-multicurrency">
          <div className="feature-content max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">Billetera multimoneda</h2>
            <p className="text-lg text-white/90">Administrá todas tus divisas desde un mismo lugar, sin cambiar de app. Mantené control total sobre tus saldos y movimientos.</p>
          </div>
        </section>

        <section className="feature-section feat-best-rates">
          <div className="feature-content max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">Mejores tasas de cambio</h2>
            <p className="text-lg text-white/90">Aprovechá las mejores tasas en cada transferencia y evitá sorpresas. Cambiá con transparencia y rapidez.</p>
          </div>
        </section>

        <section className="feature-section feat-secure">
          <div className="feature-content max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">Segura y confiable</h2>
            <p className="text-lg text-white/90">Tu dinero protegido con tecnologías de seguridad modernas y controles de fraude avanzados.</p>
          </div>
        </section>

        <section className="feature-section feat-support">
          <div className="feature-content max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">Soporte 24/7</h2>
            <p className="text-lg text-white/90">Soporte disponible siempre que lo necesites, en cualquier momento y en varios idiomas.</p>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="max-w-7xl mx-auto px-6 py-10 text-center text-sm text-slate-200">© {new Date().getFullYear()} TravelGo — Todos los derechos reservados. Espacio reservado para padding inferior.</div>
        </footer>
      </div>
    </div>
  )
}
