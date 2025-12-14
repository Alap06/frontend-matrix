import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiArrowLeft, FiHome } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'
import './AuthPages.css'

const LoginPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Connexion sans spécifier le rôle - détecté automatiquement par le backend
      const result = await login(formData.email, formData.password)

      if (result.success) {
        toast.success(t('common.success'))

        // Redirection selon le rôle
        const role = result.user.role
        if (role === 'student') {
          navigate('/student')
        } else if (role === 'teacher') {
          navigate('/teacher')
        } else if (role === 'admin' || role === 'administrator') {
          navigate('/admin')
        } else if (role === 'club_manager') {
          navigate('/club-manager')
        } else if (role === 'scolar_administrator') {
          navigate('/scolar')
        } else {
          // Fallback pour rôles non reconnus
          toast.error('Rôle non reconnu')
        }
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="auth-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <Link
        to="/"
        className="back-button"
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          background: 'var(--bg-secondary)',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.875rem',
          transition: 'all 0.2s'
        }}
      >
        <FiArrowLeft /> <FiHome /> Accueil
      </Link>

      <div className="auth-header" style={{ marginTop: '2rem' }}>
        <motion.div
          className="auth-logo"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <div className="auth-logo-icon">SGE</div>
        </motion.div>
        <h2>{t('auth.loginTitle')}</h2>
        <p>{t('common.welcome')}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">
            <FiMail />
            {t('common.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@issatkr.rnu.tn"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <FiLock />
            {t('common.password')}
          </label>
          <div className="input-with-icon">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="input-icon-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="form-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>{t('auth.rememberMe')}</span>
          </label>

          <Link to="/forgot-password" className="link-primary">
            {t('common.forgotPassword')}
          </Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? (
            <div className="spinner-small"></div>
          ) : (
            <>
              <FiLogIn />
              {t('common.login')}
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          {t('auth.noAccount')}
          <Link to="/register" className="link-primary">
            {t('auth.signUp')}
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default LoginPage
