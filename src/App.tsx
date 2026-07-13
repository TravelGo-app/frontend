import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import Exchange from "./pages/Exchange";
import Deposit from "./pages/Deposit";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";

const loadingVideo = new URL(
  "./assets/video loading.mp4",
  import.meta.url,
).toString();

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (["/", "/login", "/register"].includes(location.pathname)) return;
    setIsLoading(true);
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, 950);
    return () => window.clearTimeout(timer);
  }, [location.key]);

  return (
    <>
      {location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/register" && <Navbar />}
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
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
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
          <Route path="/history" element={<Placeholder title="History" />} />
          <Route path="/about-us" element={<Placeholder title="About Us" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
