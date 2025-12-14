import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiPlus, FiX, FiAlertCircle, FiCheckCircle, FiClock,
    FiTrash2, FiUpload, FiLock, FiUnlock, FiMessageCircle,
    FiUser, FiBook
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as reclamationService from '../../services/reclamationService'
import '../student/StudentPages.css'

const TeacherReclamations = () => {
    const [reclamations, setReclamations] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedReclamation, setSelectedReclamation] = useState(null)
    const [formData, setFormData] = useState({
        category: 'ENSEIGNEMENT',
        description: '',
        is_anonymous: false,
        file: null
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadReclamations()
    }, [])

    const loadReclamations = async () => {
        try {
            setLoading(true)
            const data = await reclamationService.getReclamations()
            setReclamations(data)
        } catch (error) {
            toast.error('Erreur lors du chargement des réclamations')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.description.trim()) {
            toast.error('Veuillez entrer une description')
            return
        }

        try {
            setSubmitting(true)
            await reclamationService.createReclamation(formData)
            toast.success('Réclamation créée avec succès')
            setShowCreateModal(false)
            setFormData({ category: 'ENSEIGNEMENT', description: '', is_anonymous: false, file: null })
            loadReclamations()
        } catch (error) {
            toast.error('Erreur lors de la création')
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (uuid) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) return

        try {
            await reclamationService.deleteReclamation(uuid)
            toast.success('Réclamation supprimée')
            loadReclamations()
            setShowDetailModal(false)
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        }
    }

    const viewDetails = async (reclamation) => {
        try {
            const details = await reclamationService.getReclamation(reclamation.id)
            setSelectedReclamation(details)
            setShowDetailModal(true)
        } catch (error) {
            toast.error('Erreur lors du chargement des détails')
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'NOUVEAU': return <FiAlertCircle className="status-icon new" />
            case 'EN_COURS': return <FiClock className="status-icon pending" />
            case 'RESOLU': return <FiCheckCircle className="status-icon resolved" />
            case 'REJETE': return <FiX className="status-icon rejected" />
            default: return null
        }
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'NOUVEAU': return 'status-new'
            case 'EN_COURS': return 'status-pending'
            case 'RESOLU': return 'status-resolved'
            case 'REJETE': return 'status-rejected'
            default: return ''
        }
    }

    const hasResponses = (reclamation) => {
        return reclamation.history && reclamation.history.some(h => h.comment)
    }

    return (
        <div className="dashboard-page reclamations-page">
            <div className="page-header">
                <div>
                    <h2><FiBook style={{ marginRight: '0.5rem' }} />Mes Réclamations</h2>
                    <p>Soumettez et suivez vos réclamations - Consultez les réponses de l'administration</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <FiPlus /> Nouvelle Réclamation
                </button>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement...</p>
                </div>
            ) : reclamations.length === 0 ? (
                <div className="empty-state">
                    <FiAlertCircle size={48} />
                    <h3>Aucune réclamation</h3>
                    <p>Vous n'avez pas encore soumis de réclamation</p>
                    <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        Créer ma première réclamation
                    </button>
                </div>
            ) : (
                <div className="reclamations-grid">
                    {reclamations.map((rec, index) => (
                        <motion.div
                            key={rec.id || index}
                            className={`reclamation-card ${getStatusClass(rec.status)}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => viewDetails(rec)}
                        >
                            <div className="card-header">
                                <span className="category-badge">{rec.category}</span>
                                <div className="status-badge">
                                    {getStatusIcon(rec.status)}
                                    <span>{reclamationService.getStatusLabel(rec.status)}</span>
                                </div>
                            </div>
                            <p className="description">{rec.description?.substring(0, 100)}...</p>
                            <div className="card-footer">
                                <span className="date">
                                    {new Date(rec.created_at).toLocaleDateString('fr-FR')}
                                </span>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {hasResponses(rec) && (
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            color: '#10b981',
                                            fontSize: '0.75rem',
                                            fontWeight: '500'
                                        }}>
                                            <FiMessageCircle size={12} /> Réponse
                                        </span>
                                    )}
                                    {rec.is_anonymous && (
                                        <span className="anonymous-badge">
                                            <FiLock size={12} /> Anonyme
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h3>Nouvelle Réclamation</h3>
                                <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                                    <FiX />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Catégorie</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {reclamationService.CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        rows={5}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Décrivez votre réclamation en détail..."
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_anonymous}
                                            onChange={e => setFormData({ ...formData, is_anonymous: e.target.checked })}
                                        />
                                        <span>
                                            {formData.is_anonymous ? <FiLock /> : <FiUnlock />}
                                            Soumettre anonymement
                                        </span>
                                    </label>
                                    <small>Votre identité ne sera pas visible par les administrateurs</small>
                                </div>

                                <div className="form-group">
                                    <label>
                                        <FiUpload /> Pièce jointe (optionnel)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? 'Envoi...' : 'Soumettre'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Modal with Conversation View */}
            <AnimatePresence>
                {showDetailModal && selectedReclamation && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            className="modal-content modal-large"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: '700px' }}
                        >
                            <div className="modal-header">
                                <h3>Détails de la Réclamation</h3>
                                <button className="close-btn" onClick={() => setShowDetailModal(false)}>
                                    <FiX />
                                </button>
                            </div>

                            <div className="detail-content">
                                <div className="detail-row">
                                    <span className="label">Catégorie:</span>
                                    <span className="category-badge">{selectedReclamation.category}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Statut:</span>
                                    <span className={`status-badge ${getStatusClass(selectedReclamation.status)}`}>
                                        {getStatusIcon(selectedReclamation.status)}
                                        {reclamationService.getStatusLabel(selectedReclamation.status)}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Date:</span>
                                    <span>{new Date(selectedReclamation.created_at).toLocaleString('fr-FR')}</span>
                                </div>

                                {/* Conversation Container */}
                                <div style={{
                                    marginTop: '1.5rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '12px',
                                    padding: '1rem'
                                }}>
                                    <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FiMessageCircle /> Conversation
                                    </h4>

                                    {/* Original Message */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-blue))',
                                        color: 'white',
                                        padding: '1rem',
                                        borderRadius: '12px 12px 4px 12px',
                                        marginBottom: '1rem',
                                        marginLeft: 'auto',
                                        maxWidth: '85%'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                                            <FiUser style={{ display: 'inline', marginRight: '0.25rem' }} />
                                            Vous • {new Date(selectedReclamation.created_at).toLocaleString('fr-FR')}
                                        </div>
                                        <p style={{ margin: 0, lineHeight: 1.5 }}>{selectedReclamation.description}</p>
                                    </div>

                                    {/* Admin Responses */}
                                    {selectedReclamation.history && selectedReclamation.history.length > 0 ? (
                                        selectedReclamation.history.map((item, idx) => (
                                            <div key={idx}>
                                                <div style={{
                                                    textAlign: 'center',
                                                    padding: '0.5rem',
                                                    color: 'var(--text-muted)',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    Statut changé en <strong>{reclamationService.getStatusLabel(item.new_status)}</strong>
                                                    {' • '}{new Date(item.date).toLocaleString('fr-FR')}
                                                </div>

                                                {item.comment && (
                                                    <div style={{
                                                        background: 'white',
                                                        border: '1px solid var(--border-color)',
                                                        padding: '1rem',
                                                        borderRadius: '12px 12px 12px 4px',
                                                        marginBottom: '1rem',
                                                        maxWidth: '85%'
                                                    }}>
                                                        <div style={{
                                                            fontSize: '0.75rem',
                                                            color: 'var(--text-muted)',
                                                            marginBottom: '0.5rem'
                                                        }}>
                                                            <span style={{
                                                                background: 'var(--accent-blue)',
                                                                color: 'white',
                                                                padding: '0.15rem 0.5rem',
                                                                borderRadius: '9999px',
                                                                fontSize: '0.65rem',
                                                                fontWeight: '600',
                                                                marginRight: '0.5rem'
                                                            }}>ADMIN</span>
                                                            {new Date(item.date).toLocaleString('fr-FR')}
                                                        </div>
                                                        <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--text-primary)' }}>
                                                            {item.comment}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '2rem',
                                            color: 'var(--text-muted)'
                                        }}>
                                            <FiClock size={24} style={{ marginBottom: '0.5rem' }} />
                                            <p style={{ margin: 0 }}>En attente de réponse de l'administration...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(selectedReclamation.id)}
                                >
                                    <FiTrash2 /> Supprimer
                                </button>
                                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                                    Fermer
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TeacherReclamations
