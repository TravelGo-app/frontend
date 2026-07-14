import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import StepIndicator from "../components/StepIndicator";

const CURRENCIES = ["ARS", "USD", "EUR", "BRL", "CLP"];
const STEPS = ["Ingresá datos", "Confirmá", "Procesando", "¡Listo!"];
const ACCENT = "#ff7d60";

const generateIdempotencyKey = () => `transfer-${crypto.randomUUID()}`;

export default function Transfer() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [recipientIdentifier, setRecipientIdentifier] = useState("");
  const [currencyCode, setCurrencyCode] = useState("ARS");
  const [amount, setAmount] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipientIdentifier.trim()) {
      setError("Ingresá el email, alias o CVU del destinatario.");
      return;
    }

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
      await api.post("/transactions/transfer", {
        recipientIdentifier,
        currencyCode,
        amount: parsedAmount.toFixed(2),
        idempotencyKey,
      });
      setStep(3);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No se pudo completar la transferencia. Intentá de nuevo.",
      );
      setStep(1);
    }
  };

  const handleNewTransfer = () => {
    setRecipientIdentifier("");
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
          <h1 className="text-2xl font-bold text-grafito mb-1">Transferir</h1>
          <p className="text-sm text-grafito/70 mb-6">
            Enviá dinero a otro usuario de TravelGo.
          </p>

          {step === 0 && (
            <form onSubmit={handleContinue}>
              <label className="block text-sm font-bold text-grafito mb-1">
                Email, alias o CVU del destinatario
              </label>
              <input
                type="text"
                value={recipientIdentifier}
                onChange={(e) => setRecipientIdentifier(e.target.value)}
                placeholder="email@ejemplo.com, alias o CVU"
                className="w-full border border-[#155a70] rounded-xl p-3 mb-4 text-grafito font-semibold"
              />

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
                className="w-full bg-[#ff7d60] text-white py-3 rounded-full font-bold hover:brightness-110 transition"
              >
                Continuar
              </button>
            </form>
          )}

          {step === 1 && (
            <div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-grafito/60 font-semibold mb-1">
                  Vas a transferir
                </p>
                <p className="text-xl font-bold text-grafito">
                  {parseFloat(amount || "0").toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {currencyCode}
                </p>
                <p className="text-sm text-grafito/60 mt-1">
                  A: {recipientIdentifier}
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
                  className="flex-1 bg-[#ff7d60] text-white py-3 rounded-full font-bold hover:brightness-110 transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-[#ff7d60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-grafito font-semibold">Procesando...</p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-oceano text-white flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <p className="text-lg font-bold text-grafito mb-1">
                ¡Transferencia realizada!
              </p>
              <p className="text-sm text-grafito/70 mb-6">
                {amount} {currencyCode} → {recipientIdentifier}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleNewTransfer}
                  className="flex-1 bg-gray-200 text-grafito py-2 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  Nueva transferencia
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