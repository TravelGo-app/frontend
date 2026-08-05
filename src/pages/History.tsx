import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import beachBg from "../assets/PlayaPrincipal.png";
import api from "../services/api";

type Category =
  | "AUTH"
  | "PROFILE"
  | "WALLET"
  | "EMAIL"
  | "SECURITY"
  | "SYSTEM";

type Status =
  | "SUCCESS"
  | "FAILED"
  | "PENDING"
  | "INFO";

type OperationFilter =
  | "all"
  | "deposit"
  | "transfer"
  | "exchange"
  | "account";

type StatusFilter = "all" | Status;

type AmountTone =
  | "positive"
  | "negative"
  | "neutral";

interface ActivityItem {
  id: string;
  eventType: string;
  category: Category;
  status: Status;
  title: string;
  description: string;

  entity: {
    type: string;
    id: string;
  } | null;

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

interface ApiError {
  response?: {
    status?: number;

    data?: {
      error?: string;
      message?: string;
    };
  };
}

interface OperationFilterOption {
  value: OperationFilter;
  label: string;
  category?: Category;
}

interface AmountPresentation {
  text: string;
  tone: AmountTone;
  numericValue: number;
  currencyCode: string;
}

const API_LIMIT = 25;
const PAGE_SIZE = 10;

const OPERATION_FILTERS: OperationFilterOption[] =
  [
    {
      value: "all",
      label: "Todas",
    },

    {
      value: "deposit",
      label: "Depósitos",
      category: "WALLET",
    },

    {
      value: "transfer",
      label: "Transferencias",
      category: "WALLET",
    },

    {
      value: "exchange",
      label: "Intercambios",
      category: "WALLET",
    },

    {
      value: "account",
      label: "Cuenta",
      category: "AUTH",
    },
  ];

const STATUS_META: Record<
  Status,
  {
    label: string;
    className: string;
  }
> = {
  SUCCESS: {
    label: "Completada",
    className: "is-success",
  },

  FAILED: {
    label: "Error",
    className: "is-failed",
  },

  PENDING: {
    label: "Pendiente",
    className: "is-pending",
  },

  INFO: {
    label: "Información",
    className: "is-info",
  },
};

const CURRENCY_FLAGS: Record<
  string,
  string
> = {
  ARS: "ar",
  USD: "us",
  EUR: "eu",
  BRL: "br",
  CLP: "cl",
  COP: "co",
};

const METADATA_LABELS: Record<
  string,
  string
> = {
  email: "Email",
  recipientEmail: "Destinatario",
  recipientIdentifier: "Destinatario",
  toEmail: "Para",
  newEmail: "Nuevo email",
  amount: "Monto",
  currencyCode: "Moneda",
  currency: "Moneda",
  fromCurrency: "Desde",
  toCurrency: "Hacia",
  fromAmount: "Monto entregado",
  toAmount: "Monto recibido",
  rate: "Tasa",
  alias: "Alias",
  cvu: "CVU",
  ip: "Dirección IP",
  device: "Dispositivo",
  provider: "Proveedor",
  transactionId: "ID de transacción",
  operationId: "ID de operación",
  idempotencyKey: "Referencia",
};

function getStringValue(
  metadata: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    const value = metadata[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return String(value);
    }
  }

  return null;
}

function getNumberValue(value: unknown) {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace(",", ".");

  const parsed = Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : null;
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
    return `${value.toLocaleString(
      "es-AR",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )} ${currencyCode}`;
  }
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleString(
    "es-AR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleString(
    "es-AR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  );
}

function getOperationKind(
  item: ActivityItem,
): OperationFilter | "other" {
  const type =
    item.eventType.toLowerCase();

  if (type.includes("deposit")) {
    return "deposit";
  }

  if (type.includes("exchange")) {
    return "exchange";
  }

  if (type.includes("transfer")) {
    return "transfer";
  }

  if (
    item.category === "AUTH" ||
    item.category === "PROFILE"
  ) {
    return "account";
  }

  return "other";
}

function getOperationPresentation(
  item: ActivityItem,
) {
  const kind = getOperationKind(item);
  const type =
    item.eventType.toLowerCase();

  if (kind === "deposit") {
    return {
      icon: "+",
      className: "is-deposit",
      label: "Depósito",
    };
  }

  if (kind === "exchange") {
    return {
      icon: "⇄",
      className: "is-exchange",
      label: "Intercambio",
    };
  }

  if (
    kind === "transfer" &&
    (type.includes("sent") ||
      type.includes("send"))
  ) {
    return {
      icon: "↑",
      className: "is-transfer-out",
      label: "Transferencia",
    };
  }

  if (kind === "transfer") {
    return {
      icon: "↓",
      className: "is-transfer-in",
      label: "Transferencia",
    };
  }

  if (item.category === "AUTH") {
    return {
      icon: "⌁",
      className: "is-account",
      label: "Acceso",
    };
  }

  if (item.category === "PROFILE") {
    return {
      icon: "◉",
      className: "is-account",
      label: "Perfil",
    };
  }

  if (item.category === "SECURITY") {
    return {
      icon: "◆",
      className: "is-security",
      label: "Seguridad",
    };
  }

  if (item.category === "EMAIL") {
    return {
      icon: "✉",
      className: "is-email",
      label: "Correo",
    };
  }

  return {
    icon: "•",
    className: "is-neutral",
    label: "Actividad",
  };
}

function getCurrencyFromItem(
  item: ActivityItem,
) {
  return (
    getStringValue(item.metadata, [
      "currencyCode",
      "currency",
      "toCurrency",
      "fromCurrency",
    ]) ?? "ARS"
  ).toUpperCase();
}

function getAmountPresentation(
  item: ActivityItem,
): AmountPresentation {
  const type =
    item.eventType.toLowerCase();

  const currencyCode =
    getCurrencyFromItem(item);

  const amount = getNumberValue(
    item.metadata.amount,
  );

  const fromAmount = getNumberValue(
    item.metadata.fromAmount,
  );

  const toAmount = getNumberValue(
    item.metadata.toAmount,
  );

  const fromCurrency = getStringValue(
    item.metadata,
    ["fromCurrency"],
  )?.toUpperCase();

  const toCurrency = getStringValue(
    item.metadata,
    ["toCurrency"],
  )?.toUpperCase();

  if (
    type.includes("exchange") &&
    fromAmount !== null &&
    toAmount !== null &&
    fromCurrency &&
    toCurrency
  ) {
    return {
      text: `${formatMoney(
        fromAmount,
        fromCurrency,
      )} → ${formatMoney(
        toAmount,
        toCurrency,
      )}`,

      tone: "neutral",
      numericValue: toAmount,
      currencyCode: toCurrency,
    };
  }

  if (amount === null) {
    return {
      text: "—",
      tone: "neutral",
      numericValue: 0,
      currencyCode,
    };
  }

  const isPositive =
    type.includes("deposit") ||
    type.includes("received") ||
    type.includes("credited");

  const isNegative =
    type.includes("sent") ||
    type.includes("send") ||
    (type.includes("transfer") &&
      !type.includes("received"));

  if (isPositive) {
    return {
      text: `+ ${formatMoney(
        amount,
        currencyCode,
      )}`,

      tone: "positive",
      numericValue: amount,
      currencyCode,
    };
  }

  if (isNegative) {
    return {
      text: `- ${formatMoney(
        amount,
        currencyCode,
      )}`,

      tone: "negative",
      numericValue: amount,
      currencyCode,
    };
  }

  return {
    text: formatMoney(
      amount,
      currencyCode,
    ),

    tone: "neutral",
    numericValue: amount,
    currencyCode,
  };
}

