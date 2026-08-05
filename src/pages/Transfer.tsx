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

const ACCENT = "#00b8da";

interface Balance {
  currencyCode: string;
  amount: string;
}

interface CurrencyMeta {
  name: string;
  flag: string;
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

type ApiError = {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
};

function generateIdempotencyKey() {
  return `transfer-${crypto.randomUUID()}`;
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

function getRecipientInitials(
  identifier: string,
) {
  const normalized = identifier
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim();

  if (!normalized) {
    return "TG";
  }

  return normalized
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");
}

export default function Transfer() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const [
    recipientIdentifier,
    setRecipientIdentifier,
  ] = useState("");

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

  const availableAmount = Number(
    selectedBalance?.amount ?? 0,
  );

  const parsedAmount = Number(amount);

  const recipientInitials =
    getRecipientInitials(
      recipientIdentifier,
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
      `TRF-${idempotencyKey
        .replace("transfer-", "")
        .slice(0, 8)
        .toUpperCase()}`,
    [idempotencyKey],
  );

  const handleContinue = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError(null);

    if (!recipientIdentifier.trim()) {
      setError(
        "Ingresá el email, alias o CVU del destinatario.",
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

    setStep(1);
  };

  const handleConfirm = async () => {
    setError(null);
    setStep(2);

    try {
      await api.post(
        "/transactions/transfer",
        {
          recipientIdentifier:
            recipientIdentifier.trim(),

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
          "No se pudo completar la transferencia. Intentá de nuevo.",
      );

      setStep(1);
    }
  };

  const handleNewTransfer = () => {
    setRecipientIdentifier("");
    setAmount("");
    setError(null);

    setIdempotencyKey(
      generateIdempotencyKey(),
    );

    setStep(0);
  };

  const setPercentage = (
    percentage: number,
  ) => {
    if (availableAmount <= 0) {
      return;
    }

    const calculatedAmount =
      availableAmount * percentage;

    setAmount(
      calculatedAmount.toFixed(2),
    );
  };

  return (
    <div className="tg-operation-page is-transfer">
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
                name="send"
                size={25}
              />
            </span>

            <div>
              <p>OPERACIÓN SEGURA</p>
              <h1>Transferir</h1>
            </div>
          </div>

          <p className="tg-operation-aside__description">
            Enviá dinero de forma rápida y
            segura a otro usuario de
            TravelGo.
          </p>

          <div
            className="tg-operation-globe"
            aria-hidden="true"
          >
            <div className="tg-operation-globe__orbit orbit-one" />
            <div className="tg-operation-globe__orbit orbit-two" />

            <div className="tg-operation-globe__planet">
              <TravelIcon
                name="globe"
                size={76}
              />
            </div>

            <span className="tg-operation-globe__person person-one">
              {recipientInitials}
            </span>

            <span className="tg-operation-globe__person person-two">
              TG
            </span>

            <span className="tg-operation-globe__plane">
              ➤
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
                  <p>ENVIAR DINERO</p>

                  <h2>
                    Completá los datos
                  </h2>

                  <span>
                    Ingresá el destinatario,
                    la moneda y el monto que
                    querés transferir.
                  </span>
                </header>

                <form
                  className="tg-operation-form"
                  onSubmit={
                    handleContinue
                  }
                >
                  <div className="tg-operation-field">
                    <label htmlFor="transfer-recipient">
                      Destinatario
                    </label>

                    <div className="tg-operation-input">
                      <span className="tg-operation-input__icon">
                        <TravelIcon
                          name="users"
                          size={18}
                        />
                      </span>

                      <input
                        id="transfer-recipient"
                        type="text"
                        value={
                          recipientIdentifier
                        }
                        onChange={(event) =>
                          setRecipientIdentifier(
                            event.target.value,
                          )
                        }
                        placeholder="Email, alias o CVU"
                        autoComplete="off"
                      />
                    </div>

                    <small>
                      Debe pertenecer a un
                      destinatario válido.
                    </small>
                  </div>

                  <div className="tg-operation-field">
                    <label htmlFor="transfer-currency">
                      Moneda
                    </label>

                    <div className="tg-operation-select">
                      <span
                        className={`fi fi-${currencyMeta.flag}`}
                        aria-hidden="true"
                      />

                      <select
                        id="transfer-currency"
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
                      <label htmlFor="transfer-amount">
                        Monto
                      </label>

                      <span>
                        Disponible:{" "}
                        {selectedBalance
                          ? formatMoney(
                              availableAmount,
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
                        id="transfer-amount"
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
                    Confirmá los datos
                  </h2>

                  <span>
                    Revisá la información
                    antes de enviar el dinero.
                  </span>
                </header>

                <div className="tg-operation-recipient">
                  <div className="tg-operation-recipient__avatar">
                    {recipientInitials}
                  </div>

                  <div>
                    <strong>
                      Destinatario
                    </strong>

                    <span>
                      {recipientIdentifier}
                    </span>
                  </div>

                  <span className="tg-operation-recipient__status">
                    Verificado
                  </span>
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
                      Monto a enviar
                    </span>

                    <strong>
                      {formatMoney(
                        parsedAmount,
                        currencyCode,
                      )}
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
                      Total a debitar
                    </span>

                    <strong>
                      {formatMoney(
                        parsedAmount,
                        currencyCode,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="tg-operation-information">
                  <span>i</span>

                  <p>
                    La transferencia se
                    procesará inmediatamente.
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
                    Confirmar transferencia
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
                      name="send"
                      size={55}
                    />
                  </div>
                </div>

                <h2>Enviando dinero...</h2>

                <p>
                  Tu transferencia está siendo
                  procesada. Esto puede tardar
                  unos segundos.
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
                  ¡Transferencia realizada!
                </h2>

                <p>
                  El dinero fue enviado
                  correctamente.
                </p>

                <div className="tg-operation-receipt">
                  <div>
                    <span>
                      Destinatario
                    </span>

                    <strong>
                      {recipientIdentifier}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Monto enviado
                    </span>

                    <strong>
                      {formatMoney(
                        parsedAmount,
                        currencyCode,
                      )}
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
                    navigate("/history")
                  }
                >
                  Ver movimientos
                </button>

                <button
                  type="button"
                  className="tg-operation-text-button"
                  onClick={
                    handleNewTransfer
                  }
                >
                  Nueva transferencia
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
              Transferencia segura
            </strong>

            <span>
              Tus operaciones están
              protegidas.
            </span>
          </div>
        </article>

        <article>
          <TravelIcon
            name="rocket"
            size={24}
          />

          <div>
            <strong>Envío inmediato</strong>

            <span>
              El dinero se procesa en
              segundos.
            </span>
          </div>
        </article>

        <article>
          <TravelIcon
            name="headset"
            size={24}
          />

          <div>
            <strong>Soporte 24/7</strong>

            <span>
              Estamos disponibles para
              ayudarte.
            </span>
          </div>
        </article>
      </section>
    </div>
  );
}