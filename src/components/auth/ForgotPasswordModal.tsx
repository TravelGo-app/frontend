import { useState } from 'react'
import { authService } from '../../services/api'

interface ForgotPasswordModalProps {
  open: boolean
  onClose: () => void
}

export default function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  if (!open) return null

  const handleClose = () => {
    setEmail('')
    setError('')
    setSent(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Ingresá tu email')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'No pudimos procesar la solicitud. Probá de nuevo en unos minutos.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-700">Recuperar contraseña</h2>
          <button
            onClick={handleClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {sent ? (
          <div className="text-center py-2">
            <p className="text-gray-600 text-sm mb-4">
              Si el email existe en TravelGo, te enviamos un enlace para restablecer tu contraseña.
              Revisá tu bandeja de entrada (y spam, por las dudas).
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-[#F26A2E] text-white py-2 rounded-full font-bold hover:bg-orange-600 transition"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <p className="text-sm text-gray-500 mb-2">
              Ingresá el email de tu cuenta y te mandamos un enlace para restablecer tu contraseña.
            </p>
            <input
              type="text"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 px-2 py-2 focus:outline-none focus:border-[#F26A2E] bg-transparent"
            />
            <p className="text-red-500 text-xs h-4">{error}</p>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F26A2E] text-white py-2 rounded-full font-bold hover:bg-orange-600 transition mt-2 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}