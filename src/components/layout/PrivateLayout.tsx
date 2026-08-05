import {
  useEffect,
  useRef,
  useState,
} from "react";

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

import api from "../../services/api";

import TravelIcon, {
  type TravelIconName,
} from "../ui/TravelIcon";

interface NavigationItem {
  label: string;
  path: string;
  icon: TravelIconName;
}

interface RecentTransaction {
  id: string;
  type: "deposit" | "transfer" | "exchange";
  direction: "in" | "out" | "exchange";
  amount: string | null;
  signedAmount: string | null;
  currencyCode: string | null;
  counterpartyEmail: string | null;
  fromCurrency: string | null;
  toCurrency: string | null;
  createdAt: string;
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

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const difference =
    Date.now() - date.getTime();

  const minutes = Math.floor(
    difference / 60_000,
  );

  if (minutes < 1) {
    return "Ahora";
  }

  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `Hace ${hours} h`;
  }

  return date.toLocaleDateString(
    "es-AR",
    {
      day: "2-digit",
      month: "short",
    },
  );
}

function getNotificationPresentation(
  transaction: RecentTransaction,
): {
  title: string;
  description: string;
  icon: TravelIconName;
  tone: "cyan" | "orange" | "green";
} {
  if (transaction.type === "exchange") {
    return {
      title: "Intercambio realizado",
      description:
        transaction.fromCurrency &&
        transaction.toCurrency
          ? `${transaction.fromCurrency} → ${transaction.toCurrency}`
          : "Conversión de monedas",
      icon: "exchange",
      tone: "cyan",
    };
  }

  if (transaction.type === "deposit") {
    return {
      title: "Depósito recibido",
      description:
        transaction.currencyCode
          ? `Saldo en ${transaction.currencyCode}`
          : "Saldo actualizado",
      icon: "plus",
      tone: "green",
    };
  }

  if (transaction.direction === "out") {
    return {
      title: "Transferencia enviada",
      description:
        transaction.counterpartyEmail ??
        "Transferencia realizada",
      icon: "arrow-up",
      tone: "orange",
    };
  }

  return {
    title: "Transferencia recibida",
    description:
      transaction.counterpartyEmail ??
      "Transferencia acreditada",
    icon: "arrow-down",
    tone: "green",
  };
}

