import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FiBook, FiUsers, FiCalendar, FiAward,
  FiMessageSquare, FiClock, FiArrowRight, FiClipboard, FiCheckCircle, FiCheck, FiX
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'
import * as documentService from '../../services/documentService'

const TeacherDashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [approvals, setApprovals] = useState([])
  const [loadingApprovals, setLoadingApprovals] = useState(true)
  const [processingApproval, setProcessingApproval] = useState(null)

  // Load approvals
  useEffect(() => {
    loadApprovals()
  }, [])

  const loadApprovals = async () => {
    try {
      setLoadingApprovals(true)
      const data = await documentService.getTeacherApprovals()
      setApprovals(data)
    } catch (error) {
      console.error('Error loading approvals:', error)
      toast.error('Erreur lors du chargement des approbations')
    } finally {
      setLoadingApprovals(false)
    }
  }

  const handleApproval = async (approvalId, status) => {
    try {
      setProcessingApproval(approvalId)
      await documentService.updateApproval(approvalId, { status })
      toast.success(status === 'APPROVED' ? 'Demande approuvée ✅' : 'Demande rejetée ❌')
      loadApprovals() // Reload to get fresh data
    } catch (error) {
      console.error('Error updating approval:', error)
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setProcessingApproval(null)
    }
  }

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING')
  const pendingCount = pendingApprovals.length

  const stats = [
    { title: 'Classes', value: '8', icon: FiBook, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Étudiants', value: '240', icon: FiUsers, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Cours Aujourd\'hui', value: '4', icon: FiCalendar, color: '#10b981', bg: '#ecfdf5' },
    { title: 'Approbations', value: pendingCount.toString(), icon: FiCheckCircle, color: '#f59e0b', bg: '#fffbeb', badge: pendingCount > 0 }
  ]

  const quickActions = [
    { label: 'Saisir Notes', path: '/teacher/grades', icon: FiAward, color: '#f59e0b' },
    { label: 'Gérer Absences', path: '/teacher/absences', icon: FiClipboard, color: '#ef4444' },
    { label: 'Mes Classes', path: '/teacher/classes', icon: FiBook, color: '#3b82f6' },
    { label: 'Réclamations', path: '/teacher/reclamations', icon: FiMessageSquare, color: '#10b981' }
  ]

  const todaySchedule = [
    { time: '08:30 - 10:00', subject: 'Programmation Web', group: '2INFO-A', room: 'Salle B12' },
    { time: '10:15 - 11:45', subject: 'Base de Données', group: '1INFO-B', room: 'Lab 3' },
    { time: '14:00 - 15:30', subject: 'Algorithmique', group: '2INFO-B', room: 'Salle A05' },
    { time: '15:45 - 17:15', subject: 'Programmation Web', group: '2INFO-B', room: 'Lab 2' }
  ]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.5rem' }}
      >
        <h2 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a'
        }}>
          Bonjour, {user?.firstName || 'Professeur'} 📚
        </h2>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
          Gérez vos classes et suivez vos étudiants
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
              gap: '1rem',
              position: 'relative'
            }}
          >
            {stat.badge && (
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: '#f59e0b',
                color: 'white',
                borderRadius: '999px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: '700'
              }}>
                {stat.value}
              </div>
            )}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: stat.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color
            }}>
              <stat.icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.375rem', fontWeight: '700', color: '#0f172a', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                {stat.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Approval Requests Section */}
      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9',
            marginBottom: '1.5rem'
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
            <FiCheckCircle style={{ color: '#f59e0b' }} />
            Demandes d'Approbation en Attente
            <span style={{
              marginLeft: 'auto',
              background: '#fef3c7',
              color: '#92400e',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              {pendingCount} en attente
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
            {loadingApprovals ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                Chargement...
              </div>
            ) : pendingApprovals.slice(0, 5).map((approval) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '2px solid #e5e7eb',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem' }}>
                    {approval.document_request?.student?.first_name} {approval.document_request?.student?.last_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    📧 {approval.document_request?.student?.email}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    📅 {new Date(approval.created_at).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApproval(approval.id, 'APPROVED')}
                    disabled={processingApproval === approval.id}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #34d399)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: processingApproval === approval.id ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: processingApproval === approval.id ? 0.6 : 1
                    }}
                  >
                    <FiCheck size={16} />
                    Approuver
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApproval(approval.id, 'REJECTED')}
                    disabled={processingApproval === approval.id}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ef4444, #f87171)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.8rem',
                      cursor: processingApproval === approval.id ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: processingApproval === approval.id ? 0.6 : 1
                    }}
                  >
                    <FiX size={16} />
                    Rejeter
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {pendingCount > 5 && (
            <Link
              to="/teacher/documents"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '8px',
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              Voir toutes les demandes ({pendingCount})
            </Link>
          )}
        </motion.div>
      )}

      {/* Two Column Grid */}
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
            <FiArrowRight /> Actions Rapides
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {quickActions.map((action) => (
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

        {/* Today's Schedule */}
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
            <FiClock /> Cours Aujourd'hui
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {todaySchedule.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.6rem 0.75rem',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  borderLeft: '3px solid #3b82f6'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', minWidth: '85px' }}>
                  {item.time}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '500', color: '#0f172a' }}>
                    {item.subject}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {item.group} • {item.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TeacherDashboard
