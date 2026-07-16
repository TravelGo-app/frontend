import { Link } from "react-router-dom";
import PublicBackButton from "../components/PublicBackButton";

const PROTECTIONS = [
  {
    icon: "🔐",
    title: "Acceso protegido",
    text: "La plataforma utiliza autenticación, contraseñas protegidas y rutas privadas para limitar el acceso a cada cuenta.",
  },
  {
    icon: "🧾",
    title: "Actividad trazable",
    text: "Las operaciones y eventos relevantes se registran para que puedas revisar qué ocurrió y cuándo ocurrió.",
  },
  {
    icon: "✉️",
    title: "Confirmaciones",
    text: "Determinadas acciones pueden generar correos operativos para ayudarte a reconocer la actividad de tu cuenta.",
  },
  {
    icon: "🛡️",
    title: "Validaciones",
    text: "Los datos de entrada y las operaciones se validan antes de procesarse para reducir errores y usos inesperados.",
  },
];

export default function Security() {
  return (
    <main className="public-page">
      <PublicBackButton />

      <div className="public-shell">
        <section className="public-hero public-hero-security">
          <span className="public-badge">Uso responsable</span>
          <h1 className="public-title">Seguridad en TravelGo</h1>
          <p className="public-subtitle">
            Conocé las protecciones de la plataforma y las acciones que podés tomar
            para mantener tu cuenta segura.
          </p>
        </section>

        <section className="public-card-grid public-security-grid">
          {PROTECTIONS.map((item) => (
            <article className="public-card" key={item.title}>
              <span className="public-card-icon">{item.icon}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </section>

        <div className="public-two-columns">
          <section className="public-card">
            <h2>Buenas prácticas para tu cuenta</h2>
            <ul className="public-check-list">
              <li>Usá una contraseña única y difícil de adivinar.</li>
              <li>No compartas credenciales ni códigos de recuperación.</li>
              <li>Revisá destinatario, moneda y monto antes de confirmar.</li>
              <li>Cerrá sesión cuando utilices un equipo compartido.</li>
              <li>Mantené actualizado el navegador y el sistema operativo.</li>
              <li>Desconfiá de mensajes que pidan datos sensibles.</li>
            </ul>
          </section>

          <section className="public-card public-incident-card">
            <span className="public-card-icon">🚨</span>
            <h2>¿Detectaste algo extraño?</h2>
            <ol className="public-step-list">
              <li>Cambiá tu contraseña.</li>
              <li>Revisá el historial de actividad.</li>
              <li>Guardá una captura o referencia del evento.</li>
              <li>Registrá la incidencia en Contacto.</li>
            </ol>
            <Link className="public-primary-link" to="/contacto">
              Reportar una incidencia
            </Link>
          </section>
        </div>

        <div className="public-legal-note">
          <strong>Recordatorio</strong>
          <p>
            El asistente virtual y el equipo del proyecto nunca deberían pedirte una
            contraseña, un token ni un código de recuperación.
          </p>
        </div>
      </div>
    </main>
  );
}
