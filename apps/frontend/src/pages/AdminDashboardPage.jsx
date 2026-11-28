import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../components/AdminLayout'
import OverviewPanel from '../components/admin/OverviewPanel'
import AnalyticsPanel from '../components/admin/AnalyticsPanel'
import GalleryManagerPanel from '../components/admin/GalleryManagerPanel'
import LocationsPanel from '../components/admin/LocationsPanel'
import SettingsPanel from '../components/admin/SettingsPanel'
import { catalogData } from '../lib/catalog'
import {
  appendActivity,
  readAdminContent,
  resetAdminContent,
  writeAdminContent,
} from '../lib/adminContent'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'gallery', label: 'Gallery Manager' },
  { id: 'locations', label: 'Locations' },
  { id: 'settings', label: 'Settings' },
  { id: 'analytics', label: 'Analytics' },
]

function DashboardSection({ section, user, content, commit, onNavigate, onResetAll }) {
  if (section === 'gallery') {
    return <GalleryManagerPanel catalog={catalogData} content={content} commit={commit} />
  }

  if (section === 'locations') {
    return <LocationsPanel catalog={catalogData} content={content} commit={commit} />
  }

  if (section === 'settings') {
    return (
      <SettingsPanel
        user={user}
        catalog={catalogData}
        content={content}
        commit={commit}
        onResetAll={onResetAll}
      />
    )
  }

  if (section === 'analytics') {
    return <AnalyticsPanel content={content} />
  }

  return (
    <OverviewPanel
      user={user}
      catalog={catalogData}
      content={content}
      onNavigate={onNavigate}
    />
  )
}

export default function AdminDashboardPage({ onNavigate }) {
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('overview')
  const [content, setContent] = useState(readAdminContent)

  async function handleLogout() {
    await logout()
    if (onNavigate) {
      onNavigate('/admin/login')
    }
  }

  function commit(nextContent, action, detail) {
    const loggedContent = appendActivity(nextContent, action, detail)
    setContent(writeAdminContent(loggedContent))
  }

  function handleResetAll() {
    setContent(resetAdminContent())
  }

  return (
    <AdminLayout
      user={user}
      onLogout={handleLogout}
      sections={SECTIONS}
      activeSection={activeSection}
      onSelect={setActiveSection}
    >
      <DashboardSection
        section={activeSection}
        user={user}
        content={content}
        commit={commit}
        onNavigate={setActiveSection}
        onResetAll={handleResetAll}
      />
    </AdminLayout>
  )
}
