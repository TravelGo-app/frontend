import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/PosibleLogo.png";

const navItems = [
  {
    label: "Inicio",
    path: "/home",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10.5L12 3L21 10.5V21C21 21.5523 20.5523 22 20 22H4C3.4477 22 3 21.5523 3 21V10.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 22V13.5H15V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Billetera",
    path: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7H21V17C21 18.1046 20.1046 19 19 19H5C3.8954 19 3 18.1046 3 17V7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 7L3 5C3 3.8954 3.8954 3 5 3H19C20.1046 3 21 3.8954 21 5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 12.5H16.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Transacciones",
    path: "/transactions",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 3L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 15L12 21L18 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 3V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Historial",
    path: "/history",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12L15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.0294 21 3 16.9706 3 12C3 7.0294 7.0294 3 12 3C16.9706 3 21 7.0294 21 12Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: "Nosotros",
    path: "/sobre nosotros",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21V19C16 17.8954 15.1046 17 14 17H10C8.8954 17 8 17.8954 8 19V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 11C13.6569 11 15 9.6569 15 8C15 6.3431 13.6569 5 12 5C10.3431 5 9 6.3431 9 8C9 9.6569 10.3431 11 12 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 21V19C19 17.3431 17.6569 16 16 16H8C6.3431 16 5 17.3431 5 19V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const normalizePath = (pathname: string) => decodeURIComponent(pathname).replace(/\/+$/g, "");

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const activePath = normalizePath(location.pathname);

  const menuButtonStyles = {
    position: "fixed",
    top: 18,
    left: 18,
    zIndex: 1001,
    width: 46,
    height: 46,
    borderRadius: 18,
    border: "1px solid rgba(148, 163, 184, 0.22)",
    background: "rgba(255,255,255,0.94)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 22px 48px rgba(15, 23, 42, 0.12)",
    cursor: "pointer",
    backdropFilter: "blur(14px)",
  } as const;

  const asideStyles = {
    position: "fixed",
    top: 18,
    left: 18,
    bottom: 18,
    width: 300,
    maxWidth: "calc(100vw - 32px)",
    borderRadius: 36,
    background: "rgba(255, 255, 255, 0.98)",
    transform: isOpen ? "translateX(0)" : "translateX(-120%)",
    transition: "transform 280ms ease",
    zIndex: 1000,
    padding: "26px 20px 24px",
    boxShadow: "0 34px 80px rgba(15, 23, 42, 0.14)",
    overflowY: "auto",
    border: "1px solid rgba(226, 232, 240, 0.95)",
    backdropFilter: "blur(18px)",
  } as const;

  const linkBaseStyles = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    borderRadius: 24,
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 700,
    letterSpacing: "0.01em",
    transform: "translateZ(0)",
    transition: "transform 180ms ease, box-shadow 180ms ease, background 180ms ease",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
    background: "#ffffff",
  } as const;

  const iconBadgeStyles = (active?: boolean) => ({
    width: 42,
    minWidth: 42,
    height: 42,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    background: active ? "linear-gradient(135deg, #fb7185, #f97316)" : "rgba(14, 165, 233, 0.12)",
    color: active ? "#ffffff" : "#0369a1",
  } as const);

  const closeButtonStyles = {
    border: "none",
    background: "rgba(15, 23, 42, 0.05)",
    cursor: "pointer",
    padding: 0,
    width: 36,
    height: 36,
    borderRadius: 14,
    color: "#0f172a",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
  } as const;

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menú"
          style={menuButtonStyles}
        >
          <div style={{ display: "grid", gap: 4 }}>
            <span style={{ width: 20, height: 2, background: "#0f172a", borderRadius: 999 }} />
            <span style={{ width: 20, height: 2, background: "#0f172a", borderRadius: 999 }} />
            <span style={{ width: 20, height: 2, background: "#0f172a", borderRadius: 999 }} />
          </div>
        </button>
      )}

      <aside style={asideStyles}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none" }}
          >
            <img src={logo} alt="TravelGo" style={{ width: 44, height: 44, objectFit: "contain" }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#475569", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                TravelGo
              </p>
              <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                Mis finanzas
              </p>
            </div>
          </Link>

          <button onClick={() => setIsOpen(false)} aria-label="Cerrar menú" style={closeButtonStyles}>
            ×
          </button>
        </div>

        <div style={{ marginTop: 22, color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
          Navega rápido entre tu wallet, transferencias e historial.
        </div>

        <nav style={{ display: "grid", gap: 14, marginTop: 24 }}>
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                style={{
                  ...linkBaseStyles,
                  background: isActive ? "rgba(251, 113, 133, 0.15)" : "#ffffff",
                  color: isActive ? "#B91C1C" : "#0F172A",
                  boxShadow: isActive ? "0 28px 70px rgba(251, 113, 133, 0.18)" : "0 12px 28px rgba(15, 23, 42, 0.06)",
                  transform: isActive ? "translateX(1px)" : undefined,
                }}
              >
                <span style={iconBadgeStyles(isActive)}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 180,
            pointerEvents: "none",
            background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(254, 247, 237, 0.95) 50%, rgba(255, 246, 239, 1) 100%)",
            borderBottomLeftRadius: 36,
            borderBottomRightRadius: 36,
          }}
        >
          <svg width="100%" height="180" viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path d="M0 90C70 120 110 135 160 135C210 135 250 120 320 90V180H0V90Z" fill="#bae6fd" opacity="0.66" />
            <path d="M0 110C70 140 110 155 160 155C210 155 250 140 320 110V180H0V110Z" fill="#7dd3fc" opacity="0.34" />
            <path d="M0 130C70 152 110 166 160 166C210 166 250 152 320 130V180H0V130Z" fill="#38bdf8" opacity="0.18" />
          </svg>
        </div>
      </aside>
    </>
  );
}
