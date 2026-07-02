import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Placeholder from './pages/Placeholder'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Placeholder title="Wallet" />} />
        <Route path="/exchange" element={<Placeholder title="Exchange" />} />
        <Route path="/history" element={<Placeholder title="History" />} />
        <Route path="/coming-soon" element={<Placeholder title="Coming Soon" />} />
        <Route path="/about-us" element={<Placeholder title="About Us" />} />
      </Routes>
    </>
  )
}

export default App