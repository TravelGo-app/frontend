import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

type ActionTone = "cyan" | "orange";
type StatTone =
  | "cyan"
  | "orange"
  | "purple"
  | "blue";

interface ActionCard {
  step: string;
  title: string;
  description: string;
  cta: string;
  icon: string;
  tone: ActionTone;
  path: string;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  spark: number[];
  icon: string;
  tone: StatTone;
}

interface JourneyItem {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  tone: ActionTone;
}

interface TrustItem {
  title: string;
  text: string;
  icon: string;
}

const ROUTE_PATH =
  "M 95 118 C 260 24, 390 22, 500 88 S 720 154, 905 48";

const actionCards: ActionCard[] = [
  {
    step: "01",
    title: "Depositar",
    description:
      "Agregá dinero a tu billetera TravelGo de forma rápida y segura.",
    cta: "Depositar ahora",
    icon: "+",
    tone: "cyan",
    path: "/deposit",
  },
  {
    step: "02",
    title: "Intercambiar",
    description:
      "Convertí tus monedas y aprovechá mejores tasas para tu próximo destino.",
    cta: "Intercambiar ahora",
    icon: "⇄",
    tone: "orange",
    path: "/exchange",
  },
  {
    step: "03",
    title: "Transferir",
    description:
      "Enviá dinero a otros usuarios o contactos en segundos, donde sea que estén.",
    cta: "Transferir ahora",
    icon: "↑",
    tone: "cyan",
    path: "/transfer",
  },
];

const statCards: StatCard[] = [
  {
    title: "Total de transacciones",
    value: "128",
    change: "↑ 18% vs. mes pasado",
    spark: [
      16, 22, 14, 19, 13, 17, 15, 23, 18,
      21,
    ],
    icon: "⇄",
    tone: "cyan",
  },
  {
    title: "Volumen total",
    value: "$ 3.245.780 ARS",
    change: "↑ 12% vs. mes pasado",
    spark: [
      12, 15, 14, 17, 13, 16, 14, 18, 15,
      17,
    ],
    icon: "⇅",
    tone: "orange",
  },
  {
    title: "Ticket promedio",
    value: "$ 25.357 ARS",
    change: "↑ 5% vs. mes pasado",
    spark: [
      8, 10, 9, 12, 10, 8, 11, 9, 12, 13,
    ],
    icon: "▮▮",
    tone: "purple",
  },
  {
    title: "Operación más usada",
    value: "Transferir",
    change: "42% del total de transacciones",
    spark: [
      10, 10, 12, 12, 14, 15, 16, 16, 17,
      18,
    ],
    icon: "★",
    tone: "blue",
  },
];

const journeyItems: JourneyItem[] = [
  {
    title: "Depositar",
    value: "+ $1.250.000",
    subtitle: "12 operaciones",
    icon: "+",
    tone: "cyan",
  },
  {
    title: "Intercambiar",
    value: "$2.120.500",
    subtitle: "28 operaciones",
    icon: "⇄",
    tone: "orange",
  },
  {
    title: "Transferir",
    value: "$1.980.750",
    subtitle: "58 operaciones",
    icon: "↑",
    tone: "cyan",
  },
  {
    title: "Próximo destino",
    value: "¡Seguí viajando!",
    subtitle: "",
    icon: "◎",
    tone: "cyan",
  },
];

const trustItems: TrustItem[] = [
  {
    title: "Transacciones seguras",
    text: "Protegemos tu dinero con tecnología de nivel bancario.",
    icon: "🛡",
  },
  {
    title: "Sin comisiones ocultas",
    text: "Transparencia total en cada operación que realices.",
    icon: "⚡",
  },
  {
    title: "Soporte 24/7",
    text: "Estamos para ayudarte en cada paso de tu viaje.",
    icon: "◉",
  },
];

function Sparkline({
  values,
  tone,
}: {
  values: number[];
  tone: StatTone;
}) {
  const maximum = Math.max(...values);
  const minimum = Math.min(...values);
  const difference = Math.max(
    maximum - minimum,
    1,
  );

  const points = values
    .map((value, index) => {
      const x =
        values.length <= 1
          ? 0
          : (index /
              (values.length - 1)) *
            100;

      const y =
        100 -
        ((value - minimum) / difference) *
          100;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`tg-transactions-sparkline is-${tone}`}
      aria-hidden="true"
    >
      <polyline points={points} />
    </svg>
  );
}

