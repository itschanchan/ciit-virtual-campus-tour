import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, onRedirect }) {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated && onRedirect) {
      onRedirect('/admin/login')
    }
  }, [isAuthenticated, loading, onRedirect])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        Checking session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}
