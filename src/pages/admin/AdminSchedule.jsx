import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiCalendar, FiPlus, FiX, FiEdit2, FiTrash2, FiBook,
    FiClock, FiMapPin, FiUser, FiUsers, FiRefreshCw, FiFilter,
    FiCheck, FiSave
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as scheduleService from '../../services/scheduleService'
import * as userService from '../../services/userService'
import '../student/StudentPages.css'

const AdminSchedule = () => {
    // Data states
    const [sessions, setSessions] = useState([])
    const [groups, setGroups] = useState([])
    const [subjects, setSubjects] = useState([])
    const [teachers, setTeachers] = useState([])

    // UI states
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('sessions')
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('session')
    const [editingItem, setEditingItem] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    // Filters
    const [dayFilter, setDayFilter] = useState('')
    const [groupFilter, setGroupFilter] = useState('')

    // Form data
    const [sessionForm, setSessionForm] = useState({
        subject_id: '',
        teacher_id: '',
        group_id: '',
        session_type: 'COURS',
        day_of_week: 1,
        start_time: '08:30',
        end_time: '10:00',
        room: '',
        semester: 'S1',
        academic_year: '2024-2025'
    })

    const [groupForm, setGroupForm] = useState({
        name: '',
        description: '',
        level: '',
        specialty: ''
    })

    const [subjectForm, setSubjectForm] = useState({
        name: '',
        code: '',
        description: '',
        coefficient: 1,
        hours_cours: 21,
        hours_td: 21,
        hours_tp: 21
    })

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = async () => {
        try {
            setLoading(true)
            const [sessionsData, groupsData, subjectsData, teachersData] = await Promise.all([
                scheduleService.getSessions().catch(() => []),
                scheduleService.getGroups().catch(() => []),
                scheduleService.getSubjects().catch(() => []),
                userService.getUsersByRole('teacher').catch(() => [])
            ])
            setSessions(sessionsData)
            setGroups(groupsData)
            setSubjects(subjectsData)
            setTeachers(teachersData)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    // Session CRUD
    const handleSessionSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            if (editingItem) {
                await scheduleService.updateSession(editingItem.id, sessionForm)
                toast.success('Séance modifiée')
            } else {
                await scheduleService.createSession(sessionForm)
                toast.success('Séance créée')
            }
            setShowModal(false)
            loadAllData()
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Erreur')
        } finally {
            setSubmitting(false)
        }
    }

    const handleGroupSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            if (editingItem) {
                await scheduleService.updateGroup(editingItem.id, groupForm)
                toast.success('Groupe modifié')
            } else {
                await scheduleService.createGroup(groupForm)
                toast.success('Groupe créé')
            }
            setShowModal(false)
            loadAllData()
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Erreur')
        } finally {
            setSubmitting(false)
        }
    }

    const handleSubjectSubmit = async (e) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            if (editingItem) {
                await scheduleService.updateSubject(editingItem.id, subjectForm)
                toast.success('Matière modifiée')
            } else {
                await scheduleService.createSubject(subjectForm)
                toast.success('Matière créée')
            }
            setShowModal(false)
            loadAllData()
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Erreur')
        } finally {
            setSubmitting(false)
        }
    }

    const deleteSession = async (id) => {
        if (!window.confirm('Supprimer cette séance ?')) return
        try {
            await scheduleService.deleteSession(id)
            toast.success('Séance supprimée')
            loadAllData()
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        }
    }

    const deleteGroup = async (id) => {
        if (!window.confirm('Supprimer ce groupe ?')) return
        try {
            await scheduleService.deleteGroup(id)
            toast.success('Groupe supprimé')
            loadAllData()
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        }
    }

    const deleteSubject = async (id) => {
        if (!window.confirm('Supprimer cette matière ?')) return
        try {
            await scheduleService.deleteSubject(id)
            toast.success('Matière supprimée')
            loadAllData()
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        }
    }

    const openCreateModal = (type) => {
        setModalType(type)
        setEditingItem(null)
        if (type === 'session') {
            setSessionForm({
                subject_id: subjects[0]?.id || '',
                teacher_id: teachers[0]?.id || '',
                group_id: groups[0]?.id || '',
                session_type: 'COURS',
                day_of_week: 1,
                start_time: '08:30',
                end_time: '10:00',
                room: '',
                semester: 'S1',
                academic_year: '2024-2025'
            })
        } else if (type === 'group') {
            setGroupForm({ name: '', description: '', level: '', specialty: '' })
        } else if (type === 'subject') {
            setSubjectForm({ name: '', code: '', description: '', coefficient: 1, hours_cours: 21, hours_td: 21, hours_tp: 21 })
        }
        setShowModal(true)
    }

    const filteredSessions = sessions.filter(s => {
        if (dayFilter && s.day_of_week !== parseInt(dayFilter)) return false
        if (groupFilter && s.group_name !== groupFilter) return false
        return true
    })

    const getTypeColor = (type) => {
        switch (type) {
            case 'COURS': return '#3b82f6'
            case 'TD': return '#8b5cf6'
            case 'TP': return '#10b981'
            default: return '#6b7280'
        }
    }

    const getDayLabel = (day) => {
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
        return days[day] || ''
    }

    return (
        <div className="dashboard-page">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiCalendar /> Gestion Emploi du Temps
                        </h2>
                        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                            Créez et gérez les séances, groupes et matières
                        </p>
                    </div>
                    <button onClick={loadAllData} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiRefreshCw /> Actualiser
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                        { id: 'sessions', label: 'Séances', icon: FiClock, count: sessions.length },
                        { id: 'groups', label: 'Groupes', icon: FiUsers, count: groups.length },
                        { id: 'subjects', label: 'Matières', icon: FiBook, count: subjects.length }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '10px',
                                border: activeTab === tab.id ? '2px solid var(--primary-orange)' : '2px solid transparent',
                                background: activeTab === tab.id ? 'var(--primary-orange)' : 'var(--bg-card)',
                                color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: '500'
                            }}
                        >
                            <tab.icon /> {tab.label} <span style={{ opacity: 0.7 }}>({tab.count})</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="spinner"></div>
                        <p>Chargement...</p>
                    </div>
                ) : (
                    <>
                        {/* Sessions Tab */}
                        {activeTab === 'sessions' && (
                            <div>
                                {/* Filters and Add Button */}
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                    <select value={dayFilter} onChange={e => setDayFilter(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <option value="">Tous les jours</option>
                                        <option value="1">Lundi</option>
                                        <option value="2">Mardi</option>
                                        <option value="3">Mercredi</option>
                                        <option value="4">Jeudi</option>
                                        <option value="5">Vendredi</option>
                                        <option value="6">Samedi</option>
                                    </select>
                                    <select value={groupFilter} onChange={e => setGroupFilter(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                        <option value="">Tous les groupes</option>
                                        {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                                    </select>
                                    <div style={{ flex: 1 }} />
                                    <button onClick={() => openCreateModal('session')} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, var(--primary-orange), #e67e22)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                        <FiPlus /> Nouvelle Séance
                                    </button>
                                </div>

                                {/* Sessions Grid */}
                                {filteredSessions.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '12px' }}>
                                        <FiCalendar size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                        <h3>Aucune séance</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>Commencez par créer des groupes et matières, puis ajoutez des séances</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                        {filteredSessions.map((session, idx) => (
                                            <motion.div
                                                key={session.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                style={{
                                                    background: 'var(--bg-card)',
                                                    borderRadius: '12px',
                                                    padding: '1.25rem',
                                                    borderLeft: `4px solid ${getTypeColor(session.session_type)}`
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                    <div>
                                                        <h4 style={{ margin: 0 }}>{session.subject_name}</h4>
                                                        <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: getTypeColor(session.session_type), color: 'white' }}>
                                                            {session.session_type}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                        <button onClick={() => deleteSession(session.id)} style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}>
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <span><FiClock style={{ marginRight: '0.5rem' }} />{getDayLabel(session.day_of_week)} {session.start_time?.substring(0, 5)} - {session.end_time?.substring(0, 5)}</span>
                                                    <span><FiMapPin style={{ marginRight: '0.5rem' }} />{session.room}</span>
                                                    <span><FiUser style={{ marginRight: '0.5rem' }} />{session.teacher_name || 'Non assigné'}</span>
                                                    <span><FiUsers style={{ marginRight: '0.5rem' }} />{session.group_name}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Groups Tab */}
                        {activeTab === 'groups' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                                    <button onClick={() => openCreateModal('group')} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                        <FiPlus /> Nouveau Groupe
                                    </button>
                                </div>
                                {groups.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '12px' }}>
                                        <FiUsers size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                        <h3>Aucun groupe</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>Créez des groupes pour organiser les étudiants</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                        {groups.map((group, idx) => (
                                            <motion.div key={group.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.25rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <h4 style={{ margin: 0 }}>{group.name}</h4>
                                                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{group.level} - {group.specialty}</p>
                                                    </div>
                                                    <button onClick={() => deleteGroup(group.id)} style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}>
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                    <FiUsers /> {group.members_count || 0} étudiants
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Subjects Tab */}
                        {activeTab === 'subjects' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                                    <button onClick={() => openCreateModal('subject')} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                        <FiPlus /> Nouvelle Matière
                                    </button>
                                </div>
                                {subjects.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '12px' }}>
                                        <FiBook size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                        <h3>Aucune matière</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>Créez des matières pour les ajouter aux séances</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                        {subjects.map((subject, idx) => (
                                            <motion.div key={subject.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.25rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subject.code}</span>
                                                        <h4 style={{ margin: '0.25rem 0 0 0' }}>{subject.name}</h4>
                                                    </div>
                                                    <button onClick={() => deleteSubject(subject.id)} style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}>
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                </div>
                                                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                                                    <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Cours: {subject.hours_cours}h</span>
                                                    <span style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>TD: {subject.hours_td}h</span>
                                                    <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>TP: {subject.hours_tp}h</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                            {modalType === 'session' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ margin: 0 }}>{editingItem ? '✏️ Modifier Séance' : '➕ Nouvelle Séance'}</h3>
                                        <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                                    </div>
                                    <form onSubmit={handleSessionSubmit}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Matière</label>
                                                <select value={sessionForm.subject_id} onChange={e => setSessionForm({ ...sessionForm, subject_id: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                    <option value="">Sélectionner...</option>
                                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Groupe</label>
                                                <select value={sessionForm.group_id} onChange={e => setSessionForm({ ...sessionForm, group_id: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                    <option value="">Sélectionner...</option>
                                                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Enseignant</label>
                                                <select value={sessionForm.teacher_id} onChange={e => setSessionForm({ ...sessionForm, teacher_id: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                    <option value="">Non assigné</option>
                                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
                                                </select>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Type</label>
                                                    <select value={sessionForm.session_type} onChange={e => setSessionForm({ ...sessionForm, session_type: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                        <option value="COURS">Cours</option>
                                                        <option value="TD">TD</option>
                                                        <option value="TP">TP</option>
                                                        <option value="EXAMEN">Examen</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Jour</label>
                                                    <select value={sessionForm.day_of_week} onChange={e => setSessionForm({ ...sessionForm, day_of_week: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                        <option value="1">Lundi</option>
                                                        <option value="2">Mardi</option>
                                                        <option value="3">Mercredi</option>
                                                        <option value="4">Jeudi</option>
                                                        <option value="5">Vendredi</option>
                                                        <option value="6">Samedi</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Début</label>
                                                    <input type="time" value={sessionForm.start_time} onChange={e => setSessionForm({ ...sessionForm, start_time: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Fin</label>
                                                    <input type="time" value={sessionForm.end_time} onChange={e => setSessionForm({ ...sessionForm, end_time: e.target.value })} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Salle</label>
                                                <input type="text" value={sessionForm.room} onChange={e => setSessionForm({ ...sessionForm, room: e.target.value })} required placeholder="Ex: Salle A1, Labo 2..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>Annuler</button>
                                            <button type="submit" disabled={submitting} style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', border: 'none', background: 'var(--primary-orange)', color: 'white', cursor: 'pointer', fontWeight: '500' }}>
                                                {submitting ? '⏳...' : <><FiSave style={{ marginRight: '0.5rem' }} />Enregistrer</>}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {modalType === 'group' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ margin: 0 }}>{editingItem ? '✏️ Modifier Groupe' : '➕ Nouveau Groupe'}</h3>
                                        <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                                    </div>
                                    <form onSubmit={handleGroupSubmit}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nom</label>
                                                <input type="text" value={groupForm.name} onChange={e => setGroupForm({ ...groupForm, name: e.target.value })} required placeholder="Ex: 2INFO-A" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Niveau</label>
                                                    <input type="text" value={groupForm.level} onChange={e => setGroupForm({ ...groupForm, level: e.target.value })} placeholder="L1, L2, M1..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Spécialité</label>
                                                    <input type="text" value={groupForm.specialty} onChange={e => setGroupForm({ ...groupForm, specialty: e.target.value })} placeholder="Informatique..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                                                <textarea value={groupForm.description} onChange={e => setGroupForm({ ...groupForm, description: e.target.value })} placeholder="Description optionnelle..." rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical' }} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>Annuler</button>
                                            <button type="submit" disabled={submitting} style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: '500' }}>
                                                {submitting ? '⏳...' : <><FiSave style={{ marginRight: '0.5rem' }} />Enregistrer</>}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {modalType === 'subject' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ margin: 0 }}>{editingItem ? '✏️ Modifier Matière' : '➕ Nouvelle Matière'}</h3>
                                        <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
                                    </div>
                                    <form onSubmit={handleSubjectSubmit}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Code</label>
                                                    <input type="text" value={subjectForm.code} onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })} required placeholder="INF201" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nom</label>
                                                    <input type="text" value={subjectForm.name} onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })} required placeholder="Programmation" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Heures Cours</label>
                                                    <input type="number" value={subjectForm.hours_cours} onChange={e => setSubjectForm({ ...subjectForm, hours_cours: parseInt(e.target.value) })} min="0" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Heures TD</label>
                                                    <input type="number" value={subjectForm.hours_td} onChange={e => setSubjectForm({ ...subjectForm, hours_td: parseInt(e.target.value) })} min="0" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Heures TP</label>
                                                    <input type="number" value={subjectForm.hours_tp} onChange={e => setSubjectForm({ ...subjectForm, hours_tp: parseInt(e.target.value) })} min="0" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                            <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>Annuler</button>
                                            <button type="submit" disabled={submitting} style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', border: 'none', background: '#8b5cf6', color: 'white', cursor: 'pointer', fontWeight: '500' }}>
                                                {submitting ? '⏳...' : <><FiSave style={{ marginRight: '0.5rem' }} />Enregistrer</>}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AdminSchedule
