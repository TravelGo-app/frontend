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

const ACCENT = "#187de0";

interface Balance {
  currencyCode: string;
  amount: string;
}

interface CurrencyMeta {
  name: string;
  flag: string;
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
  return `deposit-${crypto.randomUUID()}`;
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

export default function Deposit() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const [
    currencyCode,
    setCurrencyCode,
  ] = useState("ARS");

  const [amount, setAmount] =
    useState("");

  const [balances, setBalances] =
    useState<Balance[]>([]);

  const [
    idempotencyKey,
    setIdempotencyKey,
  ] = useState(generateIdempotencyKey);

  const [error, setError] =
    useState<string | null>(null);

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

  const currencyMeta =
    CURRENCY_META[currencyCode];

  const selectedBalance = useMemo(
    () =>
      balances.find(
        (balance) =>
          balance.currencyCode ===
          currencyCode,
      ),
    [balances, currencyCode],
  );

  const currentBalance = Number(
    selectedBalance?.amount ?? 0,
  );

  const parsedAmount = Number(amount);

  const projectedBalance =
    currentBalance +
    (Number.isFinite(parsedAmount)
      ? parsedAmount
      : 0);

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
      `DEP-${idempotencyKey
        .replace("deposit-", "")
        .slice(0, 8)
        .toUpperCase()}`,
    [idempotencyKey],
  );

  const handleContinue = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);

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

    setStep(1);
  };

  const handleConfirm = async () => {
    setError(null);
    setStep(2);

    try {
      await api.post(
        "/transactions/deposit",
        {
          currencyCode,

          amount:
            parsedAmount.toFixed(2),

          idempotencyKey,
        },
      );

      setStep(3);
    } catch (caughtError: unknown) {
      const apiError =
        caughtError as ApiError;

      setError(
        apiError.response?.data?.error ||
          apiError.response?.data
            ?.message ||
          "No se pudo completar el depósito. Intentá de nuevo.",
      );

      setStep(1);
    }
  };

  const handleNewDeposit = () => {
    setAmount("");
    setError(null);

    setIdempotencyKey(
      generateIdempotencyKey(),
    );

    setStep(0);
  };

  const setQuickAmount = (
    value: number,
  ) => {
    setAmount(value.toFixed(2));
  };

  return (
    <div className="tg-operation-page is-deposit">
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

        Volver a Billetera
      </button>

      <section className="tg-operation-shell">
        <aside className="tg-operation-aside">
          <div className="tg-operation-aside__header">
            <span className="tg-operation-aside__icon">
              <TravelIcon
                name="plus"
                size={25}
              />
            </span>

            <div>
              <p>SALDO DE PRÁCTICA</p>

              <h1>Depositar</h1>
            </div>
          </div>

          <p className="tg-operation-aside__description">
            Agregá saldo simulado a tu
            billetera TravelGo para probar
            todas sus funciones.
          </p>

          <div
            className="tg-operation-globe tg-operation-deposit-art"
            aria-hidden="true"
          >
            <div className="tg-operation-globe__orbit orbit-one" />

            <div className="tg-operation-globe__orbit orbit-two" />

            <div className="tg-operation-globe__planet">
              <TravelIcon
                name="wallet"
                size={76}
              />
            </div>

            <span className="tg-operation-deposit-art__coin coin-one">
              $
            </span>

            <span className="tg-operation-deposit-art__coin coin-two">
              €
            </span>

            <span className="tg-operation-deposit-art__coin coin-three">
              R$
            </span>

            <span className="tg-operation-deposit-art__plus">
              +
            </span>
          </div>

          <div className="tg-operation-balance">
            <div>
              <span>
                Saldo actual
              </span>

              <strong>
                {selectedBalance
                  ? formatMoney(
                      currentBalance,
                      currencyCode,
                    )
                  : "—"}
              </strong>

              <small>
                {currencyCode} ·{" "}
                {currencyMeta.name}
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
                  <p>AGREGAR SALDO</p>

                  <h2>
                    Elegí moneda y monto
                  </h2>

                  <span>
                    Este depósito es simulado
                    y no procesa dinero real.
                  </span>
                </header>

                <form
                  className="tg-operation-form"
                  onSubmit={
                    handleContinue
                  }
                >
                  <div className="tg-operation-field">
                    <label htmlFor="deposit-currency">
                      Moneda
                    </label>

                    <div className="tg-operation-select">
                      <span
                        className={`fi fi-${currencyMeta.flag}`}
                        aria-hidden="true"
                      />

                      <select
                        id="deposit-currency"
                        value={currencyCode}
                        onChange={(event) =>
                          setCurrencyCode(
                            event.target.value,
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

                      <span
                        className="tg-operation-select__arrow"
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </div>
                  </div>

                  <div className="tg-operation-field">
                    <div className="tg-operation-field__row">
                      <label htmlFor="deposit-amount">
                        Monto a depositar
                      </label>

                      <span>
                        Saldo actual:{" "}
                        {selectedBalance
                          ? formatMoney(
                              currentBalance,
                              currencyCode,
                            )
                          : "—"}
                      </span>
                    </div>

                    <div className="tg-operation-amount">
                      <span>
                        {currencyCode}
                      </span>

                      <input
                        id="deposit-amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(event) =>
                          setAmount(
                            event.target.value,
                          )
                        }
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div className="tg-operation-quick-amounts">
                    <span>
                      Montos rápidos
                    </span>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setQuickAmount(1000)
                        }
                      >
                        +1.000
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setQuickAmount(5000)
                        }
                      >
                        +5.000
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setQuickAmount(10000)
                        }
                      >
                        +10.000
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setQuickAmount(50000)
                        }
                      >
                        +50.000
                      </button>
                    </div>
                  </div>

                  {amount &&
                    parsedAmount > 0 && (
                      <div className="tg-operation-projection">
                        <span>
                          Saldo estimado
                        </span>

                        <strong>
                          {formatMoney(
                            projectedBalance,
                            currencyCode,
                          )}
                        </strong>
                      </div>
                    )}

                  <div className="tg-operation-information">
                    <span>i</span>

                    <p>
                      Esta función agrega saldo
                      de práctica. No realiza
                      cargos ni transferencias
                      bancarias.
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
                    Confirmá el depósito
                  </h2>

                  <span>
                    Revisá la moneda y el monto
                    antes de continuar.
                  </span>
                </header>

                <div className="tg-operation-deposit-preview">
                  <div className="tg-operation-deposit-preview__icon">
                    <TravelIcon
                      name="plus"
                      size={26}
                    />
                  </div>

                  <div>
                    <span>
                      Vas a depositar
                    </span>

                    <strong>
                      {formatMoney(
                        parsedAmount,
                        currencyCode,
                      )}
                    </strong>

                    <small>
                      Saldo simulado TravelGo
                    </small>
                  </div>
                </div>

                <div className="tg-operation-summary">
                  <div>
                    <span>Moneda</span>

                    <strong>
                      <span
                        className={`fi fi-${currencyMeta.flag}`}
                        aria-hidden="true"
                      />

                      {currencyCode} —{" "}
                      {currencyMeta.name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Saldo anterior
                    </span>

                    <strong>
                      {formatMoney(
                        currentBalance,
                        currencyCode,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Monto depositado
                    </span>

                    <strong className="is-success">
                      +
                      {formatMoney(
                        parsedAmount,
                        currencyCode,
                      )}
                    </strong>
                  </div>

                  <div className="is-total">
                    <span>
                      Nuevo saldo
                    </span>

                    <strong>
                      {formatMoney(
                        projectedBalance,
                        currencyCode,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="tg-operation-information">
                  <span>i</span>

                  <p>
                    El saldo estará disponible
                    inmediatamente después de
                    confirmar.
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
                    Confirmar depósito
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
                      name="plus"
                      size={55}
                    />
                  </div>
                </div>

                <h2>
                  Acreditando saldo...
                </h2>

                <p>
                  Estamos agregando el saldo
                  simulado a tu billetera.
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
                <div className="tg-operation-success">
                  <span>✓</span>
                </div>

                <h2>
                  ¡Depósito acreditado!
                </h2>

                <p>
                  El nuevo saldo ya está
                  disponible en tu billetera.
                </p>

                <div className="tg-operation-receipt">
                  <div>
                    <span>Moneda</span>

                    <strong>
                      {currencyCode} —{" "}
                      {currencyMeta.name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Monto depositado
                    </span>

                    <strong>
                      {formatMoney(
                        parsedAmount,
                        currencyCode,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Nuevo saldo estimado
                    </span>

                    <strong>
                      {formatMoney(
                        projectedBalance,
                        currencyCode,
                      )}
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
                    handleNewDeposit
                  }
                >
                  Agregar otro saldo
                </button>
              </div>
            )}
          </div>
        </main>
      </section>

      <section className="tg-operation-benefits">
        <article>
          <TravelIcon
            name="shield"
            size={24}
          />

          <div>
            <strong>
              Entorno de práctica
            </strong>

            <span>
              No se procesa dinero real.
            </span>
          </div>
        </article>

        <article>
          <TravelIcon
            name="rocket"
            size={24}
          />

          <div>
            <strong>
              Acreditación inmediata
            </strong>

            <span>
              El saldo aparece en segundos.
            </span>
          </div>
        </article>

        <article>
          <TravelIcon
            name="wallet"
            size={24}
          />

          <div>
            <strong>
              Billetera multimoneda
            </strong>

            <span>
              Elegí entre cinco monedas.
            </span>
          </div>
        </article>
      </section>
    </div>
  );
}