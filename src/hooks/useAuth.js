import { useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import * as authService from '../services/authService'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Map backend role to frontend role naming
  const mapRole = (backendRole) => {
    const roleMap = {
      'administrator': 'admin',
      'student': 'student',
      'teacher': 'teacher',
      'club_manager': 'club_manager',
      'scolar_administrator': 'scolar_administrator'
    }
    return roleMap[backendRole] || backendRole
  }

  // Transform user data from backend format
  const transformUser = (backendUser) => {
    return {
      ...backendUser,
      role: mapRole(backendUser.role),
      firstName: backendUser.first_name,
      lastName: backendUser.last_name
    }
  }

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      // Check if token is expired
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          setLoading(false)
          return
        }
      } catch {
        // Invalid token format
        localStorage.removeItem('token')
        setLoading(false)
        return
      }

      // Try to get current user from API
      try {
        const currentUser = await authService.getCurrentUser()
        const transformedUser = transformUser(currentUser)
        setUser(transformedUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(transformedUser))
      } catch {
        // If API fails, try to use cached user data
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { access, refresh, user: backendUser } = response

      const transformedUser = transformUser(backendUser)

      localStorage.setItem('token', access)
      localStorage.setItem('refreshToken', refresh)
      localStorage.setItem('user', JSON.stringify(transformedUser))

      setUser(transformedUser)
      setIsAuthenticated(true)

      return { success: true, user: transformedUser }
    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.error ||
        error.message ||
        'Erreur de connexion'
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)

      // Registration returns user data, now login
      const loginResult = await login(userData.email, userData.password)
      return loginResult
    } catch (error) {
      const errorMessage = error.response?.data?.email?.[0] ||
        error.response?.data?.detail ||
        error.message ||
        'Erreur d\'inscription'
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    try {
      await authService.changePassword(oldPassword, newPassword)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.old_password?.[0] ||
        error.response?.data?.detail ||
        error.message
      return { success: false, error: errorMessage }
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    changePassword
  }
}
