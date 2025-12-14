import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FiUsers, FiCalendar, FiFileText, FiTrendingUp,
    FiBell, FiPlus
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import * as clubService from '../../services/clubService'

const ClubManagerDashboard = () => {
    const [stats, setStats] = useState({
        clubs_count: 0,
        total_events: 0,
        upcoming_events: 0,
        completed_events: 0,
        reports_count: 0,
        total_members: 0
    })
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [statsData, announcementsData] = await Promise.all([
                clubService.getClubStats(),
                clubService.getAnnouncements()
            ])
            setStats(statsData)
            setAnnouncements(announcementsData.slice(0, 5))
        } catch (error) {
            console.error(error)
            // Use default stats if API fails
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            label: 'Mes Clubs',
            value: stats.clubs_count,
            icon: FiUsers,
            color: '#8b5cf6',
            link: '/club-manager/club'
        },
        {
            label: 'Total Événements',
            value: stats.total_events,
            icon: FiCalendar,
            color: '#3b82f6',
            link: '/club-manager/events'
        },
        {
            label: 'Événements à venir',
            value: stats.upcoming_events,
            icon: FiTrendingUp,
            color: '#10b981',
            link: '/club-manager/events'
        },
        {
            label: 'Total Membres',
            value: stats.total_members,
            icon: FiUsers,
            color: '#f59e0b',
            link: '/club-manager/club'
        }
    ]

    return (
        <div className="dashboard-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ margin: 0, fontSize: '1.75rem' }}>
                        Tableau de Bord - Gestionnaire de Club
                    </h1>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                        Gérez votre club, événements et rapports
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    {statCards.map((card, index) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                        >
                            <Link to={card.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    boxShadow: 'var(--shadow-md)',
                                    borderLeft: `4px solid ${card.color}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontSize: '2rem', fontWeight: '700', color: card.color }}>
                                                {loading ? '...' : card.value}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {card.label}
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '12px',
                                            background: `${card.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: card.color
                                        }}>
                                            <card.icon size={22} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions & Announcements */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <h3 style={{ margin: '0 0 1rem 0' }}>Actions Rapides</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/club-manager/events" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
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
                                    <FiPlus /> Créer un Événement
                                </motion.button>
                            </Link>
                            <Link to="/club-manager/reports" style={{ textDecoration: 'none' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-color)',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <FiFileText /> Créer un Rapport
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Announcements */}
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
                        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiBell style={{ color: '#8b5cf6' }} /> Annonces
                        </h3>
                        {announcements.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                                Aucune annonce
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {announcements.map(ann => (
                                    <div
                                        key={ann.id}
                                        style={{
                                            padding: '0.75rem',
                                            background: 'var(--bg-secondary)',
                                            borderRadius: '8px',
                                            borderLeft: `3px solid ${clubService.getPriorityColor(ann.priority)}`
                                        }}
                                    >
                                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                                            {ann.title}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(ann.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Link to="/club-manager/announcements" style={{
                            display: 'block',
                            textAlign: 'center',
                            marginTop: '1rem',
                            color: '#8b5cf6',
                            textDecoration: 'none',
                            fontSize: '0.875rem'
                        }}>
                            Voir toutes les annonces →
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default ClubManagerDashboard
