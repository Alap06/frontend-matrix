import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi'
import { motion } from 'framer-motion'

const ContactSection = () => {
  const { t } = useTranslation()
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleContactSubmit = (e) => {
    e.preventDefault()
    console.log('Contact form submitted:', contactForm)
    alert('Message envoyé avec succès!')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">
            📞 {t('home.contact.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('home.contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-primary-blue mb-6">
              {t('home.contact.info')}
            </h3>
            
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-orange to-primary-orange-dark rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiMapPin />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-primary-blue mb-1">
                  {t('home.contact.address')}
                </h4>
                <p className="text-gray-600">
                  {t('home.contact.addressValue')}
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-orange to-primary-orange-dark rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiPhone />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-primary-blue mb-1">
                  {t('home.contact.phone')}
                </h4>
                <p className="text-gray-600">+216 77 234 500</p>
                <p className="text-gray-600">+216 77 234 501</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-orange to-primary-orange-dark rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiMail />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-primary-blue mb-1">
                  {t('home.contact.email')}
                </h4>
                <p className="text-gray-600">contact@issatkr.rnu.tn</p>
                <p className="text-gray-600">scolarite@issatkr.rnu.tn</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-orange to-primary-orange-dark rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FiClock />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-primary-blue mb-1">
                  {t('home.contact.hours')}
                </h4>
                <p className="text-gray-600">{t('home.contact.hoursWeek')}</p>
                <p className="text-gray-600">{t('home.contact.hoursSaturday')}</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleContactSubmit}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-primary-blue mb-6">
              {t('home.contact.form.title')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('home.contact.form.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder={t('home.contact.form.namePlaceholder')}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('common.email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder={t('home.contact.form.emailPlaceholder')}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('home.contact.form.subject')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  placeholder={t('home.contact.form.subjectPlaceholder')}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('home.contact.form.message')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  placeholder={t('home.contact.form.messagePlaceholder')}
                  rows="5"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent transition-all duration-300 resize-vertical"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-orange to-primary-orange-dark text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-orange/40"
              >
                <FiSend />
                {t('home.contact.form.send')}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