function getOperationId(
  item: ActivityItem,
) {
  return (
    getStringValue(item.metadata, [
      "transactionId",
      "operationId",
      "idempotencyKey",
      "reference",
    ]) ??
    item.entity?.id ??
    item.id
  );
}

function getMetadataSummary(
  item: ActivityItem,
) {
  const preferredKeys = [
    "recipientIdentifier",
    "recipientEmail",
    "toEmail",
    "email",
    "fromCurrency",
    "toCurrency",
    "rate",
    "provider",
    "alias",
    "cvu",
  ];

  const parts = preferredKeys
    .map((key) => {
      const value = item.metadata[key];

      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return null;
      }

      return `${
        METADATA_LABELS[key] ?? key
      }: ${String(value)}`;
    })
    .filter(
      (value): value is string =>
        value !== null,
    )
    .slice(0, 3);

  return parts.length
    ? parts.join(" · ")
    : null;
}

function escapeCsv(value: unknown) {
  const text =
    value === null ||
    value === undefined
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);

  return `"${text.replace(/"/g, '""')}"`;
}

function buildPageWindow(
  currentPage: number,
  totalPages: number,
) {
  const pages = new Set<number>([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);

  return Array.from(pages)
    .filter(
      (page) =>
        page >= 1 &&
        page <= totalPages,
    )
    .sort(
      (first, second) =>
        first - second,
    );
}

export default function History() {
  const navigate = useNavigate();

  const scrollContainerRef =
    useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<
    ActivityItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const [hasMore, setHasMore] =
    useState(false);

  const [nextCursor, setNextCursor] =
    useState<string | null>(null);

  const [
    operationFilter,
    setOperationFilter,
  ] =
    useState<OperationFilter>("all");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>("all");

  const [
    currencyFilter,
    setCurrencyFilter,
  ] = useState("all");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    selectedItem,
    setSelectedItem,
  ] = useState<ActivityItem | null>(
    null,
  );

  const [currentPage, setCurrentPage] =
    useState(1);

  const activeCategory =
    OPERATION_FILTERS.find(
      (entry) =>
        entry.value ===
        operationFilter,
    )?.category;

  const buildQuery = useCallback(
    (cursor?: string | null) => {
      const params =
        new URLSearchParams();

      params.set(
        "limit",
        String(API_LIMIT),
      );

      if (activeCategory) {
        params.set(
          "category",
          activeCategory,
        );
      }

      if (cursor) {
        params.set("cursor", cursor);
      }

      return params.toString();
    },
    [activeCategory],
  );

  const loadInitial = useCallback(() => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    api
      .get<ActivityResponse>(
        `/activity-history?${buildQuery()}`,
      )
      .then((response) => {
        setItems(
          response.data.items ?? [],
        );

        setHasMore(
          response.data.pagination
            .hasMore,
        );

        setNextCursor(
          response.data.pagination
            .nextCursor,
        );
      })
      .catch((caughtError: unknown) => {
        const apiError =
          caughtError as ApiError;

        if (
          apiError.response?.status ===
          401
        ) {
          setError(
            "Tu sesión venció. Iniciá sesión nuevamente.",
          );
        } else if (
          apiError.response?.status ===
          400
        ) {
          setError(
            "No pudimos aplicar los filtros solicitados.",
          );
        } else {
          setError(
            "No pudimos cargar tu historial. Intentá otra vez.",
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [buildQuery]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const handleLoadMore =
    useCallback(async () => {
      if (
        !nextCursor ||
        loadingMore
      ) {
        return;
      }

      setLoadingMore(true);

      try {
        const response =
          await api.get<ActivityResponse>(
            `/activity-history?${buildQuery(
              nextCursor,
            )}`,
          );

        setItems((previousItems) => {
          const existingIds = new Set(
            previousItems.map(
              (item) => item.id,
            ),
          );

          const newItems =
            response.data.items.filter(
              (item) =>
                !existingIds.has(
                  item.id,
                ),
            );

          return [
            ...previousItems,
            ...newItems,
          ];
        });

        setHasMore(
          response.data.pagination
            .hasMore,
        );

        setNextCursor(
          response.data.pagination
            .nextCursor,
        );
      } catch (caughtError) {
        console.error(
          "Error cargando más historial:",
          caughtError,
        );
      } finally {
        setLoadingMore(false);
      }
    }, [
      buildQuery,
      loadingMore,
      nextCursor,
    ]);

  const currencyOptions = useMemo(() => {
    return Array.from(
      new Set(
        items.map(
          getCurrencyFromItem,
        ),
      ),
    ).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    const fromDate = dateFrom
      ? new Date(
          `${dateFrom}T00:00:00`,
        )
      : null;

    const toDate = dateTo
      ? new Date(
          `${dateTo}T23:59:59.999`,
        )
      : null;

    return items.filter((item) => {
      const operationKind =
        getOperationKind(item);

      const matchesOperation =
        operationFilter === "all"
          ? true
          : operationKind ===
            operationFilter;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : item.status ===
            statusFilter;

      const itemCurrency =
        getCurrencyFromItem(item);

      const matchesCurrency =
        currencyFilter === "all"
          ? true
          : itemCurrency ===
            currencyFilter;

      const createdAt = new Date(
        item.createdAt,
      );

      const matchesDateFrom =
        !fromDate ||
        createdAt >= fromDate;

      const matchesDateTo =
        !toDate ||
        createdAt <= toDate;

      const metadataText =
        Object.values(item.metadata)
          .map((value) =>
            typeof value === "object"
              ? JSON.stringify(value)
              : String(value ?? ""),
          )
          .join(" ");

      const searchableText = [
        item.title,
        item.description,
        item.eventType,
        item.category,
        item.status,
        getOperationId(item),
        metadataText,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch === ""
          ? true
          : searchableText.includes(
              normalizedSearch,
            );

      return (
        matchesOperation &&
        matchesStatus &&
        matchesCurrency &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesSearch
      );
    });
  }, [
    currencyFilter,
    dateFrom,
    dateTo,
    items,
    operationFilter,
    search,
    statusFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);

    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [
    operationFilter,
    statusFilter,
    currencyFilter,
    dateFrom,
    dateTo,
    search,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredItems.length /
        PAGE_SIZE,
    ),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageStart =
    (currentPage - 1) * PAGE_SIZE;

  const pageItems =
    filteredItems.slice(
      pageStart,
      pageStart + PAGE_SIZE,
    );

  const pageNumbers = buildPageWindow(
    currentPage,
    totalPages,
  );

  const activeFilterLabel =
    OPERATION_FILTERS.find(
      (entry) =>
        entry.value ===
        operationFilter,
    )?.label ?? "Todas";

  const stats = useMemo(() => {
    const total =
      filteredItems.length;

    const successful =
      filteredItems.filter(
        (item) =>
          item.status === "SUCCESS",
      ).length;

    const pending =
      filteredItems.filter(
        (item) =>
          item.status === "PENDING",
      ).length;

    const failed =
      filteredItems.filter(
        (item) =>
          item.status === "FAILED",
      ).length;

    return {
      total,
      successful,
      pending,
      failed,
    };
  }, [filteredItems]);

  const clearFilters = () => {
    setOperationFilter("all");
    setStatusFilter("all");
    setCurrencyFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearch("");
  };

  const changePage = (
    nextPage: number,
  ) => {
    const safePage = Math.min(
      Math.max(nextPage, 1),
      totalPages,
    );

    setCurrentPage(safePage);

    scrollContainerRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleInternalScroll = (
    event: UIEvent<HTMLDivElement>,
  ) => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = event.currentTarget;

    const nearBottom =
      scrollHeight -
        scrollTop -
        clientHeight <
      90;

    if (
      nearBottom &&
      currentPage === totalPages &&
      hasMore &&
      !loadingMore
    ) {
      void handleLoadMore();
    }
  };

  const exportCsv = () => {
    const headers = [
      "ID",
      "Fecha",
      "Título",
      "Descripción",
      "Tipo",
      "Categoría",
      "Estado",
      "Moneda",
      "Monto",
      "Metadata",
    ];

    const rows = filteredItems.map(
      (item) => {
        const amount =
          getAmountPresentation(item);

        return [
          getOperationId(item),
          item.createdAt,
          item.title,
          item.description,
          item.eventType,
          item.category,
          item.status,
          amount.currencyCode,
          amount.text,
          item.metadata,
        ];
      },
    );

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) =>
        row.map(escapeCsv).join(","),
      ),
    ].join("\n");

    const blob = new Blob(
      [`\uFEFF${csv}`],
      {
        type: "text/csv;charset=utf-8",
      },
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "travelgo-historial.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className="tg-history-page"
      style={{
        backgroundImage: `url(${beachBg})`,
      }}
    >
      <div className="tg-history-overlay" />

      <div className="tg-history-inner">
        <button
          type="button"
          className="tg-history-back"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <span aria-hidden="true">
            ←
          </span>

          Ir a Billetera
        </button>

        <header className="tg-history-header">
          <div>
            <p className="tg-history-eyebrow">
              ACTIVIDAD DE TU CUENTA
            </p>

            <h1>Historial</h1>

            <span>
              Revisá, buscá y filtrá todos
              tus movimientos en TravelGo.
            </span>
          </div>

          <div className="tg-history-header__actions">
            <span>
              {filteredItems.length}{" "}
              resultados
            </span>

            <button
              type="button"
              className="tg-history-export"
              onClick={exportCsv}
              disabled={
                filteredItems.length ===
                0
              }
            >
              <span aria-hidden="true">
                ↓
              </span>

              Exportar CSV
            </button>
          </div>
        </header>

        <section className="tg-history-stats">
          <article className="tg-history-stat">
            <div className="tg-history-stat__icon is-cyan">
              ⇄
            </div>

            <div>
              <span>
                Actividad filtrada
              </span>

              <strong>
                {stats.total}
              </strong>

              <small>
                Registros visibles
              </small>
            </div>
          </article>

          <article className="tg-history-stat">
            <div className="tg-history-stat__icon is-green">
              ✓
            </div>

            <div>
              <span>
                Completadas
              </span>

              <strong>
                {stats.successful}
              </strong>

              <small>
                Operaciones exitosas
              </small>
            </div>
          </article>

          <article className="tg-history-stat">
            <div className="tg-history-stat__icon is-orange">
              ◷
            </div>

            <div>
              <span>
                Pendientes
              </span>

              <strong>
                {stats.pending}
              </strong>

              <small>
                En procesamiento
              </small>
            </div>
          </article>

          <article className="tg-history-stat">
            <div className="tg-history-stat__icon is-red">
              !
            </div>

            <div>
              <span>
                Con error
              </span>

              <strong>
                {stats.failed}
              </strong>

              <small>
                Requieren revisión
              </small>
            </div>
          </article>
        </section>

        <section className="tg-history-filter-panel">
          <div className="tg-history-filter-panel__top">
            <div>
              <p>FILTRAR ACTIVIDAD</p>

              <h2>
                Encontrá un movimiento
              </h2>
            </div>

            <button
              type="button"
              className="tg-history-clear"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          </div>

          <div className="tg-history-operation-filters">
            {OPERATION_FILTERS.map(
              (entry) => (
                <button
                  key={entry.value}
                  type="button"
                  className={`tg-history-chip ${
                    operationFilter ===
                    entry.value
                      ? "is-active"
                      : ""
                  }`}
                  onClick={() =>
                    setOperationFilter(
                      entry.value,
                    )
                  }
                >
                  {entry.label}
                </button>
              ),
            )}
          </div>

          <div className="tg-history-advanced-filters">
            <label className="tg-history-search">
              <span aria-hidden="true">
                ⌕
              </span>

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Buscar ID, contacto, descripción..."
              />
            </label>

            <label className="tg-history-select">
              <span>Estado</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target
                      .value as StatusFilter,
                  )
                }
              >
                <option value="all">
                  Todos
                </option>

                <option value="SUCCESS">
                  Completada
                </option>

                <option value="PENDING">
                  Pendiente
                </option>

                <option value="FAILED">
                  Error
                </option>

                <option value="INFO">
                  Información
                </option>
              </select>
            </label>

            <label className="tg-history-select">
              <span>Moneda</span>

              <select
                value={currencyFilter}
                onChange={(event) =>
                  setCurrencyFilter(
                    event.target.value,
                  )
                }
              >
                <option value="all">
                  Todas
                </option>

                {currencyOptions.map(
                  (currency) => (
                    <option
                      key={currency}
                      value={currency}
                    >
                      {currency}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="tg-history-date">
              <span>Desde</span>

              <input
                type="date"
                value={dateFrom}
                max={dateTo || undefined}
                onChange={(event) =>
                  setDateFrom(
                    event.target.value,
                  )
                }
              />
            </label>

            <label className="tg-history-date">
              <span>Hasta</span>

              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(event) =>
                  setDateTo(
                    event.target.value,
                  )
                }
              />
            </label>
          </div>
        </section>

        <section className="tg-history-panel">
          <div className="tg-history-panel__heading">
            <div>
              <h2>
                Movimientos
              </h2>

              <p>
                Filtro actual:{" "}
                {activeFilterLabel}
              </p>
            </div>

            <span>
              Página {currentPage} de{" "}
              {totalPages}
            </span>
          </div>

          {loading ? (
            <div className="tg-history-state">
              <span className="tg-history-loader" />

              <p>
                Cargando historial...
              </p>
            </div>
          ) : error ? (
            <div className="tg-history-state is-error">
              <span>!</span>

              <p>{error}</p>

              <button
                type="button"
                onClick={loadInitial}
              >
                Reintentar
              </button>
            </div>
          ) : filteredItems.length ===
            0 ? (
            <div className="tg-history-state">
              <span className="tg-history-empty-icon">
                ⌕
              </span>

              <h3>
                No encontramos movimientos
              </h3>

              <p>
                Probá modificando o limpiando
                los filtros.
              </p>

              <button
                type="button"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div
                ref={scrollContainerRef}
                className="tg-history-scroll"
                onScroll={
                  handleInternalScroll
                }
              >
                <div className="tg-history-table-wrap">
                  <table className="tg-history-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Operación</th>
                        <th>Descripción</th>
                        <th>Moneda</th>
                        <th>Monto</th>
                        <th>Estado</th>
                        <th aria-label="Acciones" />
                      </tr>
                    </thead>

                    <tbody>
                      {pageItems.map(
                        (item) => {
                          const operation =
                            getOperationPresentation(
                              item,
                            );

                          const amount =
                            getAmountPresentation(
                              item,
                            );

                          const status =
                            STATUS_META[
                              item.status
                            ];

                          const currency =
                            getCurrencyFromItem(
                              item,
                            );

                          const flag =
                            CURRENCY_FLAGS[
                              currency
                            ];

                          const metadata =
                            getMetadataSummary(
                              item,
                            );

                          return (
                            <tr
                              key={item.id}
                              className="tg-history-row"
                              onClick={() =>
                                setSelectedItem(
                                  item,
                                )
                              }
                            >
                              <td>
                                <span className="tg-history-date-cell">
                                  {formatDateShort(
                                    item.createdAt,
                                  )}
                                </span>
                              </td>

                              <td>
                                <div className="tg-history-operation">
                                  <span
                                    className={`tg-history-operation__icon ${operation.className}`}
                                  >
                                    {
                                      operation.icon
                                    }
                                  </span>

                                  <div>
                                    <strong>
                                      {
                                        operation.label
                                      }
                                    </strong>

                                    <small>
                                      ID:{" "}
                                      {getOperationId(
                                        item,
                                      )}
                                    </small>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div className="tg-history-description">
                                  <strong>
                                    {
                                      item.title
                                    }
                                  </strong>

                                  <span>
                                    {
                                      item.description
                                    }
                                  </span>

                                  {metadata && (
                                    <small>
                                      {
                                        metadata
                                      }
                                    </small>
                                  )}
                                </div>
                              </td>

                              <td>
                                <div className="tg-history-currency">
                                  {flag && (
                                    <span
                                      className={`fi fi-${flag}`}
                                      aria-hidden="true"
                                    />
                                  )}

                                  <strong>
                                    {currency}
                                  </strong>
                                </div>
                              </td>

                              <td>
                                <span
                                  className={`tg-history-amount is-${amount.tone}`}
                                >
                                  {amount.text}
                                </span>
                              </td>

                              <td>
                                <span
                                  className={`tg-history-status ${status.className}`}
                                >
                                  {status.label}
                                </span>
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="tg-history-detail-button"
                                  aria-label={`Ver detalle de ${item.title}`}
                                  onClick={(
                                    event,
                                  ) => {
                                    event.stopPropagation();

                                    setSelectedItem(
                                      item,
                                    );
                                  }}
                                >
                                  →
                                </button>
                              </td>
                            </tr>
                          );
                        },
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="tg-history-mobile-list">
                  {pageItems.map(
                    (item) => {
                      const operation =
                        getOperationPresentation(
                          item,
                        );

                      const amount =
                        getAmountPresentation(
                          item,
                        );

                      const status =
                        STATUS_META[
                          item.status
                        ];

                      return (
                        <button
                          key={item.id}
                          type="button"
                          className="tg-history-mobile-card"
                          onClick={() =>
                            setSelectedItem(
                              item,
                            )
                          }
                        >
                          <div className="tg-history-mobile-card__top">
                            <div className="tg-history-operation">
                              <span
                                className={`tg-history-operation__icon ${operation.className}`}
                              >
                                {
                                  operation.icon
                                }
                              </span>

                              <div>
                                <strong>
                                  {
                                    operation.label
                                  }
                                </strong>

                                <small>
                                  {formatDateShort(
                                    item.createdAt,
                                  )}
                                </small>
                              </div>
                            </div>

                            <span
                              className={`tg-history-status ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          <div className="tg-history-mobile-card__content">
                            <strong>
                              {item.title}
                            </strong>

                            <p>
                              {
                                item.description
                              }
                            </p>
                          </div>

                          <div className="tg-history-mobile-card__bottom">
                            <span
                              className={`tg-history-amount is-${amount.tone}`}
                            >
                              {amount.text}
                            </span>

                            <span>
                              Ver detalle →
                            </span>
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>

                {loadingMore && (
                  <div className="tg-history-loading-more">
                    <span className="tg-history-loader" />

                    Cargando más movimientos...
                  </div>
                )}
              </div>

              <footer className="tg-history-footer">
                <span>
                  Mostrando{" "}
                  {pageStart + 1}–{Math.min(
                    pageStart + PAGE_SIZE,
                    filteredItems.length,
                  )}{" "}
                  de {filteredItems.length}
                </span>

                <div className="tg-history-pagination">
                  <button
                    type="button"
                    aria-label="Página anterior"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      changePage(
                        currentPage - 1,
                      )
                    }
                  >
                    ‹
                  </button>

                  {pageNumbers.map(
                    (page, index) => {
                      const previousPage =
                        pageNumbers[
                          index - 1
                        ];

                      return (
                        <span
                          key={page}
                          className="tg-history-pagination__group"
                        >
                          {previousPage &&
                            page -
                              previousPage >
                              1 && (
                              <span className="tg-history-pagination__ellipsis">
                                …
                              </span>
                            )}

                          <button
                            type="button"
                            className={
                              currentPage ===
                              page
                                ? "is-active"
                                : ""
                            }
                            onClick={() =>
                              changePage(page)
                            }
                          >
                            {page}
                          </button>
                        </span>
                      );
                    },
                  )}

                  <button
                    type="button"
                    aria-label="Página siguiente"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      changePage(
                        currentPage + 1,
                      )
                    }
                  >
                    ›
                  </button>
                </div>

                {hasMore && (
                  <button
                    type="button"
                    className="tg-history-load-more"
                    onClick={() =>
                      void handleLoadMore()
                    }
                    disabled={loadingMore}
                  >
                    {loadingMore
                      ? "Cargando..."
                      : "Cargar más"}
                  </button>
                )}
              </footer>
            </>
          )}
        </section>
      </div>

      {selectedItem && (
        <div
          className="tg-history-modal-backdrop"
          role="presentation"
          onMouseDown={() =>
            setSelectedItem(null)
          }
        >
          <section
            className="tg-history-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-detail-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="tg-history-modal__close"
              aria-label="Cerrar detalle"
              onClick={() =>
                setSelectedItem(null)
              }
            >
              ×
            </button>

            <div className="tg-history-modal__summary">
              <span
                className={`tg-history-operation__icon ${
                  getOperationPresentation(
                    selectedItem,
                  ).className
                }`}
              >
                {
                  getOperationPresentation(
                    selectedItem,
                  ).icon
                }
              </span>

              <p>
                {
                  getOperationPresentation(
                    selectedItem,
                  ).label
                }
              </p>

              <h2 id="history-detail-title">
                {selectedItem.title}
              </h2>

              <span
                className={`tg-history-status ${
                  STATUS_META[
                    selectedItem.status
                  ].className
                }`}
              >
                {
                  STATUS_META[
                    selectedItem.status
                  ].label
                }
              </span>

              <strong
                className={`tg-history-amount is-${
                  getAmountPresentation(
                    selectedItem,
                  ).tone
                }`}
              >
                {
                  getAmountPresentation(
                    selectedItem,
                  ).text
                }
              </strong>

              <div className="tg-history-modal__reference">
                <span>
                  ID de operación
                </span>

                <strong>
                  {getOperationId(
                    selectedItem,
                  )}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    void navigator.clipboard.writeText(
                      getOperationId(
                        selectedItem,
                      ),
                    )
                  }
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="tg-history-modal__details">
              <div className="tg-history-modal__row">
                <span>
                  Fecha y hora
                </span>

                <strong>
                  {formatDateLong(
                    selectedItem.createdAt,
                  )}
                </strong>
              </div>

              <div className="tg-history-modal__row">
                <span>
                  Descripción
                </span>

                <strong>
                  {
                    selectedItem.description
                  }
                </strong>
              </div>

              <div className="tg-history-modal__row">
                <span>
                  Categoría
                </span>

                <strong>
                  {
                    selectedItem.category
                  }
                </strong>
              </div>

              <div className="tg-history-modal__row">
                <span>
                  Tipo de evento
                </span>

                <strong>
                  {
                    selectedItem.eventType
                  }
                </strong>
              </div>

              {Object.entries(
                selectedItem.metadata,
              ).map(([key, value]) => {
                if (
                  value === null ||
                  value === undefined ||
                  value === ""
                ) {
                  return null;
                }

                return (
                  <div
                    key={key}
                    className="tg-history-modal__row"
                  >
                    <span>
                      {METADATA_LABELS[key] ??
                        key}
                    </span>

                    <strong>
                      {typeof value ===
                      "object"
                        ? JSON.stringify(
                            value,
                          )
                        : String(value)}
                    </strong>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}