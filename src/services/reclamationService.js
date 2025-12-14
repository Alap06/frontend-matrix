/**
 * Reclamation Service
 * API for managing student complaints/reclamations
 */
import api from './api'

// Categories available
export const CATEGORIES = [
    { value: 'ADMINISTRATION', label: 'Administration' },
    { value: 'ENSEIGNEMENT', label: 'Enseignement' },
    { value: 'INFRASTRUCTURE', label: 'Infrastructure' },
    { value: 'HARCELEMENT', label: 'Harcèlement' },
    { value: 'AUTRES', label: 'Autres' }
]

// Status options
export const STATUSES = [
    { value: 'NOUVEAU', label: 'Nouveau', color: 'blue' },
    { value: 'EN_COURS', label: 'En cours', color: 'orange' },
    { value: 'RESOLU', label: 'Résolu', color: 'green' },
    { value: 'REJETE', label: 'Rejeté', color: 'red' }
]

/**
 * Get list of reclamations
 * Students get only their own, Admins get all
 * @param {Object} filters - {category, status, is_anonymous}
 * @returns {Promise<Array>}
 */
export const getReclamations = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.status) params.append('status', filters.status)
    if (filters.is_anonymous !== undefined) params.append('is_anonymous', filters.is_anonymous)

    const response = await api.get(`/reclamations/?${params.toString()}`)
    return response.data
}

/**
 * Get single reclamation details
 * @param {string} uuid - Public UUID of reclamation
 * @returns {Promise<Object>}
 */
export const getReclamation = async (uuid) => {
    const response = await api.get(`/reclamations/${uuid}/`)
    return response.data
}

/**
 * Create new reclamation
 * @param {Object} data - {category, description, is_anonymous, file?}
 * @returns {Promise<Object>}
 */
export const createReclamation = async (data) => {
    // Use FormData if file is included
    if (data.file) {
        const formData = new FormData()
        formData.append('category', data.category)
        formData.append('description', data.description)
        formData.append('is_anonymous', data.is_anonymous || false)
        formData.append('file', data.file)

        const response = await api.post('/reclamations/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
    }

    const response = await api.post('/reclamations/', {
        category: data.category,
        description: data.description,
        is_anonymous: data.is_anonymous || false
    })
    return response.data
}

/**
 * Update reclamation status (Admin only)
 * @param {string} uuid - Public UUID
 * @param {Object} data - {status, comment}
 * @returns {Promise<Object>}
 */
export const updateReclamation = async (uuid, data) => {
    const response = await api.patch(`/reclamations/${uuid}/`, data)
    return response.data
}

/**
 * Delete reclamation
 * @param {string} uuid - Public UUID
 * @returns {Promise<void>}
 */
export const deleteReclamation = async (uuid) => {
    await api.delete(`/reclamations/${uuid}/`)
}

/**
 * Respond to reclamation (Admin only)
 * @param {string} uuid - Public UUID
 * @param {Object} data - {response, status}
 * @returns {Promise<Object>}
 */
export const respondToReclamation = async (uuid, data) => {
    const response = await api.patch(`/reclamations/${uuid}/`, data)
    return response.data
}

/**
 * Get status color
 * @param {string} status 
 * @returns {string}
 */
export const getStatusColor = (status) => {
    const found = STATUSES.find(s => s.value === status)
    return found ? found.color : 'gray'
}

/**
 * Get status label
 * @param {string} status 
 * @returns {string}
 */
export const getStatusLabel = (status) => {
    const found = STATUSES.find(s => s.value === status)
    return found ? found.label : status
}

export default {
    CATEGORIES,
    STATUSES,
    getReclamations,
    getReclamation,
    createReclamation,
    updateReclamation,
    deleteReclamation,
    respondToReclamation,
    getStatusColor,
    getStatusLabel
}
