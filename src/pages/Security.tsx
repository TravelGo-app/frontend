import { Link } from 'react-router-dom'

export default function Security() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 document-bg">
      <div className="mx-auto w-full max-w-5xl document-panel p-10">
        <div className="document-hero">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-oceano hover:text-grafito transition">
                ← Volver a inicio
              </Link>
              <h1 className="document-hero-title">Seguridad</h1>
              <p className="document-hero-description">
                En TravelGo trabajamos para proteger tu cuenta, tus datos y cada operación con los más altos estándares de seguridad.
              </p>
            </div>
            <span className="document-badge">Documento público</span>
          </div>

          <div className="document-summary">
            <p>
              Última actualización: <strong>Julio de 2026</strong>. Conocé cómo cuidamos tu información y recomendamos prácticas seguras.
            </p>
          </div>
        </div>

        <div className="prose prose-slate document-content mt-10 max-w-none">
          <h2>Tu dinero y tu información son nuestra prioridad</h2>
          <p>
            En <strong>TravelGo</strong>, diseñamos nuestra plataforma siguiendo buenas prácticas de seguridad para proteger tu cuenta,
            tus datos personales y cada una de tus operaciones. Nuestro objetivo es brindarte una experiencia confiable para que puedas
            administrar tus finanzas mientras viajas con tranquilidad.
          </p>

          <hr />

          <h2>¿Cómo protegemos tu cuenta?</h2>
          <h3>🔐 Autenticación segura</h3>
          <p>
            Utilizamos mecanismos de autenticación que garantizan que únicamente vos puedas acceder a tu cuenta.
          </p>
          <ul>
            <li>Inicio de sesión seguro.</li>
            <li>Contraseñas protegidas mediante cifrado.</li>
            <li>Recuperación segura de contraseña.</li>
            <li>Validación de identidad cuando sea necesario.</li>
          </ul>

          <hr />

          <h3>🛡️ Protección de datos</h3>
          <p>
            Tu información personal es tratada con confidencialidad y utilizada únicamente para el funcionamiento de la plataforma.
          </p>
          <p>Protegemos datos como:</p>
          <ul>
            <li>Nombre</li>
            <li>Correo electrónico</li>
            <li>Historial de movimientos</li>
            <li>Preferencias de usuario</li>
          </ul>
          <p>Nunca comercializamos tu información.</p>

          <hr />

          <h3>💱 Operaciones transparentes</h3>
          <p>
            Cada operación realizada en TravelGo queda registrada dentro de tu historial para que siempre puedas consultar:
          </p>
          <ul>
            <li>Fecha</li>
            <li>Hora</li>
            <li>Tipo de operación</li>
            <li>Monedas involucradas</li>
            <li>Tasa aplicada</li>
            <li>Estado de la transacción</li>
          </ul>

          <hr />

          <h3>📧 Confirmaciones por correo</h3>
          <p>
            Cuando realizás determinadas operaciones, enviamos un correo electrónico de confirmación para que puedas verificar rápidamente la actividad de tu cuenta.
          </p>

          <hr />

          <h3>🤖 Asistencia inteligente</h3>
          <p>
            Nuestro asistente virtual está disponible para ayudarte a comprender el funcionamiento de la plataforma y resolver dudas frecuentes.
          </p>
          <p>Por tu seguridad, el asistente nunca solicitará:</p>
          <ul>
            <li>Contraseñas</li>
            <li>Códigos de verificación</li>
            <li>Información bancaria</li>
            <li>Datos sensibles</li>
          </ul>

          <hr />

          <h2>Recomendaciones para proteger tu cuenta</h2>
          <p>Para mantener tu cuenta segura, te recomendamos:</p>
          <ul>
            <li>Utilizar una contraseña fuerte y única.</li>
            <li>No compartir tus credenciales.</li>
            <li>Cambiar la contraseña periódicamente.</li>
            <li>Cerrar sesión al utilizar equipos compartidos.</li>
            <li>Verificar siempre los datos antes de confirmar una operación.</li>
            <li>Mantener actualizado tu navegador.</li>
          </ul>

          <hr />

          <h2>Nuestro compromiso</h2>
          <p>
            Trabajamos constantemente para mejorar la seguridad de TravelGo mediante:
          </p>
          <ul>
            <li>Actualización continua de la plataforma.</li>
            <li>Buenas prácticas de desarrollo.</li>
            <li>Protección de la información.</li>
            <li>Monitoreo de errores.</li>
            <li>Mejoras en la experiencia del usuario.</li>
          </ul>
          <p>
            La seguridad no es una función adicional; es un principio presente en cada parte de TravelGo.
          </p>
        </div>
      </div>
    </main>
  )
}