function FinancialRoute() {
  return (
    <svg
      className="tg-transactions-route__map"
      viewBox="0 0 1000 170"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="tg-transactions-route__path"
        pathLength={100}
        d={ROUTE_PATH}
      />

      <path
        className="tg-transactions-route__path-accent"
        pathLength={100}
        d={ROUTE_PATH}
      />

      <g className="tg-transactions-route__moving-plane">
        <path
          d="
            M -14 2
            L -4 -1
            L 3 -13
            L 7 -13
            L 5 -1
            L 16 4
            L 16 7
            L 5 5
            L 1 15
            L -3 15
            L -2 5
            L -14 7
            Z
          "
        />

        <animateMotion
          dur="8s"
          repeatCount="indefinite"
          rotate="auto"
          path={ROUTE_PATH}
        />
      </g>
    </svg>
  );
}

export default function Transactions() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const firstName = useMemo(() => {
    const name = user?.name?.trim();

    return name
      ? name.split(/\s+/)[0]
      : "Viajero";
  }, [user?.name]);

  return (
    <div className="tg-transactions-page">
      <section className="tg-transactions-hero">
        <button
          type="button"
          className="tg-transactions-back"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <span aria-hidden="true">←</span>
          Ir a Inicio
        </button>

        <div className="tg-transactions-hero__heading">
          <h1>Transacciones</h1>

          <p>
            Tu ruta{" "}
            <span>financiera</span> para
            viajar con claridad.
          </p>
        </div>

        <div className="tg-transactions-route">
          <FinancialRoute />

          {actionCards.map(
            (card, index) => (
              <div
                key={card.path}
                className={[
                  "tg-route-stop",
                  `is-${card.tone}`,
                  `is-stop-${index + 1}`,
                ].join(" ")}
              >
                <div className="tg-route-stop__pin">
                  <span>{card.icon}</span>
                </div>

                <article
                  className={`tg-action-card is-${card.tone}`}
                >
                  <span className="tg-action-card__step">
                    {card.step}
                  </span>

                  <div className="tg-action-card__icon">
                    {card.icon}
                  </div>

                  <h2>{card.title}</h2>

                  <p>
                    {card.description}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(card.path)
                    }
                  >
                    {card.cta}

                    <span aria-hidden="true">
                      →
                    </span>
                  </button>
                </article>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="tg-transactions-stats">
        {statCards.map((stat) => (
          <article
            key={stat.title}
            className={`tg-stat-card is-${stat.tone}`}
          >
            <div className="tg-stat-card__icon">
              {stat.icon}
            </div>

            <div className="tg-stat-card__body">
              <span>{stat.title}</span>

              <strong>{stat.value}</strong>

              <small>{stat.change}</small>

              <Sparkline
                values={stat.spark}
                tone={stat.tone}
              />
            </div>
          </article>
        ))}
      </section>

      <section className="tg-transactions-journey">
        <div className="tg-transactions-journey__header">
          <div>
            <h2>
              Tus viajes financieros
            </h2>

            <p>
              Así se movió tu dinero
              este mes.
            </p>
          </div>

          <button type="button">
            Este mes
            <span aria-hidden="true">
              ▾
            </span>
          </button>
        </div>

        <div className="tg-transactions-journey__line" />

        <div
          className="tg-transactions-journey__plane"
          aria-hidden="true"
        >
          ✈
        </div>

        <div className="tg-journey-grid">
          {journeyItems.map((item) => (
            <div
              key={item.title}
              className={`tg-journey-node is-${item.tone}`}
            >
              <div className="tg-journey-node__icon">
                {item.icon}
              </div>

              <strong>{item.value}</strong>

              <h3>{item.title}</h3>

              {item.subtitle && (
                <small>
                  {item.subtitle}
                </small>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="tg-transactions-trust">
        {trustItems.map((item) => (
          <article
            key={item.title}
            className="tg-trust-card"
          >
            <div className="tg-trust-card__icon">
              {item.icon}
            </div>

            <div>
              <h3>{item.title}</h3>

              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="tg-transactions-welcome">
        <div className="tg-transactions-welcome__badge">
          TravelGo
        </div>

        <div>
          <h2>
            {firstName}, seguí moviendo
            tu dinero con total control.
          </h2>

          <p>
            Depositá, intercambiá y
            transferí desde una misma
            experiencia visual, clara y
            pensada para viajar.
          </p>
        </div>
      </section>
    </div>
  );
}