import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 document-bg">
      <div className="mx-auto w-full max-w-5xl document-panel p-10">
        <div className="document-hero">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-900 transition">
                ← Volver a inicio
              </Link>
              <h1 className="document-hero-title text-amber-800">Contáctanos</h1>
              <p className="document-hero-description">
                En TravelGo estamos listos para ayudarte. Si tenés dudas, sugerencias o necesitás soporte,
                podés comunicarte con nosotros por los canales disponibles.
              </p>
            </div>
            <span className="document-badge">Documento público</span>
          </div>

          <div className="document-summary">
            <p>
              Última actualización: <strong>Julio de 2026</strong>. Conocé cómo contactarnos y qué opciones tenés
              para recibir ayuda rápida y confiable.
            </p>
          </div>
        </div>

        <div className="prose prose-slate document-content mt-10 max-w-none">
          <h2>Estamos aquí para ayudarte</h2>
          <p>
            En <strong>TravelGo</strong> queremos que tu experiencia sea simple, segura y sin complicaciones.
            Si tenés alguna duda, necesitás asistencia o querés compartir una sugerencia,
            nuestro equipo estará encantado de ayudarte.
          </p>
          <p>
            Ya sea una consulta sobre tu cuenta, el funcionamiento de la plataforma o una recomendación para mejorar
            nuestros servicios, podés comunicarte con nosotros a través de cualquiera de los siguientes canales.
          </p>

          <hr />

          <h2>Información de contacto</h2>

          <h3>📧 Correo electrónico</h3>
          <p>
            <strong>
              <a href="mailto:hola@travelgo.com" className="text-amber-700 hover:text-amber-900">hola@travelgo.com</a>
            </strong>
          </p>
          <p>
            Escribinos para consultas generales, soporte técnico, sugerencias o información sobre la plataforma.
            Nuestro equipo responderá tu mensaje a la mayor brevedad posible.
          </p>

          <hr />

          <h3>📞 Teléfono</h3>
          <p>
            <strong>+57 300 123 4567</strong>
          </p>
          <p>
            Si preferís comunicarte directamente con nosotros, podés hacerlo a través de nuestra línea de atención durante el horario de servicio.
          </p>
          <p><strong>Horario de atención</strong></p>
          <ul>
            <li>Lunes a Viernes: <strong>8:00 a.m. – 6:00 p.m.</strong></li>
            <li>Sábados: <strong>9:00 a.m. – 1:00 p.m.</strong></li>
            <li>Domingos y festivos: Cerrado</li>
          </ul>

          <hr />

          <h3>📍 Ubicación</h3>
          <p>
            <strong>Medellín, Colombia</strong>
          </p>
          <p>
            Nuestra sede se encuentra en la ciudad de Medellín, un referente de innovación y desarrollo tecnológico en América Latina.
          </p>

          <hr />

          <h2>También podés escribirnos</h2>
          <p>
            Si preferís, utilizá el formulario de contacto disponible en la plataforma. Solo necesitás completar:
          </p>
          <ul>
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Asunto</li>
            <li>Mensaje</li>
          </ul>
          <p>
            Nuestro equipo revisará tu solicitud y responderá lo antes posible.
          </p>

          <hr />

          <h2>¿En qué podemos ayudarte?</h2>
          <p>
            Estamos disponibles para resolver consultas relacionadas con:
          </p>
          <ul>
            <li>Registro y acceso a la plataforma.</li>
            <li>Recuperación de contraseña.</li>
            <li>Gestión de tu billetera digital.</li>
            <li>Conversión entre monedas.</li>
            <li>Historial de movimientos.</li>
            <li>Reporte de errores o incidencias.</li>
            <li>Sugerencias para mejorar TravelGo.</li>
            <li>Información general sobre nuestros servicios.</li>
          </ul>

          <hr />

          <h2>Nuestro compromiso</h2>
          <p>
            En <strong>TravelGo</strong> creemos que una buena experiencia también significa contar con un soporte cercano y oportuno.
            Nos esforzamos por brindar respuestas claras, rápidas y útiles para que puedas disfrutar de la plataforma con confianza.
          </p>
        </div>
      </div>
    </main>
  )
}
