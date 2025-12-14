import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer style={{ background: '#0B1A74', color: 'white', padding: '4rem 0' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/logos/logo3.png"
                alt="ISSAT Kairouan"
                className="w-14 h-14 object-contain rounded-xl"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(192, 127, 16, 0.4))' }}
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">ISSAT Kairouan</span>
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#C07F10' }}>
                  Excellence & Innovation
                </span>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {t('home.footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">{t('home.footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-white/80 hover:text-primary-orange transition-colors duration-300 text-sm"
                >
                  {t('common.login')}
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-white/80 hover:text-primary-orange transition-colors duration-300 text-sm"
                >
                  {t('common.register')}
                </Link>
              </li>
              <li>
                <a
                  href="#formations"
                  className="text-white/80 hover:text-primary-orange transition-colors duration-300 text-sm"
                >
                  {t('home.footer.links.formations')}
                </a>
              </li>
              <li>
                <a
                  href="#actualites"
                  className="text-white/80 hover:text-primary-orange transition-colors duration-300 text-sm"
                >
                  {t('home.footer.links.news')}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4">{t('home.footer.resources')}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#bibliotheque"
                  className="text-white/80 hover:text-primary-orange transition-colors duration-300 text-sm"
                >
                  {t('home.footer.links.library')}
                </a>
              </li>
              <li>
                <a
                  href="#clubs"
                  className="text-white/80 hover:text-primary-orange transition-colors duration-300 text-sm"
                >
                  {t('home.footer.links.clubs')}
                </a>
              </li>
              <li>
                <a
                  href="#vie-etudiante"
                  className="text-white/80 hover:text-primary-orange transition-colors duration-300 text-sm"
                >
                  {t('home.footer.links.studentLife')}
                </a>
              </li>
              <li>
                <a
                  href="#aide"
                  className="text-white/80 hover:text-primary-orange transition-colors duration-300 text-sm"
                >
                  {t('home.footer.links.help')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">{t('home.contact.title')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/80 text-sm">
                <FiMapPin className="mt-0.5 flex-shrink-0" style={{ color: '#C07F10' }} />
                <span>Kairouan 3100, Tunisie</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 text-sm">
                <FiPhone className="flex-shrink-0" style={{ color: '#C07F10' }} />
                <span>+216 77 234 500</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 text-sm">
                <FiMail className="flex-shrink-0" style={{ color: '#C07F10' }} />
                <span>contact@issatkr.rnu.tn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/70 text-sm text-center md:text-left">
            © 2025 ISSAT Kairouan. {t('home.footer.copyright')}
          </div>
          <div className="flex gap-6">
            <a
              href="#facebook"
              className="text-white/70 hover:text-primary-orange transition-colors duration-300 text-sm"
            >
              Facebook
            </a>
            <a
              href="#linkedin"
              className="text-white/70 hover:text-primary-orange transition-colors duration-300 text-sm"
            >
              LinkedIn
            </a>
            <a
              href="#instagram"
              className="text-white/70 hover:text-primary-orange transition-colors duration-300 text-sm"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
