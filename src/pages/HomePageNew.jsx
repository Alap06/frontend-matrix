import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FiFileText, FiAward, FiUsers, FiShield,
  FiArrowRight, FiCheck, FiCalendar, FiTrendingUp,
  FiBookOpen, FiTarget, FiGlobe, FiLayout, FiActivity
} from 'react-icons/fi'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactSection from '../components/ContactSection'
import StatsSection from '../components/StatsSection'
import FormationsSection from '../components/FormationsSection'
import InstitutSection from '../components/InstitutSection'
import ClubsSection from '../components/ClubsSection'
import DepartementsSection from '../components/DepartementsSection'
import AdministrationSection from '../components/AdministrationSection'
import ServicesSection from '../components/ServicesSection'

const HomePageNew = () => {
  const { t, i18n } = useTranslation()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const features = [
    {
      icon: FiFileText,
      title: t('home.features.documents.title'),
      description: t('home.features.documents.description'),
      className: "md:col-span-2 md:row-span-2 bg-white"
    },
    {
      icon: FiAward,
      title: t('home.features.grades.title'),
      description: t('home.features.grades.description'),
      className: "bg-slate-50"
    },
    {
      icon: FiUsers,
      title: t('home.features.clubs.title'),
      description: t('home.features.clubs.description'),
      className: "bg-slate-50"
    },
    {
      icon: FiShield,
      title: t('home.features.reclamations.title'),
      description: t('home.features.reclamations.description'),
      className: "md:col-span-2 bg-white"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      <Navbar />

      {/* Hero Section - Clean & Modern */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-sky-400 opacity-20 blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
            <span className="text-sm font-medium text-slate-600">Rentrée Universitaire 2024-2025</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8"
          >
            {t('home.title')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 pb-2">
              {t('home.subtitle')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {t('home.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              {t('common.login')}
              <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              En savoir plus
            </Link>
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative rounded-xl border border-slate-200 bg-white/50 shadow-2xl backdrop-blur-sm p-2"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50/20 via-transparent to-transparent z-10"></div>
            <img
              src="src\assets\logos\issat.jpg"
              alt="Dashboard Preview"
              className="rounded-lg w-full shadow-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Institut Section */}
      <InstitutSection />


      {/* Administration Section */}
      <AdministrationSection />

      {/* Departements Section */}
      <DepartementsSection />

      {/* Clubs Section */}
      <ClubsSection />

      {/* Formations Section */}
      <FormationsSection />


      {/* Services Section */}
      <ServicesSection />

      {/* Stats Section - Clean */}
      <section className="py-24 border-y border-slate-100 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Étudiants", value: "3000+", icon: FiUsers },
              { label: "Enseignants", value: "150+", icon: FiAward },
              { label: "Partenaires", value: "50+", icon: FiGlobe },
              { label: "Taux de réussite", value: "98%", icon: FiTrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4 text-sky-500">
                  <stat.icon className="text-3xl" />
                </div>
                <div className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 h-12 w-12 bg-white border border-slate-200 text-slate-900 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-slate-50 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
          >
            <FiArrowRight className="rotate-[-90deg]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomePageNew
