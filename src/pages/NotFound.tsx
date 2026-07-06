import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#2A9BB5] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#233446] mb-2">Página no encontrada</h2>
        <p className="text-gray-500 mb-8">La página que buscás no existe o fue movida.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#F26A2E] text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}