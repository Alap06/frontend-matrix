import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiFileText, FiPlus, FiSearch, FiFilter, FiDownload,
    FiClock, FiCheck, FiX, FiEye, FiCalendar
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as documentService from '../../services/documentService'

const TeacherDocuments = () => {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('')

    const [formData, setFormData] = useState({
        document_type: 'CERTIFICATE_PRESENCE',
        language: 'fr',
        reception_type: 'ONLINE',
        academic_year: '2024-2025'
    })

    useEffect(() => {
        loadDocuments()
    }, [filterStatus])

    const loadDocuments = async () => {
        try {
            setLoading(true)
            const filters = {}
            if (filterStatus) filters.status = filterStatus
            const data = await documentService.getDocumentRequests(filters)
            setDocuments(data)
        } catch (error) {
            toast.error('Erreur lors du chargement des demandes')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await documentService.createDocumentRequest(formData)
            toast.success('Demande créée avec succès')
            setShowModal(false)
            loadDocuments()
            setFormData({
                document_type: 'CERTIFICATE_PRESENCE',
                language: 'fr',
                reception_type: 'ONLINE',
                academic_year: '2024-2025'
            })
        } catch (error) {
            toast.error('Erreur lors de la création')
            console.error(error)
        }
    }

    const handleViewDetails = (doc) => {
        setSelectedDocument(doc)
        setShowDetailModal(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous supprimer cette demande ?')) return
        try {
            await documentService.deleteDocumentRequest(id)
            toast.success('Demande supprimée')
            loadDocuments()
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        }
    }

    const filteredDocuments = documents.filter(doc => {
        const query = searchQuery.toLowerCase()
        const typeLabel = documentService.getDocumentTypeLabel(doc.document_type).toLowerCase()
        return typeLabel.includes(query) || doc.academic_year?.includes(query)
    })

    const getStatusStyle = (status) => {
        const color = documentService.getStatusColor(status)
        return {
            background: `${color}15`,
            color: color,
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '500'
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
                            <FiFileText style={{ color: '#8b5cf6' }} /> Mes Demandes de Documents
                        </h1>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                            Demandez des documents administratifs
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowModal(true)}
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
                        <FiPlus /> Nouvelle Demande
                    </motion.button>
                </div>

                {/* Filters */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <FiSearch style={{
                            position: 'absolute',
                            left: '1rem',
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
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                borderRadius: '10px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-card)'
                            }}
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            minWidth: '150px'
                        }}
                    >
                        <option value="">Tous les statuts</option>
                        {documentService.STATUSES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Documents List */}
                <motion.div
                    style={{
                        background: 'var(--bg-card)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    {loading ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                    ) : filteredDocuments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <FiFileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Aucune demande de document</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {filteredDocuments.map(doc => (
                                <motion.div
                                    key={doc.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem 1.5rem',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '10px',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '10px',
                                            background: 'rgba(139, 92, 246, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#8b5cf6'
                                        }}>
                                            <FiFileText size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>
                                                {documentService.getDocumentTypeLabel(doc.document_type)}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {doc.academic_year} • {documentService.getLanguageLabel(doc.language)}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={getStatusStyle(doc.status)}>
                                            {documentService.getStatusLabel(doc.status)}
                                        </span>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleViewDetails(doc)}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'rgba(139, 92, 246, 0.1)',
                                                    color: '#8b5cf6',
                                                    cursor: 'pointer'
                                                }}
                                                title="Voir détails"
                                            >
                                                <FiEye />
                                            </button>
                                            {doc.status === 'NEW' && (
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#ef4444',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Supprimer"
                                                >
                                                    <FiX />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Create Modal */}
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
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem'
                        }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: '#ffffff',
                                borderRadius: '24px',
                                padding: '0',
                                width: '100%',
                                maxWidth: '480px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, var(--primary-orange, #f97316), #fb923c)',
                                padding: '1.25rem 1.5rem',
                                color: 'white'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>📄 Nouvelle Demande</h3>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        onClick={() => setShowModal(false)}
                                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '0.4rem', color: 'white' }}
                                    >
                                        <FiX size={18} />
                                    </motion.button>
                                </div>
                                <p style={{ margin: '0.3rem 0 0 0', opacity: 0.95, fontSize: '0.85rem' }}>
                                    Demandez un document administratif
                                </p>
                            </div>

                            {/* Body */}
                            <form onSubmit={handleSubmit} style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1f2937', fontSize: '0.9rem' }}>
                                            📑 Type de document
                                        </label>
                                        <select
                                            value={formData.document_type}
                                            onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '12px',
                                                border: '2px solid #e5e7eb',
                                                background: '#f9fafb',
                                                color: '#1f2937',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {documentService.DOCUMENT_TYPES.map(t => (
                                                <option key={t.value} value={t.value}>{t.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1f2937', fontSize: '0.9rem' }}>
                                            🌐 Langue du document
                                        </label>
                                        <select
                                            value={formData.language}
                                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '12px',
                                                border: '2px solid #e5e7eb',
                                                background: '#f9fafb',
                                                color: '#1f2937',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {documentService.LANGUAGES.map(l => (
                                                <option key={l.value} value={l.value}>{l.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1f2937', fontSize: '0.9rem' }}>
                                            📍 Mode de réception
                                        </label>
                                        <select
                                            value={formData.reception_type}
                                            onChange={(e) => setFormData({ ...formData, reception_type: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '12px',
                                                border: '2px solid #e5e7eb',
                                                background: '#f9fafb',
                                                color: '#1f2937',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {documentService.RECEPTION_TYPES.map(r => (
                                                <option key={r.value} value={r.value}>{r.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1f2937', fontSize: '0.9rem' }}>
                                            📅 Année académique
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.academic_year}
                                            onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                                            placeholder="2024-2025"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '12px',
                                                border: '2px solid #e5e7eb',
                                                background: '#f9fafb',
                                                color: '#1f2937',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '0.8rem',
                                            borderRadius: '12px',
                                            border: '2px solid #e5e7eb',
                                            background: '#ffffff',
                                            color: '#6b7280',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Annuler
                                    </button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            flex: 1,
                                            padding: '0.8rem',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, var(--primary-orange, #f97316), #fb923c)',
                                            color: 'white',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Soumettre
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedDocument && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '1rem'
                        }}
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 30, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: '#ffffff',
                                borderRadius: '24px',
                                padding: '0',
                                width: '100%',
                                maxWidth: '480px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary-orange, #f97316), #fb923c)',
                                    padding: '1.25rem 1.5rem',
                                    color: 'white'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>📄 Détails de la demande</h3>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        onClick={() => setShowDetailModal(false)}
                                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '0.4rem', color: 'white' }}
                                    >
                                        <FiX size={18} />
                                    </motion.button>
                                </div>
                                <p style={{ margin: '0.35rem 0 0 0', opacity: 0.95, fontSize: '0.9rem' }}>
                                    {documentService.getDocumentTypeLabel(selectedDocument.document_type)}
                                </p>
                            </motion.div>

                            {/* Body */}
                            <div style={{ padding: '1.25rem' }}>
                                {/* Info Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                        style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>🌐 Langue</div>
                                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>
                                            {selectedDocument.language === 'ar' ? '🇹🇳 Arabe' : '🇫🇷 Français'}
                                        </div>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                        style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>📍 Réception</div>
                                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>
                                            {selectedDocument.reception_type === 'ONLINE' ? '💻 En ligne' : '🏢 Présentiel'}
                                        </div>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                        style={{ padding: '0.75rem', background: '#fff7ed', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>📅 Année</div>
                                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>
                                            {selectedDocument.academic_year}
                                        </div>
                                    </motion.div>

                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        style={{ padding: '0.75rem', background: '#e0f2fe', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.25rem' }}>📆 Date</div>
                                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.8rem' }}>
                                            {new Date(selectedDocument.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Status */}
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                                    style={{ padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>📊 Statut:</span>
                                    <motion.span animate={{ scale: selectedDocument.status === 'NEW' ? [1, 1.05, 1] : 1 }} transition={{ duration: 2, repeat: selectedDocument.status === 'NEW' ? Infinity : 0 }}
                                        style={{ padding: '0.3rem 0.7rem', borderRadius: '9999px', background: `${documentService.getStatusColor(selectedDocument.status)}15`, color: documentService.getStatusColor(selectedDocument.status), fontWeight: '600', fontSize: '0.8rem' }}>
                                        {documentService.getStatusLabel(selectedDocument.status)}
                                    </motion.span>
                                </motion.div>
                            </div>

                            {/* Footer */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem' }}>
                                {selectedDocument.status === 'READY' ? (
                                    <motion.button whileHover={{ scale: 1.02 }}
                                        onClick={async () => {
                                            try {
                                                const blob = await documentService.downloadDocument(selectedDocument.id)
                                                const url = window.URL.createObjectURL(blob)
                                                const a = document.createElement('a')
                                                a.href = url
                                                a.download = `document_${selectedDocument.id}.pdf`
                                                document.body.appendChild(a)
                                                a.click()
                                                window.URL.revokeObjectURL(url)
                                                document.body.removeChild(a)
                                                toast.success('Document téléchargé!')
                                            } catch (error) {
                                                toast.error('Erreur lors du téléchargement')
                                            }
                                        }}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)', fontSize: '0.9rem' }}>
                                        <FiDownload size={18} /> Télécharger le PDF
                                    </motion.button>
                                ) : (
                                    <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowDetailModal(false)}
                                        style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '2px solid var(--primary-orange, #f97316)', background: '#ffffff', color: 'var(--primary-orange, #f97316)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                                        Fermer
                                    </motion.button>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TeacherDocuments
