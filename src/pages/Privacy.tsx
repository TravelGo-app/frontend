import { Link } from "react-router-dom";
import PublicBackButton from "../components/PublicBackButton";

const SECTIONS = [
  {
    icon: "🧾",
    title: "Información de la cuenta",
    text: "Podemos almacenar nombre, correo, identificadores de usuario, preferencias y datos necesarios para iniciar sesión y administrar el perfil.",
  },
  {
    icon: "📊",
    title: "Actividad dentro de TravelGo",
    text: "Se registran operaciones simuladas, cambios de perfil, eventos de seguridad y acciones necesarias para construir el historial de actividad.",
  },
  {
    icon: "🛠️",
    title: "Datos técnicos",
    text: "Podemos procesar información básica del navegador, fecha, hora, dirección IP y errores para proteger y mejorar la plataforma.",
  },
  {
    icon: "✉️",
    title: "Comunicaciones",
    text: "Las preferencias de correo determinan qué confirmaciones y resúmenes se programan. Los mensajes operativos pueden depender de proveedores externos de correo.",
  },
  {
    icon: "🤝",
    title: "Servicios de terceros",
    text: "TravelGo puede utilizar infraestructura en la nube, autenticación, tasas de cambio, correo e inteligencia artificial, compartiendo solo lo necesario para cada función.",
  },
  {
    icon: "🧹",
    title: "Conservación y eliminación",
    text: "Los datos se mantienen durante el tiempo necesario para el proyecto, la seguridad y el funcionamiento de la cuenta. Podés solicitar revisión, corrección o eliminación.",
  },
];

export default function Privacy() {
  return (
    <main className="public-page">
      <PublicBackButton />

      <div className="public-shell">
        <section className="public-hero public-hero-privacy">
          <span className="public-badge">Privacidad clara</span>
          <h1 className="public-title">Política de privacidad</h1>
          <p className="public-subtitle">
            Una explicación directa sobre qué información usa TravelGo, para qué la
            necesita y qué decisiones podés tomar sobre tus datos.
          </p>
          <p className="public-update">Última actualización: julio de 2026</p>
        </section>

        <section className="public-card-grid">
          {SECTIONS.map((section) => (
            <article className="public-card" key={section.title}>
              <span className="public-card-icon">{section.icon}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </section>

        <section className="public-card public-wide-card">
          <h2>Cómo utilizamos la información</h2>
          <ul className="public-check-list">
            <li>Crear, autenticar y administrar tu cuenta.</li>
            <li>Mostrar saldos, movimientos y actividad simulada.</li>
            <li>Proteger el acceso y detectar comportamientos inusuales.</li>
            <li>Enviar comunicaciones que correspondan a tus preferencias.</li>
            <li>Corregir errores y mejorar el funcionamiento de TravelGo.</li>
          </ul>
        </section>

        <section className="public-card public-wide-card">
          <h2>Tus decisiones</h2>
          <p>
            Podés actualizar datos del perfil, modificar preferencias de correo y
            solicitar información sobre el tratamiento de tus datos. Para una
            consulta relacionada con privacidad, utilizá el formulario de contacto.
          </p>
          <Link className="public-primary-link" to="/contacto">
            Realizar una consulta
          </Link>
        </section>

        <div className="public-legal-note">
          <strong>Aviso del proyecto</strong>
          <p>
            TravelGo es una aplicación educativa y demostrativa. Esta página describe
            las prácticas previstas por el proyecto y no reemplaza asesoramiento legal
            ni representa un servicio financiero real.
          </p>
        </div>
      </div>
    </main>
  );
}
