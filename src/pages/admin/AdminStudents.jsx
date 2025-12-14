import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiX, FiEdit2, FiTrash2, FiSearch,
  FiUser, FiMail, FiCheck, FiXCircle, FiAlertTriangle,
  FiRefreshCw, FiLock
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as userService from '../../services/userService'
import '../student/StudentPages.css'

const AdminStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
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
    is_active: true
  })
  const [submitting, setSubmitting] = useState(false)
  const [permissionError, setPermissionError] = useState(false)

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      setLoading(true)
      setPermissionError(false)
      const data = await userService.getUsersByRole('student')
      setStudents(data)
    } catch (error) {
      if (error.response?.status === 403) {
        setPermissionError(true)
      } else {
        toast.error('Erreur lors du chargement des étudiants')
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase()
    return (
      student.email?.toLowerCase().includes(query) ||
      student.first_name?.toLowerCase().includes(query) ||
      student.last_name?.toLowerCase().includes(query)
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
        toast.success('Étudiant mis à jour')
      } else {
        await userService.createUser({ ...formData, role: 'student' })
        toast.success('Étudiant créé')
      }

      setShowModal(false)
      loadStudents()
    } catch (error) {
      const errorMsg = error.response?.data?.email?.[0] ||
        error.response?.data?.detail ||
        'Erreur lors de l\'opération'
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.email} ?`)) return

    try {
      await userService.deleteUser(user.id)
      toast.success('Étudiant supprimé')
      loadStudents()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  const toggleActive = async (user) => {
    try {
      await userService.updateUser(user.id, { is_active: !user.is_active })
      toast.success(`Étudiant ${user.is_active ? 'désactivé' : 'activé'}`)
      loadStudents()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  // Permission Error Screen
  if (permissionError) {
    return (
      <div className="dashboard-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            maxWidth: '500px',
            margin: '4rem auto',
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <FiLock size={40} style={{ color: '#ef4444' }} />
          </div>
          <h2 style={{ margin: '0 0 1rem 0', color: '#ef4444' }}>Accès Refusé</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Vous n'avez pas les permissions nécessaires pour accéder à la gestion des utilisateurs.
            <br /><br />
            Cette fonctionnalité nécessite un compte administrateur avec les droits <strong>is_staff</strong> activés.
          </p>
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#f59e0b',
            marginBottom: '1.5rem'
          }}>
            <FiAlertTriangle style={{ marginRight: '0.5rem' }} />
            Contactez un super-administrateur pour obtenir les droits d'accès.
          </div>
          <button
            onClick={loadStudents}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary-blue)',
              color: 'white',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiRefreshCw /> Réessayer
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiUser /> Gestion des Étudiants
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            {students.length} étudiant{students.length > 1 ? 's' : ''} enregistré{students.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--primary-orange), #e67e22)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(192, 121, 33, 0.3)'
          }}
        >
          <FiPlus /> Ajouter Étudiant
        </button>
      </div>

      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem',
        background: 'var(--bg-card)',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <FiSearch style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }} />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: 'none',
            background: 'transparent',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FiX />
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Chargement...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '12px' }}>
          <FiUser size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>Aucun étudiant trouvé</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {searchQuery ? 'Aucun résultat pour cette recherche' : 'Commencez par ajouter un étudiant'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem'
        }}>
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `2px solid ${student.is_active ? 'transparent' : 'rgba(239, 68, 68, 0.3)'}`,
                opacity: student.is_active ? 1 : 0.7,
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.25rem'
                  }}>
                    {student.first_name?.[0] || student.email?.[0]?.toUpperCase() || 'E'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>
                      {student.first_name || student.last_name
                        ? `${student.first_name || ''} ${student.last_name || ''}`.trim()
                        : 'Sans nom'}
                    </h4>
                    <span style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <FiMail size={12} /> {student.email}
                    </span>
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  background: student.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: student.is_active ? '#10b981' : '#ef4444'
                }}>
                  {student.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <div style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
                padding: '0.5rem',
                background: 'var(--bg-secondary)',
                borderRadius: '8px'
              }}>
                📅 Inscrit le {new Date(student.date_joined).toLocaleDateString('fr-FR')}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => openEditModal(student)}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <FiEdit2 /> Modifier
                </button>
                <button
                  onClick={() => toggleActive(student)}
                  style={{
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: student.is_active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: student.is_active ? '#ef4444' : '#10b981',
                    cursor: 'pointer'
                  }}
                  title={student.is_active ? 'Désactiver' : 'Activer'}
                >
                  {student.is_active ? <FiXCircle /> : <FiCheck />}
                </button>
                <button
                  onClick={() => handleDelete(student)}
                  style={{
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    cursor: 'pointer'
                  }}
                  title="Supprimer"
                >
                  <FiTrash2 />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
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
                borderRadius: '20px',
                padding: '2rem',
                maxWidth: '450px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>{editingUser ? '✏️ Modifier Étudiant' : '➕ Nouvel Étudiant'}</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                      📧 Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required={!editingUser}
                      placeholder="etudiant@example.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                      🔐 {editingUser ? 'Nouveau mot de passe' : 'Mot de passe'}
                    </label>
                    {editingUser && (
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                        Laisser vide pour conserver le mot de passe actuel
                      </p>
                    )}
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingUser ? 'Laisser vide pour conserver' : 'Min. 8 caractères'}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        👤 Prénom
                      </label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                        placeholder="Ahmed"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        👤 Nom
                      </label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                        placeholder="Ben Ali"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        📱 Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+216 XX XXX XXX"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        🪪 CIN {editingUser && <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '400' }}>(non modifiable)</span>}
                      </label>
                      <input
                        type="text"
                        value={formData.cin}
                        onChange={e => setFormData({ ...formData, cin: e.target.value })}
                        disabled={!!editingUser}
                        placeholder="12345678"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: editingUser ? 'var(--bg-secondary)' : 'transparent',
                          fontSize: '1rem',
                          cursor: editingUser ? 'not-allowed' : 'text'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                      🎂 Date de naissance
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      padding: '0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '10px'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>Compte actif</span>
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
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, var(--primary-orange), #e67e22)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    {submitting ? '⏳ Enregistrement...' : (editingUser ? '✓ Mettre à jour' : '✓ Créer')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminStudents
