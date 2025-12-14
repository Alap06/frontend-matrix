import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiCalendar, FiClock, FiAlertTriangle, FiCheckCircle,
  FiFilter, FiSearch, FiInfo
} from 'react-icons/fi'

const StudentAbsences = () => {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample absences data - In production, this would come from API
  const absencesData = [
    {
      id: 1,
      date: '2024-12-10',
      subject: 'Mathématiques',
      type: 'TD',
      time: '10:15 - 11:45',
      status: 'justified',
      reason: 'Rendez-vous médical',
      teacher: 'Dr. Ahmed'
    },
    {
      id: 2,
      date: '2024-12-08',
      subject: 'Programmation',
      type: 'TP',
      time: '13:00 - 14:30',
      status: 'unjustified',
      reason: null,
      teacher: 'Pr. Fatma'
    },
    {
      id: 3,
      date: '2024-12-05',
      subject: 'Réseaux',
      type: 'Cours',
      time: '08:30 - 10:00',
      status: 'pending',
      reason: 'En attente de justificatif',
      teacher: 'Pr. Salah'
    },
    {
      id: 4,
      date: '2024-11-28',
      subject: 'Base de données',
      type: 'TP',
      time: '13:00 - 14:30',
      status: 'justified',
      reason: 'Événement familial',
      teacher: 'Dr. Mohamed'
    },
    {
      id: 5,
      date: '2024-11-20',
      subject: 'Anglais',
      type: 'TD',
      time: '10:15 - 11:45',
      status: 'unjustified',
      reason: null,
      teacher: 'Mrs. Sara'
    }
  ]

  const getStatusStyle = (status) => {
    switch (status) {
      case 'justified':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Justifiée', icon: FiCheckCircle }
      case 'unjustified':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Non justifiée', icon: FiAlertTriangle }
      case 'pending':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'En attente', icon: FiClock }
      default:
        return { bg: '#f3f4f6', color: '#6b7280', label: 'Inconnu', icon: FiInfo }
    }
  }

  const filteredAbsences = absencesData.filter(absence => {
    if (filter !== 'all' && absence.status !== filter) return false
    if (searchQuery && !absence.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Statistics
  const stats = {
    total: absencesData.length,
    justified: absencesData.filter(a => a.status === 'justified').length,
    unjustified: absencesData.filter(a => a.status === 'unjustified').length,
    pending: absencesData.filter(a => a.status === 'pending').length
  }

  return (
    <div className="dashboard-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCalendar /> Mes Absences
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
            Consultez et justifiez vos absences
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--bg-card)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>{stats.total}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{stats.justified}</div>
            <div style={{ fontSize: '0.875rem', color: '#10b981' }}>Justifiées</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.unjustified}</div>
            <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>Non justifiées</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '1.25rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pending}</div>
            <div style={{ fontSize: '0.875rem', color: '#f59e0b' }}>En attente</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
            <FiSearch style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Rechercher par matière..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                background: 'transparent',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiFilter style={{ color: 'var(--text-muted)' }} />
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'transparent'
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="justified">Justifiées</option>
              <option value="unjustified">Non justifiées</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>

        {/* Absences List */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          {filteredAbsences.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-muted)'
            }}>
              <FiCheckCircle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ margin: 0 }}>Aucune absence trouvée</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredAbsences.map((absence, idx) => {
                const statusStyle = getStatusStyle(absence.status)
                const StatusIcon = statusStyle.icon

                return (
                  <motion.div
                    key={absence.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1.25rem',
                      borderBottom: idx < filteredAbsences.length - 1 ? '1px solid var(--border-color)' : 'none',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Date */}
                    <div style={{
                      minWidth: '80px',
                      textAlign: 'center',
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '10px'
                    }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                        {new Date(absence.date).getDate()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {new Date(absence.date).toLocaleDateString('fr-FR', { month: 'short' })}
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{absence.subject}</div>
                      <div style={{
                        display: 'flex',
                        gap: '1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        flexWrap: 'wrap'
                      }}>
                        <span>{absence.type}</span>
                        <span><FiClock style={{ verticalAlign: 'middle' }} /> {absence.time}</span>
                        <span>{absence.teacher}</span>
                      </div>
                      {absence.reason && (
                        <div style={{
                          marginTop: '0.5rem',
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic'
                        }}>
                          📝 {absence.reason}
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      fontWeight: '500',
                      fontSize: '0.875rem'
                    }}>
                      <StatusIcon size={16} />
                      {statusStyle.label}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Info Card */}
        {stats.unjustified > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <FiAlertTriangle size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '600', color: '#ef4444', marginBottom: '0.25rem' }}>
                Attention: {stats.unjustified} absence{stats.unjustified > 1 ? 's' : ''} non justifiée{stats.unjustified > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Veuillez contacter l'administration pour régulariser votre situation.
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default StudentAbsences
