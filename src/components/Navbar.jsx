import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FiMenu, FiX, FiGlobe, FiHome, FiBook,
  FiInfo, FiFileText, FiMail, FiChevronDown
} from 'react-icons/fi'

const Navbar = () => {
  const { t, i18n } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr'
    i18n.changeLanguage(newLang)
    document.documentElement.dir = 'ltr'
  }

  const handleAnchorClick = (e, href) => {
    if (href?.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        const offset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
      setMobileMenuOpen(false)
      setActiveDropdown(null)
    }
  }

  const navItems = [
    {
      label: t('nav.home'),
      path: '/',
      icon: FiHome
    },
    {
      label: 'Formations',
      icon: FiBook,
      dropdown: [
        { label: 'Licence', path: '#licence' },
        { label: 'Master', path: '#master' },
        { label: 'Ingénieur', path: '#ingenieur' },
      ]
    },
    {
      label: 'Institut',
      icon: FiInfo,
      dropdown: [
        { label: 'Présentation', path: '#presentation' },
        { label: 'Départements', path: '#departements' },
        { label: 'Vie Estudiantine', path: '#vie-estudiantine' },
      ]
    },
    {
      label: 'Services',
      icon: FiFileText,
      dropdown: [
        { label: 'Documents', path: '#documents' },
        { label: 'Clubs', path: '#clubs' },
        { label: 'Bibliothèque', path: '#bibliotheque' },
      ]
    },
    {
      label: 'Contact',
      path: '#contact',
      icon: FiMail
    },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400`}
      style={{
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 4px 20px rgba(11, 26, 116, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid rgba(233, 224, 208, 0.5)'
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className={`flex items-center justify-between transition-all duration-400 ${scrolled ? 'py-3' : 'py-4'
          }`}>
          {/* Logo - ISSAT Kairouan */}
          <Link
            to="/"
            className="flex items-center gap-3 relative group transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 -m-2 rounded-xl bg-gradient-to-br from-[#C07F10]/10 to-[#0B1A74]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
              src="/src/assets/logos/logo3.png"
              alt="ISSAT Kairouan"
              className={`transition-all duration-300 ${scrolled ? 'w-12 h-12' : 'w-14 h-14'} object-contain rounded-xl`}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(192, 127, 16, 0.3))' }}
            />
            <div className="flex flex-col gap-0.5">
              <span className={`font-bold transition-all duration-300 tracking-tight ${scrolled ? 'text-lg' : 'text-xl'}`} style={{ color: '#0B1A74' }}>
                ISSAT Kairouan
              </span>
              <span className={`font-semibold uppercase tracking-widest transition-all duration-300 ${scrolled ? 'text-[0.65rem]' : 'text-[0.7rem]'}`} style={{ color: '#C07F10' }}>
                Excellence & Innovation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-gray-700 font-semibold text-[0.9375rem] rounded-lg transition-all duration-300 hover:text-primary-orange relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/8 to-accent-blue/8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item.icon && <item.icon className="text-lg relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5" />}
                      <span className="relative z-10">{item.label}</span>
                      <FiChevronDown className={`text-sm relative z-10 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180' : ''
                        }`} />
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-orange to-accent-blue rounded-full transition-all duration-400 group-hover:w-3/4" />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === index && (
                        <motion.div
                          className="absolute top-full left-0 mt-2 min-w-[240px] bg-white rounded-xl shadow-2xl border border-primary-orange/10 overflow-hidden"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-orange to-accent-blue" />
                          <div className="p-2">
                            {item.dropdown.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href={subItem.path}
                                onClick={(e) => handleAnchorClick(e, subItem.path)}
                                className="flex items-center px-4 py-3 text-gray-700 font-medium text-[0.9375rem] rounded-lg transition-all duration-250 hover:bg-gradient-to-br hover:from-primary-orange/8 hover:to-accent-blue/5 hover:text-primary-orange hover:translate-x-2 relative group"
                              >
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-gradient-to-b from-primary-orange to-accent-blue rounded-full transition-all duration-250 group-hover:h-[70%]" />
                                {subItem.label}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <a
                    href={item.path}
                    onClick={(e) => handleAnchorClick(e, item.path)}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-700 font-semibold text-[0.9375rem] rounded-lg transition-all duration-300 hover:text-primary-orange relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/8 to-accent-blue/8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item.icon && <item.icon className="text-lg relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5" />}
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-orange to-accent-blue rounded-full transition-all duration-400 group-hover:w-3/4" />
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-primary-orange/20 rounded-lg text-gray-700 font-semibold text-[0.9375rem] transition-all duration-300 hover:border-primary-orange hover:text-primary-orange hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-orange/15 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/10 to-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <FiGlobe className="relative z-10" />
              <span className="relative z-10">{i18n.language === 'fr' ? 'AR' : 'FR'}</span>
            </button>

            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-orange to-primary-orange-dark text-white font-semibold text-[0.9375rem] rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-orange/40 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">{t('common.login')}</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 border-2 border-primary-orange/20 rounded-lg text-gray-700 text-xl transition-all duration-300 hover:border-primary-orange hover:text-primary-orange hover:scale-105 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/10 to-accent-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {mobileMenuOpen ? <FiX className="relative z-10" /> : <FiMenu className="relative z-10" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-gradient-to-b from-white to-gray-50/98 border-t-2 border-primary-orange/15 shadow-2xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
              {navItems.map((item, index) => (
                <div key={index} className="border-b border-primary-orange/10 last:border-0 mb-2 last:mb-0">
                  {item.dropdown ? (
                    <>
                      <button
                        className="flex items-center gap-3 w-full p-4 text-gray-700 font-semibold rounded-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-primary-orange/8 hover:to-accent-blue/5 hover:text-primary-orange relative group"
                        onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                      >
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-3/5 bg-gradient-to-b from-primary-orange to-accent-blue rounded-r transition-all duration-300 group-hover:w-1" />
                        {item.icon && <item.icon className="text-xl relative z-10" />}
                        <span className="flex-1 text-left relative z-10">{item.label}</span>
                        <FiChevronDown className={`text-base relative z-10 transition-transform duration-300 ${activeDropdown === index ? 'rotate-180' : ''
                          }`} />
                      </button>
                      {activeDropdown === index && (
                        <div className="bg-gradient-to-br from-primary-orange/5 to-accent-blue/3 rounded-lg p-2 my-2">
                          {item.dropdown.map((subItem, subIndex) => (
                            <a
                              key={subIndex}
                              href={subItem.path}
                              onClick={(e) => {
                                handleAnchorClick(e, subItem.path)
                                setMobileMenuOpen(false)
                              }}
                              className="flex items-center px-4 py-3.5 pl-12 text-gray-600 font-medium rounded-md transition-all duration-300 hover:text-primary-orange hover:bg-white hover:pl-14 relative group"
                            >
                              <span className="absolute left-6 opacity-0 group-hover:opacity-100 group-hover:left-5 transition-all duration-300 text-primary-orange">→</span>
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.path}
                      onClick={(e) => {
                        handleAnchorClick(e, item.path)
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center gap-3 p-4 text-gray-700 font-semibold rounded-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-primary-orange/8 hover:to-accent-blue/5 hover:text-primary-orange hover:translate-x-1 relative group"
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-3/5 bg-gradient-to-b from-primary-orange to-accent-blue rounded-r transition-all duration-300 group-hover:w-1" />
                      {item.icon && <item.icon className="text-xl relative z-10" />}
                      <span className="relative z-10">{item.label}</span>
                    </a>
                  )}
                </div>
              ))}
              <div className="mt-6 pt-4 border-t-2 border-primary-orange/15">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-primary-orange to-primary-orange-dark text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary-orange/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('common.login')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
