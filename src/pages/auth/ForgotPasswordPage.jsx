import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from 'axios'
import './AuthPages.css'

const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/auth/forgot-password', { email })
      setEmailSent(true)
      toast.success('Email de réinitialisation envoyé!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi')
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
        <h2>{t('auth.forgotPasswordTitle')}</h2>
        {!emailSent ? (
          <p>Entrez votre email pour recevoir un lien de réinitialisation</p>
        ) : (
          <div className="success-message">
            <FiCheckCircle className="success-icon" />
            <p>Email envoyé! Vérifiez votre boîte de réception.</p>
          </div>
        )}
      </div>

      {!emailSent ? (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <FiMail />
              {t('common.email')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@issatkr.rnu.tn"
              required
            />
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
                <FiSend />
                {t('auth.sendResetLink')}
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="auth-actions">
          <Link to="/login" className="btn btn-outline btn-block">
            <FiArrowLeft />
            {t('auth.backToLogin')}
          </Link>
        </div>
      )}

      {!emailSent && (
        <div className="auth-footer">
          <Link to="/login" className="link-primary">
            <FiArrowLeft />
            {t('auth.backToLogin')}
          </Link>
        </div>
      )}
    </motion.div>
  )
}

export default ForgotPasswordPage
