import { useCallback, useEffect, useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import InstructionsScreen from './components/InstructionsScreen'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import WelcomeScreen from './components/WelcomeScreen'
import { AuthProvider } from './context/AuthContext'
import { TourProvider } from './context/TourContext'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'

function normalizeRoute(pathname) {
  const value = pathname || '/'
  return value.startsWith('/') ? value : `/${value}`
}

function TourExperience() {
  const [screen, setScreen] = useState('welcome')

  return (
    <TourProvider>
      {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('instructions')} />}
      {screen === 'instructions' && (
        <InstructionsScreen onContinue={() => setScreen('tour')} />
      )}
      {screen === 'tour' && <Layout />}
    </TourProvider>
  )
}

function AppContent() {
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname))

  const navigate = useCallback((nextRoute) => {
    const normalized = normalizeRoute(nextRoute)
    window.history.pushState({}, '', normalized)
    setRoute(normalized)
  }, [])

  useEffect(() => {
    function handlePopState() {
      setRoute(normalizeRoute(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (route === '/admin/login') {
    return <AdminLoginPage onNavigate={navigate} />
  }

  if (route.startsWith('/admin')) {
    return (
      <ProtectedRoute onRedirect={navigate}>
        <AdminDashboardPage onNavigate={navigate} />
      </ProtectedRoute>
    )
  }

  return <TourExperience />
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}
