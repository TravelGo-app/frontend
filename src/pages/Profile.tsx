import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingOverlay from "../components/LoadingOverlay";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  birthDate: string | null;
  preferredCurrency: string;
  avatar: {
    url: string | null;
    source: string | null;
    initials: string;
  };
  account: {
    emailVerified: boolean;
    phoneVerified: boolean;
    hasPassword: boolean;
    hasGoogle: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  wallet: {
    id: string;
    travelgoCvu: string;
    travelgoAlias: string;
    simulation: boolean;
  };
  requirements: {
    minimumAge: number;
    profileComplete: boolean;
  };
}

const CURRENCIES = ["ARS", "USD", "EUR", "BRL", "CLP"];

const isAtLeast17 = (birthDate: string) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 17;
};

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [preferredCurrency, setPreferredCurrency] = useState("ARS");

  const [aliasInput, setAliasInput] = useState("");
  const [editingAlias, setEditingAlias] = useState(false);

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailRequestSent, setEmailRequestSent] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadProfile = () => {
    setLoading(true);
    api
      .get("/profile")
      .then((res) => {
        const p: ProfileData = res.data.profile;
        setProfile(p);
        setName(p.name || "");
        setPhone(p.phone || "");
        setBirthDate(p.birthDate || "");
        setPreferredCurrency(p.preferredCurrency || "ARS");
        setAliasInput(p.wallet?.travelgoAlias || "");
      })
      .catch((err) => {
        console.error("Error cargando perfil:", err);
        setError("No pudimos cargar tu perfil. Intentá de nuevo.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (birthDate && !isAtLeast17(birthDate)) {
      setError("Tenés que tener al menos 17 años para usar TravelGo.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch("/profile", {
        name,
        phone: phone || null,
        birthDate: birthDate || undefined,
        preferredCurrency,
      });
      setProfile(res.data.profile);
      setSuccess("Perfil actualizado correctamente.");
      setEditing(false);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No se pudieron guardar los cambios.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAlias = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const res = await api.patch("/profile/alias", {
        alias: aliasInput.toLowerCase(),
      });
      setProfile(res.data.profile);
      setSuccess("Alias actualizado correctamente.");
      setEditingAlias(false);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No se pudo actualizar el alias. Puede estar ocupado.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRequestEmailChange = async () => {
    setError(null);
    setSuccess(null);

    if (!newEmail || !newEmail.includes("@")) {
      setError("Ingresá un email válido.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.post("/profile/email-change/request", {
        newEmail,
      });
      setEmailRequestSent(true);
      setSuccess(
        res.data.message ||
          "Te enviamos un enlace al nuevo email para confirmar el cambio.",
      );
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "No se pudo solicitar el cambio de email.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCvu = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.wallet.travelgoCvu);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <LoadingOverlay message="Cargando tu perfil..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#233446] p-8">
        <p className="text-white text-center">
          {error || "No pudimos cargar tu perfil."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#233446] p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white/70 hover:text-white text-sm font-semibold mb-6"
        >
          ← Ir a Billetera
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-4">
          <div className="flex h-1">
            <div className="flex-1 bg-[#ff4242]"></div>
            <div className="flex-1 bg-[#2391ae]"></div>
            <div className="flex-1 bg-[#ff7d60]"></div>
          </div>
          <div className="p-6 flex items-center gap-4">
            {profile.avatar.url ? (
              <img
                src={profile.avatar.url}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-oceano text-white flex items-center justify-center text-xl font-bold shrink-0">
                {profile.avatar.initials}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-grafito">
                {profile.name}
              </h1>
              <p className="text-sm text-grafito/60">{profile.email}</p>
              {!profile.requirements.profileComplete && (
                <p className="text-xs text-[#854F0B] font-semibold mt-1">
                  Completá tu perfil para usar todas las funciones
                </p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-[#ff4242] rounded-xl p-3 mb-4">
            <span className="text-[#ff4242] font-bold text-lg leading-none">
              ⚠
            </span>
            <p className="text-sm text-[#ff4242] font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-[#eaf3de] border border-[#639922] rounded-xl p-3 mb-4">
            <p className="text-sm text-[#3b6d11] font-semibold">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-grafito">
              Datos personales
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm font-semibold text-oceano hover:underline"
              >
                Editar datos
              </button>
            )}
          </div>

          {!editing ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-grafito/10 pb-2">
                <span className="text-grafito/60">Nombre completo</span>
                <span className="font-semibold text-grafito">
                  {profile.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-grafito/10 pb-2">
                <span className="text-grafito/60">Teléfono</span>
                <span className="font-semibold text-grafito">
                  {profile.phone || "Sin cargar"}
                </span>
              </div>
              <div className="flex justify-between border-b border-grafito/10 pb-2">
                <span className="text-grafito/60">Fecha de nacimiento</span>
                <span className="font-semibold text-grafito">
                  {profile.birthDate || "Sin cargar"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-grafito/60">Moneda preferida</span>
                <span className="font-semibold text-grafito">
                  {profile.preferredCurrency}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <label className="block text-sm font-bold text-grafito mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                maxLength={100}
                className="w-full border border-[#155a70] rounded-xl p-3 mb-4 text-grafito font-semibold"
              />

              <label className="block text-sm font-bold text-grafito mb-1">
                Teléfono (con código de país)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+5491123456789"
                className="w-full border border-[#155a70] rounded-xl p-3 mb-4 text-grafito font-semibold"
              />

              <label className="block text-sm font-bold text-grafito mb-1">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full border border-[#155a70] rounded-xl p-3 mb-4 text-grafito font-semibold"
              />

              <label className="block text-sm font-bold text-grafito mb-1">
                Moneda preferida
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full border border-[#155a70] rounded-xl p-3 mb-4 text-grafito font-semibold"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setName(profile.name || "");
                    setPhone(profile.phone || "");
                    setBirthDate(profile.birthDate || "");
                    setPreferredCurrency(profile.preferredCurrency || "ARS");
                  }}
                  className="flex-1 bg-gray-200 text-grafito py-3 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-oceano text-white py-3 rounded-full font-bold hover:brightness-110 transition disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-grafito">
              Correo electrónico
            </h2>
            {!editingEmail && (
              <button
                onClick={() => setEditingEmail(true)}
                className="text-sm font-semibold text-oceano hover:underline"
              >
                Cambiar email
              </button>
            )}
          </div>
          <p className="text-sm text-grafito font-semibold mb-1">
            {profile.email}
          </p>
          <p className="text-xs text-grafito/50 mb-3">
            {profile.account.emailVerified ? "Verificado" : "Sin verificar"}
          </p>

          {editingEmail && !emailRequestSent && (
            <div className="mt-3">
              <label className="block text-sm font-bold text-grafito mb-1">
                Nuevo email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nuevo@email.com"
                className="w-full border border-[#155a70] rounded-xl p-3 mb-3 text-grafito font-semibold"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingEmail(false)}
                  className="flex-1 bg-gray-200 text-grafito py-2 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRequestEmailChange}
                  disabled={saving}
                  className="flex-1 bg-oceano text-white py-2 rounded-full font-bold hover:brightness-110 transition disabled:opacity-50"
                >
                  Enviar enlace de confirmación
                </button>
              </div>
            </div>
          )}

          {emailRequestSent && (
            <p className="text-sm text-grafito/70 mt-2">
              Revisá <strong>{newEmail}</strong> para confirmar el cambio. El
              enlace vence en 60 minutos.
            </p>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-grafito mb-1">CVU / Alias</h2>
          <p className="text-sm text-grafito/60 mb-4">
            Identificador simulado de TravelGo para recibir transferencias
            dentro de la app. No pertenece a un banco real.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-grafito/60 font-semibold mb-1">
              CVU TravelGo
            </p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-mono font-bold text-grafito break-all">
                {profile.wallet.travelgoCvu}
              </p>
              <button
                onClick={handleCopyCvu}
                className="shrink-0 text-xs font-semibold text-oceano hover:underline"
              >
                {copied ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <p className="text-xs text-grafito/60 font-semibold mb-1">Alias</p>
          {!editingAlias ? (
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-grafito">
                {profile.wallet.travelgoAlias}
              </p>
              <button
                onClick={() => setEditingAlias(true)}
                className="text-xs font-semibold text-oceano hover:underline"
              >
                Editar
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aliasInput}
                  onChange={(e) => setAliasInput(e.target.value)}
                  className="flex-1 border border-[#155a70] rounded-xl p-2 text-sm text-grafito font-semibold"
                />
                <button
                  onClick={handleSaveAlias}
                  disabled={saving}
                  className="bg-[#ff7d60] text-white px-4 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
              <p className="text-xs text-grafito/50 mt-1">
                3-40 caracteres, minúsculas, números y puntos. Sin espacios ni
                puntos consecutivos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}