import { Route, Routes, useLocation } from "react-router-dom";

import ChatbotWidget from "./components/ChatbotWidget";
import PrivateLayout from "./components/layout/PrivateLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import AboutUs from "./pages/AboutUs";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Exchange from "./pages/Exchange";
import Faq from "./pages/Faq";
import HelpGuide from "./pages/HelpGuide";
import History from "./pages/History";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import Security from "./pages/Security";
import SetPassword from "./pages/SetPassword";
import Terms from "./pages/Terms";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import UnderConstruction from "./pages/UnderConstruction";

import {
  ChatVisibilityProvider,
  useChatVisibility,
} from "./context/ChatVisibilityContext";

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
  "/en-construccion",
];

const AUTH_CARD_PATHS = [
  "/login",
  "/register",
];

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <PrivateLayout />
    </ProtectedRoute>
  );
}

function AppContent() {
  const location = useLocation();
  const { hideChat } = useChatVisibility();

  const normalizedPath =
    decodeURIComponent(location.pathname).replace(/\/+$/g, "") ||
    "/";

  const isAuthCardPage =
    AUTH_CARD_PATHS.includes(normalizedPath);

  const shouldShowChatbot =
    !hideChat &&
    !NO_CHATBOT_PATHS.includes(normalizedPath);

  return (
    <>
      <Routes>
        {/* Rutas públicas */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Login />}
        />

        <Route
          path="/en-construccion"
          element={<UnderConstruction />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/confirm-email-change"
          element={<ConfirmEmailChange />}
        />

        <Route
          path="/about-us"
          element={<AboutUs />}
        />

        <Route
          path="/preguntasfrecuentes"
          element={<Faq />}
        />

        <Route
          path="/seguridad"
          element={<Security />}
        />

        <Route
          path="/contacto"
          element={<Contact />}
        />

        <Route
          path="/politica de privacidad"
          element={<Privacy />}
        />

        <Route
          path="/terminos y condiciones"
          element={<Terms />}
        />

        <Route
          path="/ayuda"
          element={<HelpGuide />}
        />

        {/* Rutas privadas con sidebar y barra superior */}

        <Route element={<ProtectedLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/exchange"
            element={<Exchange />}
          />

          <Route
            path="/deposit"
            element={<Deposit />}
          />

          <Route
            path="/transfer"
            element={<Transfer />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/home"
            element={<Profile />}
          />

          <Route
            path="/perfil"
            element={<Profile />}
          />

          <Route
            path="/configurar-password"
            element={<SetPassword />}
          />
        </Route>

        {/* Página inexistente */}

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      {shouldShowChatbot && (
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