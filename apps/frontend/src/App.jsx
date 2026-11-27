import { useCallback, useEffect, useRef, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomeScreen from "./components/WelcomeScreen";
import InstructionsScreen from "./components/InstructionsScreen";
import { trackPageView, trackTourStart } from "./lib/analytics";
import { readFirstVisitState, writeFirstVisitState } from "./lib/introduction";
import { AuthProvider } from "./context/AuthContext";
import { TourProvider } from "./context/TourContext";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";

function normalizeRoute(pathname) {
  const value = pathname || "/";
  return value.startsWith("/") ? value : `/${value}`;
}

function TourExperience() {
  const initialScreen = readFirstVisitState().hasSeenIntroduction
    ? "tour"
    : "welcome";
  const [screen, setScreen] = useState(initialScreen);
  const tourStartTracked = useRef(false);

  useEffect(() => {
    if (screen !== "tour" || tourStartTracked.current) {
      return;
    }

    tourStartTracked.current = true;
    trackTourStart();
  }, [screen]);

  function handleEnterTour() {
    writeFirstVisitState({
      hasSeenIntroduction: true,
      firstVisitTimestamp: new Date().toISOString(),
    });
    setScreen("tour");
  }

  return (
    <TourProvider>
      {screen === "welcome" && (
        <WelcomeScreen onStart={() => setScreen("instructions")} />
      )}
      {screen === "instructions" && (
        <InstructionsScreen onContinue={handleEnterTour} />
      )}
      {screen === "tour" && <Layout />}
    </TourProvider>
  );
}

function AppContent() {
  const [route, setRoute] = useState(() =>
    normalizeRoute(window.location.pathname),
  );
  const lastTrackedPath = useRef(null);

  const navigate = useCallback((nextRoute) => {
    const normalized = normalizeRoute(nextRoute);
    window.history.pushState({}, "", normalized);
    setRoute(normalized);
  }, []);

  useEffect(() => {
    if (lastTrackedPath.current === route) {
      return;
    }

    // Record every visited path so returning from an admin route counts as a
    // new public page view, but never send events for admin routes.
    lastTrackedPath.current = route;

    if (route.startsWith("/admin")) {
      return;
    }

    trackPageView(route);
  }, [route]);

  useEffect(() => {
    function handlePopState() {
      setRoute(normalizeRoute(window.location.pathname));
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (route === "/admin/login") {
    return <AdminLoginPage onNavigate={navigate} />;
  }

  if (route.startsWith("/admin")) {
    return (
      <ProtectedRoute onRedirect={navigate}>
        <AdminDashboardPage onNavigate={navigate} />
      </ProtectedRoute>
    );
  }

  return <TourExperience />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
