import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "💳",
    accent: "",
    title: "Saldos en distintas monedas",
    text: "Visualizá pesos argentinos y monedas extranjeras desde un único lugar, con balances claros y organizados.",
  },
  {
    icon: "🔄",
    accent: "oceano",
    title: "Intercambio de monedas",
    text: "Practicá conversiones y comprendé cuánto representa tu dinero en la moneda del país que vas a visitar.",
  },
  {
    icon: "📤",
    accent: "terracota",
    title: "Transferencias internas",
    text: "Enviá saldo mediante email, alias o CVU TravelGo, de forma rápida y sencilla.",
  },
  {
    icon: "📊",
    accent: "oceano",
    title: "Movimientos y gráficos",
    text: "Revisá cómo evolucionan tus saldos y observá estadísticas construidas con tus propias operaciones.",
  },
  {
    icon: "🪪",
    accent: "",
    title: "Perfil e identidad TravelGo",
    text: "Administrá tus datos, tu alias y tu CVU TravelGo para operar dentro de la plataforma.",
  },
  {
    icon: "🤖",
    accent: "terracota",
    title: "Asistente virtual",
    text: "Consultá dudas sobre TravelGo, monedas y funcionalidades mediante el chatbot integrado.",
  },
];

const STEPS = [
  {
    title: "Creás tu cuenta",
    text: "Configurás tu perfil y recibís tu alias y CVU TravelGo.",
  },
  {
    title: "Agregás saldo",
    text: "Practicás con montos virtuales sin utilizar dinero bancario real.",
  },
  {
    title: "Intercambiás monedas",
    text: "Comprendés cómo impacta una conversión antes de viajar.",
  },
  {
    title: "Revisás tus movimientos",
    text: "Consultás balances, actividad y gráficos basados en tus operaciones.",
  },
];

