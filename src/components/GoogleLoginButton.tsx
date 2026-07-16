import { useEffect, useRef, useState } from "react";
import { loginWithGoogle, type GoogleAuthResponse } from "../services/auth.service";

type CredentialResponse = {
  credential?: string;
};

type GoogleLoginButtonProps = {
  onAuthenticated: (result: GoogleAuthResponse) => void;
  onLoadingChange?: (loading: boolean) => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            ux_mode?: "popup" | "redirect";
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number;
              logo_alignment?: string;
            }
          ) => void;
        };
      };
    };
  }
}

// Guard a nivel de módulo: garantiza que window.google.accounts.id.initialize()
// se llame UNA SOLA VEZ en toda la app, sin importar cuántas veces se monte
// este componente.
let googleInitialized = false;

// El callback que window.google guarda internamente es el que existía en el
// momento de initialize(). Si esa función usa directamente las props
// (onAuthenticated, onLoadingChange) capturadas por closure, queda "pegada"
// a los valores del primer render para siempre — por eso en vez de eso,
// el callback real llama a esta referencia a nivel de módulo, que cada
// instancia de GoogleLoginButton actualiza en cada uno de sus renders.
// Así el callback SIEMPRE ejecuta la lógica más reciente.
let activeHandlers: {
  onAuthenticated: (result: GoogleAuthResponse) => void;
  onLoadingChange?: (loading: boolean) => void;
} | null = null;

export function GoogleLoginButton({ onAuthenticated, onLoadingChange }: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  // Actualiza los handlers activos en cada render, para que el callback de
  // Google (que solo existe una vez) siempre invoque la versión más
  // reciente de onAuthenticated/onLoadingChange de la instancia que está
  // realmente montada y visible.
  useEffect(() => {
    activeHandlers = { onAuthenticated, onLoadingChange };
  });

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) { setError("VITE_GOOGLE_CLIENT_ID no está configurada"); return }

    const handleCredential = async (response: CredentialResponse) => {
      // Bloquea que la misma credencial (o clicks rápidos duplicados) se
      // procese más de una vez en simultáneo.
      if (processingRef.current) return;
      processingRef.current = true;

      const handlers = activeHandlers;
      handlers?.onLoadingChange?.(true);

      try {
        setError(null);
        if (!response.credential) throw new Error("Google no devolvió una credencial");
        const result = await loginWithGoogle(response.credential);
        handlers?.onAuthenticated(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error iniciando sesión");
        handlers?.onLoadingChange?.(false);
      } finally {
        processingRef.current = false;
      }
    };

    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) { setError("No se pudo cargar Google Identity"); return }
      buttonRef.current.innerHTML = "";

      if (!googleInitialized) {
        googleInitialized = true;
        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          callback: handleCredential,
        });
      }

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 320,
      });
    };

    if (window.google) { renderGoogleButton(); return }
    const interval = window.setInterval(() => {
      if (window.google) { window.clearInterval(interval); renderGoogleButton() }
    }, 100);
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval)
      if (!window.google) setError("No se pudo cargar Google Identity")
    }, 10000);
    return () => { window.clearInterval(interval); window.clearTimeout(timeout) }
  }, [])

  return (
    <div>
      <div ref={buttonRef} />
      {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}