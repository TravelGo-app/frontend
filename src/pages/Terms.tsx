import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 document-bg">
      <div className="mx-auto w-full max-w-5xl document-panel p-10">
        <div className="document-hero">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <Link to="/" state={{ scrollTo: 'footer' }} className="inline-flex items-center gap-2 text-sm font-semibold text-oceano hover:text-grafito transition">
                ← Volver a inicio
              </Link>
              <h1 className="document-hero-title">Términos y Condiciones</h1>
              <p className="document-hero-description">
                Conocé las reglas que rigen el uso de TravelGo y las responsabilidades básicas de nuestros usuarios.
                Esta sección está pensada para ser clara, segura y accesible.
              </p>
            </div>
            <span className="document-badge">Documento público</span>
          </div>

          <div className="document-summary">
            <p>
              Última actualización: <strong>Julio de 2026</strong>. Estos términos describen cómo funciona TravelGo, qué esperas de la plataforma y qué se espera de tu uso.
            </p>
          </div>
        </div>

        <div className="document-content mt-10">
          <p>
            Bienvenido a <strong>TravelGo</strong>.
          </p>
          <p>
            TravelGo es una billetera digital diseñada para viajeros que permite administrar múltiples monedas,
            realizar conversiones de divisas y consultar información financiera dentro de una plataforma moderna e
            intuitiva. La aplicación ha sido desarrollada con fines <strong>educativos y demostrativos</strong> como parte
            de un proyecto académico, por lo que <strong>no procesa dinero real, inversiones reales ni operaciones financieras con entidades bancarias</strong>.
          </p>
          <p>
            Al registrarte o utilizar TravelGo, aceptás los presentes Términos y Condiciones, así como nuestra Política de Privacidad.
          </p>

          <hr />

          <h2>1. Aceptación de los términos</h2>
          <p>
            Al crear una cuenta confirmás que leíste, comprendiste y aceptaste estos términos. Si no estás de acuerdo con alguna de sus disposiciones, deberás abstenerte de utilizar la plataforma.
          </p>

          <hr />

          <h2>2. Finalidad de TravelGo</h2>
          <p>
            TravelGo fue creado para brindar una experiencia de billetera digital enfocada en viajeros internacionales.
          </p>
          <p>Entre sus funcionalidades principales se encuentran:</p>
          <ul>
            <li>Administración de múltiples monedas.</li>
            <li>Compra y venta simulada de divisas.</li>
            <li>Conversión entre monedas.</li>
            <li>Consulta de tasas de cambio.</li>
            <li>Historial de operaciones.</li>
            <li>Confirmaciones por correo electrónico.</li>
            <li>Asistente virtual impulsado por Inteligencia Artificial.</li>
            <li>Dashboard con balances y estadísticas.</li>
          </ul>
          <p>Todas las operaciones son simuladas y no representan movimientos financieros reales.</p>

          <hr />

          <h2>3. Registro de usuarios</h2>
          <p>
            Para acceder a la plataforma deberás proporcionar información verídica y actualizada.
          </p>
          <p>Como usuario te comprometés a:</p>
          <ul>
            <li>Registrar únicamente información propia.</li>
            <li>Mantener actualizados tus datos.</li>
            <li>No crear cuentas falsas.</li>
            <li>No utilizar la identidad de terceros.</li>
            <li>Utilizar la plataforma conforme a estos términos.</li>
          </ul>
          <p>TravelGo podrá suspender cuentas que incumplan estas condiciones.</p>

          <hr />

          <h2>4. Seguridad de la cuenta</h2>
          <p>
            El usuario es el único responsable de proteger sus credenciales de acceso.
          </p>
          <p>Se recomienda:</p>
          <ul>
            <li>Utilizar contraseñas robustas.</li>
            <li>No compartir el acceso con terceros.</li>
            <li>Cerrar sesión en dispositivos públicos.</li>
            <li>Informar inmediatamente cualquier actividad sospechosa.</li>
          </ul>
          <p>TravelGo implementa mecanismos básicos de autenticación para proteger la información de los usuarios.</p>

          <hr />

          <h2>5. Gestión de la billetera</h2>
          <p>
            Cada usuario dispone de una billetera digital donde puede mantener saldos en distintas monedas.
          </p>
          <p>Los balances mostrados son simulados y pueden incluir monedas como:</p>
          <ul>
            <li>USD</li>
            <li>EUR</li>
            <li>COP</li>
          </ul>
          <p>En futuras versiones podrán incorporarse nuevas monedas o activos digitales.</p>

          <hr />

          <h2>6. Tasas de cambio</h2>
          <p>
            Las tasas de cambio utilizadas por TravelGo provienen de servicios externos especializados.
          </p>
          <p>Las cotizaciones:</p>
          <ul>
            <li>Se actualizan periódicamente.</li>
            <li>Pueden variar sin previo aviso.</li>
            <li>Son utilizadas únicamente como referencia para las operaciones simuladas.</li>
          </ul>
          <p>TravelGo no controla ni modifica la información suministrada por dichos proveedores.</p>

          <hr />

          <h2>7. Compra, venta e intercambio</h2>
          <p>
            TravelGo permite realizar las siguientes operaciones:
          </p>
          <ul>
            <li>Compra de divisas.</li>
            <li>Venta de divisas.</li>
            <li>Conversión entre monedas.</li>
            <li>Intercambio entre balances disponibles.</li>
          </ul>
          <p>Una vez confirmada una operación:</p>
          <ul>
            <li>El balance será actualizado automáticamente.</li>
            <li>Se generará un registro en el historial.</li>
            <li>Se enviará una confirmación por correo electrónico cuando corresponda.</li>
          </ul>
          <p>Las operaciones confirmadas no podrán ser revertidas.</p>

          <hr />

          <h2>8. Historial de movimientos</h2>
          <p>
            Todas las transacciones realizadas quedarán registradas dentro del historial del usuario.
          </p>
          <p>Cada registro podrá incluir:</p>
          <ul>
            <li>Fecha y hora.</li>
            <li>Tipo de operación.</li>
            <li>Moneda origen.</li>
            <li>Moneda destino.</li>
            <li>Tasa aplicada.</li>
            <li>Valor convertido.</li>
            <li>Estado de la transacción.</li>
          </ul>
          <p>
            Este historial permite llevar un control transparente de la actividad dentro de la plataforma.
          </p>

          <hr />

          <h2>9. Confirmaciones por correo electrónico</h2>
          <p>
            Después de determinadas operaciones, TravelGo podrá enviar un correo electrónico informativo con los detalles de la transacción.
          </p>
          <p>
            Estos mensajes tienen únicamente fines informativos y no constituyen comprobantes financieros oficiales.
          </p>

          <hr />

          <h2>10. Asistente virtual (IA)</h2>
          <p>
            TravelGo incorpora un asistente basado en Inteligencia Artificial destinado a brindar orientación sobre el uso de la plataforma.
          </p>
          <p>El asistente puede ayudar con:</p>
          <ul>
            <li>Funcionamiento de la billetera.</li>
            <li>Conversión entre monedas.</li>
            <li>Explicación de funcionalidades.</li>
            <li>Consultas generales.</li>
          </ul>
          <p>
            Las respuestas generadas por la IA son únicamente informativas y no constituyen asesoría financiera, legal o tributaria.
          </p>

          <hr />

          <h2>11. Protección de datos personales</h2>
          <p>
            TravelGo recopila únicamente la información necesaria para el funcionamiento del sistema.
          </p>
          <p>Entre los datos tratados se encuentran:</p>
          <ul>
            <li>Nombre.</li>
            <li>Correo electrónico.</li>
            <li>Información de autenticación.</li>
            <li>Preferencias de uso.</li>
            <li>Historial de operaciones.</li>
          </ul>
          <p>
            La información será utilizada exclusivamente para el funcionamiento de la plataforma y no será comercializada.
          </p>

          <hr />

          <h2>12. Disponibilidad del servicio</h2>
          <p>
            Nos esforzamos por mantener TravelGo disponible de forma continua.
          </p>
          <p>Pueden presentarse interrupciones debido a:</p>
          <ul>
            <li>Mantenimiento programado.</li>
            <li>Actualizaciones.</li>
            <li>Mejoras de infraestructura.</li>
            <li>Errores técnicos.</li>
            <li>Indisponibilidad de servicios externos.</li>
            <li>Fallos en proveedores de APIs.</li>
          </ul>
          <p>TravelGo no garantiza disponibilidad absoluta.</p>

          <hr />

          <h2>13. Servicios de terceros</h2>
          <p>
            Algunas funcionalidades dependen de servicios externos como:
          </p>
          <ul>
            <li>Proveedores de tasas de cambio.</li>
            <li>Servicios de autenticación.</li>
            <li>Servicios de envío de correos electrónicos.</li>
            <li>Plataformas de infraestructura en la nube.</li>
          </ul>
          <p>
            TravelGo no será responsable por interrupciones o errores ocasionados por dichos proveedores.
          </p>

          <hr />

          <h2>14. Uso adecuado de la plataforma</h2>
          <p>
            Queda prohibido:
          </p>
          <ul>
            <li>Intentar acceder a información de otros usuarios.</li>
            <li>Manipular balances.</li>
            <li>Alterar el funcionamiento del sistema.</li>
            <li>Automatizar operaciones mediante bots.</li>
            <li>Intentar vulnerar la seguridad.</li>
            <li>Utilizar la plataforma para actividades ilícitas.</li>
          </ul>
          <p>El incumplimiento podrá ocasionar la suspensión inmediata de la cuenta.</p>

          <hr />

          <h2>15. Propiedad intelectual</h2>
          <p>
            Todo el contenido de TravelGo, incluyendo:
          </p>
          <ul>
            <li>Nombre comercial.</li>
            <li>Logotipo.</li>
            <li>Diseño de interfaz.</li>
            <li>Código fuente.</li>
            <li>Iconografía.</li>
            <li>Material gráfico.</li>
            <li>Identidad visual.</li>
          </ul>
          <p>pertenece al proyecto y se encuentra protegido por la legislación sobre propiedad intelectual.</p>

          <hr />

          <h2>16. Limitación de responsabilidad</h2>
          <p>
            TravelGo es un proyecto académico.
          </p>
          <p>Por ello:</p>
          <ul>
            <li>No administra dinero real.</li>
            <li>No actúa como entidad financiera.</li>
            <li>No presta servicios bancarios.</li>
            <li>No realiza inversiones.</li>
            <li>No garantiza ganancias económicas.</li>
            <li>No reemplaza asesoría financiera profesional.</li>
          </ul>
          <p>
            Las decisiones tomadas por el usuario con base en la información presentada son de su exclusiva responsabilidad.
          </p>

          <hr />

          <h2>17. Actualizaciones de la plataforma</h2>
          <p>
            TravelGo podrá incorporar nuevas funcionalidades, modificar la interfaz, agregar monedas, mejorar los mecanismos de seguridad o actualizar sus servicios en cualquier momento.
          </p>
          <p>Estas modificaciones podrán reflejarse también en los presentes Términos y Condiciones.</p>

          <hr />

          <h2>18. Contacto</h2>
          <p>
            Si necesitás ayuda o tenés dudas relacionadas con la plataforma, podés comunicarte con el equipo de TravelGo mediante los canales oficiales de soporte disponibles dentro de la aplicación.
          </p>

          <hr />

          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="font-semibold">Aviso importante</p>
            <p className="mt-3">
              <strong>TravelGo es un proyecto desarrollado con fines exclusivamente educativos dentro de un programa de formación Full Stack. Todas las operaciones, balances, conversiones de moneda, tasas de cambio, historiales y transacciones son simulaciones creadas para demostrar el funcionamiento de una billetera digital moderna. Ninguna operación implica el movimiento de dinero real ni constituye un servicio financiero regulado.</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
