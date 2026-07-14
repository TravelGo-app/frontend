import { Link } from 'react-router-dom'

export default function Faq() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 document-bg">
      <div className="mx-auto w-full max-w-5xl document-panel p-10">
        <div className="document-hero">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-oceano hover:text-grafito transition">
                ← Volver a inicio
              </Link>
              <h1 className="document-hero-title">Preguntas Frecuentes (FAQ)</h1>
              <p className="document-hero-description">
                Encontrá respuestas claras a las dudas más frecuentes sobre el uso de TravelGo y el alcance de la plataforma.
              </p>
            </div>
            <span className="document-badge">Documento público</span>
          </div>

          <div className="document-summary">
            <p>
              Última actualización: <strong>Julio de 2026</strong>. Aquí encontrarás las preguntas más comunes sobre TravelGo y su funcionamiento.
            </p>
          </div>
        </div>

        <div className="prose prose-slate document-content mt-10 max-w-none">
          <h2>1. ¿Qué es TravelGo?</h2>
          <p>
            TravelGo es una billetera digital multimoneda diseñada para viajeros. Permite administrar diferentes divisas,
            realizar conversiones entre monedas y llevar un control de los movimientos desde una única plataforma.
          </p>

          <hr />

          <h2>2. ¿TravelGo es un banco?</h2>
          <p>
            No. TravelGo no es una entidad bancaria. Es una plataforma de billetera digital desarrollada para facilitar la gestión de múltiples monedas durante los viajes.
          </p>

          <hr />

          <h2>3. ¿Qué monedas puedo administrar?</h2>
          <p>
            Actualmente la plataforma permite trabajar con varias monedas internacionales, como:
          </p>
          <ul>
            <li>Dólar estadounidense (USD)</li>
            <li>Euro (EUR)</li>
            <li>Peso colombiano (COP)</li>
          </ul>
          <p>En futuras versiones podrán incorporarse nuevas divisas.</p>

          <hr />

          <h2>4. ¿Cómo funcionan las tasas de cambio?</h2>
          <p>
            Las tasas de cambio se obtienen mediante servicios externos especializados y se actualizan periódicamente.
            El valor aplicado a una conversión corresponde a la tasa disponible en el momento de confirmar la operación.
          </p>

          <hr />

          <h2>5. ¿Puedo cambiar una moneda por otra?</h2>
          <p>
            Sí. TravelGo permite convertir el saldo disponible entre las monedas soportadas desde la sección <strong>Exchange</strong>.
          </p>

          <hr />

          <h2>6. ¿Dónde puedo consultar mis movimientos?</h2>
          <p>
            Todas las operaciones quedan registradas automáticamente en la sección <strong>History</strong>, donde podrás consultar fechas,
            montos, monedas utilizadas y detalles de cada transacción.
          </p>

          <hr />

          <h2>7. ¿Qué sucede si olvido mi contraseña?</h2>
          <p>
            Podrás utilizar la opción <strong>"Recuperar contraseña"</strong> para recibir un correo electrónico con las instrucciones necesarias para restablecer el acceso a tu cuenta.
          </p>

          <hr />

          <h2>8. ¿Mis datos están protegidos?</h2>
          <p>
            Sí. TravelGo implementa buenas prácticas de seguridad para proteger la información de los usuarios,
            incluyendo autenticación segura y protección de datos personales.
          </p>

          <hr />

          <h2>9. ¿Qué hago si detecto una actividad sospechosa?</h2>
          <p>
            Si observás movimientos o accesos que no reconocés, comunicate con el equipo de soporte lo antes posible y cambiá tu contraseña inmediatamente.
          </p>

          <hr />

          <h2>10. ¿TravelGo cobra comisiones?</h2>
          <p>
            Dentro de este proyecto académico, las operaciones son simuladas y no generan cobros reales.
            En un entorno de producción podrían existir comisiones claramente informadas antes de confirmar cada operación.
          </p>

          <hr />

          <h2>11. ¿Cómo puedo contactar al soporte?</h2>
          <p>
            Podés comunicarte con nuestro equipo mediante la sección <strong>Soporte</strong> disponible dentro de la aplicación.
            Nuestro objetivo es brindar asistencia las 24 horas del día.
          </p>

          <hr />

          <h2>12. ¿Puedo usar TravelGo desde cualquier dispositivo?</h2>
          <p>
            Sí. TravelGo fue desarrollado con un diseño adaptable (responsive), por lo que puede utilizarse desde computadoras,
            tablets y dispositivos móviles compatibles con navegadores modernos.
          </p>

          <hr />

          <h2>13. ¿Necesito conexión a Internet?</h2>
          <p>
            Sí. Al tratarse de una aplicación web, es necesario contar con conexión a Internet para acceder a la plataforma,
            consultar tasas de cambio y realizar operaciones.
          </p>

          <hr />

          <h2>14. ¿Qué información puedo ver en el Dashboard?</h2>
          <p>
            El Dashboard reúne la información más importante de tu cuenta, incluyendo:
          </p>
          <ul>
            <li>Balance total.</li>
            <li>Saldos por moneda.</li>
            <li>Resumen de movimientos.</li>
            <li>Accesos rápidos a las principales funciones.</li>
          </ul>

          <hr />

          <h2>15. ¿TravelGo utiliza Inteligencia Artificial?</h2>
          <p>
            Sí. TravelGo incorpora un asistente virtual basado en Inteligencia Artificial para ayudar a los usuarios a resolver dudas sobre el funcionamiento de la plataforma y facilitar la navegación.
          </p>

          <hr />

          <h2>16. ¿Puedo eliminar mi cuenta?</h2>
          <p>
            Sí. Podés solicitar la eliminación de tu cuenta desde la configuración de tu perfil o contactando al equipo de soporte.
            La solicitud será procesada conforme a las políticas de la plataforma.
          </p>

          <hr />

          <h2>17. ¿Qué navegadores son compatibles?</h2>
          <p>
            TravelGo funciona correctamente en las versiones más recientes de navegadores como:
          </p>
          <ul>
            <li>Google Chrome</li>
            <li>Microsoft Edge</li>
            <li>Mozilla Firefox</li>
            <li>Safari</li>
          </ul>
          <p>Para una mejor experiencia recomendamos mantener el navegador actualizado.</p>

          <hr />

          <h2>18. ¿TravelGo maneja dinero real?</h2>
          <p>
            No. <strong>TravelGo es un proyecto desarrollado con fines educativos.</strong> Todas las operaciones,
            saldos y conversiones son simulaciones diseñadas para demostrar el funcionamiento de una billetera digital moderna.
            No se realizan transacciones financieras reales ni se almacenan fondos de usuarios.
          </p>
        </div>
      </div>
    </main>
  )
}
