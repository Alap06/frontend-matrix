import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiMessageSquare, FiPlus, FiEye, FiX, FiSend
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as reclamationService from '../../services/reclamationService'

const ClubManagerReclamations = () => {
    const [reclamations, setReclamations] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedReclamation, setSelectedReclamation] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        is_anonymous: false
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [recData, catData] = await Promise.all([
                reclamationService.getReclamations(),
                reclamationService.getCategories()
            ])
            setReclamations(recData)
            setCategories(catData)
            if (catData.length > 0 && !formData.category) {
                setFormData(prev => ({ ...prev, category: catData[0].id }))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await reclamationService.createReclamation(formData)
            toast.success('Réclamation envoyée')
            setShowModal(false)
            setFormData({ title: '', description: '', category: categories[0]?.id || '', is_anonymous: false })
            loadData()
        } catch (error) {
            toast.error('Erreur lors de l\'envoi')
        }
    }

    const getStatusStyle = (status) => {
        const styles = {
            'pending': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'En attente' },
            'in_progress': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'En cours' },
            'resolved': { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Résolu' },
            'rejected': { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Rejeté' }
        }
        return styles[status] || styles.pending
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
                            <FiMessageSquare style={{ color: '#8b5cf6' }} /> Mes Réclamations
                        </h1>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                            Soumettez et suivez vos réclamations
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
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
                        <FiPlus /> Nouvelle Réclamation
                    </motion.button>
                </div>

                {/* Reclamations List */}
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                ) : reclamations.length === 0 ? (
                    <motion.div
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '3rem',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <FiMessageSquare size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-muted)' }}>Aucune réclamation</p>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {reclamations.map((rec, index) => {
                            const statusStyle = getStatusStyle(rec.status)

                            return (
                                <motion.div
                                    key={rec.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        background: 'var(--bg-card)',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        boxShadow: 'var(--shadow-md)',
                                        borderLeft: `4px solid ${statusStyle.color}`
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <h3 style={{ margin: 0 }}>{rec.title}</h3>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '9999px',
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color,
                                                    fontSize: '0.7rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {statusStyle.label}
                                                </span>
                                            </div>
                                            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                                {rec.description?.slice(0, 100)}...
                                            </p>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {new Date(rec.created_at).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedReclamation(rec); setShowDetailModal(true) }}
                                            style={{
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                color: '#8b5cf6',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <FiEye size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </motion.div>

            {/* Create Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-xl)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0 }}>Nouvelle Réclamation</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Catégorie</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Titre</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            rows={4}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', resize: 'vertical' }}
                                        />
                                    </div>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_anonymous}
                                            onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                                        />
                                        Envoyer de façon anonyme
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>
                                        Annuler
                                    </button>
                                    <motion.button type="submit" whileHover={{ scale: 1.02 }} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <FiSend /> Envoyer
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedReclamation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-xl)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0 }}>Détails</h2>
                                <button onClick={() => setShowDetailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={20} /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Titre</div>
                                    <div style={{ fontWeight: '500' }}>{selectedReclamation.title}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Description</div>
                                    <div>{selectedReclamation.description}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Statut</div>
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: '0.25rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        ...(() => {
                                            const s = getStatusStyle(selectedReclamation.status)
                                            return { background: s.bg, color: s.color }
                                        })()
                                    }}>
                                        {getStatusStyle(selectedReclamation.status).label}
                                    </span>
                                </div>
                                {selectedReclamation.response && (
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Réponse</div>
                                        <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '8px', marginTop: '0.25rem' }}>
                                            {selectedReclamation.response}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setShowDetailModal(false)} style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>
                                Fermer
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ClubManagerReclamations
