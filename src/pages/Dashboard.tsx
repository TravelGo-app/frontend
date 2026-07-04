import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface Balance {
  currencyCode: string;
  amount: string;
}

interface ExchangeRates {
  [key: string]: number;
}

const currencyFlags: { [key: string]: string } = {
  ARS: "🇦🇷",
  USD: "🇺🇸",
  EUR: "🇪🇺",
  BRL: "🇧🇷",
  CLP: "🇨🇱",
};

const currencyNames: { [key: string]: string } = {
  ARS: "Peso Argentino",
  USD: "Dólar Estadounidense",
  EUR: "Euro",
  BRL: "Real Brasileño",
  CLP: "Peso Chileno",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balancesRes = await api.get("/balances");
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#233446]">
            ¡Hola, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Bienvenido a tu billetera TravelGo
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-[#ff4242] text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-xl font-semibold text-[#233446] mb-4">
          Tus balances
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {balances.map((balance) => (
            <div
              key={balance.currencyCode}
              className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-gray-100 hover:shadow-md transition"
            >
              <span className="text-4xl">
                {currencyFlags[balance.currencyCode]}
              </span>
              <div>
                <p className="text-sm text-gray-400">
                  {currencyNames[balance.currencyCode]}
                </p>
                <p className="text-2xl font-bold text-[#233446]">
                  {parseFloat(balance.amount).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm font-semibold text-[#2391ae]">
                  {balance.currencyCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-[#233446] mb-4">
          Tasas de cambio del día{" "}
          <span className="text-sm text-gray-400">(base ARS)</span>
        </h2>
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b">
                <th className="pb-3">Moneda</th>
                <th className="pb-3">Tasa</th>
              </tr>
            </thead>
            <tbody>
              {["USD", "EUR", "BRL", "CLP"].map((currency) => (
                <tr
                  key={currency}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-3 flex items-center gap-2">
                    <span className="text-2xl">{currencyFlags[currency]}</span>
                    <span className="font-medium text-[#233446]">
                      {currencyNames[currency]}
                    </span>
                  </td>
                  <td className="py-3 text-[#2391ae] font-bold">
                    {rates[currency]
                      ? `1 ARS = ${rates[currency].toFixed(6)} ${currency}`
                      : "Sin datos"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
