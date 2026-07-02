import { Link } from 'react-router-dom'
import logo from '../assets/PosibleLogo.png'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Wallet', path: '/wallet' },
  { label: 'Exchange', path: '/exchange' },
  { label: 'History', path: '/history' },
  { label: 'Coming Soon', path: '/coming-soon' },
  { label: 'About Us', path: '/about-us' },
]

export default function Navbar() {
  return (
    <nav style={{ width: '90%', margin: '20px auto', border: '1px solid #ccc', padding: '12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img src={logo} alt="Posible logo" style={{ height: '40px', width: 'auto' }} />
        </Link>

        {navItems.map((item) => (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none', color: '#333' }}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
