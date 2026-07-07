import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import beachBg from "../assets/Shell.jpg";

interface Balance {
  currencyCode: string;
  amount: string;
}

interface ExchangeRates {
  [key: string]: number;
}

const currencyToCountry: { [key: string]: string } = {
  ARS: "ar",
  USD: "us",
  EUR: "eu",
  BRL: "br",
  CLP: "cl",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [rates, setRates] = useState<ExchangeRates>({});

  const handleLogout = () => {
    setTimeout(() => {
      logout();
    }, 500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balancesRes = await api.get("/wallet/balances");
        setBalances(balancesRes.data.balances);
      } catch (err) {
        console.error("Error cargando balances:", err);
      }

      try {
        const ratesRes = await fetch(`${import.meta.env.VITE_API_URL}/rates`);
        const ratesData = await ratesRes.json();
        setRates(ratesData.rates);
      } catch (err) {
        console.error("Error cargando tasas:", err);
      }
    };
    fetchData();
  }, []);

  const calculateTotalInARS = () => {
    return balances.reduce((total, balance) => {
      const amount = parseFloat(balance.amount);
      if (balance.currencyCode === "ARS") {
        return total + amount;
      }
      const rate = rates[balance.currencyCode];
      if (!rate) return total;
      return total + amount / rate;
    }, 0);
  };

  const nonBaseBalances = balances.filter((b) => b.currencyCode !== "ARS");

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
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-grafito border border-terracota rounded-2xl p-5 shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-white">
              ¡Hola, {user?.name}! 👋
            </h1>
            <p className="text-gray-300 mt-1">
              Bienvenido a tu billetera TravelGo
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-coral text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
          <div>
            <div className="bg-linear-to-br from-terracota to-arena rounded-3xl p-8 text-white shadow-lg mb-5 border border-[#155a70]">
              <p className="text-sm font-semibold opacity-90">Balance total</p>
              <p className="text-4xl font-bold mt-1 mb-4">
                {calculateTotalInARS().toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                })}{" "}
                <span className="text-xl font-semibold">ARS</span>
              </p>
              <svg viewBox="0 0 300 60" className="w-full h-16">
                <polyline
                  points="0,45 50,40 100,30 150,35 200,20 250,18 300,8"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-draw-line"
                />
              </svg>
              <p className="text-xs font-semibold opacity-90 mt-1">
                Últimos 7 días
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#16293a] border-2 border-terracota rounded-2xl p-4 text-center shadow-lg">
                <div className="w-10 h-10 rounded-full bg-coral text-white flex items-center justify-center mx-auto mb-2 text-lg">
                  ↔
                </div>
                <p className="text-sm font-bold text-white">Intercambio</p>
              </div>
              <div className="bg-[#16293a] border-2 border-terracota rounded-2xl p-4 text-center shadow-lg">
                <div className="w-10 h-10 rounded-full bg-oceano text-white flex items-center justify-center mx-auto mb-2 text-lg">
                  +
                </div>
                <p className="text-sm font-bold text-white">Depositar</p>
              </div>
              <div className="bg-[#16293a] border-2 border-terracota rounded-2xl p-4 text-center shadow-lg">
                <div className="w-10 h-10 rounded-full bg-terracota text-white flex items-center justify-center mx-auto mb-2 text-lg">
                  ↑
                </div>
                <p className="text-sm font-bold text-white">Transferir</p>
              </div>
            </div>

            <h2 className="text-lg font-bold text-white mb-3">Tus monedas</h2>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {nonBaseBalances.map((balance) => (
                <div
                  key={balance.currencyCode}
                  className="bg-[#16293a] border-2 border-terracota rounded-xl p-3 text-center shadow-lg"
                >
                  <span
                    className={`fi fi-${currencyToCountry[balance.currencyCode]} block mx-auto mb-1 rounded`}
                    style={{ width: "26px", height: "18px" }}
                  ></span>
                  <p className="text-sm font-bold text-white">
                    {parseFloat(balance.amount).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs font-bold text-oceano">
                    {balance.currencyCode}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-4 flex items-center gap-3 border border-[#155a70] shadow-lg bg-orange-50">
              <div className="w-8 h-8 rounded-full bg-terracota text-white flex items-center justify-center font-bold shrink-0">
                !
              </div>
              <div>
                <p className="text-sm font-bold text-grafito">Tip de viaje</p>
                <p className="text-sm text-grafito">
                  Cambiá tu dinero antes de viajar para evitar comisiones en el
                  aeropuerto.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-4 shadow-lg bg-white border border-[#155a70]">
              <h2 className="text-base font-bold text-grafito mb-3">
                Actividad reciente
              </h2>
              <div className="flex justify-between items-center py-2 border-b border-grafito/15">
                <span className="text-sm font-semibold text-grafito">
                  Compra USD
                </span>
                <span className="text-sm font-bold text-coral">-5.000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-grafito/15">
                <span className="text-sm font-semibold text-grafito">
                  Intercambio
                </span>
                <span className="text-sm font-bold text-grafito">10 EUR</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-semibold text-grafito">
                  Depósito
                </span>
                <span className="text-sm font-bold text-green-700">
                  +20.000
                </span>
              </div>
            </div>

            <div className="rounded-2xl p-4 shadow-lg bg-white border border-[#155a70]">
              <h2 className="text-base font-bold text-grafito mb-3">
                Tasas de cambio{" "}
                <span className="text-xs font-normal text-gray-500">
                  (base ARS)
                </span>
              </h2>
              {["USD", "EUR", "BRL", "CLP"].map((currency) => (
                <div
                  key={currency}
                  className="flex justify-between py-2 border-b last:border-0 border-grafito/15 text-sm"
                >
                  <span className="font-semibold text-grafito">{currency}</span>
                  <span className="font-bold text-oceano">
                    {rates[currency] ? rates[currency].toFixed(6) : "Sin datos"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
