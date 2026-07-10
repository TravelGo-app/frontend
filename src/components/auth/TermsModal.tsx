interface TermsModalProps {
  open: boolean
  onClose: () => void
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-700">Términos y Condiciones</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <p className="text-xs text-gray-400 italic mb-4 border-b border-gray-100 pb-3">
          TravelGo es un proyecto desarrollado con fines educativos. Los términos a continuación
          describen el funcionamiento de la plataforma tal como operaría un producto real.
        </p>

        <div className="text-sm text-gray-600 space-y-3">
          <p>
            Al crear una cuenta en TravelGo aceptás los siguientes términos, que regulan el uso de
            nuestra billetera digital multi-moneda para viajeros.
          </p>

          <p>
            <strong>1. Tu cuenta.</strong> Sos responsable de la confidencialidad de tu contraseña y de
            toda operación realizada desde tu cuenta. Si detectás actividad sospechosa, contactanos de
            inmediato para bloquear el acceso.
          </p>

          <p>
            <strong>2. Saldos y monedas.</strong> TravelGo te permite mantener saldo en distintas monedas
            dentro de tu billetera. Los saldos se muestran en tu dashboard y pueden variar según las
            tasas de cambio vigentes al momento de cada operación.
          </p>

          <p>
            <strong>3. Intercambio de divisas.</strong> Las operaciones de intercambio entre monedas se
            ejecutan a la tasa vigente en el momento de la confirmación. TravelGo no garantiza que la
            tasa se mantenga fija entre la consulta y la confirmación de la operación.
          </p>

          <p>
            <strong>4. Compras y transferencias.</strong> Las compras y transferencias realizadas dentro
            de la plataforma quedan registradas en tu historial de movimientos. Es tu responsabilidad
            verificar los datos del destinatario antes de confirmar una transferencia.
          </p>

          <p>
            <strong>5. Verificación de identidad.</strong> Para proteger tu cuenta y prevenir fraudes,
            podemos solicitarte datos adicionales de verificación antes de habilitar ciertas operaciones.
          </p>

          <p>
            <strong>6. Datos personales.</strong> Tu nombre, email y datos de uso se utilizan
            exclusivamente para el funcionamiento de TravelGo y no se comparten con terceros ajenos a la
            plataforma.
          </p>

          <p>
            <strong>7. Disponibilidad del servicio.</strong> Trabajamos para que TravelGo esté disponible
            de forma continua, aunque puede haber interrupciones puntuales por mantenimiento o mejoras.
          </p>

          <p>
            <strong>8. Cambios en los términos.</strong> Estos términos pueden actualizarse a medida que
            la plataforma incorpore nuevas funcionalidades. Te notificaremos ante cambios relevantes.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-[#2A9BB5] text-white py-2 rounded-full font-bold hover:bg-teal-600 transition"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}