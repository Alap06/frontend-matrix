import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from 'axios'
import './AuthPages.css'

const ResetPasswordPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { token } = useParams()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
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
      await axios.post('/api/auth/reset-password', {
        token,
        password: formData.password
      })
      
      toast.success('Mot de passe réinitialisé avec succès!')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation')
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
      <div className="auth-header">
        <div className="auth-logo">
          <div className="auth-logo-icon">SGE</div>
        </div>
        <h2>{t('auth.resetPasswordTitle')}</h2>
        <p>Choisissez un nouveau mot de passe sécurisé</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">
            <FiLock />
            Nouveau {t('common.password')}
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
          <small>Minimum 8 caractères</small>
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
              <FiCheck />
              {t('common.resetPassword')}
            </>
          )}
        </button>
      </form>

      <div className="auth-footer">
        <Link to="/login" className="link-primary">
          {t('auth.backToLogin')}
        </Link>
      </div>
    </motion.div>
  )
}

export default ResetPasswordPage
