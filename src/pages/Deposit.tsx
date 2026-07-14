import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StepIndicator from "../components/StepIndicator";

const CURRENCIES = ["ARS", "USD", "EUR", "BRL", "CLP"];
const STEPS = ["Ingresá monto", "Confirmá", "Procesando", "¡Listo!"];
const ACCENT = "#2391ae";

const generateIdempotencyKey = () => `deposit-${crypto.randomUUID()}`;

export default function Deposit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [currencyCode, setCurrencyCode] = useState("ARS");
  const [amount, setAmount] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Ingresá un monto válido mayor a 0.");
      return;
    }

    setStep(1);
  };

  const handleConfirm = async () => {
    setError(null);
    setStep(2);

    try {
      const parsedAmount = parseFloat(amount);
      await api.post("/transactions/deposit", {
        currencyCode,
        amount: parsedAmount.toFixed(2),
        idempotencyKey,
      });
      setStep(3);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No se pudo completar el depósito. Intentá de nuevo.",
      );
      setStep(1);
    }
  };

  const handleNewDeposit = () => {
    setAmount("");
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
          <h1 className="text-2xl font-bold text-grafito mb-1">
            Agregar saldo simulado
          </h1>
          <p className="text-sm text-grafito/70 mb-6">
            Sumá saldo de práctica a tu billetera TravelGo. No se procesa dinero real.
          </p>

          {step === 0 && (
            <form onSubmit={handleContinue}>
              <label className="block text-sm font-bold text-grafito mb-1">
                Moneda
              </label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full border border-[#155a70] rounded-xl p-3 mb-4 text-grafito font-semibold"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-bold text-grafito mb-1">
                Monto
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-[#155a70] rounded-xl p-3 mb-4 text-grafito font-semibold"
              />

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
                className="w-full bg-[#2391ae] text-white py-3 rounded-full font-bold hover:brightness-110 transition"
              >
                Continuar
              </button>
            </form>
          )}

          {step === 1 && (
            <div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-grafito/60 font-semibold mb-1">
                  Vas a agregar
                </p>
                <p className="text-2xl font-bold text-grafito">
                  {parseFloat(amount || "0").toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {currencyCode}
                </p>
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
                  className="flex-1 bg-[#2391ae] text-white py-3 rounded-full font-bold hover:brightness-110 transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-[#2391ae] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-grafito font-semibold">Procesando...</p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#2391ae] text-white flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <p className="text-lg font-bold text-grafito mb-1">
                ¡Saldo simulado agregado!
              </p>
              <p className="text-sm text-grafito/70 mb-6">
                +{amount} {currencyCode}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleNewDeposit}
                  className="flex-1 bg-gray-200 text-grafito py-2 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  Agregar otro
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