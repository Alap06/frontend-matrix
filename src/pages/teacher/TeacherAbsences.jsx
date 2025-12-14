import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUsers, FiCalendar, FiCheck, FiX, FiClock,
  FiSave, FiSearch, FiFilter, FiChevronDown
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as scheduleService from '../../services/scheduleService'

const TeacherAbsences = () => {
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load teacher's sessions
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
      setStudents(data.students || data)

      // Initialize attendance data
      const initialAttendance = {}
        ; (data.students || data).forEach(student => {
          initialAttendance[student.id] = student.attendance_status || 'PRESENT'
        })
      setAttendanceData(initialAttendance)
    } catch (error) {
      toast.error('Erreur lors du chargement des étudiants')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionSelect = (session) => {
    setSelectedSession(session)
    loadStudents(session.id)
  }

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
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
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement')
      console.error(error)
    } finally {
      setSaving(false)
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PRESENT':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: <FiCheck /> }
      case 'ABSENT':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: <FiX /> }
      case 'LATE':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: <FiClock /> }
      case 'EXCUSED':
        return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', icon: <FiCheck /> }
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', icon: null }
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
              Marquer les présences des étudiants pour vos sessions
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

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
          {/* Sessions List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              height: 'fit-content',
              maxHeight: '70vh',
              overflowY: 'auto'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
              <FiCalendar style={{ marginRight: '0.5rem' }} />
              Mes Sessions
            </h3>

            {loading && sessions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Chargement...</p>
            ) : sessions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Aucune session</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sessions.map(session => (
                  <motion.div
                    key={session.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleSessionSelect(session)}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: selectedSession?.id === session.id
                        ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
                        : 'var(--bg-secondary)',
                      color: selectedSession?.id === session.id ? 'white' : 'inherit',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {session.subject_name || session.subject?.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      {session.group_name || session.group?.name} • {session.session_type}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>
                      {scheduleService.getDayLabel(session.day_of_week)} {session.start_time} - {session.end_time}
                    </div>
                  </motion.div>
                ))}
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
            {!selectedSession ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: 'var(--text-muted)'
              }}>
                <FiUsers size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Sélectionnez une session pour marquer les présences</p>
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
                    <h3 style={{ margin: 0 }}>
                      {selectedSession.subject_name || selectedSession.subject?.name}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {selectedSession.group_name} • {selectedDate}
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
                      Tous présents
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
                      Tous absents
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

                {/* Students List */}
                {loading ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                ) : students.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucun étudiant dans cette session</p>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    {filteredStudents.map(student => {
                      const status = attendanceData[student.id] || 'PRESENT'
                      const style = getStatusStyle(status)

                      return (
                        <div
                          key={student.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: '10px',
                            gap: '1rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: '600'
                            }}>
                              {student.first_name?.[0]}{student.last_name?.[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500' }}>
                                {student.first_name} {student.last_name}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {student.email}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(s => {
                              const st = getStatusStyle(s)
                              return (
                                <button
                                  key={s}
                                  onClick={() => handleAttendanceChange(student.id, s)}
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    border: status === s ? `2px solid ${st.color}` : '2px solid transparent',
                                    background: st.bg,
                                    color: st.color,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: status === s ? 1 : 0.5,
                                    transition: 'all 0.2s'
                                  }}
                                  title={scheduleService.getAttendanceStatusLabel(s)}
                                >
                                  {st.icon}
                                </button>
                              )
                            })}
                          </div>
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
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
      </motion.div>
    </div>
  )
}

export default TeacherAbsences
