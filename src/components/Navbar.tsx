import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/PosibleLogo.png'

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Wallet', path: '/wallet' },
  { label: 'Exchange', path: '/exchange' },
  { label: 'History', path: '/history' },
  { label: 'About Us', path: '/about-us' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir menú"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1001,
          width: 44,
          height: 44,
          borderRadius: 12,
          border: '1px solid #cbd5e1',
          background: '#fff',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'grid', gap: 4 }}>
          <span style={{ width: 20, height: 2, background: '#1f2937', display: 'block' }} />
          <span style={{ width: 20, height: 2, background: '#1f2937', display: 'block' }} />
          <span style={{ width: 20, height: 2, background: '#1f2937', display: 'block' }} />
        </div>
      </button>

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 260,
          background: '#f8fafc',
          transform: isOpen ? 'translateX(0)' : 'translateX(-110%)',
          transition: 'transform 250ms ease-in-out',
          zIndex: 1000,
          padding: '20px 16px',
          boxShadow: isOpen ? '8px 0 24px rgba(15, 23, 42, 0.12)' : 'none',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Link to="/" onClick={() => setIsOpen(false)} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <img src={logo} alt="Posible logo" style={{ height: 36, width: 'auto' }} />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              style={{
                textDecoration: 'none',
                color: '#1f2937',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.02em',
                padding: '10px 12px',
                borderRadius: 12,
                background: '#fff',
                boxShadow: '0 5px 12px rgba(15, 23, 42, 0.06)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
