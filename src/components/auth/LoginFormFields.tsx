import {
  useId,
  useState,
  type FormEvent,
} from "react";

import {
  EyeIcon,
  EyeOffIcon,
} from "./AuthIcons";

import { GoogleAuthButton } from "./GoogleAuthButton";
import ForgotPasswordModal from "./ForgotPasswordModal";

import type {
  LoginData,
  LoginErrors,
} from "../../hooks/useLoginForm";

interface LoginFormFieldsProps {
  data: LoginData;
  errors: LoginErrors;
  serverError: string;
  loading: boolean;
  showGoogleFallback: boolean;
  rememberMe: boolean;

  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;

  onRememberMeChange: (
    checked: boolean,
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;

  onGoogleAuth: (result: any) => void;

  onGoogleLoadingChange?: (
    loading: boolean,
  ) => void;
}

export default function LoginFormFields({
  data,
  errors,
  serverError,
  loading,
  showGoogleFallback,
  rememberMe,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
  onGoogleAuth,
  onGoogleLoadingChange,
}: LoginFormFieldsProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showForgotPassword,
    setShowForgotPassword,
  ] = useState(false);

  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

  return (
    <>
      {serverError && (
        <div
          className="tg-auth-alert"
          role="alert"
        >
          <span
            className="tg-auth-alert__icon"
            aria-hidden="true"
          >
            !
          </span>

          <span>{serverError}</span>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="tg-auth-fields tg-auth-fields--login"
      >
        <div className="tg-auth-field">
          <label
            htmlFor={emailId}
            className="tg-auth-field__label"
          >
            Correo electrónico
          </label>

          <div className="tg-auth-field__control">
            <input
              id={emailId}
              type="email"
              placeholder="nombre@correo.com"
              autoComplete="email"
              value={data.email}
              onChange={(event) =>
                onEmailChange(
                  event.target.value,
                )
              }
              aria-invalid={Boolean(
                errors.email,
              )}
            />
          </div>

          {errors.email && (
            <p className="tg-auth-field__message is-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="tg-auth-field">
          <label
            htmlFor={passwordId}
            className="tg-auth-field__label"
          >
            Contraseña
          </label>

          <div className="tg-auth-field__control">
            <input
              id={passwordId}
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Ingresá tu contraseña"
              autoComplete="current-password"
              value={data.password}
              onChange={(event) =>
                onPasswordChange(
                  event.target.value,
                )
              }
              aria-invalid={Boolean(
                errors.password,
              )}
            />

            <button
              type="button"
              className="tg-auth-field__toggle"
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              aria-label={
                showPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOffIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="tg-auth-field__message is-error">
              {errors.password}
            </p>
          )}
        </div>

        <div className="tg-auth-options">
          <div className="tg-auth-check">
            <input
              id={rememberId}
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                onRememberMeChange(
                  event.target.checked,
                )
              }
            />

            <label htmlFor={rememberId}>
              Recordarme
            </label>
          </div>

          <button
            type="button"
            className="tg-auth-link"
            onClick={() =>
              setShowForgotPassword(true)
            }
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {showGoogleFallback ? (
          <GoogleAuthButton
            onAuthenticated={onGoogleAuth}
            onLoadingChange={
              onGoogleLoadingChange
            }
          />
        ) : (
          <>
            <button
              type="submit"
              className="tg-auth-submit"
              disabled={loading}
            >
              {loading && (
                <span
                  className="tg-auth-submit__spinner"
                  aria-hidden="true"
                />
              )}

              <span>
                {loading
                  ? "Ingresando..."
                  : "INICIAR SESIÓN"}
              </span>
            </button>

            <GoogleAuthButton
              onAuthenticated={onGoogleAuth}
              onLoadingChange={
                onGoogleLoadingChange
              }
            />
          </>
        )}
      </form>

      <ForgotPasswordModal
        open={showForgotPassword}
        onClose={() =>
          setShowForgotPassword(false)
        }
      />
    </>
  );
}