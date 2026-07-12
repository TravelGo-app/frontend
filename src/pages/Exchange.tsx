import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CURRENCIES = ["ARS", "USD", "EUR", "BRL", "CLP"];

const generateIdempotencyKey = () => `exchange-${crypto.randomUUID()}`;

export default function Exchange() {
  const navigate = useNavigate();
  const [fromCurrency, setFromCurrency] = useState("ARS");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [previewRate, setPreviewRate] = useState<number | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      await api.post("/transactions/exchange", {
        fromCurrency,
        toCurrency,
        amount: parsedAmount.toFixed(2),
        idempotencyKey,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No se pudo completar el intercambio. Intentá de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewExchange = () => {
    setAmount("");
    setSuccess(false);
    setError(null);
    setIdempotencyKey(generateIdempotencyKey());
  };

  return (
    <div className="min-h-screen bg-grafito p-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white/70 hover:text-white text-sm font-semibold mb-6"
        >
          ← Volver al Dashboard
        </button>

        <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#155a70]">
          <h1 className="text-2xl font-bold text-grafito mb-1">Intercambio</h1>
          <p className="text-sm text-grafito/70 mb-6">
            Convertí entre las monedas de tu billetera.
          </p>

          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-oceano text-white flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <p className="text-lg font-bold text-grafito mb-1">
                ¡Intercambio realizado!
              </p>
              <p className="text-sm text-grafito/70 mb-6">
                {amount} {fromCurrency} → {toCurrency}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleNewExchange}
                  className="flex-1 bg-gray-200 text-grafito py-2 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  Hacer otro
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 bg-coral text-white py-2 rounded-full font-bold hover:bg-red-600 transition"
                >
                  Volver al Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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
                <p className="text-xs text-coral font-semibold mb-4">
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
                  ≈ {convertedAmount} {toCurrency}
                </p>
              )}

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-coral rounded-xl p-3 mb-4">
                  <span className="text-coral font-bold text-lg leading-none">
                    ⚠
                  </span>
                  <p className="text-sm text-coral font-semibold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || sameCurrency}
                className="w-full bg-coral text-white py-3 rounded-full font-bold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando..." : "Confirmar intercambio"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
