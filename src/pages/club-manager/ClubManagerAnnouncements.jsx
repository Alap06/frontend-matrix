import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBell, FiCalendar, FiAlertCircle } from 'react-icons/fi'
import * as clubService from '../../services/clubService'

const ClubManagerAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAnnouncements()
    }, [])

    const loadAnnouncements = async () => {
        try {
            setLoading(true)
            const data = await clubService.getAnnouncements()
            setAnnouncements(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const getPriorityIcon = (priority) => {
        const color = clubService.getPriorityColor(priority)
        return <FiAlertCircle style={{ color }} />
    }

    return (
        <div className="dashboard-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiBell style={{ color: '#8b5cf6' }} /> Annonces
                    </h1>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                        Annonces de l'administration pour les clubs
                    </p>
                </div>

                {/* Announcements List */}
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                ) : announcements.length === 0 ? (
                    <motion.div
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '3rem',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <FiBell size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-muted)' }}>Aucune annonce pour le moment</p>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {announcements.map((ann, index) => {
                            const priorityColor = clubService.getPriorityColor(ann.priority)

                            return (
                                <motion.div
                                    key={ann.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        background: 'var(--bg-card)',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        boxShadow: 'var(--shadow-md)',
                                        borderLeft: `4px solid ${priorityColor}`
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {getPriorityIcon(ann.priority)}
                                            <h3 style={{ margin: 0 }}>{ann.title}</h3>
                                        </div>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            background: `${priorityColor}15`,
                                            color: priorityColor,
                                            fontSize: '0.7rem',
                                            fontWeight: '500'
                                        }}>
                                            {clubService.getPriorityLabel(ann.priority)}
                                        </span>
                                    </div>

                                    <p style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                        {ann.content}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <FiCalendar size={14} /> {new Date(ann.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                        {ann.created_by_name && (
                                            <span>Par: {ann.created_by_name}</span>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default ClubManagerAnnouncements
