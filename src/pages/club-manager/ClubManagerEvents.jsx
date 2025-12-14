import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiCalendar, FiPlus, FiEdit2, FiTrash2, FiMapPin,
    FiClock, FiX, FiSave, FiUsers
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as clubService from '../../services/clubService'

const ClubManagerEvents = () => {
    const [events, setEvents] = useState([])
    const [clubs, setClubs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const [formData, setFormData] = useState({
        club: '',
        title: '',
        description: '',
        date: '',
        start_time: '',
        end_time: '',
        location: '',
        expected_attendees: 0
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [eventsData, clubsData] = await Promise.all([
                clubService.getEvents(),
                clubService.getClubs()
            ])
            setEvents(eventsData)
            setClubs(clubsData)
            if (clubsData.length > 0 && !formData.club) {
                setFormData(prev => ({ ...prev, club: clubsData[0].id }))
            }
        } catch (error) {
            toast.error('Erreur lors du chargement')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingEvent) {
                await clubService.updateEvent(editingEvent.public_id, formData)
                toast.success('Événement mis à jour')
            } else {
                await clubService.createEvent(formData)
                toast.success('Événement créé')
            }
            setShowModal(false)
            setEditingEvent(null)
            resetForm()
            loadData()
        } catch (error) {
            toast.error('Erreur lors de l\'enregistrement')
            console.error(error)
        }
    }

    const handleEdit = (event) => {
        setEditingEvent(event)
        setFormData({
            club: event.club,
            title: event.title,
            description: event.description,
            date: event.date,
            start_time: event.start_time || '',
            end_time: event.end_time || '',
            location: event.location,
            expected_attendees: event.expected_attendees
        })
        setShowModal(true)
    }

    const handleDelete = async (publicId) => {
        if (!confirm('Supprimer cet événement ?')) return
        try {
            await clubService.deleteEvent(publicId)
            toast.success('Événement supprimé')
            loadData()
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        }
    }

    const resetForm = () => {
        setFormData({
            club: clubs.length > 0 ? clubs[0].id : '',
            title: '',
            description: '',
            date: '',
            start_time: '',
            end_time: '',
            location: '',
            expected_attendees: 0
        })
    }

    return (
        <div className="dashboard-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiCalendar style={{ color: '#8b5cf6' }} /> Événements
                        </h1>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                            Organisez les événements de votre club
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { resetForm(); setEditingEvent(null); setShowModal(true) }}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <FiPlus /> Nouvel Événement
                    </motion.button>
                </div>

                {/* Events List */}
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                ) : events.length === 0 ? (
                    <motion.div
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '3rem',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <FiCalendar size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-muted)' }}>Aucun événement. Créez votre premier événement !</p>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {events.map((event, index) => {
                            const statusColor = clubService.getEventStatusColor(event.status)

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        background: 'var(--bg-card)',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        boxShadow: 'var(--shadow-md)',
                                        borderLeft: `4px solid ${statusColor}`
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <h3 style={{ margin: 0 }}>{event.title}</h3>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    background: `${statusColor}15`,
                                                    color: statusColor,
                                                    fontSize: '0.7rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {clubService.getEventStatusLabel(event.status)}
                                                </span>
                                            </div>
                                            <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                {event.description?.slice(0, 150)}...
                                            </p>
                                            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <FiCalendar size={14} /> {new Date(event.date).toLocaleDateString('fr-FR')}
                                                </span>
                                                {event.start_time && (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <FiClock size={14} /> {event.start_time}
                                                    </span>
                                                )}
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <FiMapPin size={14} /> {event.location}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <FiUsers size={14} /> {event.expected_attendees} attendus
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(event)}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'rgba(139, 92, 246, 0.1)',
                                                    color: '#8b5cf6',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.public_id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#ef4444',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem'
                        }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'var(--bg-card)',
                                borderRadius: '16px',
                                padding: '2rem',
                                width: '100%',
                                maxWidth: '600px',
                                maxHeight: '90vh',
                                overflow: 'auto',
                                boxShadow: 'var(--shadow-xl)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0 }}>
                                    {editingEvent ? 'Modifier l\'Événement' : 'Nouvel Événement'}
                                </h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Club</label>
                                        <select
                                            value={formData.club}
                                            onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)'
                                            }}
                                        >
                                            {clubs.map(club => (
                                                <option key={club.id} value={club.id}>{club.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Titre</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)'
                                            }}
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            rows={3}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Lieu</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Heure début</label>
                                        <input
                                            type="time"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Heure fin</label>
                                        <input
                                            type="time"
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Participants attendus</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.expected_attendees}
                                            onChange={(e) => setFormData({ ...formData, expected_attendees: parseInt(e.target.value) })}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--bg-secondary)'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            border: '1px solid var(--border-color)',
                                            background: 'transparent',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Annuler
                                    </button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
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
                                        <FiSave /> {editingEvent ? 'Mettre à jour' : 'Créer'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ClubManagerEvents
