/**
 * Schedule Service
 * API for managing schedule, sessions, and attendance
 */
import api from './api'

// Session types
export const SESSION_TYPES = [
    { value: 'COURS', label: 'Cours Magistral', color: '#3b82f6' },
    { value: 'TD', label: 'Travaux Dirigés', color: '#8b5cf6' },
    { value: 'TP', label: 'Travaux Pratiques', color: '#10b981' },
    { value: 'EXAMEN', label: 'Examen', color: '#ef4444' },
    { value: 'RATTRAPAGE', label: 'Rattrapage', color: '#f59e0b' }
]

// Days of week
export const DAYS_OF_WEEK = [
    { value: 0, label: 'Dimanche', short: 'Dim' },
    { value: 1, label: 'Lundi', short: 'Lun' },
    { value: 2, label: 'Mardi', short: 'Mar' },
    { value: 3, label: 'Mercredi', short: 'Mer' },
    { value: 4, label: 'Jeudi', short: 'Jeu' },
    { value: 5, label: 'Vendredi', short: 'Ven' },
    { value: 6, label: 'Samedi', short: 'Sam' }
]

// Attendance statuses
export const ATTENDANCE_STATUS = [
    { value: 'PRESENT', label: 'Présent', color: '#10b981' },
    { value: 'ABSENT', label: 'Absent', color: '#ef4444' },
    { value: 'LATE', label: 'En retard', color: '#f59e0b' },
    { value: 'EXCUSED', label: 'Excusé', color: '#3b82f6' }
]

// ============================================================================
// Student Groups
// ============================================================================

export const getGroups = async () => {
    const response = await api.get('/schedule/groups/')
    return response.data
}

export const createGroup = async (data) => {
    const response = await api.post('/schedule/groups/', data)
    return response.data
}

export const updateGroup = async (id, data) => {
    const response = await api.patch(`/schedule/groups/${id}/`, data)
    return response.data
}

export const deleteGroup = async (id) => {
    await api.delete(`/schedule/groups/${id}/`)
}

// ============================================================================
// Subjects
// ============================================================================

export const getSubjects = async () => {
    const response = await api.get('/schedule/subjects/')
    return response.data
}

export const createSubject = async (data) => {
    const response = await api.post('/schedule/subjects/', data)
    return response.data
}

export const updateSubject = async (id, data) => {
    const response = await api.patch(`/schedule/subjects/${id}/`, data)
    return response.data
}

export const deleteSubject = async (id) => {
    await api.delete(`/schedule/subjects/${id}/`)
}

// ============================================================================
// Sessions
// ============================================================================

export const getSessions = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.day) params.append('day', filters.day)
    if (filters.group) params.append('group', filters.group)
    if (filters.type) params.append('type', filters.type)
    if (filters.semester) params.append('semester', filters.semester)

    const response = await api.get(`/schedule/sessions/?${params.toString()}`)
    return response.data
}

export const getSession = async (id) => {
    const response = await api.get(`/schedule/sessions/${id}/`)
    return response.data
}

export const createSession = async (data) => {
    const response = await api.post('/schedule/sessions/', data)
    return response.data
}

export const updateSession = async (id, data) => {
    const response = await api.patch(`/schedule/sessions/${id}/`, data)
    return response.data
}

export const deleteSession = async (id) => {
    await api.delete(`/schedule/sessions/${id}/`)
}

/**
 * Get current user's weekly schedule
 * Returns object with keys 1-6 (Monday-Saturday) containing session arrays
 */
export const getMySchedule = async () => {
    const response = await api.get('/schedule/my-schedule/')
    return response.data
}

// ============================================================================
// Attendance
// ============================================================================

export const getAttendance = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.start_date) params.append('start_date', filters.start_date)
    if (filters.end_date) params.append('end_date', filters.end_date)
    if (filters.status) params.append('status', filters.status)
    if (filters.session) params.append('session', filters.session)

    const response = await api.get(`/schedule/attendance/?${params.toString()}`)
    return response.data
}

/**
 * Mark attendance for multiple students at once
 * @param {number} sessionId - Session ID
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {Array} attendances - Array of {student_id, status} objects
 */
export const markAttendance = async (sessionId, date, attendances) => {
    const response = await api.post('/schedule/attendance/mark/', {
        session_id: sessionId,
        date: date,
        attendances: attendances
    })
    return response.data
}

/**
 * Get students list for a session (for taking attendance)
 */
export const getSessionStudents = async (sessionId, date) => {
    const params = date ? `?date=${date}` : ''
    const response = await api.get(`/schedule/sessions/${sessionId}/students/${params}`)
    return response.data
}

/**
 * Get current student's absences summary
 */
export const getMyAbsences = async () => {
    const response = await api.get('/schedule/my-absences/')
    return response.data
}

// ============================================================================
// Group Membership
// ============================================================================

export const getMemberships = async (groupId) => {
    const params = groupId ? `?group=${groupId}` : ''
    const response = await api.get(`/schedule/memberships/${params}`)
    return response.data
}

