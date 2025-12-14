/**
 * Document Service
 * API for managing document requests
 */
import api from './api'

// Document types
export const DOCUMENT_TYPES = [
    { value: 'TRANSCRIPT', label: 'Relevé de notes' },
    { value: 'CERTIFICATE_PRESENCE', label: 'Attestation de présence' },
    { value: 'CERTIFICATE_SUCCESS', label: 'Attestation de réussite' },
    { value: 'CERTIFICATE_INSCRIPTION', label: 'Attestation d\'inscription' },
    { value: 'DIPLOMA', label: 'Diplôme' },
    { value: 'OTHER', label: 'Autre' }
]

// Languages
export const LANGUAGES = [
    { value: 'ar', label: 'Arabe' },
    { value: 'fr', label: 'Français' }
]

// Reception types
export const RECEPTION_TYPES = [
    { value: 'ONLINE', label: 'En ligne' },
    { value: 'PERSONAL', label: 'En personne' },
    { value: 'BOTH', label: 'Les deux' }
]

// Status options
export const STATUSES = [
    { value: 'NEW', label: 'Nouveau', color: '#3b82f6' },
    { value: 'IN_PROGRESS', label: 'En cours', color: '#f59e0b' },
    { value: 'READY', label: 'Prêt', color: '#10b981' },
    { value: 'REJECTED', label: 'Rejeté', color: '#ef4444' },
    { value: 'DELIVERED', label: 'Livré', color: '#8b5cf6' }
]

// Approval statuses
export const APPROVAL_STATUSES = [
    { value: 'PENDING', label: 'En attente', color: '#f59e0b' },
    { value: 'APPROVED', label: 'Approuvé', color: '#10b981' },
    { value: 'REJECTED', label: 'Rejeté', color: '#ef4444' }
]

/**
 * Get all document requests
 * @param {Object} filters - {document_type, status}
 */
export const getDocumentRequests = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.document_type) params.append('document_type', filters.document_type)
    if (filters.status) params.append('status', filters.status)

    const response = await api.get(`/documents/demandes/?${params.toString()}`)
    return response.data
}

/**
 * Get single document request by ID
 * @param {string} id - UUID
 */
export const getDocumentRequest = async (id) => {
    const response = await api.get(`/documents/demandes/${id}/`)
    return response.data
}

/**
 * Create new document request
 * @param {Object} data - {document_type, language, reception_type, academic_year}
 */
export const createDocumentRequest = async (data) => {
    const response = await api.post('/documents/demandes/', data)
    return response.data
}

/**
 * Update document request status (Admin only)
 * @param {string} id - UUID
 * @param {Object} data - {status, comment}
 */
export const updateDocumentRequest = async (id, data) => {
    const response = await api.patch(`/documents/demandes/${id}/`, data)
    return response.data
}

/**
 * Delete document request
 * @param {string} id - UUID
 */
export const deleteDocumentRequest = async (id) => {
    await api.delete(`/documents/demandes/${id}/`)
}

/**
 * Mark document as ready
 * @param {string} id - UUID
 */
export const terminateRequest = async (id) => {
    const response = await api.put(`/documents/demandes/${id}/terminate/`)
    return response.data
}

/**
 * Reject document request
 * @param {string} id - UUID
 */
export const rejectRequest = async (id) => {
    const response = await api.put(`/documents/demandes/${id}/reject/`)
    return response.data
}

/**
 * Process document request
 * @param {string} id - UUID
 */
export const processRequest = async (id) => {
    const response = await api.put(`/documents/demandes/${id}/process/`)
    return response.data
}

/**
 * Download document PDF
 * @param {string} id - UUID
 */
export const downloadDocument = async (id) => {
    const response = await api.get(`/documents/demandes/${id}/file/`, {
        responseType: 'blob'
    })
    return response.data
}

/**
 * Upload admin PDF file
 * @param {string} id - UUID  
 * @param {File} file - PDF file to upload
 */
