import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const accessibleLabel = isDark
    ? "Cambiar a modo claro"
    : "Cambiar a modo oscuro";

  return (
    <button
      type="button"
      className="tg-theme-toggle"
      onClick={toggleTheme}
      aria-label={accessibleLabel}
      title={accessibleLabel}
    >
      <span className="tg-theme-toggleicon" aria-hidden="true">
        {isDark ? (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2 M12 20v2 M4.93 4.93l1.42 1.42 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.42-1.42 M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" />
          </svg>
        )}
      </span>

      <span className="tg-theme-togglelabel">
        {isDark ? "Modo claro" : "Modo oscuro"}
      </span>

      <span
        className={
          isDark
            ? "tg-theme-toggleswitch tg-theme-toggleswitch--dark"
            : "tg-theme-toggleswitch"
        }
        aria-hidden="true"
      >
        <span className="tg-theme-togglethumb" />
      </span>
    </button>
  );
}
