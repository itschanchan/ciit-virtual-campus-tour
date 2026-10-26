import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import { TourProvider } from './context/TourContext'

export default function App() {
  return (
    <ErrorBoundary>
      <TourProvider>
        <Layout />
      </TourProvider>
    </ErrorBoundary>
  )
}
