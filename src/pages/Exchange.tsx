import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StepIndicator from "../components/StepIndicator";

const CURRENCIES = ["ARS", "USD", "EUR", "BRL", "CLP"];
const STEPS = ["Ingresá datos", "Confirmá", "Procesando", "¡Listo!"];
const ACCENT = "#ff4242";

const generateIdempotencyKey = () => `exchange-${crypto.randomUUID()}`;

interface ExchangeResult {
  fromAmount: string;
  toAmount: string;
  fromCurrency: string;
  toCurrency: string;
  rate?: string;
}

export default function Exchange() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("ARS");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [previewRate, setPreviewRate] = useState<number | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExchangeResult | null>(null);

  const sameCurrency = fromCurrency === toCurrency;

  useEffect(() => {
    if (sameCurrency) {
      setPreviewRate(null);
      return;
    }
    let cancelled = false;
    api
      .get(`/rates/${fromCurrency}/${toCurrency}`)
      .then((res) => {
        if (cancelled) return;
        const rateValue = res.data?.rate ?? res.data?.data?.rate ?? null;
        setPreviewRate(rateValue);
      })
      .catch((err) => {
        console.error("Error cargando tasa de cambio:", err);
        if (!cancelled) setPreviewRate(null);
      });
    return () => {
      cancelled = true;
    };
  }, [fromCurrency, toCurrency, sameCurrency]);

  const convertedAmount =
    previewRate && amount && !isNaN(parseFloat(amount))
      ? (parseFloat(amount) * previewRate).toFixed(2)
      : null;

  const formatAmount = (value: string) =>
    parseFloat(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Ingresá un monto válido mayor a 0.");
      return;
    }
    if (sameCurrency) {
      setError("Elegí dos monedas distintas para intercambiar.");
      return;
    }

    setStep(1);
  };

  const handleConfirm = async () => {
    setError(null);
    setStep(2);

    try {
      const parsedAmount = parseFloat(amount);
      const response = await api.post("/transactions/exchange", {
        fromCurrency,
        toCurrency,
        amount: parsedAmount.toFixed(2),
        idempotencyKey,
      });

      const tx = response.data?.transaction ?? response.data;
      setResult({
        fromAmount: tx?.fromAmount ?? parsedAmount.toFixed(2),
        toAmount: tx?.toAmount,
        fromCurrency: tx?.fromCurrency ?? fromCurrency,
        toCurrency: tx?.toCurrency ?? toCurrency,
        rate: tx?.rate,
      });
      setStep(3);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No se pudo completar el intercambio. Intentá de nuevo.",
      );
      setStep(1);
    }
  };

  const handleNewExchange = () => {
    setAmount("");
    setResult(null);
    setError(null);
    setIdempotencyKey(generateIdempotencyKey());
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-[#233446] p-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate("/transactions")}
          className="text-white/70 hover:text-white text-sm font-semibold mb-6"
        >
          ← Volver a Transacciones
        </button>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#155a70]">
          <h1 className="text-2xl font-bold text-grafito mb-1">Intercambio</h1>
          <p className="text-sm text-grafito/70 mb-6">
            Convertí entre las monedas de tu billetera.
          </p>

          {step === 0 && (
            <form onSubmit={handleContinue}>
              <label className="block text-sm font-bold text-grafito mb-1">
                Desde
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full border border-[#155a70] rounded-xl p-3 mb-4 text-grafito font-semibold"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-bold text-grafito mb-1">
                Hacia
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full border border-[#155a70] rounded-xl p-3 mb-2 text-grafito font-semibold"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {sameCurrency && (
                <p className="text-xs text-[#ff4242] font-semibold mb-4">
                  Elegí dos monedas distintas.
                </p>
              )}

              <label className="block text-sm font-bold text-grafito mb-1 mt-2">
                Monto en {fromCurrency}
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-[#155a70] rounded-xl p-3 mb-2 text-grafito font-semibold"
              />

              {convertedAmount && !sameCurrency && (
                <p className="text-sm text-oceano font-semibold mb-4">
                  ≈ {convertedAmount} {toCurrency} (estimado)
                </p>
              )}

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-[#ff4242] rounded-xl p-3 mb-4">
                  <span className="text-[#ff4242] font-bold text-lg leading-none">
                    ⚠
                  </span>
                  <p className="text-sm text-[#ff4242] font-semibold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={sameCurrency}
                className="w-full bg-[#ff4242] text-white py-3 rounded-full font-bold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </form>
          )}

          {step === 1 && (
            <div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-grafito/60 font-semibold mb-1">
                  Vas a intercambiar
                </p>
                <p className="text-xl font-bold text-grafito">
                  {parseFloat(amount || "0").toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {fromCurrency}
                </p>
                {convertedAmount && (
                  <p className="text-sm text-grafito/60 mt-1">
                    Recibirás aproximadamente {convertedAmount} {toCurrency}
                  </p>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-[#ff4242] rounded-xl p-3 mb-4">
                  <span className="text-[#ff4242] font-bold text-lg leading-none">
                    ⚠
                  </span>
                  <p className="text-sm text-[#ff4242] font-semibold">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 bg-gray-200 text-grafito py-3 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  Volver
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-[#ff4242] text-white py-3 rounded-full font-bold hover:bg-red-600 transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-[#ff4242] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-grafito font-semibold">Procesando...</p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-oceano text-white flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <p className="text-lg font-bold text-grafito mb-1">
                ¡Intercambio realizado!
              </p>
              {result && (
                <p className="text-sm text-grafito/70 mb-6">
                  {formatAmount(result.fromAmount)} {result.fromCurrency} →{" "}
                  {formatAmount(result.toAmount)} {result.toCurrency}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleNewExchange}
                  className="flex-1 bg-gray-200 text-grafito py-2 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  Nuevo intercambio
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-[#ff4242] text-white py-2 rounded-full font-bold hover:bg-red-600 transition"
                >
                  Volver a Billetera
                </button>
              </div>
            </div>
          )}

          <StepIndicator steps={STEPS} currentStep={step} accentColor={ACCENT} />
        </div>
      </div>
    </div>
  );
}