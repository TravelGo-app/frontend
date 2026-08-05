import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useTheme } from "../context/ThemeContext";

import {
  loginWithGoogle,
  type GoogleAuthResponse,
} from "../services/auth.service";

type CredentialResponse = {
  credential?: string;
};

type GoogleButtonTheme =
  | "outline"
  | "filled_blue"
  | "filled_black";

type GoogleButtonShape =
  | "rectangular"
  | "pill"
  | "circle"
  | "square";

type GoogleLoginButtonProps = {
  onAuthenticated: (
    result: GoogleAuthResponse,
  ) => void;

  onLoadingChange?: (
    loading: boolean,
  ) => void;
};

interface ActiveGoogleHandlers {
  onAuthenticated: (
    result: GoogleAuthResponse,
  ) => void;

  onLoadingChange?: (
    loading: boolean,
  ) => void;

  setError: (
    message: string | null,
  ) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;

            callback: (
              response: CredentialResponse,
            ) => void;

            ux_mode?: "popup" | "redirect";
          }) => void;

          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon";

              theme?: GoogleButtonTheme;

              size?:
                | "large"
                | "medium"
                | "small";

              text?:
                | "signin_with"
                | "signup_with"
                | "continue_with"
                | "signin";

              shape?: GoogleButtonShape;

              width?: number;

              logo_alignment?:
                | "left"
                | "center";
            },
          ) => void;
        };
      };
    };
  }
}

let googleInitialized = false;
let googleProcessing = false;

let activeHandlers:
  | ActiveGoogleHandlers
  | null = null;

async function processGoogleCredential(
  response: CredentialResponse,
) {
  if (googleProcessing) {
    return;
  }

  googleProcessing = true;

  const handlers = activeHandlers;

  handlers?.onLoadingChange?.(true);
  handlers?.setError(null);

  try {
    if (!response.credential) {
      throw new Error(
        "Google no devolvió una credencial.",
      );
    }

    const result =
      await loginWithGoogle(
        response.credential,
      );

    handlers?.onAuthenticated(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo iniciar sesión con Google.";

    handlers?.setError(message);
    handlers?.onLoadingChange?.(false);
  } finally {
    googleProcessing = false;
  }
}

export function GoogleLoginButton({
  onAuthenticated,
  onLoadingChange,
}: GoogleLoginButtonProps) {
  const { isDark } = useTheme();

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const buttonRef =
    useRef<HTMLDivElement>(null);

  const [buttonWidth, setButtonWidth] =
    useState(320);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    activeHandlers = {
      onAuthenticated,
      onLoadingChange,
      setError,
    };

    return () => {
      if (
        activeHandlers?.onAuthenticated ===
        onAuthenticated
      ) {
        activeHandlers = null;
      }
    };
  }, [
    onAuthenticated,
    onLoadingChange,
  ]);

  useEffect(() => {
    const updateButtonWidth = () => {
      const measuredWidth =
        wrapperRef.current?.clientWidth;

      if (
        !measuredWidth ||
        measuredWidth <= 0
      ) {
        return;
      }

      const nextWidth = Math.floor(
        Math.min(
          480,
          Math.max(
            200,
            measuredWidth,
          ),
        ),
      );

      setButtonWidth(
        (currentWidth) =>
          currentWidth === nextWidth
            ? currentWidth
            : nextWidth,
      );
    };

    const animationFrame =
      window.requestAnimationFrame(
        updateButtonWidth,
      );

    if (
      typeof ResizeObserver !==
      "undefined"
    ) {
      const observer =
        new ResizeObserver(() => {
          updateButtonWidth();
        });

      if (wrapperRef.current) {
        observer.observe(
          wrapperRef.current,
        );
      }

      return () => {
        window.cancelAnimationFrame(
          animationFrame,
        );

        observer.disconnect();
      };
    }

    window.addEventListener(
      "resize",
      updateButtonWidth,
    );

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      window.removeEventListener(
        "resize",
        updateButtonWidth,
      );
    };
  }, []);

  useEffect(() => {
    const clientId =
      import.meta.env
        .VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError(
        "VITE_GOOGLE_CLIENT_ID no está configurada.",
      );

      return;
    }

    const renderGoogleButton = () => {
      if (
        !window.google ||
        !buttonRef.current
      ) {
        return false;
      }

      buttonRef.current.innerHTML = "";

      if (!googleInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          callback:
            processGoogleCredential,
        });

        googleInitialized = true;
      }

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          type: "standard",

          theme: isDark
            ? "filled_black"
            : "outline",

          size: "large",
          text: "continue_with",
          shape: "pill",
          width: buttonWidth,
          logo_alignment: "left",
        },
      );

      setError(null);

      return true;
    };

    if (renderGoogleButton()) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        if (renderGoogleButton()) {
          window.clearInterval(
            intervalId,
          );
        }
      }, 100);

    const timeoutId =
      window.setTimeout(() => {
        window.clearInterval(
          intervalId,
        );

        if (!window.google) {
          setError(
            "No se pudo cargar Google Identity.",
          );
        }
      }, 10_000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [
    buttonWidth,
    isDark,
  ]);

  return (
    <div
      ref={wrapperRef}
      className="tg-google-button"
    >
      <div
        ref={buttonRef}
        className="tg-google-button__render"
      />

      {error && (
        <p
          className="tg-google-button__error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}