export default function AboutUs() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    container
      .querySelectorAll("[data-reveal]")
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="about-page">
      <section className="about-shell about-hero" id="que-es">
        <div data-reveal>
          <span className="about-eyebrow">
            <span className="about-eyebrow-dot"></span>
            Pensado para turistas argentinos
          </span>

          <h1 className="about-h1">
            Viajá con claridad,{" "}
            <span className="about-gradient-text">
              sin perderte entre monedas.
            </span>
          </h1>

          <p className="about-hero-copy">
            TravelGo es una billetera digital que ayuda al turista argentino a
            comprender, organizar y practicar el uso de diferentes monedas antes
            y durante un viaje al exterior.
          </p>

          <div className="about-actions">
            <button
              className="about-button about-button-primary"
              onClick={() => scrollTo("funciones")}
            >
              Descubrir TravelGo →
            </button>
            <button
              className="about-button about-button-secondary"
              onClick={() => scrollTo("como-funciona")}
            >
              Ver cómo funciona
            </button>
          </div>
        </div>

        <div className="about-visual" data-reveal>
          <div className="about-glow"></div>

          <div className="about-dot about-dot-1"></div>
          <div className="about-dot about-dot-2"></div>
          <div className="about-dot about-dot-3"></div>
          <div className="about-dashed-line"></div>

          <div className="about-floating-card about-floating-card-chart">
            <div style={{ position: "relative" }}>
              <span className="about-floating-badge">+3.4%</span>
              <div className="about-mini-bars">
                <span style={{ height: "40%" }}></span>
                <span style={{ height: "65%" }}></span>
                <span style={{ height: "50%" }}></span>
                <span style={{ height: "85%" }}></span>
                <span style={{ height: "70%" }}></span>
              </div>
            </div>
          </div>

          <div className="about-floating-card about-floating-card-list">
            <div className="about-mini-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="about-phone">
            <div className="about-phone-button about-phone-button-left-1"></div>
            <div className="about-phone-button about-phone-button-left-2"></div>
            <div className="about-phone-button about-phone-button-right"></div>

            <div className="about-phone-screen">
              <div className="about-phone-notch">
                <div className="about-phone-notch-dot"></div>
              </div>
              <div className="about-phone-glare"></div>
              <div className="about-phone-home-indicator"></div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#5b6b7d",
                  fontSize: "0.8rem",
                }}
              >
                <span>9:41</span>
                <span>●●● ▰</span>
              </div>

              <div
                style={{
                  marginTop: 26,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    color: "#fff",
                    background:
                      "linear-gradient(135deg, var(--color-terracota), var(--color-coral))",
                  }}
                >
                  TG
                </div>
                <div>
                  <strong style={{ display: "block" }}>¡Hola, viajero!</strong>
                  <span style={{ color: "#5b6b7d", fontSize: "0.8rem" }}>
                    Tu viaje comienza acá
                  </span>
                </div>
              </div>

              <div className="about-balance-card">
                <small style={{ opacity: 0.88 }}>Saldo disponible</small>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    margin: "6px 0 10px",
                  }}
                >
                  $ 250.000 ARS
                </div>
                <div
                  className="about-currency-pills"
                  style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                >
                  <span>ARS</span>
                  <span>USD</span>
                  <span>BRL</span>
                  <span>EUR</span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <div className="about-mini-action">↓ Depositar</div>
                <div className="about-mini-action">→ Transferir</div>
                <div className="about-mini-action">⇄ Cambiar</div>
              </div>

              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  border: "1px solid rgba(35,52,70,0.12)",
                  borderRadius: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "#5b6b7d",
                  }}
                >
                  <strong style={{ color: "#233446" }}>
                    Actividad del viaje
                  </strong>
                  <span>Últimos 7 días</span>
                </div>
                <div className="about-bars">
                  <span style={{ height: "35%" }}></span>
                  <span style={{ height: "58%" }}></span>
                  <span style={{ height: "44%" }}></span>
                  <span style={{ height: "72%" }}></span>
                  <span style={{ height: "61%" }}></span>
                  <span style={{ height: "88%" }}></span>
                  <span style={{ height: "76%" }}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section" id="funciones">
        <div className="about-shell">
          <div className="about-section-heading" data-reveal>
            <h2>Todo lo necesario para comprender tu dinero en otro país.</h2>
            <p>
              TravelGo concentra operaciones, cotizaciones, movimientos y
              herramientas visuales en una experiencia simple y pensada para
              viajar.
            </p>
          </div>

          <div className="about-features">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="about-feature-card"
                data-reveal
              >
                <div className={`about-icon-box ${feature.accent}`}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="como-funciona">
        <div className="about-shell about-journey">
          <article className="about-story-card" data-reveal>
            <blockquote>
              "Viajo a Brasil, tengo pesos argentinos y quiero entender mejor
              cuánto puedo gastar."
            </blockquote>
            <p>
              TravelGo transforma esa duda cotidiana en una experiencia visual,
              práctica y fácil de comprender.
            </p>
          </article>

          <article className="about-steps-card" data-reveal>
            <div className="about-steps">
              {STEPS.map((step, index) => (
                <div className="about-step" key={step.title}>
                  <div className="about-step-number">{index + 1}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="about-section" id="proposito">
        <div className="about-shell">
          <div className="about-purpose" data-reveal>
            <h2>Que viajar con distintas monedas sea más fácil de entender.</h2>
            <p>
              TravelGo combina simulación, herramientas visuales y una
              experiencia sencilla para ayudar al turista argentino a
              planificar, practicar y tomar decisiones con mayor claridad.
            </p>
          </div>

          <div className="about-disclaimer" data-reveal>
            <div className="about-disclaimer-icon">⚠️</div>
            <div>
              <strong>Aviso importante</strong>
              <p>
                TravelGo es una plataforma educativa y demostrativa. Los saldos,
                depósitos, transferencias, intercambios, alias y CVU utilizados
                son simulados y no representan dinero, cuentas bancarias ni
                operaciones financieras reales.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }} data-reveal>
            <button
              className="about-button about-button-primary"
              onClick={() => navigate("/register")}
            >
              Comenzá tu viaje →
            </button>
          </div>
        </div>
      </section>

      <footer className="about-footer">
        <div className="about-shell about-footer-inner">
          <span>© {new Date().getFullYear()} TravelGo</span>
          <span>Una experiencia para viajar con mayor claridad.</span>
        </div>
      </footer>
    </div>
  );
}
