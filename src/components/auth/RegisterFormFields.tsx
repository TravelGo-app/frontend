import {
  useId,
  useState,
  type FormEvent,
} from "react";

import {
  EyeIcon,
  EyeOffIcon,
} from "./AuthIcons";
import TermsModal from "./TermsModal";

import type {
  EmailCheckStatus,
  RegisterData,
  RegisterErrors,
} from "../../hooks/useRegisterForm";

interface RegisterFormFieldsProps {
  data: RegisterData;
  errors: RegisterErrors;
  serverError: string;
  loading: boolean;
  acceptedTerms: boolean;
  emailCheckStatus: EmailCheckStatus;
  isSubmitDisabled: boolean;

  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (
    value: string,
  ) => void;
  onConfirmChange: (
    value: string,
  ) => void;
  onBirthDateChange: (
    value: string,
  ) => void;
  onTermsChange: (
    checked: boolean,
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>,
  ) => void;
}

interface EmailStatusPresentation {
  text: string;
  tone: "muted" | "success" | "danger";
}

const EMAIL_STATUS: Record<
  EmailCheckStatus,
  EmailStatusPresentation | null
> = {
  idle: null,

  checking: {
    text: "Comprobando disponibilidad...",
    tone: "muted",
  },

  available: {
    text: "Correo disponible.",
    tone: "success",
  },

  taken: {
    text: "Este correo ya está registrado.",
    tone: "danger",
  },

  error: {
    text: "No se pudo comprobar el correo.",
    tone: "muted",
  },
};

export default function RegisterFormFields({
  data,
  errors,
  serverError,
  loading,
  acceptedTerms,
  emailCheckStatus,
  isSubmitDisabled,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmChange,
  onBirthDateChange,
  onTermsChange,
  onSubmit,
}: RegisterFormFieldsProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [showTerms, setShowTerms] =
    useState(false);

  const nameId = useId();
  const emailId = useId();
  const birthDateId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const termsId = useId();

  const emailStatus =
    EMAIL_STATUS[emailCheckStatus];

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
        className="tg-auth-fields tg-auth-fields--register"
      >
        <div className="tg-auth-field">
          <label
            htmlFor={nameId}
            className="tg-auth-field__label"
          >
            Nombre completo
          </label>

          <div className="tg-auth-field__control">
            <input
              id={nameId}
              type="text"
              placeholder="Tu nombre"
              autoComplete="name"
              value={data.name}
              onChange={(event) =>
                onNameChange(
                  event.target.value,
                )
              }
              aria-invalid={
                Boolean(errors.name)
              }
            />
          </div>

          {errors.name && (
            <p className="tg-auth-field__message is-error">
              {errors.name}
            </p>
          )}
        </div>

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
              aria-invalid={
                Boolean(
                  errors.email ||
                    emailCheckStatus ===
                      "taken",
                )
              }
            />
          </div>

          {errors.email && !emailStatus ? (
            <p className="tg-auth-field__message is-error">
              {errors.email}
            </p>
          ) : emailStatus ? (
            <p
              className={`tg-auth-field__message is-${emailStatus.tone}`}
            >
              {emailStatus.text}
            </p>
          ) : null}
        </div>

        <div className="tg-auth-field">
          <label
            htmlFor={birthDateId}
            className="tg-auth-field__label"
          >
            Fecha de nacimiento
          </label>

          <div className="tg-auth-field__control">
            <input
              id={birthDateId}
              type="date"
              autoComplete="bday"
              value={data.birthDate}
              onChange={(event) =>
                onBirthDateChange(
                  event.target.value,
                )
              }
              aria-invalid={
                Boolean(errors.birthDate)
              }
            />
          </div>

          {errors.birthDate && (
            <p className="tg-auth-field__message is-error">
              {errors.birthDate}
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
              placeholder="Creá una contraseña"
              autoComplete="new-password"
              value={data.password}
              onChange={(event) =>
                onPasswordChange(
                  event.target.value,
                )
              }
              aria-invalid={
                Boolean(errors.password)
              }
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

        <div className="tg-auth-field">
          <label
            htmlFor={confirmPasswordId}
            className="tg-auth-field__label"
          >
            Confirmar contraseña
          </label>

          <div className="tg-auth-field__control">
            <input
              id={confirmPasswordId}
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Repetí tu contraseña"
              autoComplete="new-password"
              value={data.confirmPassword}
              onChange={(event) =>
                onConfirmChange(
                  event.target.value,
                )
              }
              aria-invalid={
                Boolean(
                  errors.confirmPassword,
                )
              }
            />

            <button
              type="button"
              className="tg-auth-field__toggle"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current,
                )
              }
              aria-label={
                showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              aria-pressed={
                showConfirmPassword
              }
            >
              {showConfirmPassword ? (
                <EyeOffIcon />
              ) : (
                <EyeIcon />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="tg-auth-field__message is-error">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="tg-auth-terms">
          <div className="tg-auth-check">
            <input
              id={termsId}
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) =>
                onTermsChange(
                  event.target.checked,
                )
              }
            />

            <label htmlFor={termsId}>
              Acepto los
            </label>

            <button
              type="button"
              className="tg-auth-link"
              onClick={() =>
                setShowTerms(true)
              }
            >
              términos y condiciones
            </button>
          </div>

          {errors.terms && (
            <p className="tg-auth-field__message is-error">
              {errors.terms}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="tg-auth-submit"
          disabled={isSubmitDisabled}
        >
          {loading && (
            <span
              className="tg-auth-submit__spinner"
              aria-hidden="true"
            />
          )}

          <span>
            {loading
              ? "Creando cuenta..."
              : "REGISTRARSE"}
          </span>
        </button>
      </form>

      <TermsModal
        open={showTerms}
        onClose={() =>
          setShowTerms(false)
        }
      />
    </>
  );
}