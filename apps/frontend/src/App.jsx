import { useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import InstructionsScreen from './components/InstructionsScreen'
import Layout from './components/Layout'
import WelcomeScreen from './components/WelcomeScreen'
import { TourProvider } from './context/TourContext'

export default function App() {
  const [screen, setScreen] = useState('welcome')

  return (
    <ErrorBoundary>
      <TourProvider>
        {screen === 'welcome' && <WelcomeScreen onStart={() => setScreen('instructions')} />}
        {screen === 'instructions' && (
          <InstructionsScreen onContinue={() => setScreen('tour')} />
        )}
        {screen === 'tour' && <Layout />}
      </TourProvider>
    </ErrorBoundary>
  )
}
