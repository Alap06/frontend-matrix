import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FiFileText, FiClock, FiCheck, FiX, FiTrendingUp, FiUsers,
    FiMessageSquare, FiAlertCircle, FiCheckCircle, FiXCircle
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import * as documentService from '../../services/documentService'
import * as reclamationService from '../../services/reclamationService'
import * as userService from '../../services/userService'

const ScolarDashboard = () => {
    const [documents, setDocuments] = useState([])
    const [reclamations, setReclamations] = useState([])
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = async () => {
        try {
            setLoading(true)
            const [docsData, reclsData, usersData] = await Promise.all([
                documentService.getDocumentRequests(),
                reclamationService.getReclamations(),
                userService.getUsers({ role: 'student' })
            ])
            setDocuments(docsData)
            setReclamations(reclsData)
            setStudents(usersData)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Documents stats
    const docStats = {
        total: documents.length,
        new: documents.filter(d => d.status === 'NEW').length,
        inProgress: documents.filter(d => d.status === 'IN_PROGRESS').length,
        ready: documents.filter(d => d.status === 'READY').length,
        rejected: documents.filter(d => d.status === 'REJECTED').length
    }

    // Reclamations stats
    const reclStats = {
        total: reclamations.length,
        pending: reclamations.filter(r => r.status === 'pending').length,
        inProgress: reclamations.filter(r => r.status === 'in_progress').length,
        resolved: reclamations.filter(r => r.status === 'resolved').length
    }

    const statCards = [
        { label: 'Total Demandes', value: docStats.total, icon: FiFileText, color: '#8b5cf6', link: '/scolar/documents' },
        { label: 'Nouvelles Demandes', value: docStats.new, icon: FiClock, color: '#f59e0b', link: '/scolar/documents' },
        { label: 'En Cours', value: docStats.inProgress, icon: FiTrendingUp, color: '#3b82f6', link: '/scolar/documents' },
        { label: 'Prêtes', value: docStats.ready, icon: FiCheck, color: '#10b981', link: '/scolar/documents' },
        { label: 'Réclamations', value: reclStats.total, icon: FiMessageSquare, color: '#ec4899', link: '/scolar/reclamations' },
        { label: 'Non Résolues', value: reclStats.pending + reclStats.inProgress, icon: FiAlertCircle, color: '#f59e0b', link: '/scolar/reclamations' },
        { label: 'Étudiants Actifs', value: students.length, icon: FiUsers, color: '#06b6d4', link: '#' },
        { label: 'Rejetées', value: docStats.rejected, icon: FiXCircle, color: '#ef4444', link: '/scolar/documents' }
    ]

    const recentDocuments = documents.slice(0, 5)
    const recentReclamations = reclamations.slice(0, 5)

    // Document type breakdown
    const docTypes = {}
    documents.forEach(doc => {
        const type = documentService.getDocumentTypeLabel(doc.document_type)
        docTypes[type] = (docTypes[type] || 0) + 1
    })

    return (
        <div className="dashboard-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ margin: 0, fontSize: '1.75rem' }}>
                        📊 Tableau de Bord - Responsable Scolaire
                    </h1>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                        Vue d'ensemble complète des demandes et réclamations
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
                        <Link to={card.link} key={card.label} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.03, y: -5 }}
                                style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    boxShadow: 'var(--shadow-md)',
                                    borderLeft: `4px solid ${card.color}`,
                                    cursor: card.link !== '#' ? 'pointer' : 'default',
                                    transition: 'all 0.2s'
                                }}
                            >
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
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Two column layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Recent Documents */}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiFileText style={{ color: '#8b5cf6' }} /> Dernières Demandes
                            </h3>
                            <Link to="/scolar/documents" style={{ color: '#8b5cf6', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                                Voir tout →
                            </Link>
                        </div>

                        {loading ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                        ) : recentDocuments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucune demande</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {recentDocuments.map(doc => {
                                    const statusColor = documentService.getStatusColor(doc.status)
                                    return (
                                        <div
                                            key={doc.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.75rem 1rem',
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '10px',
                                                borderLeft: `3px solid ${statusColor}`
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                                    {documentService.getDocumentTypeLabel(doc.document_type)}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {doc.student_name || `Étudiant #${doc.student}`}
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                background: `${statusColor}15`,
                                                color: statusColor,
                                                fontSize: '0.7rem',
                                                fontWeight: '600'
                                            }}>
                                                {documentService.getStatusLabel(doc.status)}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Recent Reclamations */}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiMessageSquare style={{ color: '#ec4899' }} /> Dernières Réclamations
                            </h3>
                            <Link to="/scolar/reclamations" style={{ color: '#ec4899', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                                Voir tout →
                            </Link>
                        </div>

                        {loading ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                        ) : recentReclamations.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Aucune réclamation</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {recentReclamations.map(recl => {
                                    const statusColors = {
                                        'pending': '#f59e0b',
                                        'in_progress': '#3b82f6',
                                        'resolved': '#10b981',
                                        'rejected': '#ef4444'
                                    }
                                    const statusLabels = {
                                        'pending': 'En attente',
                                        'in_progress': 'En cours',
                                        'resolved': 'Résolu',
                                        'rejected': 'Rejeté'
                                    }
                                    const color = statusColors[recl.status] || '#6b7280'
                                    return (
                                        <div
                                            key={recl.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.75rem 1rem',
                                                background: 'var(--bg-secondary)',
                                                borderRadius: '10px',
                                                borderLeft: `3px solid ${color}`
                                            }}
                                        >
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <div style={{ fontWeight: '500', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {recl.title || recl.category_name || 'Réclamation'}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {recl.user_name || 'Anonyme'}
                                                </div>
                                            </div>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                background: `${color}15`,
                                                color: color,
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                                whiteSpace: 'nowrap',
                                                marginLeft: '0.5rem'
                                            }}>
                                                {statusLabels[recl.status] || recl.status}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Document Types Breakdown */}
                {!loading && Object.keys(docTypes).length > 0 && (
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
                        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            📑 Répartition par Type de Document
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                            {Object.entries(docTypes).map(([type, count]) => (
                                <div key={type} style={{
                                    padding: '0.75rem 1rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{type}</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#8b5cf6' }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

export default ScolarDashboard