export const addMembership = async (studentId, groupId) => {
    const response = await api.post('/schedule/memberships/', {
        student_id: studentId,
        group_id: groupId
    })
    return response.data
}

export const removeMembership = async (id) => {
    await api.delete(`/schedule/memberships/${id}/`)
}

export const getMyGroup = async () => {
    const response = await api.get('/schedule/my-group/')
    return response.data
}

// ============================================================================
// Helper functions
// ============================================================================

export const getSessionTypeColor = (type) => {
    const found = SESSION_TYPES.find(t => t.value === type)
    return found ? found.color : '#6b7280'
}

export const getSessionTypeLabel = (type) => {
    const found = SESSION_TYPES.find(t => t.value === type)
    return found ? found.label : type
}

export const getAttendanceStatusColor = (status) => {
    const found = ATTENDANCE_STATUS.find(s => s.value === status)
    return found ? found.color : '#6b7280'
}

export const getAttendanceStatusLabel = (status) => {
    const found = ATTENDANCE_STATUS.find(s => s.value === status)
    return found ? found.label : status
}

/**
 * Check if a session is currently in progress
 * @param {Object} session - Session object with day_of_week, start_time, end_time
 * @returns {boolean}
 */
export const isSessionInProgress = (session) => {
    const now = new Date()
    const currentDay = now.getDay() // 0=Sunday, 1=Monday...

    if (session.day_of_week !== currentDay) return false

    const currentTime = now.toTimeString().slice(0, 8) // "HH:MM:SS"
    const startTime = session.start_time
    const endTime = session.end_time

    return currentTime >= startTime && currentTime <= endTime
}

/**
 * Get time remaining until session ends
 * @param {Object} session - Session object
 * @returns {string} Time remaining formatted
 */
export const getSessionTimeRemaining = (session) => {
    const now = new Date()
    const [endHours, endMinutes] = session.end_time.split(':').map(Number)
    const endDate = new Date()
    endDate.setHours(endHours, endMinutes, 0)

    const diffMs = endDate - now
    if (diffMs <= 0) return 'Terminée'

    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60) return `${diffMins} min restantes`

    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}h${mins.toString().padStart(2, '0')} restantes`
}

/**
 * Get student's absence history for a specific subject
 * @param {string} studentId 
 * @param {number} sessionId 
 */
export const getStudentAbsenceHistory = async (studentId, sessionId) => {
    const response = await api.get(`/schedule/attendance/?student=${studentId}&session=${sessionId}&status=ABSENT`)
    return response.data
}

/**
 * Get elimination threshold based on session type
 * TD/TP weekly (multiple per week): 2 warnings, 3rd = eliminated
 * TD normal: 3 warnings, 4th = eliminated
 * @param {string} sessionType - COURS, TD, TP, etc.
 * @param {boolean} isWeekly - If session occurs multiple times per week
 * @returns {Object} {warning: number, elimination: number}
 */
export const getEliminationThreshold = (sessionType, isWeekly = false) => {
    if ((sessionType === 'TD' || sessionType === 'TP') && isWeekly) {
        return { warning: 2, elimination: 3 }
    }
    return { warning: 3, elimination: 4 }
}

/**
 * Get absence status with warning/elimination info
 * @param {number} absenceCount 
 * @param {string} sessionType 
 * @param {boolean} isWeekly 
 * @returns {Object} {status: 'ok'|'warning'|'eliminated', message: string}
 */
export const getAbsenceStatus = (absenceCount, sessionType, isWeekly = false) => {
    const threshold = getEliminationThreshold(sessionType, isWeekly)

    if (absenceCount >= threshold.elimination) {
        return {
            status: 'eliminated',
            color: '#ef4444',
            message: `⛔ Éliminé (${absenceCount} absences)`
        }
    }
    if (absenceCount >= threshold.warning) {
        return {
            status: 'warning',
            color: '#f59e0b',
            message: `⚠️ Avertissement (${absenceCount}/${threshold.elimination - 1})`
        }
    }
    return {
        status: 'ok',
        color: '#10b981',
        message: `${absenceCount} absence${absenceCount !== 1 ? 's' : ''}`
    }
}

export const getDayLabel = (day) => {
    const found = DAYS_OF_WEEK.find(d => d.value === day)
    return found ? found.label : ''
}

export default {
    SESSION_TYPES,
    DAYS_OF_WEEK,
    ATTENDANCE_STATUS,
    getGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    getSessions,
    getSession,
    createSession,
    updateSession,
    deleteSession,
    getMySchedule,
    getAttendance,
    markAttendance,
    getSessionStudents,
    getMyAbsences,
    getMemberships,
    addMembership,
    removeMembership,
    getMyGroup,
    getSessionTypeColor,
    getSessionTypeLabel,
    getAttendanceStatusColor,
    getAttendanceStatusLabel,
    getDayLabel,
    isSessionInProgress,
    getSessionTimeRemaining,
    getStudentAbsenceHistory,
    getEliminationThreshold,
    getAbsenceStatus
}
