import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiBook, FiCalendar, FiTrendingUp } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'

const StudentGrades = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // Get education histories from user data
  const educationHistories = user?.education_histories || []

  const getResultStyle = (result) => {
    switch (result) {
      case 'tres_bien':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Très Bien' }
      case 'bien':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Bien' }
      case 'assez_bien':
        return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', label: 'Assez Bien' }
      case 'passable':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'Passable' }
      case 'ajourne':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Ajourné' }
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', label: result }
    }
  }

  const getGradeLabel = (grade) => {
    switch (grade) {
      case '1': return 'Première année'
      case '2': return 'Deuxième année'
      case '3': return 'Troisième année'
      default: return grade
    }
  }

  const getSessionLabel = (session) => {
    switch (session) {
      case 'principale': return 'Session Principale'
      case 'controle': return 'Session de Contrôle'
      default: return session
    }
  }

  return (
    <div className="dashboard-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiAward style={{ color: '#8b5cf6' }} /> Mon Parcours Académique
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
            Consultez votre historique académique et vos résultats
          </p>
        </div>

        {/* Diploma Info */}
        {user?.diploma && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
              borderRadius: '16px',
              padding: '1.5rem',
              color: 'white',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiBook size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Diplôme en cours</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{user.diploma}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Education History */}
        {educationHistories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <FiAward size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)' }}>
              Aucun historique académique disponible
            </p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {educationHistories.map((history, index) => {
              const resultStyle = getResultStyle(history.result)

              return (
                <motion.div
                  key={history.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-md)',
                    borderLeft: `4px solid ${resultStyle.color}`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <FiCalendar style={{ color: '#8b5cf6' }} />
                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                          {history.academic_year}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        {getGradeLabel(history.grade)} - {history.specialty || 'Tronc Commun'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Classe: <strong>{history.class_name}</strong> •
                        ID Inscription: <strong>{history.registration_id}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        background: resultStyle.bg,
                        color: resultStyle.color,
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}>
                        {resultStyle.label}
                      </span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {getSessionLabel(history.session)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Statistics Summary */}
        {educationHistories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: '1.5rem',
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiTrendingUp style={{ color: '#8b5cf6' }} /> Résumé
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>
                  {educationHistories.length}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Années enregistrées
                </div>
              </div>
              <div style={{
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                  {educationHistories.filter(h =>
                    ['tres_bien', 'bien', 'assez_bien', 'passable'].includes(h.result)
                  ).length}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Années réussies
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default StudentGrades
