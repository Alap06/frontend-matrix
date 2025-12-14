import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiUsers, FiBook, FiSearch, FiChevronRight,
  FiMail, FiUser, FiCalendar
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as scheduleService from '../../services/scheduleService'

const TeacherClasses = () => {
  const [sessions, setSessions] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Extract unique groups from sessions
  const groups = [...new Map(sessions.map(s => [
    s.group_id || s.group?.id,
    { id: s.group_id || s.group?.id, name: s.group_name || s.group?.name }
  ])).values()].filter(g => g.id)

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

  const loadGroupStudents = async (groupId) => {
    try {
      setLoadingStudents(true)
      const data = await scheduleService.getMemberships(groupId)
      setStudents(data.map(m => m.student || m))
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants')
      console.error(error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const handleGroupSelect = (group) => {
    setSelectedGroup(group)
    loadGroupStudents(group.id)
  }

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase()
    return (
      student.first_name?.toLowerCase().includes(query) ||
      student.last_name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query)
    )
  })

  // Get sessions for selected group
  const groupSessions = selectedGroup
    ? sessions.filter(s => (s.group_id || s.group?.id) === selectedGroup.id)
    : []

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
            <FiBook style={{ color: '#8b5cf6' }} /> Mes Classes
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
            Gérez vos classes et consultez la liste des étudiants
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
          {/* Groups List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              height: 'fit-content'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
              <FiUsers style={{ marginRight: '0.5rem' }} />
              Mes Groupes ({groups.length})
            </h3>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Chargement...</p>
            ) : groups.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Aucun groupe</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {groups.map(group => (
                  <motion.div
                    key={group.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleGroupSelect(group)}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: selectedGroup?.id === group.id
                        ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
                        : 'var(--bg-secondary)',
                      color: selectedGroup?.id === group.id ? 'white' : 'inherit',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontWeight: '500' }}>{group.name}</span>
                    <FiChevronRight />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Group Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {!selectedGroup ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '3rem',
                  boxShadow: 'var(--shadow-md)',
                  textAlign: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <FiUsers size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Sélectionnez un groupe pour voir les détails</p>
              </motion.div>
            ) : (
              <>
                {/* Group Sessions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <h3 style={{ margin: '0 0 1rem 0' }}>
                    Sessions - {selectedGroup.name}
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    {groupSessions.map(session => (
                      <div
                        key={session.id}
                        style={{
                          padding: '1rem',
                          background: 'var(--bg-secondary)',
                          borderRadius: '10px',
                          borderLeft: `4px solid ${scheduleService.getSessionTypeColor(session.session_type)}`
                        }}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {session.subject_name || session.subject?.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {scheduleService.getDayLabel(session.day_of_week)}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {session.start_time} - {session.end_time}
                        </div>
                        <span style={{
                          display: 'inline-block',
                          marginTop: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          background: scheduleService.getSessionTypeColor(session.session_type),
                          color: 'white'
                        }}>
                          {session.session_type}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Students List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{ margin: 0 }}>
                      Étudiants ({students.length})
                    </h3>
                    <div style={{ position: 'relative' }}>
                      <FiSearch style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                      }} />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          padding: '0.5rem 0.75rem 0.5rem 2rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-secondary)',
                          width: '200px'
                        }}
                      />
                    </div>
                  </div>

                  {loadingStudents ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                  ) : students.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucun étudiant</p>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '1rem'
                    }}>
                      {filteredStudents.map(student => (
                        <div
                          key={student.id}
                          style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                          }}
                        >
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1rem'
                          }}>
                            {student.first_name?.[0]}{student.last_name?.[0]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500' }}>
                              {student.first_name} {student.last_name}
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <FiMail size={12} />
                              {student.email}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default TeacherClasses
