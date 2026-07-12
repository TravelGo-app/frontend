import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CURRENCIES = ["ARS", "USD", "EUR", "BRL", "CLP"];

const generateIdempotencyKey = () => `transfer-${crypto.randomUUID()}`;

export default function Transfer() {
  const navigate = useNavigate();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [currencyCode, setCurrencyCode] = useState("ARS");
  const [amount, setAmount] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(generateIdempotencyKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipientEmail || !recipientEmail.includes("@")) {
      setError("Ingresá un email de destinatario válido.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Ingresá un monto válido mayor a 0.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/transactions/transfer", {
        recipientEmail,
        currencyCode,
        amount: parsedAmount.toFixed(2),
        idempotencyKey,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No se pudo completar la transferencia. Intentá de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransfer = () => {
    setRecipientEmail("");
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
          <h1 className="text-2xl font-bold text-grafito mb-1">Transferir</h1>
          <p className="text-sm text-grafito/70 mb-6">
            Enviá dinero a otro usuario de TravelGo.
          </p>

          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-oceano text-white flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <p className="text-lg font-bold text-grafito mb-1">
                ¡Transferencia realizada!
              </p>
              <p className="text-sm text-grafito/70 mb-6">
                {amount} {currencyCode} → {recipientEmail}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleNewTransfer}
                  className="flex-1 bg-gray-200 text-grafito py-2 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  Hacer otra
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
                Email del destinatario
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="destinatario@email.com"
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
                <div className="flex items-start gap-2 bg-red-50 border border-coral rounded-xl p-3 mb-4">
                  <span className="text-coral font-bold text-lg leading-none">
                    ⚠
                  </span>
                  <p className="text-sm text-coral font-semibold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-terracota text-white py-3 rounded-full font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando..." : "Confirmar transferencia"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
