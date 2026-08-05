import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import playaImg from "../assets/PlayaPrincipal.png";
import logoImg from "../assets/PosibleLogo.png";
import phoneTrip from "../assets/phoneTrip.png";

import LoginFormFields from "../components/auth/LoginFormFields";
import RegisterFormFields from "../components/auth/RegisterFormFields";
import TravelIcon from "../components/ui/TravelIcon";

import { useChatVisibility } from "../context/ChatVisibilityContext";
import { useTheme } from "../context/ThemeContext";

import { useLoginForm } from "../hooks/useLoginForm";
import { useRegisterForm } from "../hooks/useRegisterForm";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const { setHideChat } = useChatVisibility();
  const { isDark, toggleTheme } = useTheme();

  const initialRegisterMode =
    location.pathname === "/register";

  const [isRegister, setIsRegister] =
    useState(initialRegisterMode);

  const [showWelcome, setShowWelcome] =
    useState(false);

  const [welcomeName, setWelcomeName] =
    useState("");

  const loginForm = useLoginForm();

  const registerForm = useRegisterForm({
    onSuccess: (name) => {
      setWelcomeName(name);
      setShowWelcome(true);

      window.setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    },
  });

  useEffect(() => {
    setIsRegister(
      location.pathname === "/register",
    );
  }, [location.pathname]);

  useEffect(() => {
    setHideChat(
      loginForm.googleAuthLoading,
    );

    return () => {
      setHideChat(false);
    };
  }, [
    loginForm.googleAuthLoading,
    setHideChat,
  ]);

  const switchToRegister = () => {
    loginForm.resetErrors();
    setIsRegister(true);

    navigate("/register", {
      replace: true,
    });
  };

  const switchToLogin = () => {
    registerForm.resetErrors();
    setIsRegister(false);

    navigate("/login", {
      replace: true,
    });
  };

  if (loginForm.googleAuthLoading) {
    return (
      <div
        className="tg-auth-loading"
        style={{
          backgroundImage: `url(${playaImg})`,
        }}
      >
        <div className="tg-auth-loading__overlay" />

        <div className="tg-auth-loading__content">
          <img
            src={logoImg}
            alt="TravelGo"
          />

          <span className="tg-auth-spinner" />

          <h1>Conectando con Google</h1>

          <p>
            Estamos validando tu cuenta de
            forma segura.
          </p>
        </div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div
        className="tg-auth-loading"
        style={{
          backgroundImage: `url(${playaImg})`,
        }}
      >
        <div className="tg-auth-loading__overlay" />

        <div className="tg-auth-welcome">
          <div className="tg-auth-welcome__icon">
            ✓
          </div>

          <img
            src={logoImg}
            alt="TravelGo"
          />

          <p className="tg-auth-kicker">
            CUENTA CREADA
          </p>

          <h1>
            ¡Bienvenido a TravelGo,
            <br />
            {welcomeName}!
          </h1>

          <p>
            Tu cuenta fue creada
            correctamente.
          </p>

          <div className="tg-auth-welcome__redirect">
            <span className="tg-auth-spinner" />
            Ingresando a tu billetera...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="tg-auth-shell"
      style={{
        backgroundImage: `url(${playaImg})`,
      }}
    >
      <div className="tg-auth-shell__overlay" />

      <header className="tg-auth-toolbar">
        <button
          type="button"
          className="tg-auth-toolbar__back"
          onClick={() => navigate("/")}
          aria-label="Volver al inicio"
        >
          <span>←</span>
          Volver
        </button>

        <button
          type="button"
          className="tg-auth-toolbar__theme"
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
              isDark ? "sun" : "moon"
            }
            size={21}
          />

          <span>
            {isDark
              ? "Modo claro"
              : "Modo oscuro"}
          </span>
        </button>
      </header>

      <main className="tg-auth-stage">
        <section className="tg-auth-card">
          <aside className="tg-auth-visual">
            <div className="tg-auth-visual__glow" />

            <div className="tg-auth-brand">
              <img
                src={logoImg}
                alt="TravelGo"
              />

              <div>
                <strong>travel</strong>
                <span>go</span>
              </div>
            </div>

            <div className="tg-auth-visual__copy">
              <p className="tg-auth-kicker">
                TU DINERO, EN MOVIMIENTO
              </p>

              <h1>
                Viajá con claridad,
                <br />
                sin perderte entre
                <br />
                <span>monedas.</span>
              </h1>

              <p>
                Gestioná saldos,
                transferencias e
                intercambios desde una
                experiencia simple,
                segura y preparada para
                acompañarte.
              </p>
            </div>

            <div className="tg-auth-visual__features">
              <span>
                <TravelIcon
                  name="shield"
                  size={20}
                />
                Operaciones seguras
              </span>

              <span>
                <TravelIcon
                  name="globe"
                  size={20}
                />
                Billetera multimoneda
              </span>

              <span>
                <TravelIcon
                  name="percent"
                  size={20}
                />
                Sin costos ocultos
              </span>
            </div>

            <img
              src={phoneTrip}
              alt=""
              aria-hidden="true"
              className="tg-auth-visual__phone"
            />
          </aside>

          <section className="tg-auth-form-panel">
            <button
              type="button"
              className="tg-auth-form-panel__close"
              onClick={() => navigate("/")}
              aria-label="Cerrar"
            >
              <TravelIcon
                name="close"
                size={20}
              />
            </button>

            <div className="tg-auth-form-panel__header">
              <p className="tg-auth-kicker">
                {isRegister
                  ? "EMPEZÁ TU VIAJE"
                  : "BIENVENIDO DE NUEVO"}
              </p>

              <h2>
                {isRegister
                  ? "Creá tu cuenta"
                  : "Iniciá sesión"}
              </h2>

              <p>
                {isRegister
                  ? "Completá tus datos para comenzar a utilizar TravelGo."
                  : "Ingresá a tu billetera y continuá administrando tus monedas."}
              </p>
            </div>

            <div
              className="tg-auth-tabs"
              role="tablist"
              aria-label="Acceso a TravelGo"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!isRegister}
                className={
                  !isRegister
                    ? "is-active"
                    : ""
                }
                onClick={switchToLogin}
              >
                Iniciar sesión
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={isRegister}
                className={
                  isRegister
                    ? "is-active"
                    : ""
                }
                onClick={switchToRegister}
              >
                Registrarse
              </button>
            </div>

            <div className="tg-auth-form-container">
              <div
                className={`tg-auth-form-view ${
                  isRegister
                    ? "is-register"
                    : "is-login"
                }`}
              >
                {!isRegister ? (
                  <LoginFormFields
                    data={
                      loginForm.loginData
                    }
                    errors={
                      loginForm.loginErrors
                    }
                    serverError={
                      loginForm.serverError
                    }
                    loading={
                      loginForm.loading
                    }
                    showGoogleFallback={
                      loginForm.showGoogleFallback
                    }
                    rememberMe={
                      loginForm.rememberMe
                    }
                    onEmailChange={
                      loginForm.handleEmailChange
                    }
                    onPasswordChange={
                      loginForm.handlePasswordChange
                    }
                    onRememberMeChange={
                      loginForm.handleRememberMeChange
                    }
                    onSubmit={
                      loginForm.handleSubmit
                    }
                    onGoogleAuth={
                      loginForm.handleGoogleAuth
                    }
                    onGoogleLoadingChange={
                      loginForm.handleGoogleLoadingChange
                    }
                  />
                ) : (
                  <RegisterFormFields
                    data={
                      registerForm.registerData
                    }
                    errors={
                      registerForm.registerErrors
                    }
                    serverError={
                      registerForm.serverError
                    }
                    loading={
                      registerForm.loading
                    }
                    acceptedTerms={
                      registerForm.acceptedTerms
                    }
                    emailCheckStatus={
                      registerForm.emailCheckStatus
                    }
                    isSubmitDisabled={
                      registerForm.isSubmitDisabled
                    }
                    onNameChange={
                      registerForm.handleNameChange
                    }
                    onEmailChange={
                      registerForm.handleEmailChange
                    }
                    onPasswordChange={
                      registerForm.handlePasswordChange
                    }
                    onConfirmChange={
                      registerForm.handleConfirmChange
                    }
                    onBirthDateChange={
                      registerForm.handleBirthDateChange
                    }
                    onTermsChange={
                      registerForm.handleTermsChange
                    }
                    onSubmit={
                      registerForm.handleSubmit
                    }
                  />
                )}
              </div>
            </div>

            <p className="tg-auth-switch-mobile">
              {isRegister
                ? "¿Ya tenés una cuenta?"
                : "¿Todavía no tenés una cuenta?"}

              <button
                type="button"
                onClick={
                  isRegister
                    ? switchToLogin
                    : switchToRegister
                }
              >
                {isRegister
                  ? "Iniciar sesión"
                  : "Registrarse"}
              </button>
            </p>

            <footer className="tg-auth-form-panel__footer">
              <TravelIcon
                name="shield"
                size={16}
              />

              Tus datos están protegidos.
            </footer>
          </section>
        </section>
      </main>
    </div>
  );
}