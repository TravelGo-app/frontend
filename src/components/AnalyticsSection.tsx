import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../services/api";

interface TimelinePoint {
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

interface OperationCounts {
  total: number;
  deposits: number;
  transfersSent: number;
  transfersReceived: number;
  exchanges: number;
}

interface AnalyticsResponse {
  period: { days: number; from: string; to: string };
  operationCounts: OperationCounts;
  timeline: TimelinePoint[];
}

const CURRENCIES = ["ARS", "USD", "EUR", "BRL", "CLP"];
const DAY_OPTIONS = [7, 30, 90];
const TABS = ["Resumen", "Evolución", "Distribución", "Detalle"] as const;
type Tab = (typeof TABS)[number];

const CATEGORY_COLORS = {
  deposits: "#2391ae",
  transfersSent: "#ff7d60",
  transfersReceived: "#16a34a",
  exchanges: "#ff4242",
};

export default function AnalyticsSection() {
  const [activeTab, setActiveTab] = useState<Tab>("Resumen");
  const [days, setDays] = useState(30);
  const [currency, setCurrency] = useState("ARS");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(`/transactions/analytics?days=${days}`)
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        console.error("Error cargando analytics:", err);
        if (!cancelled) setError("No pudimos cargar las estadísticas.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const currencyTimeline = (data?.timeline || [])
    .filter((point) => point.currencyCode === currency)
    .map((point) => ({
      date: point.date.slice(5),
      balance: Number(point.closingBalance),
    }));

  const pieData = data
    ? [
        {
          name: "Depósitos",
          value: data.operationCounts.deposits,
          color: CATEGORY_COLORS.deposits,
        },
        {
          name: "Enviadas",
          value: data.operationCounts.transfersSent,
          color: CATEGORY_COLORS.transfersSent,
        },
        {
          name: "Recibidas",
          value: data.operationCounts.transfersReceived,
          color: CATEGORY_COLORS.transfersReceived,
        },
        {
          name: "Intercambios",
          value: data.operationCounts.exchanges,
          color: CATEGORY_COLORS.exchanges,
        },
      ].filter((d) => d.value > 0)
    : [];

  const detailRows = (data?.timeline || [])
    .filter((point) => point.currencyCode === currency)
    .slice()
    .reverse();

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg mt-4">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h2 className="text-sm font-bold text-grafito">Análisis y Gráficos</h2>
        <div className="flex gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="text-xs border border-[#155a70] rounded-lg px-2 py-1 text-grafito font-semibold"
          >
            {DAY_OPTIONS.map((d) => (
              <option key={d} value={d}>
                Últimos {d} días
              </option>
            ))}
          </select>
          {(activeTab === "Evolución" || activeTab === "Detalle") && (
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs border border-[#155a70] rounded-lg px-2 py-1 text-grafito font-semibold"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex gap-1 mb-4 border-b border-grafito/10 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-semibold px-3 py-2 border-b-2 transition whitespace-nowrap shrink-0 ${
              activeTab === tab
                ? "border-[#ff4242] text-grafito"
                : "border-transparent text-grafito/50 hover:text-grafito/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-sm text-grafito/60 py-6 text-center">
          Cargando estadísticas...
        </p>
      )}

      {error && !loading && (
        <p className="text-sm text-[#ff4242] font-semibold py-6 text-center">
          {error}
        </p>
      )}

      {!loading && !error && data && (
        <>
          {activeTab === "Resumen" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-grafito/60 font-semibold mb-1">
                  Total operaciones
                </p>
                <p className="text-2xl font-bold text-grafito">
                  {data.operationCounts.total}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-grafito/60 font-semibold mb-1">
                  Depósitos
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: CATEGORY_COLORS.deposits }}
                >
                  {data.operationCounts.deposits}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-grafito/60 font-semibold mb-1">
                  Intercambios
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: CATEGORY_COLORS.exchanges }}
                >
                  {data.operationCounts.exchanges}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-grafito/60 font-semibold mb-1">
                  Enviadas
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: CATEGORY_COLORS.transfersSent }}
                >
                  {data.operationCounts.transfersSent}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-grafito/60 font-semibold mb-1">
                  Recibidas
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: CATEGORY_COLORS.transfersReceived }}
                >
                  {data.operationCounts.transfersReceived}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-grafito/60 font-semibold mb-1">
                  Período
                </p>
                <p className="text-sm font-bold text-grafito">
                  {data.period.days} días
                </p>
              </div>
            </div>
          )}

          {activeTab === "Evolución" && (
            <div>
              {currencyTimeline.length < 2 ? (
                <p className="text-sm text-grafito/60 py-10 text-center">
                  Todavía no hay suficiente historial de {currency} en este
                  período.
                </p>
              ) : (
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <LineChart data={currencyTimeline}>
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#5F5E5A" }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#5F5E5A" }}
                        axisLine={false}
                        tickLine={false}
                        width={50}
                      />
                      <Tooltip
                        formatter={(value) =>
                          Number(value).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#2391ae"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#2391ae" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {activeTab === "Distribución" && (
            <div>
              {pieData.length === 0 ? (
                <p className="text-sm text-grafito/60 py-10 text-center">
                  Todavía no tenés operaciones en este período.
                </p>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div style={{ width: 180, height: 180 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={2}
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {pieData.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: entry.color }}
                          ></span>
                          <span className="text-grafito font-semibold">
                            {entry.name}
                          </span>
                        </div>
                        <span className="text-grafito/70 font-bold">
                          {entry.value} (
                          {Math.round(
                            (entry.value / data.operationCounts.total) * 100,
                          )}
                          %)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Detalle" && (
            <div className="max-h-64 overflow-y-auto">
              {detailRows.length === 0 ? (
                <p className="text-sm text-grafito/60 py-10 text-center">
                  Sin movimientos de {currency} en este período.
                </p>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-grafito/50 text-left border-b border-grafito/10">
                      <th className="py-1.5 font-semibold">Fecha</th>
                      <th className="py-1.5 font-semibold text-right">Saldo</th>
                      <th className="py-1.5 font-semibold text-right">
                        Flujo neto
                      </th>
                      <th className="py-1.5 font-semibold text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailRows.map((row) => (
                      <tr
                        key={row.date}
                        className="border-b border-grafito/5 text-grafito"
                      >
                        <td className="py-1.5">{row.date.slice(5)}</td>
                        <td className="py-1.5 text-right font-semibold">
                          {Number(row.closingBalance).toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className="py-1.5 text-right font-semibold"
                          style={{
                            color:
                              Number(row.netFlow) >= 0 ? "#16a34a" : "#ff4242",
                          }}
                        >
                          {Number(row.netFlow) >= 0 ? "+" : ""}
                          {Number(row.netFlow).toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-1.5 text-right">
                          {row.operationCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
