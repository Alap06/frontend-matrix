import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiPlus, FiX, FiEdit2, FiTrash2, FiSearch,
    FiUser, FiMail, FiCheck, FiXCircle, FiFilter,
    FiRefreshCw, FiLock, FiUsers
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as userService from '../../services/userService'
import '../student/StudentPages.css'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        cin: '',
        date_of_birth: '',
        role: 'student',
        is_active: true
    })
    const [submitting, setSubmitting] = useState(false)
    const [permissionError, setPermissionError] = useState(false)

    useEffect(() => {
        loadUsers()
    }, [roleFilter, statusFilter])

    const loadUsers = async () => {
        try {
            setLoading(true)
            setPermissionError(false)
            const filters = {}
            if (roleFilter) filters.role = roleFilter
            if (statusFilter) filters.is_active = statusFilter === 'active'
            const data = await userService.getUsers(filters)
            setUsers(data)
        } catch (error) {
            if (error.response?.status === 403) {
                setPermissionError(true)
            } else {
                toast.error('Erreur lors du chargement des utilisateurs')
            }
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase()
        return (
            user.email?.toLowerCase().includes(query) ||
            user.first_name?.toLowerCase().includes(query) ||
            user.last_name?.toLowerCase().includes(query) ||
            user.cin?.toLowerCase().includes(query)
        )
    })

    const openCreateModal = () => {
        setEditingUser(null)
        setFormData({
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            phone: '',
            cin: '',
            date_of_birth: '',
            role: 'student',
            is_active: true
        })
        setShowModal(true)
    }

    const openEditModal = (user) => {
        setEditingUser(user)
        setFormData({
            email: user.email,
            password: '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone: user.phone || '',
            cin: user.cin || '',
            date_of_birth: user.date_of_birth || '',
            role: user.role,
            is_active: user.is_active
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!editingUser && !formData.email) {
            toast.error('Email requis')
            return
        }

        try {
            setSubmitting(true)
            if (editingUser) {
                await userService.updateUser(editingUser.id, formData)
                toast.success('Utilisateur mis à jour')
            } else {
                await userService.createUser(formData)
                toast.success('Utilisateur créé')
            }
            setShowModal(false)
            loadUsers()
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (user) => {
        if (!confirm(`Supprimer ${user.first_name} ${user.last_name} ?`)) return
        try {
            await userService.deleteUser(user.id)
            toast.success('Utilisateur supprimé')
            loadUsers()
        } catch (error) {
            toast.error('Erreur lors de la suppression')
        }
    }

    const handleToggleStatus = async (user) => {
        try {
            await userService.updateUser(user.id, { is_active: !user.is_active })
            toast.success(`Utilisateur ${user.is_active ? 'désactivé' : 'activé'}`)
            loadUsers()
        } catch (error) {
            toast.error('Erreur lors de la mise à jour')
        }
    }

    const getRoleColor = (role) => {
        const colors = {
            'student': '#3b82f6',
            'teacher': '#10b981',
            'administrator': '#8b5cf6',
            'scolar_administrator': '#f59e0b',
            'club_manager': '#ec4899'
        }
        return colors[role] || '#6b7280'
    }

    const stats = {
        total: users.length,
        students: users.filter(u => u.role === 'student').length,
        teachers: users.filter(u => u.role === 'teacher').length,
        admins: users.filter(u => u.role === 'administrator' || u.role === 'scolar_administrator').length,
        active: users.filter(u => u.is_active).length
    }

    if (permissionError) {
        return (
            <div className="dashboard-page">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px' }}
                >
                    <FiXCircle size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
                    <h2>Accès refusé</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Vous n'avez pas les permissions nécessaires.</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="dashboard-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiUsers style={{ color: '#8b5cf6' }} /> Gestion des Utilisateurs
                        </h1>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
                            Gérez tous les utilisateurs de la plateforme
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        onClick={openCreateModal}
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
                        <FiPlus /> Nouvel Utilisateur
                    </motion.button>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                        { label: 'Total', value: stats.total, color: '#8b5cf6' },
                        { label: 'Étudiants', value: stats.students, color: '#3b82f6' },
                        { label: 'Enseignants', value: stats.teachers, color: '#10b981' },
                        { label: 'Admins', value: stats.admins, color: '#f59e0b' },
                        { label: 'Actifs', value: stats.active, color: '#22c55e' }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                                background: 'var(--bg-card)',
                                borderRadius: '12px',
                                padding: '1rem',
                                textAlign: 'center',
                                boxShadow: 'var(--shadow-md)',
                                borderTop: `3px solid ${stat.color}`
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', minWidth: '160px' }}
                    >
                        <option value="">Tous les rôles</option>
                        {userService.ROLES.map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', minWidth: '120px' }}
                    >
                        <option value="">Tous statuts</option>
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                    </select>
                    <button
                        onClick={loadUsers}
                        style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', cursor: 'pointer' }}
                    >
                        <FiRefreshCw size={18} />
                    </button>
                </div>

                {/* Users Table */}
                <motion.div
                    style={{
                        background: 'var(--bg-card)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Chargement...</p>
                    ) : filteredUsers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <FiUsers size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Aucun utilisateur trouvé</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Utilisateur</th>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Rôle</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Statut</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => {
                                        const roleColor = getRoleColor(user.role)
                                        return (
                                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '10px',
                                                            background: `${roleColor}20`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: roleColor,
                                                            fontWeight: '600'
                                                        }}>
                                                            {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '500' }}>
                                                                {user.first_name} {user.last_name}
                                                            </div>
                                                            {user.cin && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CIN: {user.cin}</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{user.email}</td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '9999px',
                                                        background: `${roleColor}15`,
                                                        color: roleColor,
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        {userService.getRoleLabel(user.role)}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <span
                                                        onClick={() => handleToggleStatus(user)}
                                                        style={{
                                                            cursor: 'pointer',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '9999px',
                                                            background: user.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                            color: user.is_active ? '#10b981' : '#ef4444',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        {user.is_active ? 'Actif' : 'Inactif'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', cursor: 'pointer' }}
                                                        >
                                                            <FiEdit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user)}
                                                            style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: '#ffffff',
                                borderRadius: '20px',
                                padding: '2rem',
                                width: '100%',
                                maxWidth: '600px',
                                maxHeight: '90vh',
                                overflow: 'auto',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                                <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>{editingUser ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: '#f3f4f6', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '0.5rem', color: '#6b7280' }}><FiX size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Modern Form with Sections */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                                    {/* Section 1: Informations principales */}
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FiUser style={{ color: '#8b5cf6' }} /> Informations principales
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                            <div style={{ gridColumn: '1 / -1' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                                                    📧 Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="exemple@email.com"
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '10px',
                                                        border: '2px solid #e5e7eb',
                                                        background: '#ffffff',
                                                        color: '#1f2937',
                                                        fontSize: '0.95rem',
                                                        outline: 'none',
                                                        transition: 'border-color 0.2s'
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                                                    👤 Prénom
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.first_name}
                                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                                    placeholder="Prénom"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '10px',
                                                        border: '2px solid #e5e7eb',
                                                        background: '#ffffff',
                                                        fontSize: '0.95rem'
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                                                    👤 Nom
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.last_name}
                                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                                    placeholder="Nom"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '10px',
                                                        border: '2px solid #e5e7eb',
                                                        background: '#ffffff',
                                                        fontSize: '0.95rem'
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                                                    🎭 Rôle *
                                                </label>
                                                <select
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '10px',
                                                        border: '2px solid #e5e7eb',
                                                        background: '#ffffff',
                                                        fontSize: '0.95rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {userService.ROLES.map(r => (
                                                        <option key={r.value} value={r.value}>{r.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                                                    🪪 CIN {editingUser && <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '400' }}>(non modifiable)</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.cin}
                                                    onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                                                    placeholder="12345678"
                                                    disabled={!!editingUser}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '10px',
                                                        border: '2px solid #e5e7eb',
                                                        background: editingUser ? '#f3f4f6' : '#ffffff',
                                                        fontSize: '0.95rem',
                                                        cursor: editingUser ? 'not-allowed' : 'text',
                                                        color: editingUser ? '#9ca3af' : '#1f2937'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Coordonnées */}
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FiMail style={{ color: '#8b5cf6' }} /> Coordonnées
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                                                    📱 Téléphone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+216 XX XXX XXX"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '10px',
                                                        border: '2px solid #e5e7eb',
                                                        background: '#ffffff',
                                                        fontSize: '0.95rem'
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                                                    🎂 Date de naissance
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.date_of_birth}
                                                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        borderRadius: '10px',
                                                        border: '2px solid #e5e7eb',
                                                        background: '#ffffff',
                                                        fontSize: '0.95rem'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Mot de passe (si création OU édition avec choix) */}
                                    {editingUser && (
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FiLock style={{ color: '#8b5cf6' }} /> Changer le mot de passe
                                            </h3>
                                            <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '10px', marginBottom: '1rem' }}>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#92400e' }}>
                                                    <strong>Note:</strong> Laissez vide pour conserver le mot de passe actuel
                                                </p>
                                            </div>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="Nouveau mot de passe (min. 8 caractères)"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: '10px',
                                                    border: '2px solid #e5e7eb',
                                                    background: '#ffffff',
                                                    fontSize: '0.95rem'
                                                }}
                                            />
                                        </div>
                                    )}

                                    {!editingUser && (
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FiLock style={{ color: '#8b5cf6' }} /> Mot de passe
                                            </h3>
                                            <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '10px', marginBottom: '1rem' }}>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534' }}>
                                                    <strong>Info:</strong> Laissez vide pour génération automatique
                                                </p>
                                            </div>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="Mot de passe (optionnel)"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    borderRadius: '10px',
                                                    border: '2px solid #e5e7eb',
                                                    background: '#ffffff',
                                                    fontSize: '0.95rem'
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Section 4: État du compte */}
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FiCheck style={{ color: '#8b5cf6' }} /> État du compte
                                        </h3>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '10px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                                style={{ width: '20px', height: '20px', accentColor: '#8b5cf6', cursor: 'pointer' }}
                                            />
                                            <span style={{ fontWeight: '500', color: '#374151', fontSize: '0.95rem' }}>Compte actif</span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            flex: 1,
                                            padding: '0.875rem',
                                            borderRadius: '12px',
                                            border: '2px solid #e5e7eb',
                                            background: '#ffffff',
                                            color: '#4b5563',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        Annuler
                                    </button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        disabled={submitting}
                                        style={{
                                            flex: 1,
                                            padding: '0.875rem',
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                            color: 'white',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            opacity: submitting ? 0.7 : 1,
                                            fontSize: '0.95rem',
                                            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
                                        }}
                                    >
                                        {submitting ? 'Enregistrement...' : (editingUser ? 'Mettre à jour' : 'Créer')}
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

export default AdminUsers
