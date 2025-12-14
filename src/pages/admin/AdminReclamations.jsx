import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiX, FiAlertCircle, FiCheckCircle, FiClock,
  FiFilter, FiEye, FiMessageSquare, FiUser, FiUserX,
  FiBook, FiUsers, FiSend, FiRefreshCw
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as reclamationService from '../../services/reclamationService'
import '../student/StudentPages.css'

const AdminReclamations = () => {
  const [reclamations, setReclamations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedReclamation, setSelectedReclamation] = useState(null)
  const [filters, setFilters] = useState({ category: '', status: '' })
  const [comment, setComment] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadReclamations()
  }, [filters])

  const loadReclamations = async () => {
    try {
      setLoading(true)
      const data = await reclamationService.getReclamations(filters)
      setReclamations(data)
    } catch (error) {
      toast.error('Erreur lors du chargement')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const viewDetails = async (reclamation) => {
    try {
      const details = await reclamationService.getReclamation(reclamation.id)
      setSelectedReclamation(details)
      setNewStatus(details.status)
      setComment('')
      setShowDetailModal(true)
    } catch (error) {
      toast.error('Erreur lors du chargement des détails')
    }
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) return

    try {
      setUpdating(true)
      await reclamationService.updateReclamation(selectedReclamation.id, {
        status: newStatus,
        comment: comment.trim() || undefined
      })
      toast.success('Réclamation mise à jour avec succès')
      setShowDetailModal(false)
      loadReclamations()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NOUVEAU': return <FiAlertCircle style={{ color: '#3b82f6' }} />
      case 'EN_COURS': return <FiClock style={{ color: '#f59e0b' }} />
      case 'RESOLU': return <FiCheckCircle style={{ color: '#10b981' }} />
      case 'REJETE': return <FiX style={{ color: '#ef4444' }} />
      default: return null
    }
  }

  const getStatusBadgeStyle = (status) => {
    const styles = {
      'NOUVEAU': { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
      'EN_COURS': { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
      'RESOLU': { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
      'REJETE': { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }
    }
    return styles[status] || { background: '#f3f4f6', color: '#6b7280' }
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      'student': { label: 'Étudiant', icon: FiUsers, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      'teacher': { label: 'Enseignant', icon: FiBook, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
      'administrator': { label: 'Admin', icon: FiUser, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
    }
    return roleConfig[role] || { label: role, icon: FiUser, color: '#6b7280', bg: '#f3f4f6' }
  }

  const getSenderInfo = (rec) => {
    if (rec.is_anonymous) {
      return { name: 'Anonyme', email: null, role: null }
    }
    if (rec.student) {
      return {
        name: `${rec.student.first_name || ''} ${rec.student.last_name || ''}`.trim() || rec.student.email,
        email: rec.student.email,
        role: rec.student.role || 'student'
      }
    }
    return { name: 'Utilisateur', email: null, role: null }
  }

  // Stats
  const stats = {
    total: reclamations.length,
    nouveau: reclamations.filter(r => r.status === 'NOUVEAU').length,
    en_cours: reclamations.filter(r => r.status === 'EN_COURS').length,
    resolu: reclamations.filter(r => r.status === 'RESOLU').length
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiMessageSquare /> Gestion des Réclamations
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0 0' }}>
          Traitement des réclamations des étudiants et enseignants
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>{stats.total}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total</div>
        </div>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.nouveau}</div>
          <div style={{ fontSize: '0.875rem', color: '#3b82f6' }}>Nouveaux</div>
        </div>
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.en_cours}</div>
          <div style={{ fontSize: '0.875rem', color: '#f59e0b' }}>En cours</div>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{stats.resolu}</div>
          <div style={{ fontSize: '0.875rem', color: '#10b981' }}>Résolus</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <FiFilter style={{ color: 'var(--text-muted)' }} />
        <select
          value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value })}
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '150px' }}
        >
          <option value="">Toutes catégories</option>
          {reclamationService.CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
          style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '150px' }}
        >
          <option value="">Tous statuts</option>
          {reclamationService.STATUSES.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
        <button
          onClick={() => { setFilters({ category: '', status: '' }); loadReclamations(); }}
          style={{
            marginLeft: 'auto',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FiRefreshCw /> Actualiser
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
          <p>Chargement...</p>
        </div>
      ) : reclamations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '12px' }}>
          <FiAlertCircle size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3>Aucune réclamation</h3>
          <p style={{ color: 'var(--text-muted)' }}>Aucune réclamation ne correspond aux filtres</p>
        </div>
      ) : (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Expéditeur</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Rôle</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Catégorie</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Description</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Statut</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reclamations.map((rec, index) => {
                const sender = getSenderInfo(rec)
                const roleBadge = sender.role ? getRoleBadge(sender.role) : null

                return (
                  <motion.tr
                    key={rec.id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                      {new Date(rec.created_at).toLocaleDateString('fr-FR')}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(rec.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {rec.is_anonymous ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                          <FiUserX /> Anonyme
                        </span>
                      ) : (
                        <div>
                          <div style={{ fontWeight: '500' }}>{sender.name}</div>
                          {sender.email && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sender.email}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {roleBadge ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          background: roleBadge.bg,
                          color: roleBadge.color
                        }}>
                          <roleBadge.icon size={12} />
                          {roleBadge.label}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        background: 'var(--primary-orange)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {rec.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '250px' }}>
                      <span style={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.875rem'
                      }}>
                        {rec.description?.substring(0, 60)}...
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        ...getStatusBadgeStyle(rec.status)
                      }}>
                        {getStatusIcon(rec.status)}
                        {reclamationService.getStatusLabel(rec.status)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => viewDetails(rec)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'var(--accent-blue)',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        <FiEye /> Détails
                      </button>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedReclamation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
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
              onClick={e => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '0',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiMessageSquare /> Détails de la Réclamation
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: '1.5rem', overflow: 'auto', flex: 1 }}>
                {/* Sender Info Card */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    INFORMATIONS EXPÉDITEUR
                  </h4>
                  {(() => {
                    const sender = getSenderInfo(selectedReclamation)
                    const roleBadge = sender.role ? getRoleBadge(sender.role) : null

                    if (selectedReclamation.is_anonymous) {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FiUserX size={24} style={{ color: 'var(--text-muted)' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Anonyme</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                              L'expéditeur a choisi de rester anonyme
                            </div>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: roleBadge ? roleBadge.bg : 'var(--accent-blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: roleBadge ? roleBadge.color : 'white',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>
                          {sender.name?.[0] || 'U'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{sender.name}</div>
                          {sender.email && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{sender.email}</div>
                          )}
                        </div>
                        {roleBadge && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            background: roleBadge.bg,
                            color: roleBadge.color
                          }}>
                            <roleBadge.icon size={14} />
                            {roleBadge.label}
                          </span>
                        )}
                      </div>
                    )
                  })()}
                </div>

                {/* Reclamation Details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      CATÉGORIE
                    </label>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      background: 'var(--primary-orange)',
                      color: 'white',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}>
                      {selectedReclamation.category}
                    </span>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      DATE DE SOUMISSION
                    </label>
                    <div style={{ fontWeight: '500' }}>
                      {new Date(selectedReclamation.created_at).toLocaleString('fr-FR')}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    DESCRIPTION
                  </label>
                  <div style={{
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '8px',
                    lineHeight: 1.6,
                    color: '#1e293b'
                  }}>
                    {selectedReclamation.description}
                  </div>
                </div>

                {/* Conversation History */}
                {selectedReclamation.history && selectedReclamation.history.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      HISTORIQUE DES ACTIONS
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedReclamation.history.map((item, idx) => (
                        <div key={idx} style={{
                          padding: '0.75rem',
                          background: '#f1f5f9',
                          borderRadius: '8px',
                          borderLeft: '3px solid #65a8c9'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{
                              ...getStatusBadgeStyle(item.status),
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {reclamationService.getStatusLabel(item.status)}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(item.created_at).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          {item.comment && (
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>{item.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Actions */}
                <div style={{
                  background: '#f0f9ff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #65a8c9'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiSend /> Actions Administrateur
                  </h4>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Changer le statut
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {reclamationService.STATUSES.map(status => (
                        <button
                          key={status.value}
                          onClick={() => setNewStatus(status.value)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            border: newStatus === status.value ? '2px solid #65a8c9' : '1px solid #e2e8f0',
                            background: newStatus === status.value ? '#ffffff' : '#f8fafc',
                            cursor: 'pointer',
                            fontWeight: newStatus === status.value ? '600' : '400',
                            color: '#1e293b'
                          }}
                        >
                          {getStatusIcon(status.value)} {status.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      Ajouter une réponse / commentaire
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Rédigez votre réponse à l'expéditeur..."
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        resize: 'vertical',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'var(--primary-orange)',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {updating ? (
                      <>Mise à jour...</>
                    ) : (
                      <><FiSend /> Envoyer la réponse</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminReclamations
