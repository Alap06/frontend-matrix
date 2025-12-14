import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiUsers, FiPlus, FiEdit2, FiTrash2, FiImage,
    FiX, FiSave
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as clubService from '../../services/clubService'

const ClubManagerClub = () => {
    const [clubs, setClubs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingClub, setEditingClub] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: null,
        members_count: 0
    })

    useEffect(() => {
        loadClubs()
    }, [])

    const loadClubs = async () => {
        try {
            setLoading(true)
            const data = await clubService.getClubs()
            setClubs(data)
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
            if (editingClub) {
                await clubService.updateClub(editingClub.public_id, formData)
                toast.success('Club mis à jour')
            } else {
                await clubService.createClub(formData)
                toast.success('Club créé')
            }
            setShowModal(false)
            setEditingClub(null)
            resetForm()
            loadClubs()
        } catch (error) {
            toast.error('Erreur lors de l\'enregistrement')
            console.error(error)
        }
    }

    const handleEdit = (club) => {
        setEditingClub(club)
        setFormData({
            name: club.name,
            description: club.description,
            logo: null,
            members_count: club.members_count
        })
        setShowModal(true)
    }

    const handleDelete = async (publicId) => {
        if (!confirm('Supprimer ce club ?')) return
        try {
            await clubService.deleteClub(publicId)
            toast.success('Club supprimé')
            loadClubs()
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        }
    }

    const resetForm = () => {
        setFormData({ name: '', description: '', logo: null, members_count: 0 })
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, logo: e.target.files[0] })
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
                            <FiUsers style={{ color: '#8b5cf6' }} /> Mon Club
                        </h1>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                            Gérez les informations de votre club
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { resetForm(); setEditingClub(null); setShowModal(true) }}
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
                        <FiPlus /> Créer un Club
                    </motion.button>
                </div>

                {/* Clubs List */}
                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chargement...</p>
                ) : clubs.length === 0 ? (
                    <motion.div
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '3rem',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <FiUsers size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-muted)' }}>Aucun club. Créez votre premier club !</p>
                    </motion.div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {clubs.map((club, index) => {
                            const statusStyle = {
                                bg: clubService.getClubStatusColor(club.status) + '15',
                                color: clubService.getClubStatusColor(club.status)
                            }

                            return (
                                <motion.div
                                    key={club.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{
                                        background: 'var(--bg-card)',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                >
                                    {/* Logo */}
                                    <div style={{
                                        height: '120px',
                                        background: club.logo
                                            ? `url(${club.logo}) center/cover`
                                            : 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {!club.logo && (
                                            <FiUsers size={48} style={{ color: 'white', opacity: 0.5 }} />
                                        )}
                                    </div>

                                    <div style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{club.name}</h3>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                background: statusStyle.bg,
                                                color: statusStyle.color,
                                                fontSize: '0.7rem',
                                                fontWeight: '500'
                                            }}>
                                                {clubService.getClubStatusLabel(club.status)}
                                            </span>
                                        </div>

                                        <p style={{
                                            margin: '0 0 1rem 0',
                                            fontSize: '0.875rem',
                                            color: 'var(--text-muted)',
                                            lineHeight: 1.5
                                        }}>
                                            {club.description?.slice(0, 100)}...
                                        </p>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <FiUsers size={14} /> {club.members_count} membres
                                            </span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleEdit(club)}
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
                                                    onClick={() => handleDelete(club.public_id)}
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
                                maxWidth: '500px',
                                boxShadow: 'var(--shadow-xl)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ margin: 0 }}>
                                    {editingClub ? 'Modifier le Club' : 'Créer un Club'}
                                </h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <FiX size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Nom du club
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            rows={4}
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
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Logo du club
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
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
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                            Nombre de membres
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.members_count}
                                            onChange={(e) => setFormData({ ...formData, members_count: parseInt(e.target.value) })}
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
                                        <FiSave /> {editingClub ? 'Mettre à jour' : 'Créer'}
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

export default ClubManagerClub
