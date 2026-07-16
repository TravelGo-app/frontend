import { useState } from "react";
import { Link } from "react-router-dom";
import PublicBackButton from "../components/PublicBackButton";

const GUIDES = [
  {
    id: "account",
    icon: "👤",
    title: "Crear y acceder a tu cuenta",
    intro: "Configurá tu perfil y entrá de forma segura.",
    steps: [
      "Abrí Crear cuenta desde la landing.",
      "Completá nombre, correo y contraseña.",
      "Corregí cualquier validación mostrada antes de continuar.",
      "Ingresá y revisá los datos principales de tu perfil.",
    ],
    tip: "Usá un correo al que tengas acceso y una contraseña que no reutilices.",
  },
  {
    id: "deposit",
    icon: "💰",
    title: "Agregar saldo simulado",
    intro: "Practicá cómo se acredita dinero en una billetera.",
    steps: [
      "Entrá al dashboard y elegí Depositar.",
      "Seleccioná una moneda disponible.",
      "Ingresá un monto válido.",
      "Confirmá y verificá el nuevo saldo y el movimiento generado.",
    ],
    tip: "Los montos son educativos y no representan dinero real.",
  },
  {
    id: "transfer",
    icon: "📤",
    title: "Realizar una transferencia",
    intro: "Enviá saldo a otra cuenta TravelGo.",
    steps: [
      "Abrí Transferir.",
      "Buscá al destinatario por email, alias o CVU TravelGo.",
      "Elegí moneda y monto.",
      "Revisá cuidadosamente el resumen y confirmá.",
      "Consultá el resultado en Transacciones o Historial.",
    ],
    tip: "Nunca confirmes sin revisar destinatario, moneda y monto.",
  },
  {
    id: "exchange",
    icon: "💱",
    title: "Cambiar monedas",
    intro: "Comprendé una conversión antes de viajar.",
    steps: [
      "Ingresá a Cambiar moneda.",
      "Elegí moneda de origen y destino.",
      "Ingresá el monto que querés convertir.",
      "Revisá la tasa y el resultado estimado.",
      "Confirmá para registrar la operación simulada.",
    ],
    tip: "La tasa mostrada puede cambiar cuando el proveedor actualiza la cotización.",
  },
  {
    id: "history",
    icon: "🕘",
    title: "Revisar el historial",
    intro: "Encontrá movimientos y actividad de tu cuenta.",
    steps: [
      "Abrí Historial desde el menú privado.",
      "Filtrá por categoría o estado.",
      "Revisá fecha, descripción y resultado de cada evento.",
      "Usá Cargar más cuando existan registros adicionales.",
    ],
    tip: "El historial financiero y el historial de actividad pueden mostrar distintos tipos de eventos.",
  },
  {
    id: "emails",
    icon: "✉️",
    title: "Administrar correos",
    intro: "Elegí qué confirmaciones querés recibir.",
    steps: [
      "Entrá a Perfil.",
      "Buscá las preferencias de comunicación.",
      "Activá o desactivá cada tipo de aviso.",
      "Guardá los cambios y verificá el mensaje de confirmación.",
    ],
    tip: "La entrega final también depende del proveedor de correo y de la bandeja del destinatario.",
  },
  {
    id: "security",
    icon: "🛡️",
    title: "Proteger tu cuenta",
    intro: "Aplicá hábitos simples para reducir riesgos.",
    steps: [
      "No compartas tu contraseña.",
      "Revisá periódicamente tu historial.",
      "Cambiá la contraseña ante cualquier sospecha.",
      "Registrá una consulta si detectás una actividad desconocida.",
    ],
    tip: "TravelGo nunca debería solicitar contraseñas o códigos mediante el chatbot.",
  },
];

export default function HelpGuide() {
  const [activeId, setActiveId] = useState(GUIDES[0].id);
  const activeGuide = GUIDES.find((guide) => guide.id === activeId) ?? GUIDES[0];

  return (
    <main className="public-page">
      <PublicBackButton />

      <div className="public-shell">
        <section className="public-hero public-hero-help">
          <span className="public-badge">Guía interactiva</span>
          <h1 className="public-title">Aprendé a usar TravelGo</h1>
          <p className="public-subtitle">
            Seleccioná una función y seguí el instructivo paso a paso.
          </p>
        </section>

        <section className="guide-layout">
          <nav className="guide-nav" aria-label="Temas de ayuda">
            {GUIDES.map((guide) => (
              <button
                key={guide.id}
                type="button"
                className={`guide-tab ${guide.id === activeId ? "guide-tab-active" : ""}`}
                onClick={() => setActiveId(guide.id)}
              >
                <span>{guide.icon}</span>
                <span>{guide.title}</span>
              </button>
            ))}
          </nav>

          <article className="guide-panel" aria-live="polite">
            <span className="guide-panel-icon">{activeGuide.icon}</span>
            <p className="guide-kicker">INSTRUCTIVO</p>
            <h2>{activeGuide.title}</h2>
            <p className="guide-intro">{activeGuide.intro}</p>

            <ol className="guide-steps">
              {activeGuide.steps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>

            <div className="guide-tip">
              <strong>Consejo</strong>
              <p>{activeGuide.tip}</p>
            </div>
          </article>
        </section>

        <section className="public-cta">
          <div>
            <h2>¿Todavía tenés dudas?</h2>
            <p>Consultá las respuestas frecuentes o registrá una consulta de prueba.</p>
          </div>
          <div className="public-cta-actions">
            <Link className="public-primary-link" to="/preguntasfrecuentes">Ver FAQ</Link>
            <Link className="public-secondary-link" to="/contacto">Ir a Contacto</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
