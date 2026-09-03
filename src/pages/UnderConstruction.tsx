import { useNavigate } from 'react-router-dom'
import logoImg from '../assets/PosibleLogo.png'

export default function UnderConstruction() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf9f7]">
      <div className="text-center max-w-md w-full">
        <img src={logoImg} alt="TravelGo" className="w-20 h-20 mx-auto mb-6 object-contain" />
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-3 italic">
          App en construcción
        </h1>
        <p className="text-gray-500 mb-8">
          Estamos terminando de pulir TravelGo. Volvé a intentarlo en un rato.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#F26A2E] text-white py-2 px-6 rounded-full font-bold hover:bg-orange-600 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}