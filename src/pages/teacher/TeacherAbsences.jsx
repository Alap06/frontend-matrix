import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUsers, FiCalendar, FiCheck, FiX, FiClock,
  FiSave, FiSearch, FiAlertTriangle, FiInfo,
  FiChevronLeft, FiPlay, FiUser
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as scheduleService from '../../services/scheduleService'

const TeacherAbsences = () => {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState({})
  const [studentAbsenceCounts, setStudentAbsenceCounts] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAbsenceHistory, setShowAbsenceHistory] = useState(null)
  const [absenceHistory, setAbsenceHistory] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Filter sessions currently in progress
  const currentSessions = useMemo(() => {
    return sessions.filter(session => scheduleService.isSessionInProgress(session))
  }, [sessions, currentTime])

  // All sessions for today
  const todaySessions = useMemo(() => {
    const today = new Date().getDay()
    return sessions.filter(session => session.day_of_week === today)
  }, [sessions])

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)
      const data = await scheduleService.getSessions()
      setSessions(data)
    } catch (error) {
      toast.error('Erreur lors du chargement des sessions')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async (sessionId) => {
    try {
      setLoading(true)
      const data = await scheduleService.getSessionStudents(sessionId, selectedDate)
      const studentsList = data.students || data
      setStudents(studentsList)

      // Initialize all as PRESENT (unchecked will become ABSENT on save)
      const initialAttendance = {}
      const absenceCounts = {}

      for (const student of studentsList) {
        initialAttendance[student.id] = student.attendance_status || 'PRESENT'
        absenceCounts[student.id] = student.absence_count || 0
      }

      setAttendanceData(initialAttendance)
      setStudentAbsenceCounts(absenceCounts)
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionSelect = (session) => {
    setSelectedSession(session)
    setShowAbsenceHistory(null)
    loadStudents(session.id)
  }

  const handleTogglePresence = (studentId) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }))
  }

  const handleSaveAttendance = async () => {
    if (!selectedSession) {
      toast.error('Veuillez sélectionner une session')
      return
    }

    try {
      setSaving(true)
      const attendances = Object.entries(attendanceData).map(([studentId, status]) => ({
        student_id: studentId,
        status: status
      }))

      await scheduleService.markAttendance(selectedSession.id, selectedDate, attendances)
      toast.success('Présences enregistrées avec succès')

      // Reload to update absence counts
      loadStudents(selectedSession.id)
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleShowAbsenceHistory = async (student) => {
    try {
      setShowAbsenceHistory(student)
      const history = await scheduleService.getStudentAbsenceHistory(student.id, selectedSession.id)
      setAbsenceHistory(history)
    } catch (error) {
      console.error(error)
      setAbsenceHistory([])
    }
  }

  const markAllAs = (status) => {
    const newData = {}
    students.forEach(student => {
      newData[student.id] = status
    })
    setAttendanceData(newData)
  }

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase()
    return (
      student.first_name?.toLowerCase().includes(query) ||
      student.last_name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query)
    )
  })

  const getAbsenceStatusInfo = (studentId) => {
    const count = studentAbsenceCounts[studentId] || 0
    const sessionType = selectedSession?.session_type || 'TD'
    return scheduleService.getAbsenceStatus(count, sessionType, false)
  }

  return (
    <div className="dashboard-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiUsers style={{ color: '#8b5cf6' }} /> Gestion des Présences
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
              Séances en cours uniquement • {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
          {/* Sessions List - Current Only */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              height: 'fit-content',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {/* Current Sessions */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiPlay style={{ color: '#10b981' }} />
                Séances en cours ({currentSessions.length})
              </h3>

              {loading && sessions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Chargement...</p>
              ) : currentSessions.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px'
                }}>
                  <FiClock size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>Aucune séance en cours</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {todaySessions.length} séance(s) prévue(s) aujourd'hui
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentSessions.map(session => (
                    <motion.div
                      key={session.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSessionSelect(session)}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: selectedSession?.id === session.id
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'var(--bg-secondary)',
                        color: selectedSession?.id === session.id ? 'white' : 'inherit',
                        border: selectedSession?.id === session.id ? 'none' : '2px solid #10b981',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#10b981',
                          animation: 'pulse 2s infinite'
                        }} />
                        <span style={{ fontWeight: '600' }}>
                          {session.subject_name || session.subject?.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                        {session.group_name || session.group?.name} • {session.session_type}
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                        {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)} • {scheduleService.getSessionTimeRemaining(session)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Today's Sessions */}
            {todaySessions.length > 0 && (
              <div>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <FiCalendar style={{ marginRight: '0.5rem' }} />
                  Séances du jour ({todaySessions.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {todaySessions.filter(s => !currentSessions.includes(s)).map(session => (
                    <div
                      key={session.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: 'var(--bg-secondary)',
                        opacity: 0.6,
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ fontWeight: '500' }}>{session.subject_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {session.start_time?.slice(0, 5)} - {session.end_time?.slice(0, 5)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Students Attendance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Absence History Modal */}
            <AnimatePresence>
              {showAbsenceHistory && (
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
                  onClick={() => setShowAbsenceHistory(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      maxWidth: '500px',
                      width: '90%',
                      maxHeight: '70vh',
                      overflow: 'auto'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '50px', height: '50px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: '600'
                      }}>
                        {showAbsenceHistory.first_name?.[0]}{showAbsenceHistory.last_name?.[0]}
                      </div>
                      <div>
                        <h3 style={{ margin: 0 }}>
                          {showAbsenceHistory.first_name} {showAbsenceHistory.last_name}
                        </h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          Historique des absences
                        </p>
                      </div>
                    </div>

                    {absenceHistory.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        Aucune absence enregistrée
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {absenceHistory.map((record, idx) => (
                          <div key={idx} style={{
                            padding: '0.75rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{new Date(record.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              background: record.is_justified ? 'rgba(139, 92, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: record.is_justified ? '#8b5cf6' : '#ef4444',
                              fontSize: '0.8rem'
                            }}>
                              {record.is_justified ? 'Justifiée' : 'Non justifiée'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setShowAbsenceHistory(null)}
                      style={{
                        width: '100%',
                        marginTop: '1rem',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--bg-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      Fermer
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedSession ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-muted)'
              }}>
                <FiUsers size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Sélectionnez une séance en cours pour marquer les présences</p>
              </div>
            ) : (
              <>
                {/* Header with actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: '#10b981', animation: 'pulse 2s infinite'
                      }} />
                      {selectedSession.subject_name || selectedSession.subject?.name}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {selectedSession.group_name} • {selectedDate} • {students.length} étudiant(s)
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => markAllAs('PRESENT')}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      <FiCheck style={{ marginRight: '0.25rem' }} /> Tous présents
                    </button>
                    <button
                      onClick={() => markAllAs('ABSENT')}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      <FiX style={{ marginRight: '0.25rem' }} /> Tous absents
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <FiSearch style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }} />
                    <input
                      type="text"
                      placeholder="Rechercher un étudiant..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)'
                      }}
                    />
                  </div>
                </div>

                {/* Legend */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
                    Présent
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444' }} />
                    Absent
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiAlertTriangle style={{ color: '#f59e0b' }} />
                    Avertissement (3 abs)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiX style={{ color: '#ef4444' }} />
                    Éliminé (4+ abs)
                  </span>
                </div>

                {/* Students List */}
                {loading ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                ) : students.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucun étudiant dans cette session</p>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    {filteredStudents.map(student => {
                      const status = attendanceData[student.id] || 'PRESENT'
                      const isPresent = status === 'PRESENT'
                      const absenceInfo = getAbsenceStatusInfo(student.id)

                      return (
                        <div
                          key={student.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            background: isPresent ? 'var(--bg-secondary)' : 'rgba(239, 68, 68, 0.05)',
                            borderRadius: '10px',
                            borderLeft: `4px solid ${isPresent ? '#10b981' : '#ef4444'}`,
                            gap: '1rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                            <div style={{
                              width: '40px', height: '40px', borderRadius: '50%',
                              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: '600', fontSize: '0.9rem'
                            }}>
                              {student.first_name?.[0]}{student.last_name?.[0]}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '500' }}>
                                {student.first_name} {student.last_name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {student.email}
                              </div>
                            </div>
                          </div>

                          {/* Absence Count Badge */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleShowAbsenceHistory(student)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '20px',
                              background: absenceInfo.status === 'eliminated' ? 'rgba(239, 68, 68, 0.1)' :
                                absenceInfo.status === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                                  'rgba(107, 114, 128, 0.1)',
                              color: absenceInfo.color,
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Cliquez pour voir l'historique"
                          >
                            {absenceInfo.status === 'eliminated' && <FiX size={12} />}
                            {absenceInfo.status === 'warning' && <FiAlertTriangle size={12} />}
                            {absenceInfo.message}
                          </motion.div>

                          {/* Presence Toggle */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTogglePresence(student.id)}
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '10px',
                              border: 'none',
                              background: isPresent
                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                : 'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem'
                            }}
                            title={isPresent ? 'Marquer absent' : 'Marquer présent'}
                          >
                            {isPresent ? <FiCheck /> : <FiX />}
                          </motion.button>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Save Button */}
                {students.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveAttendance}
                    disabled={saving}
                    style={{
                      width: '100%',
                      marginTop: '1.5rem',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    <FiSave />
                    {saving ? 'Enregistrement...' : 'Enregistrer les présences'}
                  </motion.button>
                )}
              </>
            )}
          </motion.div>
        </div>

        {/* CSS for pulse animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </motion.div>
    </div>
  )
}

export default TeacherAbsences
