import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiUserPlus, FiArrowLeft, FiHome
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'
import './AuthPages.css'

const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setLoading(true)

    try {
      const result = await register(formData)

      if (result.success) {
        toast.success('Compte créé avec succès!')
        navigate('/student')
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
      className="auth-card auth-card-large"
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
        <h2>{t('auth.registerTitle')}</h2>
        <p>Créer votre compte étudiant</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="firstName">
              <FiUser />
              {t('auth.firstName')}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              <FiUser />
              {t('auth.lastName')}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nom"
              required
            />
          </div>
        </div>

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

        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="studentId">
              <FiUser />
              {t('auth.studentId')}
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="123456"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FiPhone />
              {t('auth.phone')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="20 123 456"
            />
          </div>
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
              minLength={8}
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

        <div className="form-group">
          <label htmlFor="confirmPassword">
            <FiLock />
            {t('common.confirmPassword')}
          </label>
          <div className="input-with-icon">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="input-icon-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
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
              <FiUserPlus />
              {t('common.register')}
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          {t('auth.haveAccount')}
          <Link to="/login" className="link-primary">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default RegisterPage
