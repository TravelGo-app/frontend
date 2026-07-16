import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SetPassword from "./pages/SetPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Exchange from "./pages/Exchange";
import Deposit from "./pages/Deposit";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";
import History from "./pages/History";
import AboutUs from "./pages/AboutUs";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import Terms from "./pages/Terms";
import HelpGuide from "./pages/HelpGuide";
import ChatbotWidget from "./components/ChatbotWidget";
import {
  ChatVisibilityProvider,
  useChatVisibility,
} from "./context/ChatVisibilityContext";

const loadingVideo = new URL(
  "./assets/video loading.mp4",
  import.meta.url,
).toString();

const NO_CHROME_PATHS = [
  "/",
  "/login",
  "/register",
  "/configurar-password",
  "/reset-password",
  "/confirm-email-change",
  "/about-us",
  "/preguntasfrecuentes",
  "/seguridad",
  "/contacto",
  "/politica de privacidad",
  "/terminos y condiciones",
  "/ayuda",
];

const NO_CHATBOT_PATHS = [
  "/",
  "/configurar-password",
  "/reset-password",
  "/confirm-email-change",
  "/about-us",
  "/preguntasfrecuentes",
  "/seguridad",
  "/contacto",
  "/politica de privacidad",
  "/terminos y condiciones",
  "/ayuda",
];

const AUTH_CARD_PATHS = ["/login", "/register"];

function AppContent() {
  const location = useLocation();
  const normalizedPath =
    decodeURIComponent(location.pathname).replace(/\/+$/g, "") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const { hideChat } = useChatVisibility();

  useEffect(() => {
    if (
      NO_CHROME_PATHS.includes(normalizedPath) ||
      AUTH_CARD_PATHS.includes(normalizedPath)
    ) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 950);

    return () => window.clearTimeout(timer);
  }, [normalizedPath]);

  const isAuthCardPage = AUTH_CARD_PATHS.includes(normalizedPath);

  return (
    <>
      {!NO_CHROME_PATHS.includes(normalizedPath) && !isLoading && <Navbar />}

      {isLoading ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
            paddingBottom: "100px",
          }}
        >
          <video
            src={loadingVideo}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: -1,
            }}
          />
          <span
            style={{
              color: "#000",
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: "rgba(255,255,255,0.75)",
              padding: "10px 18px",
              borderRadius: "16px",
            }}
          >
            loading...
          </span>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route
            path="/configurar-password"
            element={
              <ProtectedRoute>
                <SetPassword />
              </ProtectedRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/confirm-email-change"
            element={<ConfirmEmailChange />}
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exchange"
            element={
              <ProtectedRoute>
                <Exchange />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deposit"
            element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfer"
            element={
              <ProtectedRoute>
                <Transfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/preguntasfrecuentes" element={<Faq />} />
          <Route path="/seguridad" element={<Security />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/politica de privacidad" element={<Privacy />} />
          <Route path="/terminos y condiciones" element={<Terms />} />
          <Route path="/ayuda" element={<HelpGuide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}

      {!isLoading &&
        !hideChat &&
        !NO_CHATBOT_PATHS.includes(normalizedPath) && (
          <ChatbotWidget compact={isAuthCardPage} />
        )}
    </>
  );
}

export default function App() {
  return (
    <ChatVisibilityProvider>
      <AppContent />
    </ChatVisibilityProvider>
  );
}
