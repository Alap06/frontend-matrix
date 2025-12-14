import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiUser, FiMail, FiPhone, FiCalendar, FiAward,
    FiLock, FiCheck, FiX, FiImage
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import * as authService from '../../services/authService'
import AvatarSelector, { getCurrentAvatar, saveAvatar } from '../../components/AvatarSelector'

const ScolarProfile = () => {
    const { user, checkAuth } = useAuth()
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const [currentAvatar, setCurrentAvatar] = useState(getCurrentAvatar())
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [changingPassword, setChangingPassword] = useState(false)

    // Accent color for Scolar Admin
    const accentColor = '#06b6d4'
    const accentGradient = 'linear-gradient(135deg, #06b6d4, #0891b2)'

    const handlePasswordChange = async (e) => {
        e.preventDefault()

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas')
            return
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('Le mot de passe doit contenir au moins 8 caractères')
            return
        }

        try {
            setChangingPassword(true)
            await authService.changePassword(passwordData.oldPassword, passwordData.newPassword)
            toast.success('Mot de passe modifié avec succès')
            setShowPasswordModal(false)
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error) {
            toast.error(error.response?.data?.old_password?.[0] || 'Erreur lors du changement')
        } finally {
            setChangingPassword(false)
        }
    }

    const handleAvatarSelect = (avatarId) => {
        saveAvatar(avatarId)
        setCurrentAvatar(getCurrentAvatar())
        toast.success('Avatar mis à jour !')
        setShowAvatarModal(false)
    }

    return (
        <div className="dashboard-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Profile Header */}
                <div style={{
                    background: accentGradient,
                    borderRadius: '16px',
                    padding: '2rem',
                    color: 'white',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        right: '-50px',
                        top: '-50px',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)'
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                        {/* Avatar with change button */}
                        <div style={{ position: 'relative' }}>
                            <div
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: currentAvatar.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3rem',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s'
                                }}
                                onClick={() => setShowAvatarModal(true)}
                            >
                                {currentAvatar.emoji}
                            </div>
                            <button
                                onClick={() => setShowAvatarModal(true)}
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}
                            >
                                <FiImage size={16} style={{ color: accentColor }} />
                            </button>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>{user?.email}</p>
                            <span style={{
                                display: 'inline-block',
                                marginTop: '0.75rem',
                                padding: '0.35rem 1rem',
                                borderRadius: '9999px',
                                background: 'rgba(255,255,255,0.2)',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}>
                                📋 Responsable Scolaire
                            </span>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {/* Personal Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiUser /> Informations Personnelles
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {/* Nom complet */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: `rgba(6, 182, 212, 0.1)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: accentColor
                                }}>
                                    <FiUser />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nom complet</div>
                                    <div style={{ fontWeight: '500' }}>{user?.firstName} {user?.lastName || '-'}</div>
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#8b5cf6'
                                }}>
                                    <FiMail />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
                                    <div style={{ fontWeight: '500' }}>{user?.email || '-'}</div>
                                </div>
                            </div>

                            {/* Téléphone */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#3b82f6'
                                }}>
                                    <FiPhone />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Téléphone</div>
                                    <div style={{ fontWeight: '500' }}>{user?.phone || 'Non renseigné'}</div>
                                </div>
                            </div>

                            {/* CIN */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#f59e0b'
                                }}>
                                    🪪
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CIN</div>
                                    <div style={{ fontWeight: '500' }}>{user?.cin || 'Non renseigné'}</div>
                                </div>
                            </div>

                            {/* Date de naissance */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(236, 72, 153, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ec4899'
                                }}>
                                    🎂
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date de naissance</div>
                                    <div style={{ fontWeight: '500' }}>
                                        {user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('fr-FR') : 'Non renseigné'}
                                    </div>
                                </div>
                            </div>

                            {/* Rôle */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: `rgba(6, 182, 212, 0.1)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: accentColor
                                }}>
                                    <FiAward />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rôle</div>
                                    <div style={{ fontWeight: '500' }}>Responsable Scolaire</div>
                                </div>
                            </div>

                            {/* Date d'inscription */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#10b981'
                                }}>
                                    <FiCalendar />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date d'inscription</div>
                                    <div style={{ fontWeight: '500' }}>
                                        {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR') : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Account Status Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiCheck /> Statut du Compte
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '10px'
                            }}>
                                <span>Compte actif</span>
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: '#10b981',
                                    fontWeight: '600'
                                }}>
                                    <FiCheck /> Oui
                                </span>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: `rgba(6, 182, 212, 0.1)`,
                                borderRadius: '10px'
                            }}>
                                <span>Droits scolaires</span>
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: accentColor,
                                    fontWeight: '600'
                                }}>
                                    <FiCheck /> scolar_admin
                                </span>
                            </div>
                        </div>

                        {/* Change Password Button */}
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            style={{
                                width: '100%',
                                marginTop: '1.5rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                border: '1px solid var(--border-color)',
                                background: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <FiLock /> Changer le mot de passe
                        </button>

                        {/* Change Avatar Button */}
                        <button
                            onClick={() => setShowAvatarModal(true)}
                            style={{
                                width: '100%',
                                marginTop: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: accentGradient,
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <FiImage /> Changer l'avatar
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Password Change Modal */}
            <AnimatePresence>
                {showPasswordModal && (
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
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: 'var(--bg-card)',
                                borderRadius: '16px',
                                padding: '2rem',
                                maxWidth: '400px',
                                width: '100%'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>Changer le mot de passe</h3>
                                <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handlePasswordChange}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        required
                                        minLength={8}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                                        Confirmer le nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            background: 'transparent',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={changingPassword}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: accentColor,
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        {changingPassword ? 'Modification...' : 'Modifier'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Selection Modal */}
            <AvatarSelector
                show={showAvatarModal}
                onClose={() => setShowAvatarModal(false)}
                onSelect={handleAvatarSelect}
                selectedId={currentAvatar.id}
                accentColor={accentColor}
            />
        </div>
    )
}

export default ScolarProfile
