import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiAward, FiUsers, FiSearch } from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as scheduleService from '../../services/scheduleService'

const TeacherGrades = () => {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const data = await scheduleService.getSessions()
      setSessions(data)
    } catch (error) {
      toast.error('Erreur lors du chargement')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Group sessions by subject
  const subjects = [...new Map(sessions.map(s => [
    s.subject_id || s.subject?.id,
    {
      id: s.subject_id || s.subject?.id,
      name: s.subject_name || s.subject?.name,
      code: s.subject_code || s.subject?.code
    }
  ])).values()].filter(s => s.id)

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
            <FiAward style={{ color: '#8b5cf6' }} /> Gestion des Notes
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
            Gérez les notes de vos étudiants par matière
          </p>
        </div>

        {/* Info Card */}
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
              <FiAward size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Matières enseignées</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{subjects.length}</div>
            </div>
          </div>
        </motion.div>

        {/* Subjects Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
        ) : subjects.length === 0 ? (
          <motion.div
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
              Aucune matière assignée
            </p>
          </motion.div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {subjects.map((subject, index) => {
              const subjectSessions = sessions.filter(s =>
                (s.subject_id || s.subject?.id) === subject.id
              )
              const groups = [...new Set(subjectSessions.map(s => s.group_name || s.group?.name))]

              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-md)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600'
                    }}>
                      {subject.code?.slice(0, 2) || subject.name?.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{subject.name}</div>
                      {subject.code && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {subject.code}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiUsers size={14} />
                      {groups.length} groupe(s): {groups.join(', ')}
                    </div>
                  </div>

                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem'
                  }}>
                    Système de notes à venir
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.5rem',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            color: '#8b5cf6',
            textAlign: 'center'
          }}
        >
          <strong>Note:</strong> L'interface complète de saisie des notes sera disponible prochainement.
          Pour l'instant, vous pouvez consulter la liste de vos matières et groupes.
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TeacherGrades
