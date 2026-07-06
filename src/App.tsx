import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Placeholder from './pages/Placeholder'
import NotFound from './pages/NotFound'

const loadingVideo = new URL('./assets/video loading.mp4', import.meta.url).toString()

function App() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, 700)
    return () => window.clearTimeout(timer)
  }, [location.key])

  return (
    <>
      {location.pathname !== '/' && <Navbar />}
      {isLoading ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            zIndex: 1000,
          }}
        >
          <video
            src={loadingVideo}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '220px', maxWidth: '80vw', borderRadius: '16px' }}
          />
          <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>Cargando...</span>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={<Placeholder title="Wallet" />} />
          <Route path="/exchange" element={<Placeholder title="Exchange" />} />
          <Route path="/history" element={<Placeholder title="History" />} />
          <Route path="/coming-soon" element={<Placeholder title="Coming Soon" />} />
          <Route path="/about-us" element={<Placeholder title="About Us" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  )
}

export default App