import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../../assets/PosibleLogo.png";
import beachBackground from "../../assets/PlayaPrincipal.png";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

import TravelIcon, {
  type TravelIconName,
} from "../ui/TravelIcon";

interface NavigationItem {
  label: string;
  path: string;
  icon: TravelIconName;
}

const navigation: NavigationItem[] = [
  {
    label: "Inicio",
    path: "/dashboard",
    icon: "home",
  },
  {
    label: "Billetera",
    path: "/transactions",
    icon: "wallet",
  },
  {
    label: "Intercambio",
    path: "/exchange",
    icon: "exchange",
  },
  {
    label: "Historial",
    path: "/history",
    icon: "history",
  },
  {
    label: "Próximamente",
    path: "/ayuda",
    icon: "rocket",
  },
  {
    label: "Nosotros",
    path: "/about-us",
    icon: "users",
  },
];

export default function PrivateLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const firstName =
    user?.name?.trim().split(/\s+/)[0] || "Viajero";

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "TG";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div
      className="tg-private-shell"
      style={{
        backgroundImage: `url(${beachBackground})`,
      }}
    >
      <div className="tg-private-shell__backdrop" />

      <button
        type="button"
        className={`tg-mobile-overlay ${
          mobileMenuOpen ? "is-visible" : ""
        }`}
        aria-label="Cerrar menú"
        tabIndex={mobileMenuOpen ? 0 : -1}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`tg-sidebar ${
          mobileMenuOpen ? "is-open" : ""
        }`}
        aria-label="Navegación principal"
      >
        <div className="tg-sidebar__brand">
          <button
            type="button"
            className="tg-sidebar__mobile-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <TravelIcon name="close" />
          </button>

          <img
            src={logo}
            alt="TravelGo"
            className="tg-sidebar__logo"
          />

          <div className="tg-sidebar__wordmark">
            <strong>travel</strong>
            <span>go</span>
          </div>
        </div>

        <nav className="tg-sidebar__navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "tg-sidebar__link",
                  isActive ? "is-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="tg-sidebar__link-icon">
                <TravelIcon name={item.icon} />
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div
          className="tg-sidebar__travel-card"
          aria-hidden="true"
        >
          <div className="tg-sidebar__travel-art">
            <span className="tg-sidebar__sun" />
            <span className="tg-sidebar__island" />
            <span className="tg-sidebar__palm">
              🌴
            </span>
          </div>

          <strong>Viajá por el mundo,</strong>

          <span>
            nosotros cuidamos tu dinero.
          </span>

          <div className="tg-sidebar__progress">
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="tg-sidebar__support">
          <span className="tg-sidebar__support-icon">
            <TravelIcon
              name="headset"
              size={25}
            />
          </span>

          <strong>¿Necesitás ayuda?</strong>

          <p>
            Nuestro equipo está disponible las 24 horas.
          </p>

          <button
            type="button"
            onClick={() => navigate("/contacto")}
          >
            Contactar soporte
          </button>
        </div>

        <button
          type="button"
          className="tg-sidebar__logout"
          onClick={handleLogout}
        >
          <TravelIcon
            name="logout"
            size={18}
          />

          Cerrar sesión
        </button>
      </aside>

      <div className="tg-private-main">
        <header className="tg-topbar">
          <button
            type="button"
            className="tg-topbar__menu"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <TravelIcon
              name="menu"
              size={23}
            />
          </button>

          <div className="tg-topbar__spacer" />

          <button
            type="button"
            className="tg-topbar__currency"
            aria-label="Moneda principal: dólar estadounidense"
          >
            <span
              className="fi fi-us"
              aria-hidden="true"
            />

            <strong>USD</strong>

            <TravelIcon
              name="chevron"
              size={16}
            />
          </button>

          <button
            type="button"
            className="tg-topbar__notification"
            aria-label="Notificaciones"
          >
            <TravelIcon
              name="bell"
              size={22}
            />

            <span>3</span>
          </button>

          <button
            type="button"
            className="tg-topbar__theme"
            onClick={toggleTheme}
            aria-label={
              isDark
                ? "Activar modo claro"
                : "Activar modo oscuro"
            }
            title={
              isDark
                ? "Modo claro"
                : "Modo oscuro"
            }
          >
            <TravelIcon
              name={isDark ? "sun" : "moon"}
              size={21}
            />
          </button>

          <button
            type="button"
            className="tg-topbar__profile"
            onClick={() => navigate("/perfil")}
            aria-label="Abrir perfil"
          >
            <span className="tg-topbar__avatar">
              {initials}
            </span>

            <span className="tg-topbar__user">
              <strong>{firstName}</strong>
              <small>En línea</small>
            </span>

            <TravelIcon
              name="chevron"
              size={16}
            />
          </button>
        </header>

        <main className="tg-private-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}