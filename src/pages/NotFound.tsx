import { useNavigate } from 'react-router-dom'
import playaImg from '../assets/playa.jpg'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: '#f6ddc6',
      fontFamily: "'Poppins', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes orbit404 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0%,100% { opacity:.6; transform:scale(1); } 50% { opacity:.92; transform:scale(1.05); } }
        @keyframes coinCycle {
          0% { opacity:0; transform:scale(.5); }
          3% { opacity:1; transform:scale(1); }
          17% { opacity:1; transform:scale(1); }
          20% { opacity:0; transform:scale(1.3); }
          100% { opacity:0; }
        }
      `}</style>

      {/* Fondo playa */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `url(${playaImg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(1.5px)', transform: 'scale(1.03)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(255,251,244,.24) 0%, rgba(255,248,238,.18) 45%, rgba(245,238,232,.28) 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(110% 90% at 50% 44%, rgba(255,255,255,.16) 0%, rgba(255,255,255,0) 55%, rgba(120,90,60,.14) 100%)',
      }} />

      {/* Contenido */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        padding: '52px 60px', maxWidth: '660px',
        background: 'rgba(255,255,255,.14)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        borderRadius: '28px',
        border: '1px solid rgba(255,255,255,.42)',
        boxShadow: '0 24px 64px rgba(35,52,70,.24)',
      }}>

        {/* 4 [orbe] 4 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '150px', lineHeight: 1, fontWeight: 800, color: '#233446', letterSpacing: '-4px', textShadow: '0 6px 26px rgba(35,52,70,.18)' }}>4</span>

          <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 -6px' }}>
            <div style={{ position: 'absolute', width: '108px', height: '108px', borderRadius: '50%', boxShadow: '0 16px 34px rgba(35,52,70,.28)' }} />
            <div style={{
              position: 'absolute', width: '108px', height: '108px', borderRadius: '50%',
              background: 'radial-gradient(circle at 34% 30%, #e4c2a2 0%, #ff7d60 30%, #ff4242 56%, #2391ae 86%, #17323f 100%)',
              filter: 'blur(.5px)',
              animation: 'pulseGlow 4.5s ease-in-out infinite',
            }} />
            <div style={{
              position: 'absolute', width: '108px', height: '108px', borderRadius: '50%',
              background: 'radial-gradient(circle at 70% 76%, rgba(35,145,174,.5) 0%, rgba(35,145,174,0) 55%)',
            }} />

            {/* Símbolos de monedas */}
            <div style={{ position: 'absolute', width: '108px', height: '108px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[
                { symbol: '$', delay: '0s' },
                { symbol: '€', delay: '2.5s' },
                { symbol: '£', delay: '5s' },
                { symbol: '¥', delay: '7.5s', size: '44px' },
                { symbol: '₿', delay: '10s', size: '42px' },
              ].map(({ symbol, delay, size }) => (
                <span key={symbol} style={{
                  position: 'absolute', opacity: 0,
                  fontSize: size || '46px', fontWeight: 700,
                  color: '#f6f1ea', textShadow: '0 2px 10px rgba(0,0,0,.35)',
                  animation: `coinCycle 12.5s ease-in-out infinite backwards`,
                  animationDelay: delay,
                }}>{symbol}</span>
              ))}
            </div>

            <div style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', border: '1.5px solid rgba(228,194,162,.16)' }} />

            {/* Avión orbitando */}
            <div style={{ position: 'absolute', width: '150px', height: '150px', animation: 'orbit404 9s linear infinite' }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: `conic-gradient(from 0deg,
                  rgba(255,66,66,.98) 0deg,
                  rgba(255,125,96,0) 5deg,
                  rgba(35,145,174,0) 140deg,
                  rgba(35,145,174,.4) 235deg,
                  rgba(35,145,174,.72) 315deg,
                  rgba(255,125,96,.92) 351deg,
                  rgba(255,66,66,.98) 360deg)`,
                WebkitMask: 'radial-gradient(circle, transparent 65%, #000 68%, #000 74%, transparent 77%)',
                mask: 'radial-gradient(circle, transparent 65%, #000 68%, #000 74%, transparent 77%)',
                filter: 'drop-shadow(0 0 6px rgba(35,145,174,.45))',
              }} />
              <svg viewBox="0 0 24 24" width="30" height="30" style={{
                position: 'absolute', top: '-15px', left: '60px',
                filter: 'drop-shadow(0 2px 6px rgba(35,52,70,.45))',
                transform: 'rotate(45deg)',
              }} fill="#233446">
                <path d="M21.5 12c0-.6-.4-1.1-1-1.3L14 8.5V3.8c0-.9-.7-1.6-1.6-1.6h-.8c-.9 0-1.6.7-1.6 1.6v4.7L3.5 10.7c-.6.2-1 .7-1 1.3v1.1c0 .4.4.7.8.6L10 12.9v3.9l-1.9 1.2c-.2.1-.3.3-.3.5v.8c0 .3.3.5.6.4l3.6-1 3.6 1c.3.1.6-.1.6-.4v-.8c0-.2-.1-.4-.3-.5L14 16.8v-3.9l6.7 1.8c.4.1.8-.2.8-.6V12z"/>
              </svg>
            </div>
          </div>

          <span style={{ fontSize: '150px', lineHeight: 1, fontWeight: 800, color: '#233446', letterSpacing: '-4px', textShadow: '0 6px 26px rgba(35,52,70,.18)' }}>4</span>
        </div>

        <h1 style={{ margin: '18px 0 0', fontSize: '34px', fontWeight: 700, color: '#1a2a3a', textShadow: '0 1px 2px rgba(255,255,255,.7), 0 2px 22px rgba(255,255,255,.7)' }}>
          ¡Esta página se perdió en el camino!
        </h1>
        <p style={{ margin: '16px 0 0', fontSize: '16px', lineHeight: 1.6, color: '#243444', fontWeight: 500, textShadow: '0 1px 12px rgba(255,255,255,.8)', maxWidth: '440px' }}>
          No encontramos lo que buscabas. Puede que la dirección haya cambiado o el destino ya no exista.
        </p>

        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '34px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '15px 40px', borderRadius: '8px', border: '1.5px solid #2391ae',
            color: '#ffffff', fontSize: '14px', fontWeight: 600, letterSpacing: '1.5px',
            background: '#2391ae', boxShadow: '0 8px 22px rgba(35,145,174,.4)',
            cursor: 'pointer',
          }}
        >
          VOLVER AL INICIO
        </button>
      </div>
    </div>
  )
}