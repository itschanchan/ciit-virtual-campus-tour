import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const ADMIN_TAB_SESSION_KEY = 'ciit-admin-tab-session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkSession = useCallback(async () => {
    if (sessionStorage.getItem(ADMIN_TAB_SESSION_KEY) !== 'active') {
      setUser(null)
      setLoading(false)
      return false
    }

    try {
      const response = await fetch('/api/admins/session', {
        credentials: 'include',
      })

      if (!response.ok) {
        sessionStorage.removeItem(ADMIN_TAB_SESSION_KEY)
        setUser(null)
        return false
      }

      const data = await response.json()
      const sessionUser = data.user ?? null
      setUser(sessionUser)

      if (!sessionUser) {
        sessionStorage.removeItem(ADMIN_TAB_SESSION_KEY)
      }

      return Boolean(sessionUser)
    } catch {
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = useCallback(async (credentials) => {
    const response = await fetch('/api/admins/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      const message = data?.error?.message ?? 'Invalid credentials'
      throw new Error(message)
    }

    const sessionUser = data.user ?? null
    if (sessionUser) {
      sessionStorage.setItem(ADMIN_TAB_SESSION_KEY, 'active')
    }

    setUser(sessionUser)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/admins/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      sessionStorage.removeItem(ADMIN_TAB_SESSION_KEY)
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      checkSession,
    }),
    [user, loading, login, logout, checkSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
