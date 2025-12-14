import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUsers, FiBook, FiSearch, FiChevronRight,
  FiMail, FiCalendar, FiClock, FiMapPin, FiHash,
  FiX, FiAlertTriangle
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as scheduleService from '../../services/scheduleService'

const TeacherClasses = () => {
  const [sessions, setSessions] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [selectedSession, setSelectedSession] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSessionModal, setShowSessionModal] = useState(null)
  const [studentAbsenceCounts, setStudentAbsenceCounts] = useState({})

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

  const loadSessionStudents = async (session) => {
    try {
      setLoadingStudents(true)
      const today = new Date().toISOString().split('T')[0]
      const data = await scheduleService.getSessionStudents(session.id, today)
      const studentsList = data.students || data
      setStudents(studentsList)

      // Extract absence counts
      const absenceCounts = {}
      studentsList.forEach(student => {
        absenceCounts[student.id] = student.absence_count || 0
      })
      setStudentAbsenceCounts(absenceCounts)
      setSelectedSession(session)
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants')
      console.error(error)
    } finally {
      setLoadingStudents(false)
    }
  }

  const handleGroupSelect = (group) => {
    setSelectedGroup(group)
    setSelectedSession(null)
    loadGroupStudents(group.id)
  }

  const handleSessionClick = (session) => {
    setShowSessionModal(session)
  }

  const handleViewSessionStudents = (session) => {
    setShowSessionModal(null)
    loadSessionStudents(session)
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

  // Group sessions by day
  const sessionsByDay = groupSessions.reduce((acc, session) => {
    const day = session.day_of_week
    if (!acc[day]) acc[day] = []
    acc[day].push(session)
    return acc
  }, {})

  const getAbsenceStatusInfo = (studentId, sessionType) => {
    const count = studentAbsenceCounts[studentId] || 0
    return scheduleService.getAbsenceStatus(count, sessionType || 'TD', false)
  }

  // Calculate session duration
  const getSessionDuration = (session) => {
    const [startH, startM] = (session.start_time || '00:00').split(':').map(Number)
    const [endH, endM] = (session.end_time || '00:00').split(':').map(Number)
    const duration = (endH * 60 + endM) - (startH * 60 + startM)
    const hours = Math.floor(duration / 60)
    const mins = duration % 60
    return `${hours}h${mins > 0 ? mins.toString().padStart(2, '0') : ''}`
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
            <FiBook style={{ color: '#8b5cf6' }} /> Mes Classes
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
            Gérez vos classes, consultez les séances et les étudiants
          </p>
        </div>

        {/* Session Detail Modal */}
        <AnimatePresence>
          {showSessionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
              onClick={() => setShowSessionModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  padding: '2rem',
                  maxWidth: '450px',
                  width: '90%',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
                }}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      background: scheduleService.getSessionTypeColor(showSessionModal.session_type),
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem'
                    }}>
                      {showSessionModal.session_type}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
                      {showSessionModal.subject_name || showSessionModal.subject?.name}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {showSessionModal.subject_code || showSessionModal.subject?.code}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSessionModal(null)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '36px',
                      height: '36px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiX />
                  </button>
                </div>

                {/* Session Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#8b5cf6'
                    }}>
                      <FiCalendar />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Jour</div>
                      <div style={{ fontWeight: '500' }}>{scheduleService.getDayLabel(showSessionModal.day_of_week)}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#10b981'
                    }}>
                      <FiClock />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Horaire</div>
                      <div style={{ fontWeight: '500' }}>
                        {showSessionModal.start_time?.slice(0, 5)} - {showSessionModal.end_time?.slice(0, 5)}
                        <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          ({getSessionDuration(showSessionModal)})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#f59e0b'
                    }}>
                      <FiMapPin />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salle</div>
                      <div style={{ fontWeight: '500' }}>{showSessionModal.room || 'Non spécifiée'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#3b82f6'
                    }}>
                      <FiUsers />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Groupe</div>
                      <div style={{ fontWeight: '500' }}>{showSessionModal.group_name}</div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewSessionStudents(showSessionModal)}
                  style={{
                    width: '100%',
                    marginTop: '1.5rem',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FiUsers /> Voir les étudiants
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                {groups.map(group => {
                  const groupSessionCount = sessions.filter(s => (s.group_id || s.group?.id) === group.id).length
                  return (
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
                      <div>
                        <div style={{ fontWeight: '500' }}>{group.name}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                          {groupSessionCount} séance(s)
                        </div>
                      </div>
                      <FiChevronRight />
                    </motion.div>
                  )
                })}
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
                {/* Group Sessions by Day */}
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
                  <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                      <FiCalendar style={{ marginRight: '0.5rem' }} />
                      Emploi du temps - {selectedGroup.name}
                    </span>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 'normal',
                      color: 'var(--text-muted)'
                    }}>
                      {groupSessions.length} séance(s)
                    </span>
                  </h3>

                  {Object.keys(sessionsByDay).length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucune séance</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[1, 2, 3, 4, 5, 6].map(day => {
                        if (!sessionsByDay[day]) return null
                        return (
                          <div key={day}>
                            <div style={{
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              color: 'var(--text-muted)',
                              marginBottom: '0.5rem',
                              textTransform: 'uppercase'
                            }}>
                              {scheduleService.getDayLabel(day)}
                            </div>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                              gap: '0.75rem'
                            }}>
                              {sessionsByDay[day].sort((a, b) => a.start_time?.localeCompare(b.start_time)).map(session => (
                                <motion.div
                                  key={session.id}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  onClick={() => handleSessionClick(session)}
                                  style={{
                                    padding: '1rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '10px',
                                    borderLeft: `4px solid ${scheduleService.getSessionTypeColor(session.session_type)}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                      {session.subject_name || session.subject?.name}
                                    </div>
                                    <span style={{
                                      padding: '0.15rem 0.4rem',
                                      borderRadius: '4px',
                                      fontSize: '0.65rem',
                                      fontWeight: '600',
                                      background: scheduleService.getSessionTypeColor(session.session_type),
                                      color: 'white'
                                    }}>
                                      {session.session_type}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                      <FiClock size={12} />
                                      {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}
                                      <span style={{ marginLeft: '0.25rem', opacity: 0.7 }}>({getSessionDuration(session)})</span>
                                    </span>
                                    {session.room && (
                                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <FiMapPin size={12} />
                                        {session.room}
                                      </span>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
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
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <h3 style={{ margin: 0 }}>
                      <FiUsers style={{ marginRight: '0.5rem' }} />
                      {selectedSession ? (
                        <>Étudiants - {selectedSession.subject_name} ({students.length})</>
                      ) : (
                        <>Étudiants du groupe ({students.length})</>
                      )}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {selectedSession && (
                        <button
                          onClick={() => {
                            setSelectedSession(null)
                            loadGroupStudents(selectedGroup.id)
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Voir tout le groupe
                        </button>
                      )}
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
                            width: '180px'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {loadingStudents ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                  ) : students.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucun étudiant</p>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '0.75rem',
                      maxHeight: '400px',
                      overflowY: 'auto'
                    }}>
                      {filteredStudents.map(student => {
                        const absenceInfo = selectedSession
                          ? getAbsenceStatusInfo(student.id, selectedSession.session_type)
                          : null

                        return (
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
                              fontSize: '1rem',
                              flexShrink: 0
                            }}>
                              {student.first_name?.[0]}{student.last_name?.[0]}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: '500' }}>
                                {student.first_name} {student.last_name}
                              </div>
                              <div style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                <FiMail size={12} />
                                {student.email}
                              </div>
                            </div>
                            {absenceInfo && (
                              <div style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                background: absenceInfo.status === 'eliminated' ? 'rgba(239, 68, 68, 0.1)' :
                                  absenceInfo.status === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                                    'rgba(107, 114, 128, 0.1)',
                                color: absenceInfo.color,
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                flexShrink: 0
                              }}>
                                {absenceInfo.status === 'eliminated' && <FiX size={10} />}
                                {absenceInfo.status === 'warning' && <FiAlertTriangle size={10} />}
                                {studentAbsenceCounts[student.id] || 0} abs
                              </div>
                            )}
                          </div>
                        )
                      })}
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
