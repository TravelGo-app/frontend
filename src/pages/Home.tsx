export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-2xl mx-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Bienvenido a Home</h1>
        <p className="text-slate-600 mb-6">
          Esta es la página de inicio principal después de iniciar sesión.
          Desde aquí podés navegar a tu dashboard, wallet, exchange e historial.
        </p>
        <p className="text-sm text-slate-500">
          Si querés, más adelante podemos mejorar este contenido con tarjetas, gráficos y accesos directos.
        </p>
      </div>
    </div>
  )
}
