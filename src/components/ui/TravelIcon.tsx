import type { SVGProps } from "react";

export type TravelIconName =
  | "home"
  | "dashboard"
  | "wallet"
  | "exchange"
  | "history"
  | "rocket"
  | "users"
  | "bell"
  | "chevron"
  | "sun"
  | "moon"
  | "menu"
  | "close"
  | "headset"
  | "logout"
  | "shield"
  | "globe"
  | "percent"
  | "send"
  | "plus"
  | "arrow-up"
  | "arrow-down"
  | "location"
  | "eye"
  | "mail";

interface TravelIconProps extends SVGProps<SVGSVGElement> {
  name: TravelIconName;
  size?: number;
}

export default function TravelIcon({
  name,
  size = 20,
  ...props
}: TravelIconProps) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };

  switch (name) {
    case "home":
      return (
        <svg {...commonProps}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5.5 9.5V21h13V9.5" />
          <path d="M9.5 21v-6h5v6" />
        </svg>
      );

    case "dashboard":
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );

    case "wallet":
      return (
        <svg {...commonProps}>
          <path d="M4 6.5h14a2 2 0 0 1 2 2V19H6a2 2 0 0 1-2-2V6.5Z" />
          <path d="M4 7V5a2 2 0 0 1 2-2h11" />
          <path d="M15 12h5v4h-5a2 2 0 0 1 0-4Z" />
        </svg>
      );

    case "exchange":
      return (
        <svg {...commonProps}>
          <path d="M7 7h12l-3-3" />
          <path d="m19 7-3 3" />
          <path d="M17 17H5l3 3" />
          <path d="m5 17 3-3" />
        </svg>
      );

    case "history":
      return (
        <svg {...commonProps}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "rocket":
      return (
        <svg {...commonProps}>
          <path d="M14 5c3.5-3.5 6.5-2 6.5-2s1.5 3-2 6.5l-4.5 4.5-4-4L14 5Z" />
          <path d="m9 11-4 1-2 2 5 1" />
          <path d="m13 15-1 4-2 2-1-5" />
          <circle cx="16.5" cy="6.5" r="1.5" />
        </svg>
      );

    case "users":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20" />
          <path d="M16 5.5a3 3 0 0 1 0 5.5" />
          <path d="M17 14a4 4 0 0 1 3.5 4V20" />
        </svg>
      );

    case "bell":
      return (
        <svg {...commonProps}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...commonProps}>
          <path d="m9 10 3 3 3-3" />
        </svg>
      );

    case "sun":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.42 1.42" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M4.93 19.07l1.42-1.42" />
          <path d="M17.66 6.34l1.41-1.41" />
        </svg>
      );

    case "moon":
      return (
        <svg {...commonProps}>
          <path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6a8.5 8.5 0 1 0 11.6 11.6Z" />
        </svg>
      );

    case "menu":
      return (
        <svg {...commonProps}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );

    case "close":
      return (
        <svg {...commonProps}>
          <path d="m6 6 12 12" />
          <path d="M18 6 6 18" />
        </svg>
      );

    case "headset":
      return (
        <svg {...commonProps}>
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <path d="M4 14h3v6H5a1 1 0 0 1-1-1v-5Z" />
          <path d="M20 14h-3v6h2a1 1 0 0 0 1-1v-5Z" />
          <path d="M17 20c0 1-1.2 2-3 2h-2" />
        </svg>
      );

    case "logout":
      return (
        <svg {...commonProps}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
        </svg>
      );

    case "shield":
      return (
        <svg {...commonProps}>
          <path d="M12 3 4.5 6v5.5c0 4.7 3.1 8 7.5 9.5 4.4-1.5 7.5-4.8 7.5-9.5V6L12 3Z" />
          <path d="m9 12 2 2 4-5" />
        </svg>
      );

    case "globe":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 0 1 0 18" />
          <path d="M12 3a15 15 0 0 0 0 18" />
        </svg>
      );

    case "percent":
      return (
        <svg {...commonProps}>
          <circle cx="7" cy="7" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="m6 18 12-12" />
        </svg>
      );

    case "send":
      return (
        <svg {...commonProps}>
          <path d="m22 2-7 20-4-9-9-4 20-7Z" />
          <path d="m22 2-11 11" />
        </svg>
      );

    case "plus":
      return (
        <svg {...commonProps}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "arrow-up":
      return (
        <svg {...commonProps}>
          <path d="m6 10 6-6 6 6" />
          <path d="M12 4v16" />
        </svg>
      );

    case "arrow-down":
      return (
        <svg {...commonProps}>
          <path d="m6 14 6 6 6-6" />
          <path d="M12 20V4" />
        </svg>
      );

    case "location":
      return (
        <svg {...commonProps}>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );

    case "eye":
      return (
        <svg {...commonProps}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );

    case "mail":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );

    default:
      return null;
  }
}