import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FiUsers, FiFileText, FiUserCheck, FiCalendar,
  FiMessageSquare, FiTrendingUp, FiArrowRight, FiClock
} from 'react-icons/fi'

const AdminDashboard = () => {
  const stats = [
    { title: 'Étudiants', value: '5,247', icon: FiUsers, color: '#3b82f6', bg: '#eff6ff', change: '+12%' },
    { title: 'Enseignants', value: '198', icon: FiUserCheck, color: '#8b5cf6', bg: '#f5f3ff', change: '+3%' },
    { title: 'Documents', value: '42', icon: FiFileText, color: '#f59e0b', bg: '#fffbeb', change: 'En attente' },
    { title: 'Réclamations', value: '8', icon: FiMessageSquare, color: '#10b981', bg: '#ecfdf5', change: '3 nouvelles' }
  ]

  const quickActions = [
    { label: 'Gérer Étudiants', path: '/admin/students', icon: FiUsers, color: '#3b82f6' },
    { label: 'Gérer Enseignants', path: '/admin/teachers', icon: FiUserCheck, color: '#8b5cf6' },
    { label: 'Documents', path: '/admin/documents', icon: FiFileText, color: '#f59e0b' },
    { label: 'Emplois du temps', path: '/admin/schedule', icon: FiCalendar, color: '#10b981' }
  ]

  const recentActivities = [
    { text: 'Nouvelle demande de document', time: 'Il y a 5 min', type: 'document' },
    { text: 'Étudiant Ahmed inscrit', time: 'Il y a 15 min', type: 'user' },
    { text: 'Réclamation résolue', time: 'Il y a 1h', type: 'success' },
    { text: 'Nouvel enseignant ajouté', time: 'Il y a 2h', type: 'user' }
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <h2 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Administration SGE 🎓
        </h2>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
          Vue d'ensemble du système de gestion
        </p>
      </motion.div>

      {/* Stats Grid - Compact */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              background: stat.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color
            }}>
              <stat.icon size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                {stat.title}
              </div>
            </div>
            <div style={{
              fontSize: '0.7rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              background: stat.bg,
              color: stat.color,
              fontWeight: '500'
            }}>
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9'
          }}
        >
          <h3 style={{
            margin: '0 0 1rem',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiTrendingUp /> Actions Rapides
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {quickActions.map((action, idx) => (
              <Link
                key={action.label}
                to={action.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  textDecoration: 'none',
                  color: '#334155',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  border: '1px solid transparent'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.borderColor = action.color
                  e.currentTarget.style.color = action.color
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f8fafc'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.color = '#334155'
                }}
              >
                <action.icon size={16} style={{ color: action.color }} />
                {action.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9'
          }}
        >
          <h3 style={{
            margin: '0 0 1rem',
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiClock /> Activité Récente
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivities.map((activity, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0',
                  borderBottom: idx < recentActivities.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}
              >
                <span style={{ fontSize: '0.8rem', color: '#334155' }}>{activity.text}</span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