export const uploadAdminFile = async (id, file) => {
    const formData = new FormData()
    formData.append('pdf_requested_file', file)
    const response = await api.patch(`/documents/demandes/${id}/upload-file/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

/**
 * Generate inscription certificate
 * @param {string} id - UUID
 * @param {string} lang - Language (ar/fr)
 */
export const generateInscriptionCertificate = async (id, lang = 'fr') => {
    const response = await api.get(`/documents/demandes/${id}/generate-inscription-certificate/`, {
        params: { lang },
        responseType: 'blob'
    })
    return response.data
}

/**
 * Generate presence certificate  
 * @param {string} id - UUID
 * @param {string} lang - Language (ar/fr)
 */
export const generatePresenceCertificate = async (id, lang = 'fr') => {
    const response = await api.get(`/documents/demandes/${id}/generate-presence-certificate/`, {
        params: { lang },
        responseType: 'blob'
    })
    return response.data
}

/**
 * Generate success certificate
 * @param {string} id - UUID
 * @param {string} lang - Language (ar/fr)
 */
export const generateSuccessCertificate = async (id, lang = 'fr') => {
    const response = await api.get(`/documents/demandes/${id}/generate-success-certificate/`, {
        params: { lang },
        responseType: 'blob'
    })
    return response.data
}

/**
 * Generate certificate based on document type
 * @param {string} id - UUID
 * @param {string} documentType - Document type
 * @param {string} lang - Language (ar/fr)
 */
export const generateCertificate = async (id, documentType, lang = 'fr') => {
    switch (documentType) {
        case 'CERTIFICATE_INSCRIPTION':
            return generateInscriptionCertificate(id, lang)
        case 'CERTIFICATE_PRESENCE':
            return generatePresenceCertificate(id, lang)
        case 'CERTIFICATE_SUCCESS':
            return generateSuccessCertificate(id, lang)
        default:
            throw new Error('Type de document non supporté pour la génération automatique')
    }
}


/**
 * Create presence request with teacher selection (Student only)
 * @param {Object} data - {language, reception_type, academic_year, teachers}
 */
export const createPresenceRequest = async (data) => {
    const response = await api.post('/documents/presence-requests/', data)
    return response.data
}

/**
 * Get teacher approvals (Teacher only)
 */
export const getTeacherApprovals = async () => {
    const response = await api.get('/documents/teacher/approvals/')
    return response.data
}

/**
 * Update approval status (Teacher only)
 * @param {number} id - Approval ID
 * @param {Object} data - {status, comment}
 */
export const updateApproval = async (id, data) => {
    const response = await api.patch(`/documents/teacher/approvals/${id}/`, data)
    return response.data
}


// Helper functions
export const getDocumentTypeLabel = (type) => {
    const found = DOCUMENT_TYPES.find(t => t.value === type)
    return found ? found.label : type
}

export const getLanguageLabel = (lang) => {
    const found = LANGUAGES.find(l => l.value === lang)
    return found ? found.label : lang
}

export const getReceptionTypeLabel = (type) => {
    const found = RECEPTION_TYPES.find(t => t.value === type)
    return found ? found.label : type
}

export const getStatusLabel = (status) => {
    const found = STATUSES.find(s => s.value === status)
    return found ? found.label : status
}

export const getStatusColor = (status) => {
    const found = STATUSES.find(s => s.value === status)
    return found ? found.color : '#6b7280'
}

export const getApprovalStatusLabel = (status) => {
    const found = APPROVAL_STATUSES.find(s => s.value === status)
    return found ? found.label : status
}

export const getApprovalStatusColor = (status) => {
    const found = APPROVAL_STATUSES.find(s => s.value === status)
    return found ? found.color : '#6b7280'
}

export default {
    DOCUMENT_TYPES,
    LANGUAGES,
    RECEPTION_TYPES,
    STATUSES,
    APPROVAL_STATUSES,
    getDocumentRequests,
    getDocumentRequest,
    createDocumentRequest,
    updateDocumentRequest,
    deleteDocumentRequest,
    terminateRequest,
    rejectRequest,
    processRequest,
    downloadDocument,
    uploadAdminFile,
    createPresenceRequest,
    getTeacherApprovals,
    updateApproval,
    generateInscriptionCertificate,
    generatePresenceCertificate,
    generateSuccessCertificate,
    generateCertificate,
    getDocumentTypeLabel,
    getLanguageLabel,
    getReceptionTypeLabel,
    getStatusLabel,
    getStatusColor,
    getApprovalStatusLabel,
    getApprovalStatusColor
}
