import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60">
        <div className="mb-8">
          <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
            ← Volver a inicio
          </Link>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          Política de Privacidad
        </h1>
        <p className="mt-3 text-sm text-slate-500">Última actualización: Julio de 2026</p>

        <div className="prose prose-slate mt-10 max-w-none">
          <p>
            En <strong>TravelGo</strong>, respetamos y protegemos la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información personal proporcionada durante el uso de nuestra plataforma.
          </p>
          <p>
            Al registrarte y utilizar TravelGo, aceptás las prácticas descritas en esta política.
          </p>

          <hr />

          <h2>1. Información que recopilamos</h2>
          <p>
            Para ofrecer nuestros servicios, TravelGo puede recopilar la siguiente información:
          </p>
          <h3>Información de registro</h3>
          <ul>
            <li>Nombre completo.</li>
            <li>Correo electrónico.</li>
            <li>Contraseña cifrada.</li>
            <li>Fecha de creación de la cuenta.</li>
          </ul>
          <h3>Información de uso</h3>
          <p>Durante el uso de la plataforma podemos registrar:</p>
          <ul>
            <li>Inicio y cierre de sesión.</li>
            <li>Historial de operaciones.</li>
            <li>Monedas utilizadas.</li>
            <li>Conversión de divisas realizada.</li>
            <li>Configuración de preferencias.</li>
          </ul>
          <h3>Información técnica</h3>
          <p>Con fines de seguridad y funcionamiento del sistema también pueden recopilarse datos como:</p>
          <ul>
            <li>Navegador utilizado.</li>
            <li>Sistema operativo.</li>
            <li>Dirección IP.</li>
            <li>Fecha y hora de acceso.</li>
            <li>Información básica del dispositivo.</li>
          </ul>

          <hr />

          <h2>2. Finalidad del tratamiento de datos</h2>
          <p>La información recopilada se utiliza únicamente para:</p>
          <ul>
            <li>Crear y administrar tu cuenta.</li>
            <li>Permitir el acceso seguro a la plataforma.</li>
            <li>Mostrar balances y movimientos.</li>
            <li>Procesar operaciones simuladas.</li>
            <li>Enviar confirmaciones por correo electrónico.</li>
            <li>Mejorar la experiencia del usuario.</li>
            <li>Detectar actividades inusuales.</li>
            <li>Corregir errores y mejorar el rendimiento de la aplicación.</li>
          </ul>
          <p>Nunca utilizaremos tu información con fines comerciales sin tu consentimiento.</p>

          <hr />

          <h2>3. Protección de la información</h2>
          <p>TravelGo implementa medidas de seguridad orientadas a proteger la información almacenada.</p>
          <p>Entre ellas:</p>
          <ul>
            <li>Contraseñas almacenadas mediante algoritmos de cifrado.</li>
            <li>Acceso restringido a la información.</li>
            <li>Validaciones de autenticación.</li>
            <li>Protección frente a accesos no autorizados.</li>
            <li>Buenas prácticas de desarrollo seguro.</li>
          </ul>
          <p>Aunque aplicamos medidas razonables de protección, ningún sistema es completamente inmune a riesgos tecnológicos.</p>

          <hr />

          <h2>4. Compartición de información</h2>
          <p>TravelGo no vende, alquila ni comercializa la información personal de sus usuarios.</p>
          <p>Podremos compartir información únicamente cuando sea necesario para el funcionamiento de la plataforma mediante servicios tecnológicos como:</p>
          <ul>
            <li>Servicios de autenticación.</li>
            <li>Proveedores de infraestructura.</li>
            <li>Servicios de envío de correos electrónicos.</li>
            <li>APIs de tasas de cambio.</li>
          </ul>
          <p>Estos servicios únicamente reciben la información estrictamente necesaria para cumplir su función.</p>

          <hr />

          <h2>5. Cookies y almacenamiento local</h2>
          <p>TravelGo puede utilizar cookies o mecanismos de almacenamiento local del navegador para:</p>
          <ul>
            <li>Mantener la sesión iniciada.</li>
            <li>Recordar preferencias del usuario.</li>
            <li>Mejorar el rendimiento de la aplicación.</li>
            <li>Optimizar la experiencia de navegación.</li>
          </ul>
          <p>Estas tecnologías no recopilan información financiera real.</p>

          <hr />

          <h2>6. Conservación de los datos</h2>
          <p>La información será almacenada únicamente durante el tiempo necesario para el funcionamiento de la plataforma o hasta que el usuario solicite la eliminación de su cuenta, salvo que exista una obligación legal de conservar determinados registros.</p>

          <hr />

          <h2>7. Derechos del usuario</h2>
          <p>Como usuario de TravelGo podrás solicitar:</p>
          <ul>
            <li>Acceder a tus datos personales.</li>
            <li>Actualizar información incorrecta.</li>
            <li>Modificar tus datos de perfil.</li>
            <li>Solicitar la eliminación de tu cuenta.</li>
            <li>Conocer qué información almacena la plataforma.</li>
          </ul>
          <p>TravelGo atenderá estas solicitudes dentro de las posibilidades del proyecto.</p>

          <hr />

          <h2>8. Correos electrónicos</h2>
          <p>TravelGo podrá enviarte correos electrónicos relacionados con:</p>
          <ul>
            <li>Confirmación de registro.</li>
            <li>Recuperación de contraseña.</li>
            <li>Confirmación de operaciones.</li>
            <li>Avisos de seguridad.</li>
            <li>Cambios importantes en la plataforma.</li>
          </ul>
          <p>No enviaremos publicidad no solicitada.</p>

          <hr />

          <h2>9. Inteligencia Artificial</h2>
          <p>TravelGo incorpora un asistente virtual basado en Inteligencia Artificial para responder consultas relacionadas con el funcionamiento de la plataforma.</p>
          <p>Las conversaciones con el asistente podrán utilizarse para mejorar la experiencia del usuario y optimizar futuras versiones del sistema.</p>
          <p>No se recomienda compartir información sensible, contraseñas, códigos de verificación o datos financieros confidenciales durante las conversaciones con el asistente.</p>

          <hr />

          <h2>10. Servicios de terceros</h2>
          <p>Algunas funcionalidades de TravelGo dependen de servicios externos.</p>
          <p>Entre ellos:</p>
          <ul>
            <li>APIs de tasas de cambio.</li>
            <li>Servicios de autenticación.</li>
            <li>Servicios de correo electrónico.</li>
            <li>Infraestructura en la nube.</li>
          </ul>
          <p>Cada proveedor gestiona sus propios estándares de seguridad y privacidad.</p>

          <hr />

          <h2>11. Seguridad de la información</h2>
          <p>Nos comprometemos a aplicar buenas prácticas para proteger la información de nuestros usuarios.</p>
          <ul>
            <li>Autenticación segura.</li>
            <li>Comunicación mediante conexiones cifradas.</li>
            <li>Protección de contraseñas.</li>
            <li>Validación de operaciones.</li>
            <li>Actualización constante de componentes utilizados en la plataforma.</li>
          </ul>

          <hr />

          <h2>12. Cambios en esta política</h2>
          <p>Esta Política de Privacidad podrá actualizarse cuando TravelGo incorpore nuevas funcionalidades o realice mejoras en sus procesos.</p>
          <p>Cuando los cambios sean relevantes, se informará a los usuarios mediante los canales disponibles dentro de la aplicación.</p>

          <hr />

          <h2>13. Contacto</h2>
          <p>Si tenés preguntas relacionadas con esta Política de Privacidad o con el tratamiento de tus datos personales, podés comunicarte con el equipo de TravelGo a través de los canales oficiales de soporte disponibles dentro de la plataforma.</p>

          <hr />

          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="font-semibold">Aviso importante</p>
            <p className="mt-3">
              <strong>TravelGo es un proyecto académico desarrollado con fines educativos dentro de un programa de formación Full Stack. La información almacenada y las operaciones realizadas en la plataforma forman parte de una simulación de una billetera digital y no representan servicios financieros reales. Sin embargo, el proyecto fue diseñado siguiendo buenas prácticas de desarrollo, seguridad y privacidad con el objetivo de ofrecer una experiencia similar a la de una aplicación fintech profesional.</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
