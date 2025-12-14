/**
 * Authentication Service
 * Real API integration for Django backend
 */
import api from './api'

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{access: string, refresh: string, user: Object}>}
 */
export const login = async (email, password) => {
    const response = await api.post('/auth/login/', { email, password })
    return response.data
}

/**
 * Register new user
 * @param {Object} userData - {email, password, first_name, last_name, role}
 * @returns {Promise<Object>}
 */
export const register = async (userData) => {
    const response = await api.post('/auth/register/', {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName || userData.first_name,
        last_name: userData.lastName || userData.last_name,
        role: userData.role || 'student'
    })
    return response.data
}

/**
 * Logout user (blacklist refresh token)
 * @param {string} refreshToken 
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken) => {
    await api.post('/auth/logout/', { refresh: refreshToken })
}

/**
 * Get current authenticated user
 * @returns {Promise<Object>}
 */
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me/')
    return response.data
}

/**
 * Change password
 * @param {string} oldPassword 
 * @param {string} newPassword 
 * @returns {Promise<Object>}
 */
export const changePassword = async (oldPassword, newPassword) => {
    const response = await api.put('/auth/password/change/', {
        old_password: oldPassword,
        new_password: newPassword
    })
    return response.data
}

/**
 * Request password reset email
 * @param {string} email 
 * @returns {Promise<Object>}
 */
export const forgotPassword = async (email) => {
    const response = await api.post('/auth/password/forgot/', { email })
    return response.data
}

/**
 * Reset password with token
 * @param {string} email 
 * @param {string} token 
 * @param {string} newPassword 
 * @returns {Promise<Object>}
 */
export const resetPassword = async (email, token, newPassword) => {
    const response = await api.post('/auth/password/reset/', {
        email,
        token,
        new_password: newPassword
    })
    return response.data
}

export default {
    login,
    register,
    logout,
    getCurrentUser,
    changePassword,
    forgotPassword,
    resetPassword
}
