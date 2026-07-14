import { useNavigate } from "react-router-dom";
import beachBg from "../assets/PlayaPrincipal.png";

const OPTIONS = [
  {
    label: "Intercambio",
    description: "Convertí entre las monedas de tu billetera.",
    icon: "↔",
    color: "#ff4242",
    path: "/exchange",
  },
  {
    label: "Depositar",
    description: "Agregá dinero a tu billetera TravelGo.",
    icon: "+",
    color: "#2391ae",
    path: "/deposit",
  },
  {
    label: "Transferir",
    description: "Enviá dinero a otro usuario de TravelGo.",
    icon: "↑",
    color: "#ff7d60",
    path: "/transfer",
  },
];

export default function Transactions() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen p-8 relative"
      style={{
        backgroundImage: `url(${beachBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-6 bg-[#233446]/50 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex h-1">
            <div className="flex-1 bg-[#ff4242]"></div>
            <div className="flex-1 bg-[#2391ae]"></div>
            <div className="flex-1 bg-[#ff7d60]"></div>
          </div>
          <div className="p-5">
            <h1 className="text-3xl font-bold text-white">Transacciones</h1>
            <p className="text-white/80 mt-1">
              Elegí qué querés hacer con tu billetera TravelGo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {OPTIONS.map((option) => (
            <button
              key={option.path}
              onClick={() => navigate(option.path)}
              className="bg-white rounded-b-2xl p-6 text-center shadow-lg hover:brightness-95 transition cursor-pointer group"
              style={{ borderTop: `3px solid ${option.color}` }}
            >
              <div
                className="w-14 h-14 rounded-full text-white flex items-center justify-center mx-auto mb-3 text-2xl"
                style={{ backgroundColor: option.color }}
              >
                {option.icon}
              </div>
              <p className="text-lg font-bold text-grafito mb-1">
                {option.label}
              </p>
              <p className="text-sm text-grafito/60 mb-3">
                {option.description}
              </p>
              <span
                className="text-sm font-semibold group-hover:underline"
                style={{ color: option.color }}
              >
                Empezar →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}