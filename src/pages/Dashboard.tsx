import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import beachBg from "../assets/playa.jpg";

interface Balance {
  currencyCode: string;
  amount: string;
}

interface ExchangeRates {
  [key: string]: number;
}

interface RecentTransaction {
  id: string;
  type: "deposit" | "transfer" | "exchange";
  direction: "in" | "out" | "exchange";
  amount: string | null;
  signedAmount: string | null;
  currencyCode: "ARS" | "USD" | "EUR" | "BRL" | "CLP" | null;
  counterpartyEmail: string | null;
  fromCurrency: "ARS" | "USD" | "EUR" | "BRL" | "CLP" | null;
  toCurrency: "ARS" | "USD" | "EUR" | "BRL" | "CLP" | null;
  fromAmount: string | null;
  toAmount: string | null;
  rate: string | null;
  status: "completed" | "failed" | "pending";
  createdAt: string;
}

const currencyToCountry: { [key: string]: string } = {
  ARS: "ar",
  USD: "us",
  EUR: "eu",
  BRL: "br",
  CLP: "cl",
};

const TRAVEL_TIPS = [
  "Cambiá tu dinero antes de viajar para evitar comisiones en el aeropuerto.",
  "Llevá siempre algo de efectivo en la moneda local para gastos pequeños.",
  "Revisá las tasas de cambio antes de hacer un intercambio grande.",
  "Guardá una copia digital de tus documentos de viaje.",
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balances, setBalances] = useState<Balance[]>([]);
  const [rates, setRates] = useState<ExchangeRates>({});
  const [selectedCurrency, setSelectedCurrency] = useState<Balance | null>(
    null,
  );
  const [activity, setActivity] = useState<RecentTransaction[]>([]);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  const firstName = user?.name?.split(" ")[0];

  const handleLogout = () => {
    setTimeout(() => {
      logout();
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TRAVEL_TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const balancesRes = await api.get("/wallet/balances");
        setBalances(balancesRes.data.balances);
      } catch (err) {
        console.error("Error cargando balances:", err);
      }

      try {
        const currencies = ["USD", "EUR", "BRL", "CLP"];
        const rateResponses = await Promise.all(
          currencies.map((currency) => api.get(`/rates/ARS/${currency}`)),
        );
        const ratesData: ExchangeRates = {};
        rateResponses.forEach((res, index) => {
          const rateValue = res.data?.rate ?? res.data?.data?.rate;
          ratesData[currencies[index]] = rateValue;
        });
        setRates(ratesData);
      } catch (err) {
        console.error("Error cargando tasas:", err);
      }

      try {
        const activityRes = await api.get("/transactions/recent?limit=10");
        setActivity(activityRes.data.transactions);
        setActivityError(null);
      } catch (err) {
        console.error("Error cargando actividad reciente:", err);
        setActivityError(
          "No pudimos cargar tu actividad reciente. Intentá nuevamente.",
        );
      } finally {
        setDataLoading(false);
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

  const formatAmount = (value: string) =>
    parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatSignedAmount = (value: string) => {
    const num = parseFloat(value);
    const formatted = Math.abs(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${num >= 0 ? "+" : "-"}${formatted}`;
  };

  const equivalentInARS = (balance: Balance) => {
    if (balance.currencyCode === "ARS") return null;
    const rate = rates[balance.currencyCode];
    if (!rate) return null;
    return (parseFloat(balance.amount) / rate).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grafito">
        <p className="text-white text-lg font-body">Cargando tu billetera...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8 font-body"
      style={{
        backgroundImage: `url(${beachBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 bg-grafito/55 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-lg">
          <div>
            <h1
              className="font-display text-3xl font-bold text-ocean-animated"
              style={{ WebkitTextStroke: "0.6px rgba(35,52,70,0.55)" }}
            >
              ¡Hola, {firstName}!
            </h1>
            <p className="text-white/90 mt-1 text-sm font-semibold">
              Bienvenido a tu billetera TravelGo
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-coral text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 items-start">
          <div>
            <div className="bg-linear-to-br from-terracota/40 to-arena/30 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-white shadow-lg mb-4">
              <p className="text-sm font-extrabold uppercase tracking-wider">
                Balance total
              </p>
              <p
                className="font-display text-5xl font-bold mt-2 mb-3"
                style={{ WebkitTextStroke: "0.8px rgba(35,52,70,0.6)" }}
              >
                {calculateTotalInARS().toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                <span
                  className="text-lg font-body font-normal"
                  style={{ WebkitTextStroke: 0 }}
                >
                  ARS
                </span>
              </p>
              <svg viewBox="0 0 300 60" className="w-full h-14">
                <polyline
                  points="0,45 50,40 100,30 150,35 200,20 250,18 300,8"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-draw-line"
                />
              </svg>
              <p className="text-xs font-semibold opacity-85 mt-1">
                Últimos 7 días
              </p>
            </div>

            <h2 className="text-white font-bold text-sm mb-2">Tus monedas</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {nonBaseBalances.map((balance) => (
                <button
                  key={balance.currencyCode}
                  onClick={() => setSelectedCurrency(balance)}
                  className="flex items-center justify-between bg-grafito/55 backdrop-blur-md border border-white/25 rounded-2xl p-3 shadow-lg cursor-pointer hover:brightness-110 transition"
                >
                  <span
                    className={`fi fi-${currencyToCountry[balance.currencyCode]} rounded-md shrink-0`}
                    style={{ width: "60px", height: "44px" }}
                  ></span>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">
                      {parseFloat(balance.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-[#9fe0ee] font-bold text-xs mt-0.5">
                      {balance.currencyCode}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate("/transactions")}
              className="w-full bg-grafito/60 backdrop-blur-md border border-white/25 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-lg hover:brightness-110 transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-coral text-white flex items-center justify-center text-sm shrink-0">
                ↔
              </div>
              <p className="text-sm font-bold text-white">Ir a Transacciones</p>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="tip-card-animated relative rounded-2xl p-5 shadow-lg overflow-hidden flex flex-col items-center text-center">
              <div className="tip-pulse-ring absolute -top-6 -right-4 w-24 h-24 rounded-full bg-white/20"></div>
              <div className="tip-pulse-ring-delayed absolute -bottom-8 -left-5 w-20 h-20 rounded-full bg-white/15"></div>

              <div className="flex items-center justify-center gap-2 mb-2 relative z-10">
                <div className="tip-bounce-icon w-9 h-9 rounded-full bg-white/30 text-white flex items-center justify-center font-bold text-lg">
                  💡
                </div>
                <p className="text-white font-bold text-base">Tip de viaje</p>
              </div>
              <p className="text-white text-sm font-medium leading-snug relative z-10">
                {TRAVEL_TIPS[tipIndex]}
              </p>
              <div className="flex gap-1.5 mt-3 relative z-10">
                {TRAVEL_TIPS.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1 rounded-full transition-all ${
                      index === tipIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  ></span>
                ))}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
              <p className="text-sm font-bold text-grafito mb-2">
                Tasas de cambio
              </p>
              {["USD", "EUR", "BRL", "CLP"].map((currency) => (
                <div
                  key={currency}
                  className="flex justify-between py-1.5 text-sm"
                >
                  <span className="font-semibold text-grafito">{currency}</span>
                  <span className="font-bold text-oceano">
                    {rates[currency] ? rates[currency].toFixed(6) : "Sin datos"}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
              <h2 className="text-sm font-bold text-grafito mb-3">
                Actividad reciente
              </h2>
              {activityError ? (
                <p className="text-sm text-coral font-semibold">
                  {activityError}
                </p>
              ) : activity.length === 0 ? (
                <p className="text-sm text-grafito/60">
                  Todavía no tenés movimientos.
                </p>
              ) : (
                activity.map((tx, index) => (
                  <div
                    key={tx.id}
                    className={`py-2 ${
                      index < activity.length - 1
                        ? "border-b border-grafito/15"
                        : ""
                    }`}
                  >
                    {tx.type === "exchange" ? (
                      <>
                        <span className="text-sm font-semibold text-grafito">
                          Intercambio
                        </span>
                        <p className="text-sm font-bold text-oceano mt-1">
                          {formatAmount(tx.fromAmount!)} {tx.fromCurrency} →{" "}
                          {formatAmount(tx.toAmount!)} {tx.toCurrency}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-grafito">
                            {tx.type === "deposit"
                              ? "Depósito"
                              : tx.direction === "out"
                                ? "Transferencia enviada"
                                : "Transferencia recibida"}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              tx.direction === "out"
                                ? "text-coral"
                                : "text-green-700"
                            }`}
                          >
                            {formatSignedAmount(tx.signedAmount!)}{" "}
                            {tx.currencyCode}
                          </span>
                        </div>
                        {tx.counterpartyEmail && (
                          <p className="text-xs text-grafito/60 mt-0.5">
                            {tx.direction === "out" ? "A" : "De"}:{" "}
                            {tx.counterpartyEmail}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedCurrency && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCurrency(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-[#155a70]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`fi fi-${currencyToCountry[selectedCurrency.currencyCode]} rounded`}
                  style={{ width: "32px", height: "22px" }}
                ></span>
                <h3 className="text-lg font-bold text-grafito">
                  {selectedCurrency.currencyCode}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCurrency(null)}
                className="text-grafito/50 hover:text-grafito text-xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-sm text-grafito/70 mb-1">Balance disponible</p>
            <p className="text-3xl font-bold text-grafito mb-4">
              {parseFloat(selectedCurrency.amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-lg">{selectedCurrency.currencyCode}</span>
            </p>

            {equivalentInARS(selectedCurrency) && (
              <p className="text-sm text-grafito/70 mb-4">
                Equivalente aprox.:{" "}
                <span className="font-bold text-oceano">
                  {equivalentInARS(selectedCurrency)} ARS
                </span>
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedCurrency(null);
                  navigate("/exchange");
                }}
                className="flex-1 bg-coral text-white py-2 rounded-full font-bold hover:bg-red-600 transition"
              >
                Intercambiar
              </button>
              <button
                onClick={() => setSelectedCurrency(null)}
                className="flex-1 bg-gray-200 text-grafito py-2 rounded-full font-bold hover:bg-gray-300 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
