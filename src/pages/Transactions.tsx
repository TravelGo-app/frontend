import { useNavigate } from "react-router-dom";
import beachBg from "../assets/Shell.jpg";

const OPTIONS = [
  {
    label: "Intercambio",
    description: "Convertí entre las monedas de tu billetera.",
    icon: "↔",
    iconBg: "bg-coral",
    path: "/exchange",
  },
  {
    label: "Depositar",
    description: "Agregá dinero a tu billetera TravelGo.",
    icon: "+",
    iconBg: "bg-oceano",
    path: "/deposit",
  },
  {
    label: "Transferir",
    description: "Enviá dinero a otro usuario de TravelGo.",
    icon: "↑",
    iconBg: "bg-terracota",
    path: "/transfer",
  },
];

export default function Transactions() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundImage: `url(${beachBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 bg-grafito border border-terracota rounded-2xl p-5 shadow-lg">
          <h1 className="text-3xl font-bold text-white">Transacciones</h1>
          <p className="text-gray-300 mt-1">
            Elegí qué querés hacer con tu billetera TravelGo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {OPTIONS.map((option) => (
            <button
              key={option.path}
              onClick={() => navigate(option.path)}
              className="bg-[#16293a] border-2 border-terracota rounded-2xl p-6 text-center shadow-lg hover:brightness-110 transition cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-full ${option.iconBg} text-white flex items-center justify-center mx-auto mb-3 text-2xl`}
              >
                {option.icon}
              </div>
              <p className="text-lg font-bold text-white mb-1">
                {option.label}
              </p>
              <p className="text-sm text-gray-300">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
