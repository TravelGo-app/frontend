import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import StepIndicator from "../components/StepIndicator";
import TravelIcon from "../components/ui/TravelIcon";
import api from "../services/api";

const CURRENCIES = [
  "ARS",
  "USD",
  "EUR",
  "BRL",
  "CLP",
];

const STEPS = [
  "Datos",
  "Confirmación",
  "Procesando",
  "Completado",
];

const ACCENT = "#ff6417";

interface Balance {
  currencyCode: string;
  amount: string;
}

interface CurrencyMeta {
  name: string;
  flag: string;
}

interface ExchangeResult {
  fromAmount: string;
  toAmount: string;
  fromCurrency: string;
  toCurrency: string;
  rate?: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
}

const CURRENCY_META: Record<
  string,
  CurrencyMeta
> = {
  ARS: {
    name: "Peso argentino",
    flag: "ar",
  },

  USD: {
    name: "Dólar estadounidense",
    flag: "us",
  },

  EUR: {
    name: "Euro",
    flag: "eu",
  },

  BRL: {
    name: "Real brasileño",
    flag: "br",
  },

  CLP: {
    name: "Peso chileno",
    flag: "cl",
  },
};

function generateIdempotencyKey() {
  return `exchange-${crypto.randomUUID()}`;
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

function formatRate(value: number) {
  return value.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

export default function Exchange() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const [
    fromCurrency,
    setFromCurrency,
  ] = useState("ARS");

  const [
    toCurrency,
    setToCurrency,
  ] = useState("USD");

  const [amount, setAmount] =
    useState("");

  const [balances, setBalances] =
    useState<Balance[]>([]);

  const [
    previewRate,
    setPreviewRate,
  ] = useState<number | null>(null);

  const [rateLoading, setRateLoading] =
    useState(false);

  const [
    idempotencyKey,
    setIdempotencyKey,
  ] = useState(generateIdempotencyKey);

  const [error, setError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<ExchangeResult | null>(null);

  const sameCurrency =
    fromCurrency === toCurrency;

  const fromMeta =
    CURRENCY_META[fromCurrency];

  const toMeta =
    CURRENCY_META[toCurrency];

  const parsedAmount = Number(amount);

  useEffect(() => {
    let mounted = true;

    api
      .get("/wallet/balances")
      .then((response) => {
        if (!mounted) {
          return;
        }

        setBalances(
          response.data?.balances ?? [],
        );
      })
      .catch(() => {
        if (mounted) {
          setBalances([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (sameCurrency) {
      setPreviewRate(null);
      setRateLoading(false);

      return;
    }

    let cancelled = false;

    setRateLoading(true);

    api
      .get(
        `/rates/${fromCurrency}/${toCurrency}`,
      )
      .then((response) => {
        if (cancelled) {
          return;
        }

        const rawRate =
          response.data?.rate ??
          response.data?.data?.rate;

        const numericRate =
          Number(rawRate);

        setPreviewRate(
          Number.isFinite(numericRate)
            ? numericRate
            : null,
        );
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewRate(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setRateLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    fromCurrency,
    toCurrency,
    sameCurrency,
  ]);

  const selectedBalance = useMemo(
    () =>
      balances.find(
        (balance) =>
          balance.currencyCode ===
          fromCurrency,
      ),
    [balances, fromCurrency],
  );

  const availableAmount = Number(
    selectedBalance?.amount ?? 0,
  );

  const convertedAmount = useMemo(() => {
    if (
      sameCurrency ||
      !previewRate ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return null;
    }

    return parsedAmount * previewRate;
  }, [
    parsedAmount,
    previewRate,
    sameCurrency,
  ]);

  const resultFromAmount = Number(
    result?.fromAmount ??
      parsedAmount ??
      0,
  );

  const resultToAmount = Number(
    result?.toAmount ??
      convertedAmount ??
      0,
  );

  const resultRate = Number(
    result?.rate ??
      previewRate ??
      0,
  );

  const receiptDate = useMemo(
    () =>
      new Date().toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [step],
  );

  const operationReference = useMemo(
    () =>
      `EXC-${idempotencyKey
        .replace("exchange-", "")
        .slice(0, 8)
        .toUpperCase()}`,
    [idempotencyKey],
  );

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setError(null);
  };

  const setPercentage = (
    percentage: number,
  ) => {
    if (availableAmount <= 0) {
      return;
    }

    setAmount(
      (
        availableAmount * percentage
      ).toFixed(2),
    );
  };

  const handleContinue = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);

    if (sameCurrency) {
      setError(
        "Elegí dos monedas distintas para intercambiar.",
      );

      return;
    }

    if (
      !amount ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0
    ) {
      setError(
        "Ingresá un monto válido mayor a 0.",
      );

      return;
    }

    if (!previewRate) {
      setError(
        "No pudimos obtener la tasa de cambio. Intentá nuevamente.",
      );

      return;
    }

    setStep(1);
  };

  const handleConfirm = async () => {
    setError(null);
    setStep(2);

    try {
      const response = await api.post(
        "/transactions/exchange",
        {
          fromCurrency,
          toCurrency,

          amount:
            parsedAmount.toFixed(2),

          idempotencyKey,
        },
      );

      const transaction =
        response.data?.transaction ??
        response.data;

      setResult({
        fromAmount:
          transaction?.fromAmount ??
          parsedAmount.toFixed(2),

        toAmount:
          transaction?.toAmount ??
          convertedAmount?.toFixed(2) ??
          "0.00",

        fromCurrency:
          transaction?.fromCurrency ??
          fromCurrency,

        toCurrency:
          transaction?.toCurrency ??
          toCurrency,

        rate:
          transaction?.rate ??
          previewRate?.toString(),
      });

      setStep(3);
    } catch (caughtError: unknown) {
      const apiError =
        caughtError as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.response?.data
            ?.message ||
          "No se pudo completar el intercambio. Intentá de nuevo.",
      );

      setStep(1);
    }
  };

  const handleNewExchange = () => {
    setAmount("");
    setResult(null);
    setError(null);

    setIdempotencyKey(
      generateIdempotencyKey(),
    );

    setStep(0);
  };

  return (
    <div className="tg-operation-page is-exchange">
      <button
        type="button"
        className="tg-operation-back"
        onClick={() =>
          navigate("/transactions")
        }
      >
        <span aria-hidden="true">
          ←
        </span>

        Volver a Transacciones
      </button>

      <section className="tg-operation-shell">
        <aside className="tg-operation-aside">
          <div className="tg-operation-aside__header">
            <span className="tg-operation-aside__icon">
              <TravelIcon
                name="exchange"
                size={25}
              />
            </span>

            <div>
              <p>CAMBIO DE MONEDAS</p>

              <h1>Intercambiar</h1>
            </div>
          </div>

          <p className="tg-operation-aside__description">
            Convertí tus monedas utilizando
            la tasa de cambio disponible en
            TravelGo.
          </p>

          <div
            className="tg-operation-globe tg-operation-exchange-art"
            aria-hidden="true"
          >
            <div className="tg-operation-globe__orbit orbit-one" />

            <div className="tg-operation-globe__orbit orbit-two" />

            <div className="tg-operation-globe__planet">
              <TravelIcon
                name="exchange"
                size={72}
              />
            </div>

            <span className="tg-operation-exchange-art__currency currency-one">
              {fromCurrency}
            </span>

            <span className="tg-operation-exchange-art__currency currency-two">
              {toCurrency}
            </span>

            <span className="tg-operation-exchange-art__arrow">
              ⇄
            </span>
          </div>

          <div className="tg-operation-balance">
            <div>
              <span>
                Saldo disponible
              </span>

              <strong>
                {selectedBalance
                  ? formatMoney(
                      availableAmount,
                      fromCurrency,
                    )
                  : "—"}
              </strong>

              <small>
                {fromCurrency} ·{" "}
                {fromMeta.name}
              </small>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Ver billetera

              <TravelIcon
                name="eye"
                size={15}
              />
            </button>
          </div>
        </aside>

        <main className="tg-operation-panel">
          <StepIndicator
            steps={STEPS}
            currentStep={step}
            accentColor={ACCENT}
          />

          <div className="tg-operation-content">
            {step === 0 && (
              <div className="tg-operation-view">
                <header className="tg-operation-heading">
                  <p>CONVERTIR MONEDAS</p>

                  <h2>
                    Elegí las monedas
                  </h2>

                  <span>
                    Seleccioná una moneda de
                    origen, otra de destino y
                    el monto que querés
                    convertir.
                  </span>
                </header>

                <form
                  className="tg-operation-form"
                  onSubmit={
                    handleContinue
                  }
                >
                  <div className="tg-exchange-selector">
                    <div className="tg-operation-field">
                      <label htmlFor="exchange-from">
                        Moneda de origen
                      </label>

                      <div className="tg-operation-select">
                        <span
                          className={`fi fi-${fromMeta.flag}`}
                          aria-hidden="true"
                        />

                        <select
                          id="exchange-from"
                          value={fromCurrency}
                          onChange={(event) =>
                            setFromCurrency(
                              event.target
                                .value,
                            )
                          }
                        >
                          {CURRENCIES.map(
                            (currency) => (
                              <option
                                key={currency}
                                value={currency}
                              >
                                {currency} —{" "}
                                {
                                  CURRENCY_META[
                                    currency
                                  ].name
                                }
                              </option>
                            ),
                          )}
                        </select>

                        <span className="tg-operation-select__arrow">
                          ▾
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="tg-exchange-swap"
                      onClick={swapCurrencies}
                      aria-label="Invertir monedas"
                      title="Invertir monedas"
                    >
                      <TravelIcon
                        name="exchange"
                        size={21}
                      />
                    </button>

                    <div className="tg-operation-field">
                      <label htmlFor="exchange-to">
                        Moneda de destino
                      </label>

                      <div className="tg-operation-select">
                        <span
                          className={`fi fi-${toMeta.flag}`}
                          aria-hidden="true"
                        />

                        <select
                          id="exchange-to"
                          value={toCurrency}
                          onChange={(event) =>
                            setToCurrency(
                              event.target
                                .value,
                            )
                          }
                        >
                          {CURRENCIES.map(
                            (currency) => (
                              <option
                                key={currency}
                                value={currency}
                              >
                                {currency} —{" "}
                                {
                                  CURRENCY_META[
                                    currency
                                  ].name
                                }
                              </option>
                            ),
                          )}
                        </select>

                        <span className="tg-operation-select__arrow">
                          ▾
                        </span>
                      </div>
                    </div>
                  </div>

                  {sameCurrency && (
                    <div className="tg-operation-alert">
                      <span>!</span>

                      <p>
                        Elegí dos monedas
                        distintas.
                      </p>
                    </div>
                  )}

                  <div className="tg-operation-field">
                    <div className="tg-operation-field__row">
                      <label htmlFor="exchange-amount">
                        Monto a convertir
                      </label>

                      <span>
                        Disponible:{" "}
                        {selectedBalance
                          ? formatMoney(
                              availableAmount,
                              fromCurrency,
                            )
                          : "—"}
                      </span>
                    </div>

                    <div className="tg-operation-amount">
                      <span>
                        {fromCurrency}
                      </span>

                      <input
                        id="exchange-amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(event) =>
                          setAmount(
                            event.target.value,
                          )
                        }
                        placeholder="0,00"
                      />
                    </div>

                    <div className="tg-operation-percentages">
                      <button
                        type="button"
                        onClick={() =>
                          setPercentage(0.25)
                        }
                      >
                        25%
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPercentage(0.5)
                        }
                      >
                        50%
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPercentage(0.75)
                        }
                      >
                        75%
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPercentage(1)
                        }
                      >
                        Máximo
                      </button>
                    </div>
                  </div>

                  <div className="tg-exchange-rate-card">
                    <div className="tg-exchange-rate-card__header">
                      <span>
                        Tasa estimada
                      </span>

                      <small
                        className={
                          rateLoading
                            ? "is-loading"
                            : ""
                        }
                      >
                        {rateLoading
                          ? "Actualizando..."
                          : "Tasa disponible"}
                      </small>
                    </div>

                    <strong>
                      {previewRate &&
                      !sameCurrency
                        ? `1 ${fromCurrency} = ${formatRate(
                            previewRate,
                          )} ${toCurrency}`
                        : "—"}
                    </strong>

                    <div className="tg-exchange-rate-card__result">
                      <span>
                        Recibirás aproximadamente
                      </span>

                      <strong>
                        {convertedAmount !==
                          null
                          ? formatMoney(
                              convertedAmount,
                              toCurrency,
                            )
                          : "—"}
                      </strong>
                    </div>
                  </div>

                  <div className="tg-operation-information">
                    <span>i</span>

                    <p>
                      El importe final se
                      confirmará antes de
                      procesar el intercambio.
                    </p>
                  </div>

                  {error && (
                    <div
                      className="tg-operation-alert"
                      role="alert"
                    >
                      <span>!</span>

                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="tg-operation-primary"
                    disabled={
                      sameCurrency ||
                      rateLoading ||
                      !previewRate
                    }
                  >
                    Continuar

                    <span aria-hidden="true">
                      →
                    </span>
                  </button>
                </form>
              </div>
            )}

            {step === 1 && (
              <div className="tg-operation-view">
                <header className="tg-operation-heading">
                  <p>REVISIÓN FINAL</p>

                  <h2>
                    Confirmá el intercambio
                  </h2>

                  <span>
                    Revisá la tasa y los
                    importes antes de continuar.
                  </span>
                </header>

                <div className="tg-exchange-preview">
                  <div className="tg-exchange-preview__currency">
                    <span
                      className={`fi fi-${fromMeta.flag}`}
                    />

                    <small>
                      Entregás
                    </small>

                    <strong>
                      {formatMoney(
                        parsedAmount,
                        fromCurrency,
                      )}
                    </strong>
                  </div>

                  <div className="tg-exchange-preview__arrow">
                    <TravelIcon
                      name="exchange"
                      size={24}
                    />
                  </div>

                  <div className="tg-exchange-preview__currency">
                    <span
                      className={`fi fi-${toMeta.flag}`}
                    />

                    <small>
                      Recibís aprox.
                    </small>

                    <strong>
                      {formatMoney(
                        convertedAmount ?? 0,
                        toCurrency,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="tg-operation-summary">
                  <div>
                    <span>
                      Moneda de origen
                    </span>

                    <strong>
                      <span
                        className={`fi fi-${fromMeta.flag}`}
                      />

                      {fromCurrency} —{" "}
                      {fromMeta.name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Moneda de destino
                    </span>

                    <strong>
                      <span
                        className={`fi fi-${toMeta.flag}`}
                      />

                      {toCurrency} —{" "}
                      {toMeta.name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Tasa aplicada
                    </span>

                    <strong>
                      1 {fromCurrency} ={" "}
                      {previewRate
                        ? formatRate(
                            previewRate,
                          )
                        : "—"}{" "}
                      {toCurrency}
                    </strong>
                  </div>

                  <div>
                    <span>Comisión</span>

                    <strong className="is-success">
                      $ 0,00
                    </strong>
                  </div>

                  <div className="is-total">
                    <span>
                      Total estimado
                    </span>

                    <strong>
                      {formatMoney(
                        convertedAmount ?? 0,
                        toCurrency,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="tg-operation-information">
                  <span>i</span>

                  <p>
                    La conversión se realizará
                    utilizando la tasa mostrada
                    al confirmar.
                  </p>
                </div>

                {error && (
                  <div
                    className="tg-operation-alert"
                    role="alert"
                  >
                    <span>!</span>

                    <p>{error}</p>
                  </div>
                )}

                <div className="tg-operation-actions">
                  <button
                    type="button"
                    className="tg-operation-secondary"
                    onClick={() =>
                      setStep(0)
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="tg-operation-primary"
                    onClick={
                      handleConfirm
                    }
                  >
                    Confirmar intercambio
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="tg-operation-status">
                <div className="tg-operation-status__animation">
                  <div className="tg-operation-status__ring ring-one" />

                  <div className="tg-operation-status__ring ring-two" />

                  <div className="tg-operation-status__plane">
                    <TravelIcon
                      name="exchange"
                      size={55}
                    />
                  </div>
                </div>

                <h2>
                  Convirtiendo monedas...
                </h2>

                <p>
                  Estamos procesando tu
                  intercambio y actualizando
                  los saldos de tu billetera.
                </p>

                <div className="tg-operation-information">
                  <span>i</span>

                  <p>
                    No cierres esta ventana ni
                    actualices la página.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="tg-operation-status is-success">
                <div className="tg-operation-success is-exchange">
                  <span>✓</span>
                </div>

                <h2>
                  ¡Intercambio realizado!
                </h2>

                <p>
                  Las monedas fueron
                  convertidas correctamente.
                </p>

                <div className="tg-operation-receipt">
                  <div>
                    <span>
                      Moneda entregada
                    </span>

                    <strong>
                      {formatMoney(
                        resultFromAmount,
                        result?.fromCurrency ??
                          fromCurrency,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Moneda recibida
                    </span>

                    <strong>
                      {formatMoney(
                        resultToAmount,
                        result?.toCurrency ??
                          toCurrency,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Tasa aplicada
                    </span>

                    <strong>
                      1{" "}
                      {result?.fromCurrency ??
                        fromCurrency}{" "}
                      ={" "}
                      {resultRate
                        ? formatRate(
                            resultRate,
                          )
                        : "—"}{" "}
                      {result?.toCurrency ??
                        toCurrency}
                    </strong>
                  </div>

                  <div>
                    <span>Comisión</span>

                    <strong>
                      $ 0,00
                    </strong>
                  </div>

                  <div>
                    <span>
                      Fecha y hora
                    </span>

                    <strong>
                      {receiptDate}
                    </strong>
                  </div>

                  <div>
                    <span>
                      ID de operación
                    </span>

                    <strong>
                      {operationReference}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="tg-operation-primary"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                >
                  Ver billetera
                </button>

                <button
                  type="button"
                  className="tg-operation-text-button"
                  onClick={
                    handleNewExchange
                  }
                >
                  Nuevo intercambio
                </button>
              </div>
            )}
          </div>
        </main>
      </section>

      <section className="tg-operation-benefits">
        <article>
          <TravelIcon
            name="exchange"
            size={24}
          />

          <div>
            <strong>
              Conversión inmediata
            </strong>

            <span>
              Actualizamos tus saldos en
              segundos.
            </span>
          </div>
        </article>

        <article>
          <TravelIcon
            name="percent"
            size={24}
          />

          <div>
            <strong>
              Tasa transparente
            </strong>

            <span>
              Conocés el resultado antes de
              confirmar.
            </span>
          </div>
        </article>

        <article>
          <TravelIcon
            name="shield"
            size={24}
          />

          <div>
            <strong>
              Operación segura
            </strong>

            <span>
              Protegemos cada conversión.
            </span>
          </div>
        </article>
      </section>
    </div>
  );
}