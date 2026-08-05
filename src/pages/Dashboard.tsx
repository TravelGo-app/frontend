import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import phoneTrip from "../assets/phoneTrip.png";
import LoadingOverlay from "../components/LoadingOverlay";
import TravelIcon, {
  type TravelIconName,
} from "../components/ui/TravelIcon";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { sendDashboardSummaryEmail } from "../services/emailPreferences.service";

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
  currencyCode: string | null;
  counterpartyEmail: string | null;
  fromCurrency: string | null;
  toCurrency: string | null;
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
}

interface ChartDataPoint {
  date: string;
  closingBalance: number;
}

interface CurrencyMeta {
  name: string;
  flag: string;
  accent: string;
}

const POLL_INTERVAL_MS = 20_000;

const currencyMeta: Record<string, CurrencyMeta> = {
  ARS: {
    name: "Peso argentino",
    flag: "ar",
    accent: "#27a8cc",
  },

  USD: {
    name: "Dólar estadounidense",
    flag: "us",
    accent: "#00a7c8",
  },

  EUR: {
    name: "Euro",
    flag: "eu",
    accent: "#00a7c8",
  },

  BRL: {
    name: "Real brasileño",
    flag: "br",
    accent: "#ff6a13",
  },

  CLP: {
    name: "Peso chileno",
    flag: "cl",
    accent: "#7c5ce7",
  },

  COP: {
    name: "Peso colombiano",
    flag: "co",
    accent: "#ff6a13",
  },
};

const quickActions: Array<{
  title: string;
  subtitle: string;
  icon: TravelIconName;
  tone: "cyan" | "orange";
  path: string;
}> = [
  {
    title: "Intercambiar",
    subtitle: "Convertí monedas",
    icon: "exchange",
    tone: "cyan",
    path: "/exchange",
  },

  {
    title: "Depositar",
    subtitle: "Agregá dinero",
    icon: "plus",
    tone: "cyan",
    path: "/deposit",
  },

  {
    title: "Transferir",
    subtitle: "Enviá dinero",
    icon: "arrow-up",
    tone: "orange",
    path: "/transfer",
  },

  {
    title: "Pagar",
    subtitle: "Gestioná pagos",
    icon: "send",
    tone: "cyan",
    path: "/transactions",
  },
];

function createSparkData(amount: number, seed: number) {
  const normalizedAmount = Math.max(Math.abs(amount), 1);

  return Array.from(
    {
      length: 10,
    },
    (_, index) => ({
      value:
        normalizedAmount *
        (0.74 +
          index * 0.025 +
          Math.sin(index * 1.45 + seed) * 0.055),
    }),
  );
}

