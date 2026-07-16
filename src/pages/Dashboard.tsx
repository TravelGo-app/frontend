import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { sendDashboardSummaryEmail } from "../services/emailPreferences.service";
import LoadingOverlay from "../components/LoadingOverlay";
import beachBg from "../assets/PlayaPrincipal.png";
import AnalyticsSection from "../components/AnalyticsSection";

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

interface AnalyticsTimelinePoint {
  date: string;
  currencyCode: string;
  closingBalance: string;
  netFlow: string;
  depositsIn: string;
  transfersIn: string;
  transfersOut: string;
  exchangesIn: string;
  exchangesOut: string;
  operationCount: number;
}

interface ChartDataPoint {
  date: string;
  closingBalance: number;
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

const POLL_INTERVAL_MS = 20000;

const buildChartPoints = (data: ChartDataPoint[]) => {
  if (data.length < 2) return "";
  const values = data.map((d) => d.closingBalance);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 300;
      const y = 55 - ((d.closingBalance - min) / range) * 45;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

const getActivityIcon = (tx: RecentTransaction) => {
  if (tx.type === "deposit") return { icon: "+", bg: "#2391ae" };
  if (tx.type === "exchange") return { icon: "↔", bg: "#ff4242" };
  if (tx.direction === "out") return { icon: "↑", bg: "#ff7d60" };
  return { icon: "↓", bg: "#16a34a" };
};

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
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [summarySending, setSummarySending] = useState(false);
  const [summaryToast, setSummaryToast] = useState<
    | { type: "success" | "error"; message: string }
    | null
  >(null);

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
    if (!summaryToast) return;

    const timeout = window.setTimeout(() => {
      setSummaryToast(null);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [summaryToast]);

  useEffect(() => {
    const fetchData = async (isInitial = false) => {
      if (isInitial) setDataLoading(true);

      const fetchBalances = async () => {
        try {
          const res = await api.get("/wallet/balances");
          setBalances(res.data.balances);
        } catch (err) {
          console.error("Error cargando balances:", err);
        }
      };

      const fetchRates = async () => {
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
      };

      const fetchActivity = async () => {
        try {
          const res = await api.get("/transactions/recent?limit=10");
          setActivity(res.data.transactions);
          setActivityError(null);
        } catch (err) {
          console.error("Error cargando actividad reciente:", err);
          setActivityError(
            "No pudimos cargar tu actividad reciente. Intentá nuevamente.",
          );
        }
      };

      const fetchAnalytics = async () => {
        try {
          const res = await api.get("/transactions/analytics?days=7");
          const timeline: AnalyticsTimelinePoint[] = res.data.timeline || [];
          const arsTimeline = timeline
            .filter((point) => point.currencyCode === "ARS")
            .map((point) => ({
              date: point.date,
              closingBalance: Number(point.closingBalance),
            }));
          setChartData(arsTimeline);
        } catch (err) {
          console.error("Error cargando analytics:", err);
          setChartData([]);
        }
      };

      await Promise.all([
        fetchBalances(),
        fetchRates(),
        fetchActivity(),
        fetchAnalytics(),
      ]);

      if (isInitial) setDataLoading(false);
      setLastUpdated(new Date());
    };

    fetchData(true);

    const pollInterval = setInterval(() => {
      fetchData(false);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(pollInterval);
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

  const arsBalance = balances.find((b) => b.currencyCode === "ARS");
  const otherBalances = balances.filter((b) => b.currencyCode !== "ARS");

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

  const formatLastUpdated = (date: Date) =>
    date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const handleSendDashboardSummary = async () => {
    setSummaryToast(null);
    setSummarySending(true);

    try {
      await sendDashboardSummaryEmail(30);
      setSummaryToast({
        type: "success",
        message: "Resumen programado. Revisá tu correo en los próximos minutos.",
      });
    } catch (err: any) {
      console.error("Error enviando resumen de dashboard:", err);
      const status = err.response?.status;
      if (status === 429) {
        setSummaryToast({
          type: "error",
          message:
            "Ya solicitaste un resumen recientemente. Esperá unos minutos.",
        });
      } else if (status === 401) {
        setSummaryToast({
          type: "error",
          message: "Tu sesión venció. Iniciá sesión nuevamente.",
        });
      } else {
        setSummaryToast({
          type: "error",
          message: "No se pudo programar el resumen.",
        });
      }
    } finally {
      setSummarySending(false);
    }
  };

  if (dataLoading) {
    return <LoadingOverlay message="Cargando tu billetera..." />;
  }

  return (
    <div
      className="min-h-screen p-8 font-body relative"
      style={{
        backgroundImage: `url(${beachBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {summaryToast && (
          <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
            <div
              className={`rounded-2xl px-4 py-3 shadow-xl ring-1 ring-black/10 text-sm font-semibold transition-transform duration-300 ${
                summaryToast.type === "success"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#ff4242] text-white"
              }`}
            >
              {summaryToast.message}
            </div>
          </div>
        )}
        <div className="mb-4 bg-[#f1efe8] rounded-2xl overflow-hidden shadow-lg">
          <div className="flex h-1">
            <div className="flex-1 bg-[#ff4242]"></div>
            <div className="flex-1 bg-[#2391ae]"></div>
            <div className="flex-1 bg-[#ff7d60]"></div>
          </div>
          <div className="flex justify-between items-center p-5">
            <div>
              <h1
                className="font-display text-3xl font-bold text-brand-animated"
                style={{ WebkitTextStroke: "0.5px rgba(35,52,70,0.4)" }}
              >
                ¡Hola, {firstName}!
              </h1>
              <p className="text-grafito/70 mt-1 text-sm font-semibold">
                Bienvenido a tu billetera TravelGo
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#ff4242] text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-red-600 transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 items-start">
          <div>
            <div className="bg-linear-to-br from-[#ff7d60]/40 to-[#e4c2a2]/30 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-white shadow-lg mb-4">
              <p className="text-sm font-extrabold uppercase tracking-wider">
                Balance total (equivalente en ARS)
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
              {chartData.length >= 2 ? (
                <svg viewBox="0 0 300 60" className="w-full h-14">
                  <polyline
                    points={buildChartPoints(chartData)}
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-draw-line"
                  />
                </svg>
              ) : (
                <p className="text-xs text-white/70 h-14 flex items-center">
                  Todavía no hay suficiente historial para el gráfico.
                </p>
              )}
              <p className="text-xs font-semibold opacity-85 mt-1">
                Últimos 7 días
                {lastUpdated && (
                  <span className="opacity-70">
                    {" "}
                    · Actualizado {formatLastUpdated(lastUpdated)}
                  </span>
                )}
              </p>
            </div>

            <h2 className="text-white font-bold text-sm mb-2">Tus monedas</h2>

            {arsBalance && (
              <button
                onClick={() => setSelectedCurrency(arsBalance)}
                className="w-full flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-lg cursor-pointer hover:brightness-95 transition mb-3"
              >
                <span
                  className="fi fi-ar rounded-md shrink-0"
                  style={{ width: "60px", height: "44px" }}
                ></span>
                <div className="text-right">
                  <p className="text-grafito font-bold text-lg">
                    {parseFloat(arsBalance.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-oceano font-bold text-xs mt-0.5">ARS</p>
                </div>
              </button>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              {otherBalances.map((balance) => (
                <button
                  key={balance.currencyCode}
                  onClick={() => setSelectedCurrency(balance)}
                  className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-lg cursor-pointer hover:brightness-95 transition"
                >
                  <span
                    className={`fi fi-${currencyToCountry[balance.currencyCode]} rounded-md shrink-0`}
                    style={{ width: "60px", height: "44px" }}
                  ></span>
                  <div className="text-right">
                    <p className="text-grafito font-bold text-lg">
                      {parseFloat(balance.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-oceano font-bold text-xs mt-0.5">
                      {balance.currencyCode}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate("/transactions")}
              className="w-full bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center gap-3 shadow-lg hover:brightness-95 transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#ff4242] text-white flex items-center justify-center text-sm shrink-0">
                ↔
              </div>
              <p className="text-sm font-bold text-grafito">
                Ir a Transacciones
              </p>
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

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-grafito">
                  Tasas de cambio
                </p>
                {lastUpdated && (
                  <span className="text-[10px] text-grafito/50 font-semibold">
                    {formatLastUpdated(lastUpdated)}
                  </span>
                )}
              </div>
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

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <h2 className="text-sm font-bold text-grafito">
                  Actividad
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <button
                    onClick={handleSendDashboardSummary}
                    disabled={summarySending}
                    className="inline-flex items-center justify-center rounded-full bg-[#2391ae] px-4 py-2 text-sm font-bold text-white hover:bg-[#1c7a98] transition disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {summarySending ? "Preparando resumen..." : "Enviar resumen ✉️"}
                  </button>
                </div>
              </div>
              {activityError ? (
                <p className="text-sm text-[#ff4242] font-semibold">
                  {activityError}
                </p>
              ) : activity.length === 0 ? (
                <p className="text-sm text-grafito/60">
                  Todavía no tenés movimientos.
                </p>
              ) : (
                <div className="max-h-[168px] overflow-y-auto pr-1">
                  {activity.map((tx, index) => {
                    const { icon, bg } = getActivityIcon(tx);
                    return (
                      <div
                        key={tx.id}
                        className={`flex items-center gap-3 py-2 ${
                          index < activity.length - 1
                            ? "border-b border-grafito/15"
                            : ""
                        }`}
                      >
                        <div
                          className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ backgroundColor: bg }}
                        >
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          {tx.type === "exchange" ? (
                            <>
                              <span className="text-sm font-semibold text-grafito">
                                Intercambio
                              </span>
                              <p className="text-sm font-bold text-oceano mt-0.5">
                                {formatAmount(tx.fromAmount!)} {tx.fromCurrency}{" "}
                                → {formatAmount(tx.toAmount!)} {tx.toCurrency}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-sm font-semibold text-grafito">
                                  {tx.type === "deposit"
                                    ? "Depósito"
                                    : tx.direction === "out"
                                      ? "Transferencia enviada"
                                      : "Transferencia recibida"}
                                </span>
                                <span
                                  className={`text-sm font-bold shrink-0 ${
                                    tx.direction === "out"
                                      ? "text-[#ff4242]"
                                      : "text-green-700"
                                  }`}
                                >
                                  {formatSignedAmount(tx.signedAmount!)}{" "}
                                  {tx.currencyCode}
                                </span>
                              </div>
                              {tx.counterpartyEmail && (
                                <p className="text-xs text-grafito/60 mt-0.5 truncate">
                                  {tx.direction === "out" ? "A" : "De"}:{" "}
                                  {tx.counterpartyEmail}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <AnalyticsSection />
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
              {selectedCurrency.currencyCode !== "ARS" && (
                <button
                  onClick={() => {
                    setSelectedCurrency(null);
                    navigate("/exchange");
                  }}
                  className="flex-1 bg-[#ff4242] text-white py-2 rounded-full font-bold hover:bg-red-600 transition"
                >
                  Intercambiar
                </button>
              )}
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
