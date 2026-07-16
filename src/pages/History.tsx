import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import beachBg from "../assets/PlayaPrincipal.png";

type Category = "AUTH" | "PROFILE" | "WALLET" | "EMAIL" | "SECURITY" | "SYSTEM";
type Status = "SUCCESS" | "FAILED" | "PENDING" | "INFO";

interface ActivityItem {
  id: string;
  eventType: string;
  category: Category;
  status: Status;
  title: string;
  description: string;
  entity: { type: string; id: string } | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

interface ActivityResponse {
  items: ActivityItem[];
  pagination: {
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
  };
}

type SimpleFilter = "all" | "deposit" | "transfer" | "exchange" | "account";

const FILTERS: { value: SimpleFilter; label: string; category?: Category }[] = [
  { value: "all", label: "Todos" },
  { value: "deposit", label: "Depósitos", category: "WALLET" },
  { value: "transfer", label: "Transferencias", category: "WALLET" },
  { value: "exchange", label: "Intercambios", category: "WALLET" },
  { value: "account", label: "Cuenta", category: "AUTH" },
];

const STATUS_STYLE: Record<Status, { label: string; bg: string; text: string }> = {
  SUCCESS: { label: "Exitoso", bg: "#eaf3de", text: "#3b6d11" },
  FAILED: { label: "Error", bg: "#fce6e6", text: "#a32d2d" },
  PENDING: { label: "Pendiente", bg: "#FAEEDA", text: "#854F0B" },
  INFO: { label: "Info", bg: "#e6f1fb", text: "#185fa5" },
};

const getIconForItem = (item: ActivityItem) => {
  const type = item.eventType.toLowerCase();
  if (type.includes("deposit")) return { icon: "+", bg: "#2391ae" };
  if (type.includes("exchange")) return { icon: "↔", bg: "#ff4242" };
  if (type.includes("transfer") && type.includes("sent")) return { icon: "↑", bg: "#ff7d60" };
  if (type.includes("transfer")) return { icon: "↓", bg: "#16a34a" };
  if (item.category === "AUTH") return { icon: "🔑", bg: "#7c3aed" };
  if (item.category === "PROFILE") return { icon: "👤", bg: "#0891b2" };
  if (item.category === "SECURITY") return { icon: "🛡", bg: "#ff4242" };
  if (item.category === "EMAIL") return { icon: "✉", bg: "#f59e0b" };
  if (item.category === "WALLET") return { icon: "$", bg: "#16a34a" };
  if (item.category === "SYSTEM") return { icon: "⚙", bg: "#64748b" };
  return { icon: "•", bg: "#5F5E5A" };
};

const METADATA_LABELS: Record<string, string> = {
  email: "Email",
  recipientEmail: "Destinatario",
  toEmail: "Para",
  newEmail: "Nuevo email",
  amount: "Monto",
  currencyCode: "Moneda",
  currency: "Moneda",
  fromCurrency: "Desde",
  toCurrency: "Hacia",
  days: "Días",
  reportType: "Tipo de reporte",
  alias: "Alias",
  cvu: "CVU",
  ip: "IP",
  device: "Dispositivo",
  provider: "Proveedor",
};

const formatMetadataValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getMetadataLine = (metadata: Record<string, unknown>): string | null => {
  const entries = Object.entries(metadata || {}).filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );
  if (entries.length === 0) return null;

  return entries
    .slice(0, 3)
    .map(([key, value]) => {
      const label = METADATA_LABELS[key] || key;
      return `${label}: ${formatMetadataValue(value)}`;
    })
    .join(" · ");
};

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const LIMIT = 25;

