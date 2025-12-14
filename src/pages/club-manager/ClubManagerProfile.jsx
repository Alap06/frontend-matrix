import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FiUser, FiMail, FiPhone, FiCalendar, FiCreditCard, FiEdit2, FiSave
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import AvatarSelector from '../../components/AvatarSelector'

const ClubManagerProfile = () => {
    const { user, updateUser } = useAuth()
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: ''
    })

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.firstName || user.first_name || '',
                last_name: user.lastName || user.last_name || '',
                phone: user.phone || ''
            })
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await updateUser(formData)
            toast.success('Profil mis à jour')
            setEditing(false)
        } catch (error) {
            toast.error('Erreur lors de la mise à jour')
        }
    }

    const getRoleLabel = (role) => {
        const roles = {
            'club_manager': 'Gestionnaire de Club',
            'student': 'Étudiant',
            'teacher': 'Enseignant',
            'administrator': 'Administrateur'
        }
        return roles[role] || role
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
                        <FiUser style={{ color: '#8b5cf6' }} /> Mon Profil
                    </h1>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                        Gérez vos informations personnelles
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem' }}>
                    {/* Avatar Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '2rem',
                            textAlign: 'center',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <AvatarSelector />
                        <h2 style={{ margin: '1rem 0 0.25rem 0' }}>
                            {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
                        </h2>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                        }}>
                            {getRoleLabel(user?.role)}
                        </span>
                    </motion.div>

                    {/* Info Card */}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Informations Personnelles</h3>
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        color: '#8b5cf6',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <FiEdit2 size={16} /> Modifier
                                </button>
                            ) : null}
                        </div>

                        {editing ? (
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Prénom</label>
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nom</label>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Téléphone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>
                                        Annuler
                                    </button>
                                    <motion.button type="submit" whileHover={{ scale: 1.02 }} style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <FiSave /> Enregistrer
                                    </motion.button>
                                </div>
                            </form>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                                        <FiUser />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nom complet</div>
                                        <div style={{ fontWeight: '500' }}>{user?.firstName || user?.first_name} {user?.lastName || user?.last_name || '-'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                        <FiMail />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
                                        <div style={{ fontWeight: '500' }}>{user?.email || '-'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                        <FiPhone />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Téléphone</div>
                                        <div style={{ fontWeight: '500' }}>{user?.phone || 'Non renseigné'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                                        <FiCreditCard />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CIN</div>
                                        <div style={{ fontWeight: '500' }}>{user?.cin || '-'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                                        <FiCalendar />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date de naissance</div>
                                        <div style={{ fontWeight: '500' }}>{user?.date_of_birth || user?.dateOfBirth || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default ClubManagerProfile
