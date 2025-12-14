import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiCreditCard,
    FiEdit2, FiSave, FiX, FiCamera, FiLock, FiEye, FiEyeOff, FiUpload, FiCheck
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import * as userService from '../../services/userService'

const AVATAR_OPTIONS = [
    '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫',
    '🧑‍💻', '👩‍💻', '🧑‍🔬', '👩‍🔬', '🧑‍⚕️', '👩‍⚕️'
]

const ScolarProfile = () => {
    const { user, updateUser } = useAuth()
    const [activeTab, setActiveTab] = useState('general')
    const [editing, setEditing] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)
    const [showAvatarPicker, setShowAvatarPicker] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        cin: '',
        address: '',
        city: ''
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.firstName || user.first_name || '',
                last_name: user.lastName || user.last_name || '',
                phone: user.phone || '',
                cin: user.cin || '',
                address: user.address || '',
                city: user.city || ''
            })
        }
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await updateUser(formData)
            toast.success('✅ Profil mis à jour!')
            setEditing(false)
        } catch (error) {
            toast.error('❌ Erreur')
            console.error(error)
        }
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas')
            return
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Minimum 6 caractères')
            return
        }

        try {
            await userService.changePassword({
                old_password: passwordData.currentPassword,
                new_password: passwordData.newPassword
            })
            toast.success('✅ Mot de passe modifié!')
            setChangingPassword(false)
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (error) {
            toast.error('❌ Erreur')
        }
    }

    const handleAvatarSelect = (emoji) => {
        updateUser({ avatar: emoji })
        setShowAvatarPicker(false)
        toast.success('Avatar mis à jour!')
    }

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Sélectionner une image')
            return
        }

        try {
            setUploading(true)
            const formData = new FormData()
            formData.append('profile_picture', file)
            await userService.uploadProfilePicture(formData)
            toast.success('✅ Photo uploadée!')
            setUploading(false)
        } catch (error) {
            toast.error('Erreur upload')
            setUploading(false)
        }
    }

    const InfoRow = ({ icon: Icon, label, value }) => (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.875rem 0',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <Icon size={18} style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    {label}
                </div>
                <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                    {value || 'Non renseigné'}
                </div>
            </div>
        </div>
    )

    return (
        <div className="dashboard-page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Header with Tabs */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '1.5rem',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        padding: '1rem 2rem',
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <button
                            onClick={() => setActiveTab('general')}
                            style={{
                                padding: '0.75rem 0',
                                border: 'none',
                                background: 'none',
                                color: activeTab === 'general' ? '#06b6d4' : 'var(--text-secondary)',
                                fontWeight: activeTab === 'general' ? '600' : '400',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                borderBottom: activeTab === 'general' ? '3px solid #06b6d4' : '3px solid transparent',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            📋 Informations générales
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            style={{
                                padding: '0.75rem 0',
                                border: 'none',
                                background: 'none',
                                color: activeTab === 'security' ? '#06b6d4' : 'var(--text-secondary)',
                                fontWeight: activeTab === 'security' ? '600' : '400',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                borderBottom: activeTab === 'security' ? '3px solid #06b6d4' : '3px solid transparent',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            🔒 Sécurité
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
                    {/* Left - Avatar Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '2rem 1.5rem',
                            boxShadow: 'var(--shadow-sm)',
                            textAlign: 'center',
                            height: 'fit-content'
                        }}
                    >
                        {/* Avatar */}
                        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #06b6d4, #38bdf8)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3.5rem',
                                    boxShadow: 'var(--shadow-md)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    border: '4px solid white'
                                }}
                                onClick={() => setShowAvatarPicker(true)}
                            >
                                {user?.avatar || '👨‍💼'}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.2s'
                                }}
                                    className="avatar-hover">
                                    <FiCamera size={24} color="white" />
                                </div>
                            </motion.div>

                            {/* Upload button */}
                            <motion.label
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    background: 'white',
                                    boxShadow: 'var(--shadow-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '2px solid #06b6d4'
                                }}
                            >
                                <FiCamera size={16} color="#06b6d4" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    style={{ display: 'none' }}
                                    disabled={uploading}
                                />
                            </motion.label>
                        </div>

                        {/* Name */}
                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
                        </h2>

                        {/* Status Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.35rem 0.875rem',
                            borderRadius: '6px',
                            background: 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                            color: '#06b6d4',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06b6d4' }} />
                            Responsable Scolaire
                        </div>

                        {/* Quick Info - Only for students */}
                        {user?.role === 'student' && (
                            <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    👤 Groupe
                                </div>
                                <div style={{ fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.875rem' }}>
                                    {user?.group || 'Non défini'}
                                </div>

                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    🎯 Niveau
                                </div>
                                <div style={{ fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.875rem' }}>
                                    {user?.level || 'Non défini'}
                                </div>

                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    🏢 Filière
                                </div>
                                <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                    {user?.major || 'Non défini'}
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        {!editing && activeTab === 'general' && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setEditing(true)}
                                style={{
                                    width: '100%',
                                    marginTop: '1.5rem',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #06b6d4, #38bdf8)',
                                    color: 'white',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <FiEdit2 size={16} /> Modifier le profil
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Right - Information Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'general' && (
                                <motion.div
                                    key="general"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                >
                                    {editing ? (
                                        /* Edit Form */
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                background: 'white',
                                                borderRadius: '12px',
                                                padding: '2rem',
                                                boxShadow: 'var(--shadow-sm)'
                                            }}
                                        >
                                            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                                                ✏️ Modifier les informations
                                            </h3>

                                            <form onSubmit={handleSubmit}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                                            Prénom
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.first_name}
                                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--border-color)',
                                                                fontSize: '0.95rem',
                                                                outline: 'none',
                                                                transition: 'border-color 0.2s'
                                                            }}
                                                            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
                                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                                            Nom
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.last_name}
                                                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--border-color)',
                                                                fontSize: '0.95rem',
                                                                outline: 'none'
                                                            }}
                                                            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
                                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                                            CIN
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.cin}
                                                            onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--border-color)',
                                                                fontSize: '0.95rem',
                                                                outline: 'none'
                                                            }}
                                                            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
                                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                                            Téléphone
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--border-color)',
                                                                fontSize: '0.95rem',
                                                                outline: 'none'
                                                            }}
                                                            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
                                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                                        />
                                                    </div>
                                                    <div style={{ gridColumn: '1 / -1' }}>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                                            Adresse
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--border-color)',
                                                                fontSize: '0.95rem',
                                                                outline: 'none'
                                                            }}
                                                            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
                                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                                            Ville
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={formData.city}
                                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--border-color)',
                                                                fontSize: '0.95rem',
                                                                outline: 'none'
                                                            }}
                                                            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
                                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                                    <motion.button
                                                        type="button"
                                                        whileHover={{ scale: 1.02 }}
                                                        onClick={() => setEditing(false)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.75rem',
                                                            borderRadius: '8px',
                                                            border: '1px solid var(--border-color)',
                                                            background: 'white',
                                                            cursor: 'pointer',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        Annuler
                                                    </motion.button>
                                                    <motion.button
                                                        type="submit"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.75rem',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            background: 'linear-gradient(135deg, #10b981, #34d399)',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '0.5rem'
                                                        }}
                                                    >
                                                        <FiCheck size={18} /> Enregistrer
                                                    </motion.button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        /* View Mode */
                                        <>
                                            {/* General Information */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{
                                                    background: 'white',
                                                    borderRadius: '12px',
                                                    padding: '1.5rem',
                                                    boxShadow: 'var(--shadow-sm)'
                                                }}
                                            >
                                                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                                    Informations générales
                                                </h3>
                                                <InfoRow icon={FiUser} label="Nom & Prénom" value={`${user?.firstName || user?.first_name || ''} ${user?.lastName || user?.last_name || ''}`} />
                                                <InfoRow icon={FiCreditCard} label="CIN / Passport" value={user?.cin} />
                                            </motion.div>

                                            {/* Location */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                style={{
                                                    background: 'white',
                                                    borderRadius: '12px',
                                                    padding: '1.5rem',
                                                    boxShadow: 'var(--shadow-sm)'
                                                }}
                                            >
                                                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                                    Informations de localisation
                                                </h3>
                                                <InfoRow icon={FiGlobe} label="Ville" value={user?.city} />
                                                <InfoRow icon={FiMapPin} label="Adresse Postale" value={user?.address} />
                                            </motion.div>

                                            {/* Contact */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                style={{
                                                    background: 'white',
                                                    borderRadius: '12px',
                                                    padding: '1.5rem',
                                                    boxShadow: 'var(--shadow-sm)'
                                                }}
                                            >
                                                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                                    Informations de contact
                                                </h3>
                                                <InfoRow icon={FiMail} label="Email" value={user?.email} />
                                                <InfoRow icon={FiPhone} label="Téléphone" value={user?.phone} />
                                            </motion.div>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    style={{
                                        background: 'white',
                                        borderRadius: '12px',
                                        padding: '2rem',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                >
                                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                                        🔒 Changer le mot de passe
                                    </h3>

                                    <form onSubmit={handlePasswordChange}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {[
                                                { key: 'current', label: 'Mot de passe actuel', value: passwordData.currentPassword, field: 'currentPassword' },
                                                { key: 'new', label: 'Nouveau mot de passe', value: passwordData.newPassword, field: 'newPassword' },
                                                { key: 'confirm', label: 'Confirmer', value: passwordData.confirmPassword, field: 'confirmPassword' }
                                            ].map(({ key, label, value, field }) => (
                                                <div key={key}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                                                        {label}
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type={showPasswords[key] ? 'text' : 'password'}
                                                            value={value}
                                                            onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                                                            style={{
                                                                width: '100%',
                                                                padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--border-color)',
                                                                fontSize: '0.95rem',
                                                                outline: 'none'
                                                            }}
                                                            onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
                                                            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPasswords({ ...showPasswords, [key]: !showPasswords[key] })}
                                                            style={{
                                                                position: 'absolute',
                                                                right: '0.75rem',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                color: 'var(--text-secondary)'
                                                            }}
                                                        >
                                                            {showPasswords[key] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                width: '100%',
                                                marginTop: '1.5rem',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: 'linear-gradient(135deg, #06b6d4, #38bdf8)',
                                                color: 'white',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <FiLock size={18} /> Modifier le mot de passe
                                        </motion.button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Avatar Picker Modal */}
                <AnimatePresence>
                    {showAvatarPicker && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAvatarPicker(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    maxWidth: '450px',
                                    width: '90%',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Choisir un Avatar</h3>
                                    <button
                                        onClick={() => setShowAvatarPicker(false)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--text-secondary)'
                                        }}
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem' }}>
                                    {AVATAR_OPTIONS.map((emoji, idx) => (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAvatarSelect(emoji)}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '12px',
                                                border: user?.avatar === emoji ? '2px solid #06b6d4' : '1px solid var(--border-color)',
                                                background: user?.avatar === emoji ? 'rgba(6, 182, 212, 0.1)' : 'white',
                                                fontSize: '1.8rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {emoji}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <style>{`
                    .avatar-hover:hover {
                        opacity: 1 !important;
                    }
                    
                    @media (max-width: 768px) {
                        .dashboard-page > div > div:last-child {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>
            </motion.div>
        </div>
    )
}

export default ScolarProfile
