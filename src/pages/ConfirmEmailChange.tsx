import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ConfirmEmailChange() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Falta el token de confirmación en el enlace.");
      return;
    }

    api
      .post("/profile/email-change/confirm", { token })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        setStatus("success");
        setMessage(res.data.message || "Email actualizado correctamente.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "No pudimos confirmar el cambio de email. El enlace puede haber vencido.",
        );
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#233446] flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl p-8 shadow-lg max-w-sm w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-oceano border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-grafito font-semibold">
              Confirmando tu nuevo email...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-oceano text-white flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <p className="text-lg font-bold text-grafito mb-2">¡Listo!</p>
            <p className="text-sm text-grafito/70 mb-6">{message}</p>
            <button
              onClick={() => navigate("/perfil?emailChanged=true")}
              className="w-full bg-oceano text-white py-3 rounded-full font-bold hover:brightness-110 transition"
            >
              Ir a mi perfil
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-[#ff4242] text-white flex items-center justify-center mx-auto mb-4 text-2xl">
              ✕
            </div>
            <p className="text-lg font-bold text-grafito mb-2">
              No pudimos confirmar el cambio
            </p>
            <p className="text-sm text-grafito/70 mb-6">{message}</p>
            <button
              onClick={() => navigate("/perfil")}
              className="w-full bg-gray-200 text-grafito py-3 rounded-full font-bold hover:bg-gray-300 transition"
            >
              Volver a mi perfil
            </button>
          </>
        )}
      </div>
    </div>
  );
}