import { Link } from "react-router-dom";
import PublicBackButton from "../components/PublicBackButton";

const FAQS = [
  {
    question: "¿Qué es TravelGo?",
    answer:
      "TravelGo es una billetera digital educativa y multimoneda. Permite practicar depósitos, transferencias, cambios de moneda y consulta de movimientos dentro de una experiencia simulada.",
  },
  {
    question: "¿TravelGo utiliza dinero real?",
    answer:
      "No. Los saldos, depósitos, transferencias y conversiones son simulados. La plataforma fue creada con fines educativos y demostrativos, por lo que no almacena fondos ni reemplaza a una entidad financiera.",
  },
  {
    question: "¿Cómo creo una cuenta?",
    answer:
      "Entrá en Crear cuenta, completá tus datos, verificá que el correo sea válido y elegí una contraseña segura. También podés ingresar con Google cuando esa opción esté disponible.",
  },
  {
    question: "¿Cómo agrego saldo?",
    answer:
      "Desde el dashboard ingresá a Depositar, seleccioná la moneda y escribí el monto de práctica. Al confirmar, el saldo simulado aparecerá en tu billetera y en el historial.",
  },
  {
    question: "¿Cómo envío una transferencia?",
    answer:
      "Abrí Transferir, buscá al destinatario mediante email, alias o CVU TravelGo, elegí la moneda, ingresá el monto y revisá los datos antes de confirmar.",
  },
  {
    question: "¿Qué correos envía TravelGo?",
    answer:
      "Según tus preferencias, la plataforma puede programar confirmaciones de registro, depósitos, transferencias, cambios de moneda, recuperación de contraseña y resúmenes del dashboard.",
  },
  {
    question: "¿Cómo funciona el cambio de monedas?",
    answer:
      "En Cambiar moneda seleccionás la moneda de origen, la moneda de destino y el monto. Antes de confirmar se muestra la cotización disponible y el resultado estimado.",
  },
  {
    question: "¿Dónde consulto mis movimientos?",
    answer:
      "La sección Historial reúne operaciones financieras y actividad relevante de la cuenta. Podés filtrar los eventos y continuar cargando resultados cuando haya más información.",
  },
  {
    question: "¿Qué hago si olvidé mi contraseña?",
    answer:
      "Usá Recuperar contraseña desde el inicio de sesión. Recibirás un enlace en el correo asociado a tu cuenta para establecer una nueva contraseña.",
  },
  {
    question: "¿Qué hago si veo una actividad que no reconozco?",
    answer:
      "Cambiá tu contraseña, cerrá sesiones abiertas, revisá tu historial y evitá compartir códigos o credenciales. Después registrá el incidente mediante la página de Contacto.",
  },
  {
    question: "¿Mis datos personales se venden?",
    answer:
      "No. TravelGo no vende datos personales. La información se utiliza para permitir el funcionamiento de la cuenta, mejorar la experiencia, enviar comunicaciones elegidas y proteger la plataforma.",
  },
  {
    question: "¿El asistente virtual puede pedirme una contraseña?",
    answer:
      "No. Nunca compartas contraseñas, códigos de recuperación, tokens ni información sensible con el asistente virtual o con otra persona.",
  },
];

export default function Faq() {
  return (
    <main className="public-page">
      <PublicBackButton />

      <div className="public-shell">
        <section className="public-hero">
          <span className="public-badge">Centro de respuestas</span>
          <h1 className="public-title">Preguntas frecuentes</h1>
          <p className="public-subtitle">
            Respuestas simples para entender TravelGo, resolver dudas y usar la
            plataforma con mayor seguridad.
          </p>
        </section>

        <section className="faq-list" aria-label="Preguntas frecuentes">
          {FAQS.map((faq, index) => (
            <details className="faq-item" key={faq.question} open={index === 0}>
              <summary>
                <span>{faq.question}</span>
                <span className="faq-toggle" aria-hidden="true">+</span>
              </summary>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </section>

        <section className="public-cta">
          <div>
            <h2>¿Necesitás una explicación paso a paso?</h2>
            <p>La guía de ayuda reúne instrucciones rápidas para cada función.</p>
          </div>
          <div className="public-cta-actions">
            <Link className="public-primary-link" to="/ayuda">Abrir guía</Link>
            <Link className="public-secondary-link" to="/contacto">Contactar</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
