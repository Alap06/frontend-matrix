import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiFileText, FiPlus, FiX, FiClock, FiCheckCircle, FiXCircle,
  FiDownload, FiCalendar, FiInfo, FiSend, FiGlobe, FiMapPin, FiEye, FiUsers, FiUser
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import * as documentService from '../../services/documentService'
import * as userService from '../../services/userService'
import './StudentPages.css'

const StudentDocuments = () => {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [myRequests, setMyRequests] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loadingTeachers, setLoadingTeachers] = useState(false)
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [teacherSearch, setTeacherSearch] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    language: 'fr',
    reception_type: 'ONLINE',
    academic_year: '2024-2025'
  })

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(teacher => {
    const searchLower = teacherSearch.toLowerCase()
    const fullName = `${teacher.first_name || ''} ${teacher.last_name || ''}`.toLowerCase()
    const email = (teacher.email || '').toLowerCase()
    return fullName.includes(searchLower) || email.includes(searchLower)
  })

  // Document types from service
  const documentTypes = documentService.DOCUMENT_TYPES.map((type, idx) => ({
    ...type,
    icon: ['📋', '🎓', '📊', '💼', '✉️', '📄'][idx] || '📄',
    description: getTypeDescription(type.value),
    processingDays: getProcessingDays(type.value)
  }))

  function getTypeDescription(type) {
    const descriptions = {
      'TRANSCRIPT': 'Notes et moyennes du semestre',
      'CERTIFICATE_PRESENCE': 'Confirme votre présence en cours (nécessite approbation de 2 enseignants)',
      'CERTIFICATE_SUCCESS': 'Certificat de réussite académique',
      'CERTIFICATE_INSCRIPTION': 'Certificat d\'inscription officiel',
      'DIPLOMA': 'Votre diplôme officiel',
      'OTHER': 'Autre type de document'
    }
    return descriptions[type] || 'Document administratif'
  }

  function getProcessingDays(type) {
    const days = {
      'TRANSCRIPT': 5,
      'CERTIFICATE_PRESENCE': 5,
      'CERTIFICATE_SUCCESS': 5,
      'CERTIFICATE_INSCRIPTION': 2,
      'DIPLOMA': 10,
      'OTHER': 7
    }
    return days[type] || 5
  }

  useEffect(() => {
    loadMyDocuments()
  }, [])

  const loadMyDocuments = async () => {
    try {
      setLoading(true)
      const data = await documentService.getDocumentRequests()
      setMyRequests(data)
    } catch (error) {
      console.error('Error loading documents:', error)
      toast.error('Erreur lors du chargement des documents')
    } finally {
      setLoading(false)
    }
  }

  const loadTeachers = async () => {
    try {
      setLoadingTeachers(true)
      const data = await userService.getUsersByRole('teacher')
      setTeachers(data)
    } catch (error) {
      console.error('Error loading teachers:', error)
      toast.error('Erreur lors du chargement des enseignants')
    } finally {
      setLoadingTeachers(false)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'NEW': return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Nouveau', icon: FiClock }
      case 'IN_PROGRESS': return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: 'En cours', icon: FiClock }
      case 'READY': return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'Prêt', icon: FiCheckCircle }
      case 'REJECTED': return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'Rejetée', icon: FiXCircle }
      case 'DELIVERED': return { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', label: 'Livré', icon: FiCheckCircle }
      default: return { bg: '#f3f4f6', color: '#6b7280', label: status, icon: FiClock }
    }
  }

  const openRequestModal = async (type) => {
    setSelectedType(type)
    setFormData({ language: 'fr', reception_type: 'ONLINE', academic_year: '2024-2025' })
    setSelectedTeachers([])
    setShowRequestModal(true)

    // Load teachers for presence certificate
    if (type.value === 'CERTIFICATE_PRESENCE') {
      await loadTeachers()
    }
  }

  const openDetailModal = (doc) => {
    setSelectedDoc(doc)
    setShowDetailModal(true)
  }

  const toggleTeacher = (teacherId) => {
    setSelectedTeachers(prev => {
      if (prev.includes(teacherId)) {
        return prev.filter(id => id !== teacherId)
      }
      if (prev.length < 5) {
        return [...prev, teacherId]
      }
      // Max 5 teachers
      toast.warning('Maximum 5 enseignants')
      return prev
    })
  }

  const handleSubmitRequest = async (e) => {
    e.preventDefault()
    if (!selectedType) return

    try {
      setSubmitting(true)

      // If presence certificate, use special endpoint with teachers
      if (selectedType.value === 'CERTIFICATE_PRESENCE') {
        if (selectedTeachers.length < 2) {
          toast.error('Veuillez sélectionner au moins 2 enseignants')
          setSubmitting(false)
          return
        }
        if (selectedTeachers.length > 5) {
          toast.error('Maximum 5 enseignants')
          setSubmitting(false)
          return
        }
        await documentService.createPresenceRequest({
          language: formData.language,
          reception_type: formData.reception_type,
          academic_year: formData.academic_year,
          teachers: selectedTeachers
        })
        toast.success('Demande envoyée! En attente d\'approbation des enseignants.')
      } else {
        await documentService.createDocumentRequest({
          document_type: selectedType.value,
          language: formData.language,
          reception_type: formData.reception_type,
          academic_year: formData.academic_year
        })
        toast.success('Demande envoyée avec succès!')
      }

      setShowRequestModal(false)
      loadMyDocuments()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors de l\'envoi de la demande')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownloadPDF = async (docId) => {
    try {
      setDownloading(true)
      const blob = await documentService.downloadDocument(docId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `document_${docId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Document téléchargé!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erreur lors du téléchargement')
    } finally {
      setDownloading(false)
    }
  }

  const stats = {
    total: myRequests.length,
    pending: myRequests.filter(r => r.status === 'NEW' || r.status === 'IN_PROGRESS').length,
    ready: myRequests.filter(r => r.status === 'READY').length
  }

  return (
    <div className="dashboard-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <FiFileText style={{ color: 'var(--primary-orange, #f97316)' }} /> Mes Documents
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
            Demandez et suivez vos documents administratifs
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-orange, #f97316)' }}>{stats.total}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total demandes</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            style={{ background: '#fffbeb', padding: '1.25rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #fef3c7' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pending}</div>
            <div style={{ fontSize: '0.875rem', color: '#92400e' }}>En attente</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '16px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{stats.ready}</div>
            <div style={{ fontSize: '0.875rem', color: '#065f46' }}>Prêts à télécharger</div>
          </motion.div>
        </div>

        {/* Document Types */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>📄 Demander un document</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {documentTypes.map((type, idx) => (
              <motion.div key={type.value} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                onClick={() => openRequestModal(type)}
                whileHover={{ scale: 1.02, y: -4 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  border: type.value === 'CERTIFICATE_PRESENCE' ? '2px solid var(--primary-orange, #f97316)' : '2px solid #f1f5f9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}>
                {type.value === 'CERTIFICATE_PRESENCE' && (
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'var(--primary-orange, #f97316)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '600' }}>
                    👨‍🏫 2 Prof
                  </div>
                )}
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{type.icon}</div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#1f2937' }}>{type.label}</h4>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#6b7280' }}>{type.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
                  <FiClock /> Délai: ~{type.processingDays} jours
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* My Requests */}
        <div>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>📋 Mes demandes</h3>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '16px' }}>
              <p style={{ color: '#6b7280' }}>Chargement...</p>
            </div>
          ) : myRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <FiFileText size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: '#9ca3af' }} />
              <h4 style={{ color: '#1f2937' }}>Aucune demande</h4>
              <p style={{ color: '#6b7280' }}>Vous n'avez pas encore demandé de document</p>
            </div>
          ) : (
            <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              {myRequests.map((request, idx) => {
                const statusStyle = getStatusStyle(request.status)
                const StatusIcon = statusStyle.icon
                return (
                  <motion.div key={request.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1.25rem',
                      borderBottom: idx < myRequests.length - 1 ? '1px solid #f1f5f9' : 'none',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                    {/* Document Info */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#1f2937' }}>
                        {documentService.getDocumentTypeLabel(request.document_type)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiCalendar /> {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.4rem 0.8rem', borderRadius: '9999px',
                      background: statusStyle.bg, color: statusStyle.color,
                      fontWeight: '500', fontSize: '0.8rem'
                    }}>
                      <StatusIcon size={14} />
                      {statusStyle.label}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <motion.button whileHover={{ scale: 1.05 }} onClick={() => openDetailModal(request)}
                        style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: '500' }}>
                        <FiEye size={14} /> Détails
                      </motion.button>

                      {request.status === 'READY' && (
                        <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleDownloadPDF(request.id)} disabled={downloading}
                          style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', cursor: downloading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: '500', opacity: downloading ? 0.7 : 1 }}>
                          <FiDownload size={14} /> {downloading ? '...' : 'PDF'}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#ffffff', borderRadius: '24px', padding: '0', maxWidth: '480px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>

              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, var(--primary-orange, #f97316), #fb923c)', padding: '1.25rem 1.5rem', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>📄 Détails de la demande</h3>
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={() => setShowDetailModal(false)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '0.4rem', color: 'white' }}>
                    <FiX size={18} />
                  </motion.button>
                </div>
                <p style={{ margin: '0.3rem 0 0 0', opacity: 0.95, fontSize: '0.9rem' }}>
                  {documentService.getDocumentTypeLabel(selectedDoc.document_type)}
                </p>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem' }}>
                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <FiGlobe style={{ color: '#22c55e' }} size={13} />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Langue</span>
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>
                      {selectedDoc.language === 'ar' ? '🇹🇳 Arabe' : '🇫🇷 Français'}
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <FiMapPin style={{ color: '#f59e0b' }} size={13} />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Réception</span>
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>
                      {selectedDoc.reception_type === 'ONLINE' ? '💻 En ligne' : '🏢 Présentiel'}
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    style={{ padding: '0.75rem', background: '#fff7ed', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <FiCalendar style={{ color: '#f97316' }} size={13} />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Année</span>
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>
                      {selectedDoc.academic_year}
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    style={{ padding: '0.75rem', background: '#e0f2fe', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <FiClock style={{ color: '#0ea5e9' }} size={13} />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' }}>Date</span>
                    </div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.8rem' }}>
                      {new Date(selectedDoc.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </motion.div>
                </div>

                {/* Status */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  style={{ padding: '0.75rem 1rem', background: '#f9fafb', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>📊 Statut:</span>
                  <motion.span animate={{ scale: selectedDoc.status === 'NEW' ? [1, 1.05, 1] : 1 }} transition={{ duration: 2, repeat: selectedDoc.status === 'NEW' ? Infinity : 0 }}
                    style={{ padding: '0.3rem 0.7rem', borderRadius: '9999px', background: getStatusStyle(selectedDoc.status).bg, color: getStatusStyle(selectedDoc.status).color, fontWeight: '600', fontSize: '0.8rem' }}>
                    {getStatusStyle(selectedDoc.status).label}
                  </motion.span>
                </motion.div>

                {selectedDoc.additional_info && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} style={{ marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem', fontWeight: '500' }}>💬 Informations:</div>
                    <div style={{ padding: '0.7rem', background: '#f9fafb', borderRadius: '10px', color: '#374151', fontSize: '0.85rem' }}>{selectedDoc.additional_info}</div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem' }}>
                {selectedDoc.status === 'READY' ? (
                  <motion.button whileHover={{ scale: 1.02 }} onClick={() => handleDownloadPDF(selectedDoc.id)} disabled={downloading}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', cursor: downloading ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)', opacity: downloading ? 0.7 : 1, fontSize: '0.9rem' }}>
                    <FiDownload size={18} /> {downloading ? 'Téléchargement...' : 'Télécharger le PDF'}
                  </motion.button>
                ) : (
                  <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowDetailModal(false)}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '2px solid var(--primary-orange, #f97316)', background: '#ffffff', color: 'var(--primary-orange, #f97316)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                    Fermer
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && selectedType && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowRequestModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', overflowY: 'auto' }}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#ffffff', borderRadius: '24px', padding: '0', maxWidth: '500px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>

              {/* Header */}
              <div style={{ background: 'linear-gradient(135deg, var(--primary-orange, #f97316), #fb923c)', padding: '1.25rem 1.5rem', color: 'white', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{selectedType.icon} Nouvelle demande</h3>
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} onClick={() => setShowRequestModal(false)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', borderRadius: '8px', padding: '0.4rem', color: 'white' }}>
                    <FiX size={18} />
                  </motion.button>
                </div>
                <p style={{ margin: '0.3rem 0 0 0', opacity: 0.95, fontSize: '0.9rem' }}>{selectedType.label}</p>
              </div>

              {/* Body */}
              <div style={{ padding: '1.25rem' }}>
                <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#3b82f6', fontWeight: '600', fontSize: '0.9rem' }}>
                    <FiInfo /> Information
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e40af' }}>
                    {selectedType.description}. Délai estimé: <strong>{selectedType.processingDays} jours</strong>.
                  </p>
                </div>

                <form onSubmit={handleSubmitRequest}>
                  {/* Language */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1f2937', fontSize: '0.9rem' }}>🌐 Langue du document</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[{ value: 'fr', label: '🇫🇷 Français' }, { value: 'ar', label: '🇹🇳 Arabe' }].map(lang => (
                        <button key={lang.value} type="button" onClick={() => setFormData({ ...formData, language: lang.value })}
                          style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', border: formData.language === lang.value ? '2px solid var(--primary-orange, #f97316)' : '2px solid #e5e7eb', background: formData.language === lang.value ? 'rgba(249, 115, 22, 0.1)' : '#f9fafb', color: formData.language === lang.value ? 'var(--primary-orange, #f97316)' : '#6b7280', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}>
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reception Type */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1f2937', fontSize: '0.9rem' }}>📍 Mode de réception</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[{ value: 'ONLINE', label: '💻 En ligne' }, { value: 'PERSONAL', label: '🏢 En personne' }].map(rec => (
                        <button key={rec.value} type="button" onClick={() => setFormData({ ...formData, reception_type: rec.value })}
                          style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', border: formData.reception_type === rec.value ? '2px solid var(--primary-orange, #f97316)' : '2px solid #e5e7eb', background: formData.reception_type === rec.value ? 'rgba(249, 115, 22, 0.1)' : '#f9fafb', color: formData.reception_type === rec.value ? 'var(--primary-orange, #f97316)' : '#6b7280', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem' }}>
                          {rec.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Academic Year */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1f2937', fontSize: '0.9rem' }}>📅 Année académique</label>
                    <input type="text" value={formData.academic_year} onChange={e => setFormData({ ...formData, academic_year: e.target.value })}
                      placeholder="2024-2025" style={{ width: '100%', padding: '0.7rem', borderRadius: '10px', border: '2px solid #e5e7eb', background: '#f9fafb', fontSize: '0.9rem', color: '#1f2937' }} />
                  </div>

                  {/* Teacher Selection for Presence Certificate */}
                  {selectedType.value === 'CERTIFICATE_PRESENCE' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#1f2937', fontSize: '0.9rem' }}>
                        👨‍🏫 Sélectionner 2 à 5 enseignants pour approbation
                      </label>
                      <div style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '10px', marginBottom: '0.75rem', border: '1px solid #fde68a' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e' }}>
                          <strong>Important:</strong> Les enseignants sélectionnés (2 minimum, 5 maximum) devront approuver votre demande avant qu'elle soit traitée par l'administration.
                        </p>
                      </div>

                      {/* Search Bar */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                          <FiUser style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }} />
                          <input
                            type="text"
                            placeholder="Rechercher par nom ou prénom..."
                            value={teacherSearch}
                            onChange={(e) => setTeacherSearch(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.7rem 0.7rem 0.7rem 2.5rem',
                              borderRadius: '10px',
                              border: '2px solid #e5e7eb',
                              background: '#f9fafb',
                              fontSize: '0.9rem',
                              color: '#1f2937'
                            }}
                          />
                        </div>
                      </div>

                      {loadingTeachers ? (
                        <div style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>
                          Chargement des enseignants...
                        </div>
                      ) : (
                        <div style={{ maxHeight: '250px', overflowY: 'auto', border: '2px solid #e5e7eb', borderRadius: '12px' }}>
                          {filteredTeachers.length === 0 ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                              {teacherSearch ? 'Aucun enseignant trouvé' : 'Aucun enseignant disponible'}
                            </div>
                          ) : (
                            filteredTeachers.map((teacher, idx) => {
                              const isSelected = selectedTeachers.includes(teacher.id)
                              return (
                                <motion.div
                                  key={teacher.id}
                                  whileHover={{ backgroundColor: '#f9fafb' }}
                                  onClick={() => toggleTeacher(teacher.id)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    cursor: 'pointer',
                                    borderBottom: idx < filteredTeachers.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    background: isSelected ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: isSelected ? 'var(--primary-orange, #f97316)' : '#e5e7eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isSelected ? 'white' : '#6b7280',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s'
                                  }}>
                                    {isSelected ? <FiCheckCircle size={18} /> : (teacher.first_name?.[0] || teacher.email[0]).toUpperCase()}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.9rem' }}>
                                      {teacher.first_name && teacher.last_name
                                        ? `${teacher.first_name} ${teacher.last_name}`
                                        : teacher.email}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                      {teacher.email}
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                      style={{ background: 'var(--primary-orange, #f97316)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '600' }}>
                                      ✓ Sélectionné
                                    </motion.div>
                                  )}
                                </motion.div>
                              )
                            })
                          )}
                        </div>
                      )}

                      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiUsers style={{ color: selectedTeachers.length >= 2 ? '#10b981' : '#f59e0b' }} />
                        <span style={{ fontSize: '0.85rem', color: selectedTeachers.length >= 2 ? '#10b981' : '#f59e0b', fontWeight: '500' }}>
                          {selectedTeachers.length}/5 enseignants sélectionnés {selectedTeachers.length < 2 ? '(min. 2)' : '✓'}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setShowRequestModal(false)}
                      style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '2px solid #e5e7eb', background: '#ffffff', cursor: 'pointer', color: '#6b7280', fontWeight: '500', fontSize: '0.9rem' }}>
                      Annuler
                    </button>
                    <button type="submit" disabled={submitting || (selectedType.value === 'CERTIFICATE_PRESENCE' && selectedTeachers.length < 2)}
                      style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, var(--primary-orange, #f97316), #fb923c)', color: 'white', cursor: (submitting || (selectedType.value === 'CERTIFICATE_PRESENCE' && selectedTeachers.length < 2)) ? 'not-allowed' : 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem', opacity: (submitting || (selectedType.value === 'CERTIFICATE_PRESENCE' && selectedTeachers.length < 2)) ? 0.7 : 1 }}>
                      {submitting ? '⏳ Envoi...' : <><FiSend /> Envoyer</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StudentDocuments
