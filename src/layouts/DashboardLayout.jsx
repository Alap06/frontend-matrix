import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FiHome, FiUser, FiFileText, FiAward, FiCalendar,
  FiUsers, FiMessageSquare, FiSettings, FiLogOut,
  FiMenu, FiX, FiBook, FiClipboard, FiGlobe
} from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'
import './DashboardLayout.css'
import logo from '../assets/logos/logo3.png'

const DashboardLayout = ({ userType }) => {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr'
    i18n.changeLanguage(newLang)
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getNavItems = () => {
    switch (userType) {
      case 'student':
        return [
          { path: '/student', icon: FiHome, label: t('nav.dashboard') },
          { path: '/student/profile', icon: FiUser, label: t('nav.profile') },
          { path: '/student/schedule', icon: FiCalendar, label: 'Emploi du temps' },
          { path: '/student/documents', icon: FiFileText, label: t('nav.documents') },
          { path: '/student/grades', icon: FiAward, label: t('nav.grades') },
          { path: '/student/absences', icon: FiClipboard, label: t('nav.absences') },
          { path: '/student/clubs', icon: FiUsers, label: t('nav.clubs') },
          { path: '/student/reclamations', icon: FiMessageSquare, label: t('nav.reclamations') },
        ]
      case 'teacher':
        return [
          { path: '/teacher', icon: FiHome, label: t('nav.dashboard') },
          { path: '/teacher/profile', icon: FiUser, label: t('nav.profile') },
          { path: '/teacher/classes', icon: FiBook, label: t('nav.classes') },
          { path: '/teacher/grades', icon: FiAward, label: t('nav.grades') },
          { path: '/teacher/absences', icon: FiClipboard, label: t('nav.absences') },
          { path: '/teacher/documents', icon: FiFileText, label: t('nav.documents') },
          { path: '/teacher/reclamations', icon: FiMessageSquare, label: t('nav.reclamations') },
        ]
      case 'admin':
        return [
          { path: '/admin', icon: FiHome, label: t('nav.dashboard') },
          { path: '/admin/profile', icon: FiUser, label: t('nav.profile') },
          { path: '/admin/users', icon: FiUsers, label: 'Utilisateurs' },
          { path: '/admin/schedule', icon: FiCalendar, label: 'Emploi du temps' },
          { path: '/admin/documents', icon: FiFileText, label: t('nav.documents') },
          { path: '/admin/clubs', icon: FiUsers, label: t('nav.clubs') },
          { path: '/admin/reclamations', icon: FiMessageSquare, label: t('nav.reclamations') },
        ]
      case 'club_manager':
        return [
          { path: '/club-manager', icon: FiHome, label: t('nav.dashboard') },
          { path: '/club-manager/profile', icon: FiUser, label: t('nav.profile') },
          { path: '/club-manager/club', icon: FiUsers, label: 'Mon Club' },
          { path: '/club-manager/events', icon: FiCalendar, label: 'Événements' },
          { path: '/club-manager/reports', icon: FiFileText, label: 'Rapports' },
          { path: '/club-manager/announcements', icon: FiMessageSquare, label: 'Annonces' },
          { path: '/club-manager/reclamations', icon: FiClipboard, label: t('nav.reclamations') },
        ]
      case 'scolar_administrator':
        return [
          { path: '/scolar', icon: FiHome, label: t('nav.dashboard') },
          { path: '/scolar/profile', icon: FiUser, label: t('nav.profile') },
          { path: '/scolar/documents', icon: FiFileText, label: t('nav.documents') },
          { path: '/scolar/reclamations', icon: FiMessageSquare, label: t('nav.reclamations') },
        ]
      default:
        return []
    }
  }

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setSidebarOpen(false)
  }, [navigate])

  const navItems = getNavItems()

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src={logo} alt="SGE Logo" className="logo-image" />
          </div>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${userType}`}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="nav-item"
            onClick={toggleLanguage}
            title={i18n.language === 'fr' ? 'العربية' : 'Français'}
          >
            <FiGlobe className="nav-icon" />
            <span className="nav-label">
              {i18n.language === 'fr' ? 'العربية' : 'Français'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <FiMenu />
          </button>

          <div className="header-title">
            <h1>{t('nav.dashboard')}</h1>
          </div>

          <div className="header-actions">
            <div className="user-menu">
              <button
                className="user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-avatar">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="user-info">
                  <span className="user-name">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="user-role">{userType}</span>
                </div>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="user-dropdown"
                  >
                    <NavLink to={`/${userType}/profile`} className="dropdown-item">
                      <FiUser /> {t('nav.profile')}
                    </NavLink>
                    <button onClick={handleLogout} className="dropdown-item">
                      <FiLogOut /> {t('common.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
