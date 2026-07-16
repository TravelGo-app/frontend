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

// Guard a nivel de módulo: compartido entre TODAS las instancias de
// GoogleLoginButton, aunque haya más de una montada al mismo tiempo
// (por ejemplo, Login y Register renderizados juntos en el panel deslizante).
// Un useRef normal no sirve acá porque cada instancia tendría el suyo propio.
let googleInitialized = false;

export function GoogleLoginButton({ onAuthenticated, onLoadingChange }: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) { setError("VITE_GOOGLE_CLIENT_ID no está configurada"); return }

    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) { setError("No se pudo cargar Google Identity"); return }
      buttonRef.current.innerHTML = "";

      if (!googleInitialized) {
        googleInitialized = true;
        window.google.accounts.id.initialize({
          client_id: clientId,
          ux_mode: "popup",
          callback: async (response: CredentialResponse) => {
            onLoadingChange?.(true)
            try {
              setError(null)
              if (!response.credential) throw new Error("Google no devolvió una credencial")
              const result = await loginWithGoogle(response.credential)
              onAuthenticated(result)
            } catch (err) {
              setError(err instanceof Error ? err.message : "Error iniciando sesión")
              onLoadingChange?.(false)
            }
          },
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