import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FiCalendar, FiClock, FiMapPin, FiUser, FiBook,
    FiChevronLeft, FiChevronRight, FiRefreshCw, FiAlertCircle
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as scheduleService from '../../services/scheduleService'

const StudentSchedule = () => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 1) // Default to Monday if Sunday
    const [schedule, setSchedule] = useState({})
    const [loading, setLoading] = useState(true)
    const [useDemoData, setUseDemoData] = useState(false)

    // Demo data for fallback
    const demoSchedule = {
        1: [ // Monday
            { id: 1, subject_name: 'Mathématiques', session_type: 'COURS', start_time: '08:30:00', end_time: '10:00:00', room: 'Salle A1', teacher_name: 'Dr. Ahmed' },
            { id: 2, subject_name: 'Programmation', session_type: 'TD', start_time: '10:15:00', end_time: '11:45:00', room: 'Labo 2', teacher_name: 'Pr. Fatma' },
            { id: 3, subject_name: 'Base de données', session_type: 'TP', start_time: '13:00:00', end_time: '14:30:00', room: 'Labo 3', teacher_name: 'Dr. Mohamed' }
        ],
        2: [ // Tuesday
            { id: 4, subject_name: 'Réseaux', session_type: 'COURS', start_time: '08:30:00', end_time: '10:00:00', room: 'Salle B2', teacher_name: 'Pr. Salah' },
            { id: 5, subject_name: 'Anglais', session_type: 'TD', start_time: '10:15:00', end_time: '11:45:00', room: 'Salle C1', teacher_name: 'Mrs. Sara' }
        ],
        3: [ // Wednesday
            { id: 6, subject_name: 'Algorithmique', session_type: 'COURS', start_time: '08:30:00', end_time: '10:00:00', room: 'Amphithéâtre A', teacher_name: 'Dr. Amine' },
            { id: 7, subject_name: 'Programmation', session_type: 'TP', start_time: '14:00:00', end_time: '15:30:00', room: 'Labo 1', teacher_name: 'Pr. Fatma' }
        ],
        4: [ // Thursday
            { id: 8, subject_name: 'Mathématiques', session_type: 'TD', start_time: '10:15:00', end_time: '11:45:00', room: 'Salle A2', teacher_name: 'Dr. Ahmed' },
            { id: 9, subject_name: 'Réseaux', session_type: 'TP', start_time: '13:00:00', end_time: '14:30:00', room: 'Labo Réseau', teacher_name: 'Pr. Salah' },
            { id: 10, subject_name: 'Projet', session_type: 'TP', start_time: '15:00:00', end_time: '16:30:00', room: 'Labo 2', teacher_name: 'Dr. Mohamed' }
        ],
        5: [ // Friday
            { id: 11, subject_name: 'Base de données', session_type: 'COURS', start_time: '08:30:00', end_time: '10:00:00', room: 'Salle B1', teacher_name: 'Dr. Mohamed' },
            { id: 12, subject_name: 'Culture Entreprise', session_type: 'COURS', start_time: '10:15:00', end_time: '11:45:00', room: 'Salle C2', teacher_name: 'M. Karim' }
        ],
        6: [], // Saturday
        0: []  // Sunday
    }

    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    const shortDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

    useEffect(() => {
        loadSchedule()
    }, [])

    const loadSchedule = async () => {
        try {
            setLoading(true)
            const data = await scheduleService.getMySchedule()
            setSchedule(data)
            setUseDemoData(false)
        } catch (error) {
            console.error('Failed to load schedule, using demo data:', error)
            setSchedule(demoSchedule)
            setUseDemoData(true)
        } finally {
            setLoading(false)
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'COURS': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '#3b82f6' }
            case 'TD': return { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '#8b5cf6' }
            case 'TP': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '#10b981' }
            case 'EXAMEN': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '#ef4444' }
            default: return { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' }
        }
    }

    const formatTime = (timeStr) => {
        if (!timeStr) return ''
        return timeStr.substring(0, 5) // Remove seconds if present
    }

    const todaySchedule = schedule[selectedDay] || []

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() + (direction * 7))
        setCurrentDate(newDate)
    }

    const getWeekDates = () => {
        const week = []
        const startOfWeek = new Date(currentDate)
        const day = startOfWeek.getDay()
        startOfWeek.setDate(startOfWeek.getDate() - day + 1) // Start from Monday

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek)
            date.setDate(date.getDate() + i)
            week.push(date)
        }
        return week
    }

    return (
        <div className="dashboard-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiCalendar /> Mon Emploi du Temps
                        </h2>
                        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
                            Consultez vos cours, TD et TP de la semaine
                        </p>
                    </div>
                    <button
                        onClick={loadSchedule}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--bg-card)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <FiRefreshCw /> Actualiser
                    </button>
                </div>

                {/* Demo Data Notice */}
                {useDemoData && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                        <FiAlertCircle style={{ color: '#f59e0b', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.875rem', color: '#f59e0b' }}>
                            Données de démonstration affichées. L'emploi du temps réel sera disponible une fois les séances configurées.
                        </span>
                    </div>
                )}

                {/* Week Navigation */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: 'var(--bg-card)',
                    borderRadius: '12px'
                }}>
                    <button
                        onClick={() => navigateWeek(-1)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--bg-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        <FiChevronLeft /> Précédent
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </div>
                    </div>

                    <button
                        onClick={() => navigateWeek(1)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--bg-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        Suivant <FiChevronRight />
                    </button>
                </div>

                {/* Day Selector */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    overflowX: 'auto',
                    paddingBottom: '0.5rem'
                }}>
                    {getWeekDates().map((date, idx) => {
                        const dayNum = date.getDay()
                        const isSelected = selectedDay === dayNum
                        const isToday = date.toDateString() === new Date().toDateString()
                        const hasClasses = schedule[dayNum] && schedule[dayNum].length > 0

                        return (
                            <motion.button
                                key={idx}
                                onClick={() => setSelectedDay(dayNum)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    flex: '1 0 auto',
                                    minWidth: '80px',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: isSelected ? '2px solid var(--primary-orange)' : '2px solid transparent',
                                    background: isSelected ? 'var(--primary-orange)' : 'var(--bg-card)',
                                    color: isSelected ? 'white' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    position: 'relative',
                                    boxShadow: isSelected ? '0 4px 12px rgba(192, 121, 33, 0.3)' : 'var(--shadow-sm)'
                                }}
                            >
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{shortDays[dayNum]}</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0.25rem 0' }}>
                                    {date.getDate()}
                                </div>
                                {isToday && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '4px',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: isSelected ? 'white' : '#10b981'
                                    }} />
                                )}
                                {hasClasses && !isSelected && (
                                    <div style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: 'var(--primary-orange)',
                                        margin: '0 auto'
                                    }} />
                                )}
                            </motion.button>
                        )
                    })}
                </div>

                {/* Schedule for Selected Day */}
                <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    minHeight: '300px'
                }}>
                    <h3 style={{ margin: '0 0 1.5rem 0' }}>
                        {daysOfWeek[selectedDay]} - {todaySchedule.length} séance{todaySchedule.length > 1 ? 's' : ''}
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Chargement...</p>
                        </div>
                    ) : todaySchedule.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: 'var(--text-muted)'
                        }}>
                            <FiCalendar size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p style={{ margin: 0 }}>Pas de cours ce jour</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {todaySchedule.map((session, idx) => {
                                const typeStyle = getTypeColor(session.session_type)
                                return (
                                    <motion.div
                                        key={session.id || idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        style={{
                                            display: 'flex',
                                            background: typeStyle.bg,
                                            borderRadius: '12px',
                                            borderLeft: `4px solid ${typeStyle.border}`,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Time */}
                                        <div style={{
                                            padding: '1rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            minWidth: '100px',
                                            borderRight: `1px solid ${typeStyle.border}20`
                                        }}>
                                            <FiClock style={{ marginBottom: '0.25rem', color: typeStyle.color }} />
                                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: typeStyle.color }}>
                                                {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div style={{ flex: 1, padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{session.subject_name}</span>
                                                <span style={{
                                                    padding: '0.15rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '600',
                                                    background: typeStyle.color,
                                                    color: 'white'
                                                }}>
                                                    {session.session_type}
                                                </span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                gap: '1rem',
                                                fontSize: '0.875rem',
                                                color: 'var(--text-muted)',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <FiMapPin size={14} /> {session.room}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <FiUser size={14} /> {session.teacher_name}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#3b82f6' }} />
                        <span style={{ fontSize: '0.875rem' }}>Cours magistral</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#8b5cf6' }} />
                        <span style={{ fontSize: '0.875rem' }}>Travaux Dirigés (TD)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
                        <span style={{ fontSize: '0.875rem' }}>Travaux Pratiques (TP)</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default StudentSchedule