function formatMoney(
  value: number,
  currencyCode: string,
) {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currencyCode}`;
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCurrencyMeta(
  currencyCode: string,
): CurrencyMeta {
  return (
    currencyMeta[currencyCode] ??
    currencyMeta.ARS
  );
}

function activityVisual(
  transaction: RecentTransaction,
): {
  icon: TravelIconName;
  tone: "cyan" | "orange" | "green";
  title: string;
} {
  if (transaction.type === "exchange") {
    return {
      icon: "exchange",
      tone: "cyan",
      title: "Intercambio de monedas",
    };
  }

  if (transaction.type === "deposit") {
    return {
      icon: "plus",
      tone: "cyan",
      title: "Depósito recibido",
    };
  }

  if (transaction.direction === "out") {
    return {
      icon: "arrow-up",
      tone: "orange",
      title: "Transferencia enviada",
    };
  }

  return {
    icon: "arrow-down",
    tone: "green",
    title: "Transferencia recibida",
  };
}
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [balances, setBalances] = useState<Balance[]>([]);
  const [rates, setRates] = useState<ExchangeRates>({});
  const [activity, setActivity] = useState<
    RecentTransaction[]
  >([]);
  const [chartData, setChartData] = useState<
    ChartDataPoint[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [
    selectedCurrency,
    setSelectedCurrency,
  ] = useState<Balance | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [summarySending, setSummarySending] =
    useState(false);

  const [summaryToast, setSummaryToast] =
    useState<string | null>(null);

  const firstName =
    user?.name?.trim().split(/\s+/)[0] ||
    "Viajero";

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async (
      initialLoad: boolean,
    ) => {
      if (initialLoad) {
        setLoading(true);
      }

      const [
        balancesResult,
        activityResult,
        analyticsResult,
      ] = await Promise.allSettled([
        api.get("/wallet/balances"),

        api.get(
          "/transactions/recent?limit=6",
        ),

        api.get(
          "/transactions/analytics?days=7",
        ),
      ]);

      const currencies = [
        "USD",
        "EUR",
        "BRL",
        "CLP",
      ];

      const rateResults =
        await Promise.allSettled(
          currencies.map((currency) =>
            api.get(
              `/rates/ARS/${currency}`,
            ),
          ),
        );

      if (!mounted) {
        return;
      }

      if (
        balancesResult.status ===
        "fulfilled"
      ) {
        setBalances(
          balancesResult.value.data
            .balances || [],
        );
      }

      if (
        activityResult.status ===
        "fulfilled"
      ) {
        setActivity(
          activityResult.value.data
            .transactions || [],
        );
      }

      if (
        analyticsResult.status ===
        "fulfilled"
      ) {
        const timeline: AnalyticsTimelinePoint[] =
          analyticsResult.value.data
            .timeline || [];

        const nextChartData = timeline
          .filter(
            (point) =>
              point.currencyCode === "ARS",
          )
          .map((point) => ({
            date: point.date,
            closingBalance: Number(
              point.closingBalance,
            ),
          }));

        setChartData(nextChartData);
      }

      const nextRates: ExchangeRates = {};

      rateResults.forEach(
        (result, index) => {
          if (
            result.status !== "fulfilled"
          ) {
            return;
          }

          const rawValue =
            result.value.data?.rate ??
            result.value.data?.data?.rate;

          const numericValue =
            Number(rawValue);

          if (
            Number.isFinite(numericValue)
          ) {
            nextRates[
              currencies[index]
            ] = numericValue;
          }
        },
      );

      setRates(nextRates);
      setLastUpdated(new Date());
      setLoading(false);
    };

    void fetchDashboard(true);

    const interval =
      window.setInterval(() => {
        void fetchDashboard(false);
      }, POLL_INTERVAL_MS);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!summaryToast) {
      return;
    }

    const timer = window.setTimeout(
      () => {
        setSummaryToast(null);
      },
      4500,
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [summaryToast]);

  const totalInArs = useMemo(() => {
    return balances.reduce(
      (total, balance) => {
        const amount = Number(
          balance.amount,
        );

        if (
          !Number.isFinite(amount)
        ) {
          return total;
        }

        if (
          balance.currencyCode === "ARS"
        ) {
          return total + amount;
        }

        const rate =
          rates[balance.currencyCode];

        if (!rate) {
          return total;
        }

        return total + amount / rate;
      },
      0,
    );
  }, [balances, rates]);

  const trend = useMemo(() => {
    if (chartData.length < 2) {
      return 0;
    }

    const first =
      chartData[0].closingBalance;

    const last =
      chartData[
        chartData.length - 1
      ].closingBalance;

    if (!first) {
      return 0;
    }

    return (
      ((last - first) /
        Math.abs(first)) *
      100
    );
  }, [chartData]);

  const mainAccounts =
    balances.slice(0, 3);

  const handleSendSummary =
    async () => {
      setSummarySending(true);

      try {
        await sendDashboardSummaryEmail(
          30,
        );

        setSummaryToast(
          "Resumen programado correctamente.",
        );
      } catch {
        setSummaryToast(
          "No se pudo programar el resumen.",
        );
      } finally {
        setSummarySending(false);
      }
    };

  if (loading) {
    return (
      <LoadingOverlay message="Cargando tu billetera..." />
    );
  }

  return (
    <div className="tg-dashboard">
      {summaryToast && (
        <div className="tg-dashboard__toast">
          {summaryToast}
        </div>
      )}

      <section className="tg-dashboard__intro">
        <div>
          <p className="tg-dashboard__eyebrow">
            TU BILLETERA DE VIAJE
          </p>

          <h1>
            Buen día,
            <br />
            {firstName}{" "}
            <span aria-hidden="true">
              👋
            </span>
          </h1>

          <p>
            Administrá tu dinero mientras
            viajás por el mundo.
          </p>
        </div>

        <div className="tg-dashboard__last-update">
          <span className="tg-dashboard__status-dot" />

          {lastUpdated
            ? `Actualizado ${lastUpdated.toLocaleTimeString(
                "es-AR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}`
            : "Actualizando"}
        </div>
      </section>

      <section className="tg-balance-panel">
        <div className="tg-balance-panel__header">
          <div>
            <span className="tg-card-label">
              Balance total

              <TravelIcon
                name="eye"
                size={16}
              />
            </span>

            <strong className="tg-balance-panel__amount">
              {formatMoney(
                totalInArs,
                "ARS",
              )}
            </strong>

            <span
              className={[
                "tg-balance-panel__trend",
                trend < 0
                  ? "is-negative"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {trend >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(trend).toFixed(2)}
              % esta semana
            </span>
          </div>

          <div className="tg-balance-panel__chart">
            {chartData.length > 1 ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={chartData}
                >
                  <defs>
                    <linearGradient
                      id="travelgoBalanceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#00b3d6"
                        stopOpacity={0.38}
                      />

                      <stop
                        offset="100%"
                        stopColor="#00b3d6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="date"
                    hide
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border:
                        "1px solid rgba(0,179,214,.2)",
                      background:
                        "rgba(2,25,44,.92)",
                      color: "#ffffff",
                    }}
                    formatter={(value) => [
                      formatMoney(
                        Number(value ?? 0),
                        "ARS",
                      ),
                      "Balance",
                    ]}
                    labelFormatter={() => ""}
                  />

                  <Area
                    type="monotone"
                    dataKey="closingBalance"
                    stroke="#00b3d6"
                    strokeWidth={3}
                    fill="url(#travelgoBalanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="tg-empty-chart">
                Todavía no hay suficiente
                historial.
              </div>
            )}
          </div>
        </div>

        <div className="tg-balance-panel__currencies">
          {mainAccounts.map(
            (balance) => {
              const meta =
                getCurrencyMeta(
                  balance.currencyCode,
                );

              return (
                <button
                  type="button"
                  key={
                    balance.currencyCode
                  }
                  onClick={() =>
                    setSelectedCurrency(
                      balance,
                    )
                  }
                >
                  <span
                    className={`fi fi-${meta.flag}`}
                    aria-hidden="true"
                  />

                  <span>
                    <strong>
                      {
                        balance.currencyCode
                      }
                    </strong>

                    <small>
                      {formatMoney(
                        Number(
                          balance.amount,
                        ),
                        balance.currencyCode,
                      )}
                    </small>
                  </span>
                </button>
              );
            },
          )}
        </div>
      </section>

      <section className="tg-dashboard-card">
        <div className="tg-section-heading">
          <h2>Acciones rápidas</h2>
        </div>

        <div className="tg-quick-actions">
          {quickActions.map(
            (action) => (
              <button
                type="button"
                key={action.title}
                onClick={() =>
                  navigate(action.path)
                }
                className={`tg-quick-action is-${action.tone}`}
              >
                <span>
                  <TravelIcon
                    name={action.icon}
                    size={28}
                  />
                </span>

                <strong>
                  {action.title}
                </strong>

                <small>
                  {action.subtitle}
                </small>
              </button>
            ),
          )}
        </div>
      </section>

      <section className="tg-dashboard-card">
        <div className="tg-section-heading">
          <h2>Tus cuentas</h2>

          <button
            type="button"
            onClick={() =>
              navigate("/transactions")
            }
          >
            Ver todas <span>›</span>
          </button>
        </div>

        <div className="tg-account-grid">
          {balances.map(
            (balance, index) => {
              const meta =
                getCurrencyMeta(
                  balance.currencyCode,
                );

              const amount =
                Number(balance.amount);

              const sparkData =
                createSparkData(
                  amount,
                  index + 1,
                );

              return (
                <button
                  type="button"
                  className="tg-account-card"
                  key={
                    balance.currencyCode
                  }
                  onClick={() =>
                    setSelectedCurrency(
                      balance,
                    )
                  }
                >
                  <div className="tg-account-card__heading">
                    <span
                      className={`fi fi-${meta.flag}`}
                      aria-hidden="true"
                    />

                    <span>
                      <strong>
                        {meta.name}
                      </strong>

                      <small>
                        {
                          balance.currencyCode
                        }
                      </small>
                    </span>
                  </div>

                  <strong className="tg-account-card__amount">
                    {formatMoney(
                      amount,
                      balance.currencyCode,
                    )}
                  </strong>

                  <div className="tg-account-card__spark">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <LineChart
                        data={sparkData}
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={
                            meta.accent
                          }
                          strokeWidth={2.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </button>
              );
            },
          )}
        </div>
      </section>
            <section className="tg-dashboard__two-columns">
        <article className="tg-destination-card">
          <div>
            <span className="tg-card-label">
              <TravelIcon
                name="location"
                size={17}
              />

              Destino actual
            </span>

            <h2>
              Cartagena, Colombia
            </h2>

            <p>
              Moneda local
              <strong>COP</strong>
            </p>

            <div className="tg-destination-card__rate">
              <small>
                Tasa de referencia
              </small>

              <strong>
                1 USD = 4.120 COP
              </strong>

              <span>↑ 0,82%</span>
            </div>
          </div>

          <div
            className="tg-destination-card__art"
            aria-hidden="true"
          >
            <span className="tg-destination-card__plane">
              ✈
            </span>

            <span className="tg-destination-card__palm">
              🌴
            </span>
          </div>
        </article>

        <article className="tg-dashboard-card tg-rates-card">
          <div className="tg-section-heading">
            <h2>Tasas de cambio</h2>

            <button
              type="button"
              onClick={() =>
                navigate("/exchange")
              }
            >
              Ver todas <span>›</span>
            </button>
          </div>

          <div className="tg-rates-list">
            {[
              "USD",
              "EUR",
              "BRL",
            ].map(
              (
                currency,
                index,
              ) => {
                const meta =
                  getCurrencyMeta(
                    currency,
                  );

                return (
                  <div key={currency}>
                    <span
                      className={`fi fi-${meta.flag}`}
                      aria-hidden="true"
                    />

                    <strong>
                      {currency} → ARS
                    </strong>

                    <span>
                      {rates[currency]
                        ? rates[
                            currency
                          ].toLocaleString(
                            "es-AR",
                            {
                              maximumFractionDigits: 4,
                            },
                          )
                        : "—"}
                    </span>

                    <small
                      className={
                        index === 1
                          ? "is-down"
                          : ""
                      }
                    >
                      {index === 1
                        ? "↓ 0,34%"
                        : "↑ 0,82%"}
                    </small>
                  </div>
                );
              },
            )}
          </div>
        </article>
      </section>

      <section className="tg-dashboard__lower-grid">
        <article className="tg-dashboard-card tg-transactions-card">
          <div className="tg-section-heading">
            <h2>
              Movimientos recientes
            </h2>

            <div className="tg-section-heading__actions">
              <button
                type="button"
                onClick={
                  handleSendSummary
                }
                disabled={
                  summarySending
                }
              >
                <TravelIcon
                  name="mail"
                  size={15}
                />

                {summarySending
                  ? "Enviando..."
                  : "Resumen"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/history")
                }
              >
                Ver todos
                <span>›</span>
              </button>
            </div>
          </div>

          <div className="tg-transaction-list">
            {activity.length === 0 ? (
              <p className="tg-empty-state">
                Todavía no tenés
                movimientos.
              </p>
            ) : (
              activity
                .slice(0, 5)
                .map(
                  (transaction) => {
                    const visual =
                      activityVisual(
                        transaction,
                      );

                    const signedAmount =
                      Number(
                        transaction.signedAmount ??
                          transaction.amount ??
                          0,
                      );

                    return (
                      <button
                        type="button"
                        key={
                          transaction.id
                        }
                        onClick={() =>
                          navigate(
                            "/history",
                          )
                        }
                      >
                        <span
                          className={`tg-transaction-list__icon is-${visual.tone}`}
                        >
                          <TravelIcon
                            name={
                              visual.icon
                            }
                            size={18}
                          />
                        </span>

                        <span className="tg-transaction-list__description">
                          <strong>
                            {
                              visual.title
                            }
                          </strong>

                          <small>
                            {formatDate(
                              transaction.createdAt,
                            )}
                          </small>
                        </span>

                        <span
                          className={[
                            "tg-transaction-list__amount",
                            signedAmount >
                            0
                              ? "is-positive"
                              : "",
                          ]
                            .filter(
                              Boolean,
                            )
                            .join(" ")}
                        >
                          <strong>
                            {signedAmount >
                            0
                              ? "+"
                              : ""}

                            {formatMoney(
                              signedAmount,
                              transaction.currencyCode ||
                                "ARS",
                            )}
                          </strong>

                          <small>
                            {transaction.counterpartyEmail ||
                              "TravelGo"}
                          </small>
                        </span>

                        <span className="tg-transaction-list__chevron">
                          ›
                        </span>
                      </button>
                    );
                  },
                )
            )}
          </div>
        </article>

        <article className="tg-promo-card">
          <div>
            <span>VIAJÁ MEJOR</span>

            <h2>
              Más claridad,
              <br />
              mejores decisiones.
            </h2>

            <p>
              Consultá saldos, tipos
              de cambio y movimientos
              desde un único lugar.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/ayuda")
              }
            >
              Explorar consejos
              <span>›</span>
            </button>
          </div>

          <img
            src={phoneTrip}
            alt=""
            aria-hidden="true"
          />
        </article>
      </section>

      <section className="tg-trust-strip">
        <div>
          <TravelIcon
            name="shield"
            size={32}
          />

          <span>
            <strong>
              100% SEGURO
            </strong>

            <small>
              Protegemos tus
              operaciones.
            </small>
          </span>
        </div>

        <div>
          <TravelIcon
            name="globe"
            size={32}
          />

          <span>
            <strong>
              MULTIMONEDA
            </strong>

            <small>
              Administrá diferentes
              monedas.
            </small>
          </span>
        </div>

        <div>
          <TravelIcon
            name="percent"
            size={32}
          />

          <span>
            <strong>
              SIN COSTOS OCULTOS
            </strong>

            <small>
              Transparencia en cada
              operación.
            </small>
          </span>
        </div>

        <div>
          <TravelIcon
            name="headset"
            size={32}
          />

          <span>
            <strong>
              SOPORTE 24/7
            </strong>

            <small>
              Estamos para ayudarte.
            </small>
          </span>
        </div>
      </section>

      {selectedCurrency && (
        <div
          className="tg-currency-modal"
          role="presentation"
          onMouseDown={() =>
            setSelectedCurrency(null)
          }
        >
          <div
            className="tg-currency-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="currency-dialog-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="tg-currency-modal__close"
              onClick={() =>
                setSelectedCurrency(
                  null,
                )
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            <span
              className={`fi fi-${
                getCurrencyMeta(
                  selectedCurrency.currencyCode,
                ).flag
              } tg-currency-modal__flag`}
              aria-hidden="true"
            />

            <p>
              Balance disponible
            </p>

            <h2 id="currency-dialog-title">
              {formatMoney(
                Number(
                  selectedCurrency.amount,
                ),
                selectedCurrency.currencyCode,
              )}
            </h2>

            <div className="tg-currency-modal__actions">
              <button
                type="button"
                onClick={() => {
                  setSelectedCurrency(
                    null,
                  );

                  navigate(
                    "/exchange",
                  );
                }}
              >
                Intercambiar
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedCurrency(
                    null,
                  )
                }
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