export default function PrivateLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const [
    profileMenuOpen,
    setProfileMenuOpen,
  ] = useState(false);

  const [
    notificationsSeen,
    setNotificationsSeen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState<RecentTransaction[]>([]);

  const [
    notificationsError,
    setNotificationsError,
  ] = useState(false);

  const notificationsRef =
    useRef<HTMLDivElement>(null);

  const profileMenuRef =
    useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } =
    useTheme();

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    "Viajero";

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join("") || "TG";

  const notificationCount =
    notificationsSeen
      ? 0
      : notifications.length;

  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let mounted = true;

    api
      .get(
        "/transactions/recent?limit=5",
      )
      .then((response) => {
        if (!mounted) {
          return;
        }

        setNotifications(
          response.data.transactions ?? [],
        );

        setNotificationsError(false);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setNotifications([]);
        setNotificationsError(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      !mobileMenuOpen &&
      !notificationsOpen &&
      !profileMenuOpen
    ) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key !== "Escape") {
        return;
      }

      setMobileMenuOpen(false);
      setNotificationsOpen(false);
      setProfileMenuOpen(false);
    };

    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(
          target,
        )
      ) {
        setNotificationsOpen(false);
      }

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          target,
        )
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    if (mobileMenuOpen) {
      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );

      document.body.style.overflow = "";
    };
  }, [
    mobileMenuOpen,
    notificationsOpen,
    profileMenuOpen,
  ]);

  const handleLogout = () => {
    logout();

    navigate("/", {
      replace: true,
    });
  };

  const toggleNotifications = () => {
    setNotificationsOpen(
      (current) => !current,
    );

    setProfileMenuOpen(false);
    setNotificationsSeen(true);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(
      (current) => !current,
    );

    setNotificationsOpen(false);
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
          mobileMenuOpen
            ? "is-visible"
            : ""
        }`}
        aria-label="Cerrar menú"
        tabIndex={
          mobileMenuOpen ? 0 : -1
        }
        onClick={() =>
          setMobileMenuOpen(false)
        }
      />

      <aside
        className={`tg-sidebar ${
          mobileMenuOpen
            ? "is-open"
            : ""
        }`}
        aria-label="Navegación principal"
      >
        <div className="tg-sidebar__brand">
          <button
            type="button"
            className="tg-sidebar__mobile-close"
            onClick={() =>
              setMobileMenuOpen(false)
            }
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
              className={({
                isActive,
              }) =>
                [
                  "tg-sidebar__link",
                  isActive
                    ? "is-active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="tg-sidebar__link-icon">
                <TravelIcon
                  name={item.icon}
                />
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

          <strong>
            Viajá por el mundo,
          </strong>

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

          <strong>
            ¿Necesitás ayuda?
          </strong>

          <p>
            Nuestro equipo está disponible
            las 24 horas.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/contacto")
            }
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
            onClick={() =>
              setMobileMenuOpen(true)
            }
            aria-label="Abrir menú"
          >
            <TravelIcon
              name="menu"
              size={23}
            />
          </button>

          <div className="tg-topbar__spacer" />

          <div
            className="tg-topbar__dropdown-wrap"
            ref={notificationsRef}
          >
            <button
              type="button"
              className="tg-topbar__notification"
              aria-label="Abrir actividad reciente"
              aria-haspopup="menu"
              aria-expanded={
                notificationsOpen
              }
              onClick={toggleNotifications}
            >
              <TravelIcon
                name="bell"
                size={22}
              />

              {notificationCount > 0 && (
                <span>
                  {notificationCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div
                className="tg-topbar__dropdown tg-notifications-menu"
                role="menu"
              >
                <header className="tg-notifications-menu__header">
                  <div>
                    <strong>
                      Actividad reciente
                    </strong>

                    <small>
                      Últimos movimientos
                    </small>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/history")
                    }
                  >
                    Ver historial
                  </button>
                </header>

                <div className="tg-notifications-menu__list">
                  {notificationsError ? (
                    <p className="tg-topbar__dropdown-state">
                      No se pudo consultar la
                      actividad.
                    </p>
                  ) : notifications.length ===
                    0 ? (
                    <p className="tg-topbar__dropdown-state">
                      No hay movimientos
                      recientes.
                    </p>
                  ) : (
                    notifications.map(
                      (transaction) => {
                        const presentation =
                          getNotificationPresentation(
                            transaction,
                          );

                        return (
                          <button
                            type="button"
                            key={transaction.id}
                            className="tg-notification-item"
                            onClick={() =>
                              navigate(
                                "/history",
                              )
                            }
                          >
                            <span
                              className={`tg-notification-item__icon is-${presentation.tone}`}
                            >
                              <TravelIcon
                                name={
                                  presentation.icon
                                }
                                size={17}
                              />
                            </span>

                            <span className="tg-notification-item__copy">
                              <strong>
                                {
                                  presentation.title
                                }
                              </strong>

                              <small>
                                {
                                  presentation.description
                                }
                              </small>
                            </span>

                            <time>
                              {formatRelativeTime(
                                transaction.createdAt,
                              )}
                            </time>
                          </button>
                        );
                      },
                    )
                  )}
                </div>
              </div>
            )}
          </div>

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
              name={
                isDark
                  ? "sun"
                  : "moon"
              }
              size={21}
            />
          </button>

          <div
            className="tg-topbar__dropdown-wrap"
            ref={profileMenuRef}
          >
            <button
              type="button"
              className="tg-topbar__profile"
              onClick={toggleProfileMenu}
              aria-label="Abrir menú de usuario"
              aria-haspopup="menu"
              aria-expanded={
                profileMenuOpen
              }
            >
              <span className="tg-topbar__avatar">
                {initials}
              </span>

              <span className="tg-topbar__user">
                <strong>
                  {firstName}
                </strong>

                <small>En línea</small>
              </span>

              <TravelIcon
                name="chevron"
                size={16}
              />
            </button>

            {profileMenuOpen && (
              <div
                className="tg-topbar__dropdown tg-profile-menu"
                role="menu"
              >
                <div className="tg-profile-menu__identity">
                  <span className="tg-topbar__avatar">
                    {initials}
                  </span>

                  <div>
                    <strong>
                      {user?.name ??
                        firstName}
                    </strong>

                    <small>
                      {user?.email}
                    </small>
                  </div>
                </div>

                <div className="tg-profile-menu__separator" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    navigate("/perfil")
                  }
                >
                  <TravelIcon
                    name="users"
                    size={18}
                  />

                  Editar perfil
                </button>

                <button
                  type="button"
                  role="menuitem"
                  className="is-danger"
                  onClick={handleLogout}
                >
                  <TravelIcon
                    name="logout"
                    size={18}
                  />

                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="tg-private-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}