import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiFileText, FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiCalendar
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as clubService from '../../services/clubService'

const ClubManagerReports = () => {
    const [reports, setReports] = useState([])
    const [clubs, setClubs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingReport, setEditingReport] = useState(null)
    const [formData, setFormData] = useState({
        club: '',
        semester: 's1',
        academic_year: '2024-2025',
        title: '',
        content: '',
        events_organized: 0,
        total_attendees: 0,
        budget_used: '',
        achievements: '',
        challenges: '',
        next_semester_plans: ''
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            const [reportsData, clubsData] = await Promise.all([
                clubService.getReports(),
                clubService.getClubs()
            ])
            setReports(reportsData)
            setClubs(clubsData)
            if (clubsData.length > 0 && !formData.club) {
                setFormData(prev => ({ ...prev, club: clubsData[0].id }))
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
            const data = {
                ...formData,
                budget_used: formData.budget_used ? parseFloat(formData.budget_used) : null
            }
            if (editingReport) {
                await clubService.updateReport(editingReport.public_id, data)
                toast.success('Rapport mis à jour')
            } else {
                await clubService.createReport(data)
                toast.success('Rapport créé')
            }
            setShowModal(false)
            setEditingReport(null)
            resetForm()
            loadData()
        } catch (error) {
            toast.error('Erreur lors de l\'enregistrement')
            console.error(error)
        }
    }

    const handleEdit = (report) => {
        setEditingReport(report)
        setFormData({
            club: report.club,
            semester: report.semester,
            academic_year: report.academic_year,
            title: report.title,
            content: report.content,
            events_organized: report.events_organized,
            total_attendees: report.total_attendees,
            budget_used: report.budget_used || '',
            achievements: report.achievements || '',
            challenges: report.challenges || '',
            next_semester_plans: report.next_semester_plans || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (publicId) => {
        if (!confirm('Supprimer ce rapport ?')) return
        try {
            await clubService.deleteReport(publicId)
            toast.success('Rapport supprimé')
            loadData()
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        }
    }

    const resetForm = () => {
        setFormData({
            club: clubs.length > 0 ? clubs[0].id : '',
            semester: 's1',
            academic_year: '2024-2025',
            title: '',
            content: '',
            events_organized: 0,
            total_attendees: 0,
            budget_used: '',
            achievements: '',
            challenges: '',
            next_semester_plans: ''
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
                            <FiFileText style={{ color: '#8b5cf6' }} /> Rapports Semestriels
                        </h1>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                            Créez et gérez les rapports de fin de semestre
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { resetForm(); setEditingReport(null); setShowModal(true) }}
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
                        <FiPlus /> Nouveau Rapport
                    </motion.button>
                </div>

                {/* Reports List */}
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                ) : reports.length === 0 ? (
                    <motion.div
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '3rem',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <FiFileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-muted)' }}>Aucun rapport. Créez votre premier rapport semestriel !</p>
                    </motion.div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {reports.map((report, index) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    background: 'var(--bg-card)',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 0.25rem 0' }}>{report.title}</h3>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {report.club_name} • {report.semester_display} {report.academic_year}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEdit(report)}
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
                                            onClick={() => handleDelete(report.public_id)}
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

                                <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {report.content?.slice(0, 150)}...
                                </p>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    fontSize: '0.8rem'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#8b5cf6' }}>{report.events_organized}</div>
                                        <div style={{ color: 'var(--text-muted)' }}>Événements</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#10b981' }}>{report.total_attendees}</div>
                                        <div style={{ color: 'var(--text-muted)' }}>Participants</div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#f59e0b' }}>
                                            {report.budget_used ? `${report.budget_used} TND` : '-'}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)' }}>Budget</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
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
                                maxWidth: '700px',
                                maxHeight: '90vh',
                                overflow: 'auto',
                                boxShadow: 'var(--shadow-xl)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0 }}>
                                    {editingReport ? 'Modifier le Rapport' : 'Nouveau Rapport'}
                                </h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Club</label>
                                        <select
                                            value={formData.club}
                                            onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        >
                                            {clubs.map(club => (
                                                <option key={club.id} value={club.id}>{club.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Semestre</label>
                                        <select
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        >
                                            {clubService.SEMESTERS.map(s => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Année</label>
                                        <input
                                            type="text"
                                            value={formData.academic_year}
                                            onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                                            placeholder="2024-2025"
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Titre</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contenu détaillé</label>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            required
                                            rows={4}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', resize: 'vertical' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Événements organisés</label>
                                        <input
                                            type="number" min="0"
                                            value={formData.events_organized}
                                            onChange={(e) => setFormData({ ...formData, events_organized: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Total participants</label>
                                        <input
                                            type="number" min="0"
                                            value={formData.total_attendees}
                                            onChange={(e) => setFormData({ ...formData, total_attendees: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Budget utilisé (TND)</label>
                                        <input
                                            type="number" step="0.01" min="0"
                                            value={formData.budget_used}
                                            onChange={(e) => setFormData({ ...formData, budget_used: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Réalisations</label>
                                        <textarea
                                            value={formData.achievements}
                                            onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                                            rows={2}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Défis rencontrés</label>
                                        <textarea
                                            value={formData.challenges}
                                            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                                            rows={2}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', resize: 'vertical' }}
                                        />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Plans pour le prochain semestre</label>
                                        <textarea
                                            value={formData.next_semester_plans}
                                            onChange={(e) => setFormData({ ...formData, next_semester_plans: e.target.value })}
                                            rows={2}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', resize: 'vertical' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>
                                        Annuler
                                    </button>
                                    <motion.button type="submit" whileHover={{ scale: 1.02 }} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <FiSave /> {editingReport ? 'Mettre à jour' : 'Créer'}
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

export default ClubManagerReports