export default function History() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [filter, setFilter] = useState<SimpleFilter>("all");

  const activeCategory = FILTERS.find((f) => f.value === filter)?.category;

  const buildQuery = useCallback(
    (cursor?: string | null) => {
      const params = new URLSearchParams();
      params.set("limit", String(LIMIT));
      if (activeCategory) params.set("category", activeCategory);
      if (cursor) params.set("cursor", cursor);
      return params.toString();
    },
    [activeCategory],
  );

  const loadInitial = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get<ActivityResponse>(`/activity-history?${buildQuery()}`)
      .then((res) => {
        setItems(res.data.items);
        setHasMore(res.data.pagination.hasMore);
        setNextCursor(res.data.pagination.nextCursor);
      })
      .catch((err) => {
        console.error("Error cargando historial:", err);
        if (err.response?.status === 401) {
          setError("Tu sesión venció. Iniciá sesión de nuevo para ver tu historial.");
        } else if (err.response?.status === 400) {
          setError("Hubo un problema con los filtros aplicados. Probá de nuevo.");
        } else {
          setError("No pudimos cargar tu historial. Intentá nuevamente.");
        }
      })
      .finally(() => setLoading(false));
  }, [buildQuery]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const handleLoadMore = () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    api
      .get<ActivityResponse>(`/activity-history?${buildQuery(nextCursor)}`)
      .then((res) => {
        setItems((prev) => [...prev, ...res.data.items]);
        setHasMore(res.data.pagination.hasMore);
        setNextCursor(res.data.pagination.nextCursor);
      })
      .catch((err) => {
        console.error("Error cargando más historial:", err);
      })
      .finally(() => setLoadingMore(false));
  };

  const displayedItems = items.filter((item) => {
    if (filter === "all" || filter === "account") return true;
    const type = item.eventType.toLowerCase();
    if (filter === "deposit") return type.includes("deposit");
    if (filter === "transfer") return type.includes("transfer");
    if (filter === "exchange") return type.includes("exchange");
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#233446]">
        <p className="text-white text-lg font-body">Cargando historial...</p>
      </div>
    );
  }

  return (
    <div
      className="h-screen p-8 font-body relative overflow-hidden"
      style={{
        backgroundImage: `url(${beachBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 h-full flex flex-col">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white/80 hover:text-white text-sm font-semibold mb-6 self-start"
        >
          ← Ir a Billetera
        </button>

        <div className="bg-[rgba(90,90,90,0.55)] backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg mb-6 flex-shrink-0">
          <div className="flex h-1">
            <div className="flex-1 bg-[#ff4242]"></div>
            <div className="flex-1 bg-[#2391ae]"></div>
            <div className="flex-1 bg-[#ff7d60]"></div>
          </div>
          <div className="p-5">
            <h1 className="text-white font-bold text-3xl">Historial</h1>
            <p className="text-white/80 text-sm mt-1">
              Toda tu actividad en TravelGo, de la más reciente a la más antigua
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 flex-shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition ${
                filter === f.value
                  ? "bg-[#233446] text-white"
                  : "bg-white text-grafito hover:brightness-95 shadow-sm"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <p className="text-sm text-[#ff4242] font-semibold mb-4">{error}</p>
            {error.includes("sesión") ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-oceano text-white text-sm font-semibold px-5 py-2 rounded-full hover:brightness-110 transition"
              >
                Iniciar sesión
              </button>
            ) : (
              <button
                onClick={loadInitial}
                className="bg-oceano text-white text-sm font-semibold px-5 py-2 rounded-full hover:brightness-110 transition"
              >
                Reintentar
              </button>
            )}
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
            <p className="text-base text-grafito/60">
              Todavía no hay actividad registrada.
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="bg-white rounded-2xl p-4 shadow-lg flex-1 overflow-y-auto">
              {displayedItems.map((item) => {
                const { icon, bg } = getIconForItem(item);
                const statusStyle = STATUS_STYLE[item.status];
                const metadataLine = getMetadataLine(item.metadata);
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 py-3 px-2 border-b border-gray-300 last:border-b-0"
                  >
                    <div
                      className="w-11 h-11 rounded-full text-white flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: bg }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-base font-bold text-grafito">
                          {item.title}
                        </p>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                          }}
                        >
                          {statusStyle.label}
                        </span>
                      </div>
                      <p className="text-sm text-grafito/60 mt-0.5">
                        {item.description}
                      </p>
                      {metadataLine && (
                        <p className="text-xs text-oceano font-semibold mt-0.5 truncate">
                          {metadataLine}
                        </p>
                      )}
                      <p className="text-xs text-grafito/40 mt-1">
                        {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="text-center mt-4 flex-shrink-0">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-white text-grafito text-sm font-semibold px-6 py-3 rounded-full shadow-lg hover:brightness-95 transition disabled:opacity-50"
                >
                  {loadingMore ? "Cargando..." : "Cargar más"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}