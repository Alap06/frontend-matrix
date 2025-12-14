import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiFileText, FiPlus, FiX, FiEdit2, FiTrash2, FiDownload, FiUpload,
  FiSearch, FiFilter, FiCheck, FiClock, FiEye, FiUsers,
  FiUser, FiCalendar, FiSave, FiCheckCircle, FiXCircle, FiGlobe, FiMapPin
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as documentService from '../../services/documentService'
import '../student/StudentPages.css'

const ScolarDocuments = () => {
  const [activeTab, setActiveTab] = useState('requests')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('type')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Document types that admin can create
  const [documentTypes, setDocumentTypes] = useState([
    { id: 1, name: 'Attestation de Présence', description: 'Confirme la présence de l\'étudiant', visibleTo: ['student', 'teacher'], processingDays: 3, active: true },
    { id: 2, name: 'Attestation de Scolarité', description: 'Certificat d\'inscription', visibleTo: ['student'], processingDays: 2, active: true },
    { id: 3, name: 'Relevé de Notes', description: 'Notes et moyennes du semestre', visibleTo: ['student'], processingDays: 5, active: true },
    { id: 4, name: 'Certificat de Stage', description: 'Attestation pour les stages', visibleTo: ['student', 'teacher'], processingDays: 7, active: true },
    { id: 5, name: 'Lettre de Recommandation', description: 'Lettre de recommandation académique', visibleTo: ['student'], processingDays: 10, active: true }
  ])

  // Document requests from backend
  const [requests, setRequests] = useState([])

  // Form for new document type
  const [typeForm, setTypeForm] = useState({
    name: '',
    description: '',
    visibleTo: ['student'],
    processingDays: 3,
    active: true
  })

  // Selected request for detail view
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [pdfDownloaded, setPdfDownloaded] = useState(false)
  const [certificateGenerated, setCertificateGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [pdfUploaded, setPdfUploaded] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Load document requests from backend
  useEffect(() => {
    loadRequests()
  }, [statusFilter])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const filters = {}
      if (statusFilter !== 'all') {
        // Map frontend status to backend status
        const statusMap = { 'pending': 'NEW', 'approved': 'READY', 'rejected': 'REJECTED' }
        filters.status = statusMap[statusFilter] || statusFilter
      }
      const data = await documentService.getDocumentRequests(filters)
      setRequests(data)
    } catch (error) {
      console.error('Error loading requests:', error)
      toast.error('Erreur lors du chargement des demandes')
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setModalType('type')
    setTypeForm({ name: '', description: '', visibleTo: ['student'], processingDays: 3, active: true })
    setShowModal(true)
  }

  const handleCreateType = (e) => {
    e.preventDefault()
    const newType = { ...typeForm, id: Date.now() }
    setDocumentTypes([...documentTypes, newType])
    setShowModal(false)
    toast.success('Type de document créé')
  }

  const deleteType = (id) => {
    if (!window.confirm('Supprimer ce type de document ?')) return
    setDocumentTypes(documentTypes.filter(t => t.id !== id))
    toast.success('Type supprimé')
  }

  const toggleTypeVisibility = (typeId, role) => {
    setDocumentTypes(documentTypes.map(t => {
      if (t.id === typeId) {
        const newVisibleTo = t.visibleTo.includes(role)
          ? t.visibleTo.filter(r => r !== role)
          : [...t.visibleTo, role]
        return { ...t, visibleTo: newVisibleTo }
      }
      return t
    }))
  }

  const handleRequestAction = async (requestId, action) => {
    try {
      setSubmitting(true)
      if (action === 'approve') {
        await documentService.terminateRequest(requestId)
        toast.success('Demande approuvée avec succès')
      } else {
        await documentService.rejectRequest(requestId)
        toast.success('Demande rejetée')
      }
      setSelectedRequest(null)
      loadRequests()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors du traitement de la demande')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadPDF = async (request) => {
    try {
      const blob = await documentService.downloadDocument(request.id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `demande_${documentService.getDocumentTypeLabel(request.document_type).replace(/\s+/g, '_')}_${request.student_name || 'document'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      setPdfDownloaded(true)
      toast.success('✅ PDF téléchargé! Générez maintenant le certificat.')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erreur lors du téléchargement du PDF')
    }
  }

  // Check if document type supports certificate generation
  const isCertificateType = (docType) => {
    return ['CERTIFICATE_INSCRIPTION', 'CERTIFICATE_PRESENCE', 'CERTIFICATE_SUCCESS'].includes(docType)
  }

  const handleGenerateCertificate = async (request) => {
    if (!isCertificateType(request.document_type)) {
      // For non-certificate types, skip directly to upload step
      setCertificateGenerated(true)
      toast.info('ℹ️ Ce type de document ne nécessite pas de génération automatique. Uploadez directement.')
      return
    }

    try {
      setGenerating(true)
      const blob = await documentService.generateCertificate(request.id, request.document_type, request.language || 'fr')
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `certificat_${documentService.getDocumentTypeLabel(request.document_type).replace(/\s+/g, '_')}_${request.student_name || 'document'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      setCertificateGenerated(true)
      toast.success('✅ Certificat généré et téléchargé! Uploadez-le maintenant.')
    } catch (error) {
      console.error('Generate error:', error)
      toast.error('Erreur lors de la génération du certificat: ' + (error.response?.data?.detail || error.message))
    } finally {
      setGenerating(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Veuillez sélectionner un fichier PDF')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Le fichier ne doit pas dépasser 10 Mo')
        return
      }
      setUploadedFile(file)
    }
  }

  const handleUploadPDF = async (request) => {
    if (!uploadedFile) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    try {
      setUploading(true)
      await documentService.uploadAdminFile(request.id, uploadedFile)
      setPdfUploaded(true)
      toast.success('✅ Document uploadé! Vous pouvez maintenant approuver.')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Erreur lors de l\'upload du document')
    } finally {
      setUploading(false)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
      case 'NEW': return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Nouveau', icon: FiClock }
      case 'IN_PROGRESS': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'En cours', icon: FiClock }
      case 'approved':
      case 'READY': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'Prêt', icon: FiCheckCircle }
      case 'rejected':
      case 'REJECTED': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'Rejetée', icon: FiXCircle }
      case 'DELIVERED': return { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', label: 'Livré', icon: FiCheckCircle }
      default: return { bg: '#f3f4f6', color: '#6b7280', label: status, icon: FiClock }
    }
  }

  const filteredRequests = requests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (searchQuery && !r.requester.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !r.type.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  }

  return (
    <div className="dashboard-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiFileText /> Gestion des Documents
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Gérez les types de documents et traitez les demandes
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total', value: stats.total, color: '#3b82f6' },
            { label: 'En attente', value: stats.pending, color: '#f59e0b' },
            { label: 'Approuvées', value: stats.approved, color: '#10b981' },
            { label: 'Rejetées', value: stats.rejected, color: '#ef4444' }
          ].map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setActiveTab('types')} style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            border: activeTab === 'types' ? '2px solid var(--primary-orange)' : '2px solid transparent',
            background: activeTab === 'types' ? 'var(--primary-orange)' : 'var(--bg-card)',
            color: activeTab === 'types' ? 'white' : 'var(--text-primary)',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiFileText /> Types de Documents ({documentTypes.length})
          </button>
          <button onClick={() => setActiveTab('requests')} style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            border: activeTab === 'requests' ? '2px solid var(--primary-orange)' : '2px solid transparent',
            background: activeTab === 'requests' ? 'var(--primary-orange)' : 'var(--bg-card)',
            color: activeTab === 'requests' ? 'white' : 'var(--text-primary)',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiClock /> Demandes {stats.pending > 0 && <span style={{ background: '#f59e0b', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem' }}>{stats.pending}</span>}
          </button>
        </div>

        {/* Types Tab */}
        {activeTab === 'types' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button onClick={openCreateModal} style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, var(--primary-orange), #e67e22)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '500'
              }}>
                <FiPlus /> Nouveau Type
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {documentTypes.map((type, idx) => (
                <motion.div key={type.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ margin: 0 }}>{type.name}</h4>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{type.description}</p>
                    </div>
                    <button onClick={() => deleteType(type.id)} style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <FiCalendar /> Traitement: {type.processingDays} jours
                  </div>

                  <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Visible par:</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['student', 'teacher'].map(role => (
                      <button key={role} onClick={() => toggleTypeVisibility(type.id, role)} style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: type.visibleTo.includes(role) ? (role === 'student' ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)') : 'var(--bg-secondary)',
                        color: type.visibleTo.includes(role) ? (role === 'student' ? '#3b82f6' : '#8b5cf6') : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.8rem'
                      }}>
                        {type.visibleTo.includes(role) && <FiCheck size={12} />}
                        {role === 'student' ? 'Étudiants' : 'Enseignants'}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <FiSearch style={{ color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none' }} />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
            </div>

            {/* Requests List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '12px' }}>
                <p style={{ color: 'var(--text-muted)' }}>Chargement...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '12px' }}>
                <FiFileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <h3>Aucune demande</h3>
                <p style={{ color: 'var(--text-muted)' }}>Aucune demande de document pour le moment</p>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
                {filteredRequests.map((request, idx) => {
                  const statusStyle = getStatusStyle(request.status)
                  const StatusIcon = statusStyle.icon
                  return (
                    <motion.div key={request.id || request.public_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1.25rem',
                        borderBottom: idx < filteredRequests.length - 1 ? '1px solid var(--border-color)' : 'none',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}>
                      {/* Requester Info */}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{request.student_name || 'Étudiant'}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            background: 'rgba(59,130,246,0.1)',
                            color: '#3b82f6',
                            fontSize: '0.75rem'
                          }}>
                            Étudiant
                          </span>
                          {request.academic_year && <span style={{ fontSize: '0.75rem' }}>{request.academic_year}</span>}
                        </div>
                      </div>

                      {/* Document Type */}
                      <div style={{ flex: 1, minWidth: '150px' }}>
                        <div style={{ fontWeight: '500' }}>{documentService.getDocumentTypeLabel(request.document_type)}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <FiCalendar style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                          {new Date(request.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>

                      {/* Status */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        fontWeight: '500',
                        fontSize: '0.875rem'
                      }}>
                        <StatusIcon size={16} />
                        {statusStyle.label}
                      </div>

                      {/* Actions */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedRequest(request)
                          setPdfDownloaded(false)
                          setCertificateGenerated(false)
                          setPdfUploaded(false)
                          setUploadedFile(null)
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontWeight: '500',
                          fontSize: '0.85rem'
                        }}
                      >
                        <FiEye size={16} />
                        Voir Détails
                      </motion.button>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Create Type Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', maxWidth: '500px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>📄 Nouveau Type de Document</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={24} /></button>
              </div>

              <form onSubmit={handleCreateType}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nom</label>
                    <input type="text" value={typeForm.name} onChange={e => setTypeForm({ ...typeForm, name: e.target.value })} required placeholder="Ex: Attestation de Présence" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                    <textarea value={typeForm.description} onChange={e => setTypeForm({ ...typeForm, description: e.target.value })} placeholder="Description du document..." rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Délai de traitement (jours)</label>
                    <input type="number" value={typeForm.processingDays} onChange={e => setTypeForm({ ...typeForm, processingDays: parseInt(e.target.value) })} min="1" max="30" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Visible par</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['student', 'teacher'].map(role => (
                        <button key={role} type="button" onClick={() => {
                          const newVisibleTo = typeForm.visibleTo.includes(role)
                            ? typeForm.visibleTo.filter(r => r !== role)
                            : [...typeForm.visibleTo, role]
                          setTypeForm({ ...typeForm, visibleTo: newVisibleTo })
                        }} style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          border: 'none',
                          background: typeForm.visibleTo.includes(role) ? (role === 'student' ? '#3b82f6' : '#8b5cf6') : 'var(--bg-secondary)',
                          color: typeForm.visibleTo.includes(role) ? 'white' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {typeForm.visibleTo.includes(role) && <FiCheck />}
                          {role === 'student' ? 'Étudiants' : 'Enseignants'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer' }}>Annuler</button>
                  <button type="submit" style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', border: 'none', background: 'var(--primary-orange)', color: 'white', cursor: 'pointer', fontWeight: '500' }}>
                    <FiSave style={{ marginRight: '0.5rem' }} /> Créer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Request Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', overflowY: 'auto' }}
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#ffffff', borderRadius: '24px', padding: '0', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', margin: 'auto' }}
            >
              {/* Modal Header */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: 'linear-gradient(135deg, var(--primary-orange, #f97316), #fb923c)', padding: '1.25rem 1.5rem', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>📄 Détails de la Demande</h3>
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedRequest(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '0.4rem', color: 'white' }}><FiX size={18} /></motion.button>
                </div>
                <p style={{ margin: '0.35rem 0 0 0', opacity: 0.95, fontSize: '0.9rem' }}>{documentService.getDocumentTypeLabel(selectedRequest.document_type)}</p>
              </motion.div>

              {/* Modal Body */}
              <div style={{ padding: '1.25rem', maxHeight: '60vh', overflowY: 'auto' }}>
                {/* Student Info Card */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(251, 146, 60, 0.05))', borderRadius: '16px', border: '1px solid rgba(249, 115, 22, 0.15)', marginBottom: '1rem' }}>
                  <motion.div whileHover={{ scale: 1.05 }} style={{ width: '55px', height: '55px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--primary-orange, #f97316), #fb923c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.4rem', fontWeight: '700', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)', flexShrink: 0 }}>
                    {(selectedRequest.student_name || 'E')[0].toUpperCase()}
                  </motion.div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1rem', marginBottom: '0.2rem' }}>
                      {selectedRequest.student_first_name && selectedRequest.student_last_name ? `${selectedRequest.student_first_name} ${selectedRequest.student_last_name}` : selectedRequest.student_name || 'Étudiant'}
                    </div>
                    {selectedRequest.student_cin && <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.2rem' }}>🪪 CIN: <strong style={{ color: '#374151' }}>{selectedRequest.student_cin}</strong></div>}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--primary-orange, #f97316)', fontSize: '0.7rem', fontWeight: '500' }}>👨‍🎓 Étudiant</span>
                      {selectedRequest.academic_year && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>📅 {selectedRequest.academic_year}</span>}
                    </div>
                  </div>
                </motion.div>

                {/* Student Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📧 Coordonnées de l'étudiant
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                    {selectedRequest.student?.email && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        <span style={{ fontWeight: '500' }}>Email:</span> {selectedRequest.student.email}
                      </div>
                    )}
                    {selectedRequest.student?.phone && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        <span style={{ fontWeight: '500' }}>Tél:</span> {selectedRequest.student.phone}
                      </div>
                    )}
                    {selectedRequest.student_cin && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        <span style={{ fontWeight: '500' }}>CIN:</span> {selectedRequest.student_cin}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Teacher Approvals Section - Only for presence certificates */}
                {selectedRequest.document_type === 'CERTIFICATE_PRESENCE' && selectedRequest.presence_approvals && selectedRequest.presence_approvals.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      marginBottom: '1rem',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                      borderRadius: '12px',
                      border: '1px solid #bbf7d0'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#166534', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      👨‍🏫 Enseignants sélectionnés ({selectedRequest.presence_approvals.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {selectedRequest.presence_approvals.map((approval, idx) => {
                        const teacher = approval.teacher
                        const status = approval.status
                        const statusConfig = {
                          'PENDING': { label: 'En attente', color: '#f59e0b', bg: '#fef3c7', icon: '⏳' },
                          'APPROVED': { label: 'Approuvé', color: '#10b981', bg: '#d1fae5', icon: '✅' },
                          'REJECTED': { label: 'Rejeté', color: '#ef4444', bg: '#fee2e2', icon: '❌' }
                        }[status] || { label: status, color: '#6b7280', bg: '#f3f4f6', icon: '📝' }

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.22 + idx * 0.05 }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.75rem',
                              background: 'white',
                              borderRadius: '10px',
                              border: `2px solid ${statusConfig.bg}`,
                              flexWrap: 'wrap'
                            }}
                          >
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '1rem',
                              fontWeight: '700',
                              flexShrink: 0
                            }}>
                              {(teacher?.first_name || 'P')[0].toUpperCase()}
                            </div>

                            <div style={{ flex: 1, minWidth: '120px' }}>
                              <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>
                                {teacher?.first_name} {teacher?.last_name}
                              </div>
                              {teacher?.email && (
                                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                                  {teacher.email}
                                </div>
                              )}
                            </div>

                            <div style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '999px',
                              background: statusConfig.bg,
                              color: statusConfig.color,
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              whiteSpace: 'nowrap'
                            }}>
                              <span>{statusConfig.icon}</span>
                              {statusConfig.label}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Approval Summary */}
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.6rem',
                      background: 'rgba(255,255,255,0.6)',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      color: '#166534',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      {selectedRequest.presence_approvals.filter(a => a.status === 'APPROVED').length} / {selectedRequest.presence_approvals.length} enseignants approuvés
                    </div>
                  </motion.div>
                )}

                {/* Details Grid - 4 cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
                  {/* Language */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ scale: 1.02, y: -2 }} style={{ padding: '0.7rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <FiGlobe style={{ color: '#22c55e' }} size={13} />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Langue</span>
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>
                      {selectedRequest.language === 'ar' ? '🇹🇳 Arabe' : '🇫🇷 Français'}
                    </div>
                  </motion.div>

                  {/* Reception Type */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} whileHover={{ scale: 1.02, y: -2 }} style={{ padding: '0.7rem', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a', cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <FiMapPin style={{ color: '#f59e0b' }} size={13} />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Réception</span>
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>
                      {selectedRequest.reception_type === 'ONLINE' ? '💻 En Ligne' : '🏢 Présentiel'}
                    </div>
                  </motion.div>

                  {/* Document Type */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.02, y: -2 }} style={{ padding: '0.7rem', background: 'rgba(249, 115, 22, 0.08)', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.2)', cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <FiFileText style={{ color: 'var(--primary-orange, #f97316)' }} size={13} />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Type</span>
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.8rem' }}>
                      {documentService.getDocumentTypeLabel(selectedRequest.document_type)}
                    </div>
                  </motion.div>

                  {/* Date */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} whileHover={{ scale: 1.02, y: -2 }} style={{ padding: '0.7rem', background: '#e0f2fe', borderRadius: '12px', border: '1px solid #bae6fd', cursor: 'default' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <FiCalendar style={{ color: '#0ea5e9' }} size={13} />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Date</span>
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.8rem' }}>
                      {new Date(selectedRequest.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </motion.div>
                </div>

                {/* Status */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ marginTop: '0.75rem', padding: '0.7rem 1rem', background: '#f9fafb', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>📊 Statut:</span>
                  <motion.span animate={{ scale: selectedRequest.status === 'NEW' ? [1, 1.05, 1] : 1 }} transition={{ duration: 2, repeat: selectedRequest.status === 'NEW' ? Infinity : 0 }} style={{ padding: '0.3rem 0.7rem', borderRadius: '9999px', background: getStatusStyle(selectedRequest.status).bg, color: getStatusStyle(selectedRequest.status).color, fontWeight: '600', fontSize: '0.8rem' }}>
                    {getStatusStyle(selectedRequest.status).label}
                  </motion.span>
                </motion.div>

                {selectedRequest.additional_info && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} style={{ marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem', fontWeight: '500' }}>💬 Informations:</div>
                    <div style={{ padding: '0.7rem', background: '#f9fafb', borderRadius: '10px', color: '#374151', fontSize: '0.85rem', lineHeight: 1.5 }}>{selectedRequest.additional_info}</div>
                  </motion.div>
                )}

                {/* History Timeline */}
                {selectedRequest.history && selectedRequest.history.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📜 Historique des Modifications
                    </div>
                    <div style={{
                      maxHeight: '200px',
                      overflowY: 'auto',
                      background: '#f9fafb',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb'
                    }}>
                      {selectedRequest.history.map((item, idx) => (
                        <div key={idx} style={{
                          marginBottom: idx < selectedRequest.history.length - 1 ? '0.75rem' : 0,
                          paddingBottom: idx < selectedRequest.history.length - 1 ? '0.75rem' : 0,
                          borderBottom: idx < selectedRequest.history.length - 1 ? '1px solid #e5e7eb' : 'none'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1f2937' }}>
                              {item.changed_by ? `${item.changed_by.first_name} ${item.changed_by.last_name}` : 'Système'}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                              {new Date(item.date).toLocaleString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {item.old_status && item.new_status ? (
                              <>
                                <span style={{ color: '#ef4444' }}>{documentService.getStatusLabel(item.old_status)}</span>
                                {' → '}
                                <span style={{ color: '#10b981' }}>{documentService.getStatusLabel(item.new_status)}</span>
                              </>
                            ) : item.comment}
                          </div>
                          {item.comment && item.old_status && (
                            <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem', fontStyle: 'italic' }}>
                              💬 {item.comment}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Download PDF Button - Always visible */}
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownloadPDF(selectedRequest)}
                  style={{
                    padding: '0.8rem 1.2rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
                    fontSize: '0.9rem'
                  }}
                >
                  <FiDownload size={18} /> Télécharger PDF
                </motion.button>

                {(selectedRequest.status === 'NEW' || selectedRequest.status === 'IN_PROGRESS') ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                    {/* Step Progress Indicator - 4 Steps */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.75rem',
                      background: '#f8fafc',
                      borderRadius: '12px'
                    }}>
                      {/* Step 1 */}
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: pdfDownloaded ? '#10b981' : '#C07F10',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: '700'
                      }}>{pdfDownloaded ? '✓' : '1'}</div>
                      <div style={{ width: '25px', height: '2px', background: pdfDownloaded ? '#10b981' : '#e5e7eb' }} />
                      {/* Step 2 */}
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: certificateGenerated ? '#10b981' : pdfDownloaded ? '#C07F10' : '#e5e7eb',
                        color: pdfDownloaded ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: '700'
                      }}>{certificateGenerated ? '✓' : '2'}</div>
                      <div style={{ width: '25px', height: '2px', background: certificateGenerated ? '#10b981' : '#e5e7eb' }} />
                      {/* Step 3 */}
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: pdfUploaded ? '#10b981' : certificateGenerated ? '#C07F10' : '#e5e7eb',
                        color: certificateGenerated ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: '700'
                      }}>{pdfUploaded ? '✓' : '3'}</div>
                      <div style={{ width: '25px', height: '2px', background: pdfUploaded ? '#10b981' : '#e5e7eb' }} />
                      {/* Step 4 */}
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: pdfUploaded ? '#C07F10' : '#e5e7eb',
                        color: pdfUploaded ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: '700'
                      }}>4</div>
                    </div>

                    {/* Step 1: Download */}
                    {!pdfDownloaded && (
                      <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '12px', border: '1px solid #fbbf24' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>📥</span>
                          <div>
                            <div style={{ fontWeight: '700', color: '#78350f' }}>Étape 1: Télécharger la demande</div>
                            <div style={{ fontSize: '0.85rem', color: '#92400e' }}>Téléchargez le PDF de la demande étudiant</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Generate Certificate */}
                    {pdfDownloaded && !certificateGenerated && (
                      <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)', borderRadius: '12px', border: '1px solid #6366f1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>📜</span>
                          <div>
                            <div style={{ fontWeight: '700', color: '#312e81' }}>Étape 2: Générer le certificat</div>
                            <div style={{ fontSize: '0.85rem', color: '#4338ca' }}>
                              {isCertificateType(selectedRequest.document_type)
                                ? 'Générez le certificat officiel'
                                : 'Passez à l\'étape suivante'}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleGenerateCertificate(selectedRequest)}
                          disabled={generating}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: generating ? 'wait' : 'pointer',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          {generating ? '⏳ Génération...' : isCertificateType(selectedRequest.document_type) ? '📜 Générer Certificat' : '➡️ Passer à l\'upload'}
                        </motion.button>
                      </div>
                    )}

                    {/* Step 3: Upload */}
                    {certificateGenerated && !pdfUploaded && (
                      <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '12px', border: '1px solid #3b82f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>📤</span>
                          <div>
                            <div style={{ fontWeight: '700', color: '#1e3a8a' }}>Étape 3: Uploader le document</div>
                            <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>Uploadez le PDF du document officiel</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <input type="file" accept=".pdf" onChange={handleFileSelect} style={{ display: 'none' }} id="pdf-upload" />
                          <label htmlFor="pdf-upload" style={{
                            flex: 1, padding: '0.75rem 1rem', background: 'white', border: '2px dashed #3b82f6',
                            borderRadius: '10px', cursor: 'pointer', textAlign: 'center', fontSize: '0.9rem', color: '#1e40af', fontWeight: '500'
                          }}>
                            {uploadedFile ? `📄 ${uploadedFile.name}` : '📁 Choisir un fichier PDF...'}
                          </label>
                          {uploadedFile && (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleUploadPDF(selectedRequest)} disabled={uploading}
                              style={{
                                padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                color: 'white', border: 'none', borderRadius: '10px', cursor: uploading ? 'not-allowed' : 'pointer',
                                fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem'
                              }}
                            >
                              {uploading ? '⏳' : <FiUpload />} {uploading ? 'Upload...' : 'Uploader'}
                            </motion.button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 4: Ready to approve */}
                    {pdfUploaded && (
                      <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderRadius: '12px', border: '1px solid #10b981' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>✅</span>
                          <div>
                            <div style={{ fontWeight: '700', color: '#065f46' }}>Étape 4: Prêt pour approbation</div>
                            <div style={{ fontSize: '0.85rem', color: '#047857' }}>Vous pouvez maintenant approuver ou rejeter</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <motion.button
                        whileHover={pdfUploaded ? { scale: 1.03 } : {}}
                        whileTap={pdfUploaded ? { scale: 0.98 } : {}}
                        disabled={!pdfUploaded || submitting}
                        onClick={() => pdfUploaded && handleRequestAction(selectedRequest.id, 'approve')}
                        style={{
                          flex: 1,
                          padding: '0.9rem',
                          borderRadius: '12px',
                          border: 'none',
                          background: pdfUploaded ? 'linear-gradient(135deg, #10b981, #059669)' : '#e5e7eb',
                          color: pdfUploaded ? 'white' : '#9ca3af',
                          cursor: pdfUploaded ? 'pointer' : 'not-allowed',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          fontSize: '0.95rem'
                        }}
                      >
                        <FiCheck size={18} /> Approuver
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={submitting}
                        onClick={() => handleRequestAction(selectedRequest.id, 'reject')}
                        style={{
                          flex: 1,
                          padding: '0.9rem',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white',
                          cursor: submitting ? 'not-allowed' : 'pointer',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          fontSize: '0.95rem'
                        }}
                      >
                        <FiX size={18} /> Rejeter
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <motion.button whileHover={{ scale: 1.02 }} onClick={() => setSelectedRequest(null)}
                    style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', border: '2px solid #C07F10', background: '#ffffff', color: '#C07F10', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
                    Fermer
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ScolarDocuments
