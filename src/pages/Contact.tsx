import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import PublicBackButton from "../components/PublicBackButton";

export default function Contact() {
  const [ticket, setTicket] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reference = `TG-${Date.now().toString().slice(-8)}`;
    setTicket(reference);
    event.currentTarget.reset();
  };

  return (
    <main className="public-page">
      <PublicBackButton />

      <div className="public-shell">
        <section className="public-hero public-hero-contact">
          <span className="public-badge">Centro de contacto</span>
          <h1 className="public-title">Contanos cómo podemos ayudarte</h1>
          <p className="public-subtitle">
            Registrá una consulta de prueba sobre tu cuenta, una operación o una
            mejora para TravelGo.
          </p>
        </section>

        <div className="public-two-columns">
          <section className="public-card">
            <h2>Crear una consulta</h2>
            <p className="public-muted">
              Completá todos los campos. En esta versión educativa el formulario
              genera una referencia local y no envía información a un soporte real.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label className="public-field">
                  <span>Nombre</span>
                  <input name="name" type="text" minLength={2} required />
                </label>

                <label className="public-field">
                  <span>Correo</span>
                  <input name="email" type="email" required />
                </label>
              </div>

              <label className="public-field">
                <span>Tipo de consulta</span>
                <select name="category" defaultValue="" required>
                  <option value="" disabled>Seleccioná una opción</option>
                  <option value="account">Cuenta y acceso</option>
                  <option value="operation">Depósitos, transferencias o cambios</option>
                  <option value="security">Seguridad</option>
                  <option value="suggestion">Sugerencia</option>
                  <option value="other">Otra consulta</option>
                </select>
              </label>

              <label className="public-field">
                <span>Mensaje</span>
                <textarea name="message" rows={6} minLength={15} required />
              </label>

              <button className="public-submit-button" type="submit">
                Registrar consulta
              </button>
            </form>

            {ticket && (
              <div className="public-success" role="status">
                <strong>Consulta registrada en modo demostración.</strong>
                <span>Referencia: {ticket}</span>
              </div>
            )}
          </section>

          <aside className="public-card public-help-card">
            <span className="public-card-icon">🧭</span>
            <h2>Antes de escribir</h2>
            <p>
              Muchas dudas se resuelven rápidamente con las respuestas frecuentes
              o con el instructivo de uso.
            </p>
            <Link className="public-primary-link" to="/preguntasfrecuentes">
              Ver preguntas frecuentes
            </Link>
            <Link className="public-secondary-link" to="/ayuda">
              Abrir instructivo
            </Link>

            <div className="public-note">
              <strong>No compartas datos sensibles.</strong>
              <p>
                Nunca incluyas contraseñas, códigos, tokens ni información bancaria
                en una consulta.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
