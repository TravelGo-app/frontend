import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 document-bg">
      <div className="mx-auto w-full max-w-5xl document-panel p-10">
        <div className="document-hero">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <Link
                to="/"
                state={{ scrollTo: "footer" }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-oceano hover:text-grafito transition"
              >
                ← Volver a inicio
              </Link>
              <h1 className="document-hero-title">Sobre Nosotros</h1>
              <p className="document-hero-description">
                Conocé nuestra historia, misión y visión. TravelGo se creó para
                acompañar a los viajeros con una billetera digital segura, clara
                y fácil de usar en cada etapa de su recorrido.
              </p>
            </div>
            <span className="document-badge">Documento público</span>
          </div>

          <div className="document-summary">
            <p>
              En TravelGo creemos que la gestión del dinero en el viaje debe ser
              simple y confiable. Esta página describe nuestro propósito,
              valores y compromiso con cada usuario.
            </p>
          </div>
        </div>

        <div className="prose prose-slate document-content mt-10 max-w-none">
          <h2>Nuestra historia</h2>
          <p>
            En <strong>TravelGo</strong> creemos que viajar debería ser una
            experiencia llena de descubrimientos, no de preocupaciones
            financieras.
          </p>
          <p>
            Nacimos con la visión de simplificar la forma en que las personas
            administran su dinero cuando visitan nuevos destinos. Sabemos que
            cambiar divisas, controlar gastos y comprender las tasas de cambio
            puede resultar complicado, especialmente al encontrarse lejos de
            casa. Por eso diseñamos una billetera digital pensada
            específicamente para viajeros: una plataforma intuitiva, segura y
            preparada para acompañarte en cada etapa de tu recorrido.
          </p>
          <p>
            Nuestro objetivo es ofrecer una experiencia moderna que permita
            gestionar múltiples monedas desde un solo lugar, realizar
            conversiones de forma sencilla y mantener siempre el control de tus
            finanzas durante el viaje.
          </p>

          <hr />

          <h2>Nuestra misión</h2>
          <p>
            Brindar a los viajeros una billetera digital inteligente, segura y
            fácil de usar, que les permita administrar su dinero sin fronteras,
            acceder a tasas de cambio transparentes y disfrutar de una
            experiencia financiera simple desde cualquier lugar del mundo.
          </p>

          <hr />

          <h2>Nuestra visión</h2>
          <p>
            Convertirnos en una plataforma de referencia para viajeros
            internacionales, ofreciendo soluciones digitales innovadoras que
            hagan más fácil, segura y accesible la gestión de múltiples monedas
            en cualquier destino.
          </p>

          <hr />

          <h2>Nuestros valores</h2>
          <h3>🌍 Libertad</h3>
          <p>
            Creemos que el dinero no debería ser un obstáculo para descubrir
            nuevos lugares. Diseñamos herramientas que acompañan a las personas
            en cada viaje.
          </p>
          <h3>🔒 Seguridad</h3>
          <p>
            La confianza es fundamental. Trabajamos para proteger la información
            y ofrecer una experiencia transparente en cada operación.
          </p>
          <h3>💡 Innovación</h3>
          <p>
            Apostamos por la tecnología para crear soluciones simples, modernas
            e intuitivas que mejoren la experiencia del usuario.
          </p>
          <h3>🤝 Transparencia</h3>
          <p>
            Promovemos información clara, tasas visibles y procesos fáciles de
            entender para que cada usuario tome decisiones con confianza.
          </p>
          <h3>✈️ Experiencia del viajero</h3>
          <p>
            Cada funcionalidad de TravelGo está pensada para resolver
            necesidades reales de quienes exploran nuevos destinos y administran
            diferentes monedas.
          </p>

          <hr />

          <h2>¿Qué hace diferente a TravelGo?</h2>
          <p>
            TravelGo reúne en una sola plataforma las herramientas esenciales
            para un viajero moderno:
          </p>
          <ul>
            <li>🌍 Administración de múltiples monedas.</li>
            <li>
              💱 Conversión entre divisas utilizando tasas de cambio
              actualizadas.
            </li>
            <li>📊 Dashboard para visualizar balances y movimientos.</li>
            <li>📧 Confirmaciones automáticas por correo electrónico.</li>
            <li>
              🤖 Asistente virtual con Inteligencia Artificial para resolver
              consultas.
            </li>
            <li>🔒 Un enfoque en seguridad, simplicidad y facilidad de uso.</li>
          </ul>
          <p>
            Nuestro propósito es que el usuario pueda concentrarse en disfrutar
            el viaje mientras TravelGo lo acompaña en la gestión de su dinero.
          </p>

          <hr />

          <h2>Nuestro compromiso</h2>
          <p>
            Nos comprometemos a desarrollar una plataforma confiable, intuitiva
            y accesible, mejorando continuamente la experiencia del usuario
            mediante buenas prácticas de desarrollo, diseño centrado en las
            personas y tecnologías modernas.
          </p>
          <p>
            Cada decisión que tomamos busca ofrecer una experiencia sencilla,
            rápida y segura para quienes desean explorar el mundo con mayor
            tranquilidad.
          </p>
        </div>
      </div>
    </main>
  );
}
