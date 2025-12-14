import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUsers, FiPlus, FiSearch, FiEdit2, FiTrash2,
  FiCheck, FiX, FiCalendar, FiInfo
} from 'react-icons/fi'
import { toast } from 'react-toastify'

const AdminClubs = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Mock clubs data - will be replaced with API when available
  const [clubs, setClubs] = useState([
    {
      id: 1,
      name: 'Club Informatique',
      description: 'Club dédié à la programmation et aux nouvelles technologies',
      president: 'Ahmed Ben Ali',
      members: 45,
      status: 'active',
      createdAt: '2023-09-01'
    },
    {
      id: 2,
      name: 'Club Robotique',
      description: 'Conception et programmation de robots',
      president: 'Sarra Trabelsi',
      members: 32,
      status: 'active',
      createdAt: '2023-10-15'
    },
    {
      id: 3,
      name: 'Club Culturel',
      description: 'Activités culturelles et artistiques',
      president: 'Mohamed Gharbi',
      members: 58,
      status: 'active',
      createdAt: '2022-09-01'
    },
    {
      id: 4,
      name: 'Club Environnement',
      description: 'Sensibilisation et actions écologiques',
      president: 'Fatma Bouazizi',
      members: 25,
      status: 'pending',
      createdAt: '2024-01-10'
    }
  ])

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Actif' }
      case 'pending':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: 'En attente' }
      case 'inactive':
        return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', label: 'Inactif' }
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280', label: status }
    }
  }

  const handleApprove = (id) => {
    setClubs(prev => prev.map(club =>
      club.id === id ? { ...club, status: 'active' } : club
    ))
    toast.success('Club approuvé avec succès')
  }

  const handleReject = (id) => {
    setClubs(prev => prev.filter(club => club.id !== id))
    toast.success('Club rejeté')
  }

  const filteredClubs = clubs.filter(club => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.president.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !filterStatus || club.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const pendingClubs = clubs.filter(c => c.status === 'pending')

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
              <FiUsers style={{ color: '#8b5cf6' }} /> Gestion des Clubs
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
              Validez et gérez les clubs étudiants
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
            <FiPlus /> Nouveau Club
          </motion.button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
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
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>
              {clubs.length}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Total Clubs</div>
          </motion.div>
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
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
              {clubs.filter(c => c.status === 'active').length}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Clubs Actifs</div>
          </motion.div>
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
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
              {pendingClubs.length}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>En Attente</div>
          </motion.div>
        </div>

        {/* Pending Clubs */}
        {pendingClubs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#f59e0b' }}>
              Demandes en attente ({pendingClubs.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingClubs.map(club => (
                <div
                  key={club.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600' }}>{club.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Président: {club.president}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleApprove(club.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <FiCheck /> Approuver
                    </button>
                    <button
                      onClick={() => handleReject(club.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <FiX /> Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
              placeholder="Rechercher un club..."
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
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>

        {/* Clubs List */}
        <motion.div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Club</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Président</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Membres</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Statut</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.map(club => {
                const statusStyle = getStatusStyle(club.status)
                return (
                  <tr key={club.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '500' }}>{club.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {club.description.slice(0, 50)}...
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {club.president}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {club.members}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {statusStyle.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                          style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#8b5cf6',
                            cursor: 'pointer'
                          }}
                          title="Modifier"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
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
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.5rem',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <FiInfo style={{ color: '#8b5cf6', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            L'API de gestion des clubs sera intégrée prochainement.
            Les données affichées sont actuellement simulées.
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminClubs
