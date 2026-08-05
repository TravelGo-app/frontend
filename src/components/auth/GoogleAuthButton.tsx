import { GoogleLoginButton } from "../GoogleLoginButton";

import type { GoogleAuthResponse } from "../../services/auth.service";

interface GoogleAuthButtonProps {
  onAuthenticated: (
    result: GoogleAuthResponse,
  ) => void;

  onLoadingChange?: (
    loading: boolean,
  ) => void;
}

export function GoogleAuthButton({
  onAuthenticated,
  onLoadingChange,
}: GoogleAuthButtonProps) {
  return (
    <div className="tg-auth-google">
      <div
        className="tg-auth-googledivider"
        aria-hidden="true"
      >
        <span />
        <small>o continuá con</small>
        <span />
      </div>

      <div className="tg-auth-googlebutton">
        <GoogleLoginButton
          onAuthenticated={
            onAuthenticated
          }
          onLoadingChange={
            onLoadingChange
          }
        />
      </div>
    </div>
  );
}
