/**
 * User Service
 * Admin API for user management CRUD
 */
import api from './api'

// Role options
export const ROLES = [
    { value: 'student', label: 'Étudiant' },
    { value: 'teacher', label: 'Enseignant' },
    { value: 'administrator', label: 'Administrateur' },
    { value: 'scolar_administrator', label: 'Responsable Scolaire' },
    { value: 'club_manager', label: 'Responsable Club' }
]

/**
 * Get all users with optional filters
 * @param {Object} filters - {role, is_active, search}
 * @returns {Promise<Array>}
 */
export const getUsers = async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.role) params.append('role', filters.role)
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active)
    if (filters.search) params.append('search', filters.search)

    const response = await api.get(`/users/?${params.toString()}`)
    return response.data
}

/**
 * Get single user by ID
 * @param {number} id 
 * @returns {Promise<Object>}
 */
export const getUser = async (id) => {
    const response = await api.get(`/users/${id}/`)
    return response.data
}

/**
 * Create new user (Admin only)
 * @param {Object} userData - {email, password?, first_name, last_name, role, is_active, is_staff}
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
    // Validate email is provided
    if (!userData.email || userData.email.trim() === '') {
        throw new Error('Email is required')
    }

    const payload = {
        email: userData.email.trim(),
        first_name: userData.firstName || userData.first_name || '',
        last_name: userData.lastName || userData.last_name || '',
        role: userData.role || 'student',
        is_active: userData.is_active !== undefined ? userData.is_active : true,
        is_staff: userData.is_staff || false
    }

    // Only include password if provided (backend generates random if not)
    if (userData.password && userData.password.length > 0) {
        payload.password = userData.password
    }

    // Include optional fields if provided
    if (userData.phone) payload.phone = userData.phone
    if (userData.cin) payload.cin = userData.cin
    if (userData.date_of_birth) payload.date_of_birth = userData.date_of_birth

    console.log('Creating user with payload:', payload)

    const response = await api.post('/users/create/', payload)
    return response.data
}

/**
 * Update user
 * @param {number} id 
 * @param {Object} userData 
 * @returns {Promise<Object>}
 */
export const updateUser = async (id, userData) => {
    const payload = {}
    if (userData.firstName || userData.first_name) payload.first_name = userData.firstName || userData.first_name
    if (userData.lastName || userData.last_name) payload.last_name = userData.lastName || userData.last_name
    if (userData.role) payload.role = userData.role
    if (userData.is_active !== undefined) payload.is_active = userData.is_active
    if (userData.is_staff !== undefined) payload.is_staff = userData.is_staff
    if (userData.password) payload.password = userData.password

    const response = await api.patch(`/users/${id}/update/`, payload)
    return response.data
}

/**
 * Delete user
 * @param {number} id 
 * @returns {Promise<Object>}
 */
export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}/delete/`)
    return response.data
}

/**
 * Get users by role
 * @param {string} role - 'student', 'teacher', 'administrator', 'club_manager'
 * @returns {Promise<Array>}
 */
export const getUsersByRole = async (role) => {
    // Use dedicated endpoint for teachers (accessible to all authenticated users)
    if (role === 'teacher') {
        const response = await api.get('/users/teachers/')
        return response.data
    }
    // For other roles, use admin-only filter
    return getUsers({ role })
}

/**
 * Get role label
 * @param {string} role 
 * @returns {string}
 */
export const getRoleLabel = (role) => {
    const found = ROLES.find(r => r.value === role)
    return found ? found.label : role
}

export default {
    ROLES,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUsersByRole,
    getRoleLabel
}
