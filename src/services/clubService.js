/**
 * Club Service
 * API for managing clubs, events, reports, and announcements
 */
import api from './api'

// Club statuses
export const CLUB_STATUSES = [
    { value: 'pending', label: 'En attente', color: '#f59e0b' },
    { value: 'active', label: 'Actif', color: '#10b981' },
    { value: 'inactive', label: 'Inactif', color: '#6b7280' },
    { value: 'rejected', label: 'Rejeté', color: '#ef4444' }
]

// Event statuses
export const EVENT_STATUSES = [
    { value: 'draft', label: 'Brouillon', color: '#6b7280' },
    { value: 'pending', label: 'En attente', color: '#f59e0b' },
    { value: 'approved', label: 'Approuvé', color: '#10b981' },
    { value: 'rejected', label: 'Rejeté', color: '#ef4444' },
    { value: 'completed', label: 'Terminé', color: '#8b5cf6' },
    { value: 'cancelled', label: 'Annulé', color: '#6b7280' }
]

// Semesters
export const SEMESTERS = [
    { value: 's1', label: 'Semestre 1' },
    { value: 's2', label: 'Semestre 2' }
]

// Priority levels
export const PRIORITIES = [
    { value: 'low', label: 'Basse', color: '#6b7280' },
    { value: 'medium', label: 'Moyenne', color: '#3b82f6' },
    { value: 'high', label: 'Haute', color: '#f59e0b' },
    { value: 'urgent', label: 'Urgente', color: '#ef4444' }
]

// ============================================================================
// Clubs API
// ============================================================================

export const getClubs = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.search) params.append('search', filters.search)

    const response = await api.get(`/clubs/?${params.toString()}`)
    return response.data
}

export const getClub = async (publicId) => {
    const response = await api.get(`/clubs/${publicId}/`)
    return response.data
}

export const createClub = async (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key])
        }
    })

    const response = await api.post('/clubs/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export const updateClub = async (publicId, data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key])
        }
    })

    const response = await api.patch(`/clubs/${publicId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export const deleteClub = async (publicId) => {
    await api.delete(`/clubs/${publicId}/`)
}

// ============================================================================
// Events API
// ============================================================================

export const getEvents = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.club) params.append('club', filters.club)

    const response = await api.get(`/clubs/events/?${params.toString()}`)
    return response.data
}

export const getEvent = async (publicId) => {
    const response = await api.get(`/clubs/events/${publicId}/`)
    return response.data
}

export const createEvent = async (data) => {
    const response = await api.post('/clubs/events/', data)
    return response.data
}

export const updateEvent = async (publicId, data) => {
    const response = await api.patch(`/clubs/events/${publicId}/`, data)
    return response.data
}

export const deleteEvent = async (publicId) => {
    await api.delete(`/clubs/events/${publicId}/`)
}

// ============================================================================
// Reports API
// ============================================================================

export const getReports = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.semester) params.append('semester', filters.semester)
    if (filters.academic_year) params.append('academic_year', filters.academic_year)
    if (filters.club) params.append('club', filters.club)

    const response = await api.get(`/clubs/reports/?${params.toString()}`)
    return response.data
}

export const getReport = async (publicId) => {
    const response = await api.get(`/clubs/reports/${publicId}/`)
    return response.data
}

export const createReport = async (data) => {
    const response = await api.post('/clubs/reports/', data)
    return response.data
}

export const updateReport = async (publicId, data) => {
    const response = await api.patch(`/clubs/reports/${publicId}/`, data)
    return response.data
}

export const deleteReport = async (publicId) => {
    await api.delete(`/clubs/reports/${publicId}/`)
}

// ============================================================================
// Announcements API
// ============================================================================

export const getAnnouncements = async () => {
    const response = await api.get('/clubs/announcements/')
    return response.data
}

export const getAnnouncement = async (publicId) => {
    const response = await api.get(`/clubs/announcements/${publicId}/`)
    return response.data
}

export const createAnnouncement = async (data) => {
    const response = await api.post('/clubs/announcements/', data)
    return response.data
}

export const updateAnnouncement = async (publicId, data) => {
    const response = await api.patch(`/clubs/announcements/${publicId}/`, data)
    return response.data
}

export const deleteAnnouncement = async (publicId) => {
    await api.delete(`/clubs/announcements/${publicId}/`)
}

// ============================================================================
// Statistics API
// ============================================================================

export const getClubStats = async () => {
    const response = await api.get('/clubs/stats/')
    return response.data
}

// ============================================================================
// Helper Functions
// ============================================================================

export const getClubStatusLabel = (status) => {
    const found = CLUB_STATUSES.find(s => s.value === status)
    return found ? found.label : status
}

export const getClubStatusColor = (status) => {
    const found = CLUB_STATUSES.find(s => s.value === status)
    return found ? found.color : '#6b7280'
}

export const getEventStatusLabel = (status) => {
    const found = EVENT_STATUSES.find(s => s.value === status)
    return found ? found.label : status
}

export const getEventStatusColor = (status) => {
    const found = EVENT_STATUSES.find(s => s.value === status)
    return found ? found.color : '#6b7280'
}

export const getPriorityLabel = (priority) => {
    const found = PRIORITIES.find(p => p.value === priority)
    return found ? found.label : priority
}

export const getPriorityColor = (priority) => {
    const found = PRIORITIES.find(p => p.value === priority)
    return found ? found.color : '#6b7280'
}

export default {
    CLUB_STATUSES,
    EVENT_STATUSES,
    SEMESTERS,
    PRIORITIES,
    getClubs,
    getClub,
    createClub,
    updateClub,
    deleteClub,
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    getReports,
    getReport,
    createReport,
    updateReport,
    deleteReport,
    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getClubStats,
    getClubStatusLabel,
    getClubStatusColor,
    getEventStatusLabel,
    getEventStatusColor,
    getPriorityLabel,
    getPriorityColor
}
