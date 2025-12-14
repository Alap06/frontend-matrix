import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiBell, FiCalendar, FiUsers, FiBook,
  FiAward, FiTrendingUp, FiArrowRight,
  FiMapPin, FiClock, FiChevronLeft, FiChevronRight,
  FiExternalLink, FiNewspaper
} from 'react-icons/fi'
import logoISSAT from '../assets/logos/logo3.png'

const HomePage = () => {
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0)

  // Slides data avec images de background
  const slides = [
    {
      id: 1,
      title: 'Bienvenue à',
      highlight: 'ISSAT Kairouan',
      subtitle: 'Excellence & Innovation',
      description: 'Votre passerelle vers l\'excellence académique et professionnelle',
      bgGradient: 'linear-gradient(135deg, rgba(11, 26, 116, 0.9) 0%, rgba(6, 15, 61, 0.95) 100%)',
      bgPattern: 'radial-gradient(circle at 20% 80%, rgba(192, 127, 16, 0.3) 0%, transparent 50%)',
      cta: { text: 'Espace Étudiant', link: '/login' }
    },
    {
      id: 2,
      title: 'Formations',
      highlight: 'D\'Excellence',
      subtitle: 'Licence - Master - Ingénieur',
      description: 'Des programmes adaptés aux besoins du marché du travail',
      bgGradient: 'linear-gradient(135deg, rgba(192, 127, 16, 0.9) 0%, rgba(161, 105, 8, 0.95) 100%)',
      bgPattern: 'radial-gradient(circle at 80% 20%, rgba(11, 26, 116, 0.3) 0%, transparent 50%)',
      cta: { text: 'Découvrir', link: '#formations' }
    },
    {
      id: 3,
      title: 'Vie',
      highlight: 'Estudiantine',
      subtitle: 'Clubs - Événements - Sports',
      description: 'Une expérience universitaire riche et épanouissante',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.95) 100%)',
      bgPattern: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
      cta: { text: 'En savoir plus', link: '#vie-etudiante' }
    }
  ]

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Navigation slides
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  // Événements universitaires
  const events = [
    {
      id: 1,
      title: 'Journée Portes Ouvertes 2025',
      date: '15 Février 2025',
      time: '09:00 - 17:00',
      location: 'Campus ISSAT',
      type: 'Événement',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=250&fit=crop',
      color: '#C07F10'
    },
    {
      id: 2,
      title: 'Conférence: Intelligence Artificielle',
      date: '22 Février 2025',
      time: '14:00 - 16:00',
      location: 'Amphi A',
      type: 'Conférence',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop',
      color: '#0B1A74'
    },
    {
      id: 3,
      title: 'Hackathon Innovation 2025',
      date: '10 Mars 2025',
      time: '48 heures',
      location: 'Laboratoire Informatique',
      type: 'Compétition',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop',
      color: '#10B981'
    }
  ]

  // News/Actualités
  const news = [
    {
      id: 1,
      title: 'Ouverture des inscriptions Master 2025-2026',
      date: '10 Janvier 2025',
      category: 'Inscription',
      excerpt: 'Les inscriptions pour le programme Master sont désormais ouvertes. Date limite: 28 Février.',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Nouvelle plateforme de gestion des documents',
      date: '5 Janvier 2025',
      category: 'Services',
      excerpt: 'Demandez vos documents officiels en ligne via notre nouvelle plateforme SGE.',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Résultats des examens du 1er semestre',
      date: '20 Décembre 2024',
      category: 'Académique',
      excerpt: 'Les résultats sont disponibles sur votre espace étudiant.',
      priority: 'normal'
    },
    {
      id: 4,
      title: 'Partenariat avec Microsoft',
      date: '15 Décembre 2024',
      category: 'Partenariat',
      excerpt: 'ISSAT Kairouan signe un accord de partenariat avec Microsoft pour la formation.',
      priority: 'normal'
    }
  ]

  // Stats
  const stats = [
    { label: 'Étudiants', value: '2500+', icon: FiUsers, color: '#C07F10' },
    { label: 'Enseignants', value: '150+', icon: FiBook, color: '#0B1A74' },
    { label: 'Programmes', value: '15+', icon: FiAward, color: '#10B981' },
    { label: 'Taux Réussite', value: '95%', icon: FiTrendingUp, color: '#8B5CF6' }
  ]

  const priorityColors = {
    high: { bg: '#FEF3C7', border: '#F59E0B', dot: '#EF4444' },
    medium: { bg: '#DBEAFE', border: '#3B82F6', dot: '#3B82F6' },
    normal: { bg: '#F3F4F6', border: '#E5E7EB', dot: '#9CA3AF' }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      {/* Hero Slider Section */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '600px', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: slides[currentSlide].bgGradient
            }}
          >
            {/* Pattern overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: slides[currentSlide].bgPattern,
              opacity: 0.8
            }} />

            {/* Content */}
            <div style={{
              position: 'relative',
              zIndex: 10,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 2rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center', width: '100%' }}>
                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      fontSize: '1rem',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '1rem',
                      fontWeight: 500,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase'
                    }}
                  >
                    🎓 Université de Sousse
                  </motion.p>

                  <h1 style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.9)' }}>{slides[currentSlide].title}</span>
                    <br />
                    <span style={{
                      background: 'linear-gradient(135deg, #FFFFFF, #E9E0D0)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {slides[currentSlide].highlight}
                    </span>
                  </h1>

                  <p style={{
                    fontSize: '1.5rem',
                    color: '#C07F10',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    letterSpacing: '0.1em'
                  }}>
                    {slides[currentSlide].subtitle}
                  </p>

                  <p style={{
                    fontSize: '1.2rem',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '2.5rem',
                    maxWidth: '500px',
                    lineHeight: 1.7
                  }}>
                    {slides[currentSlide].description}
                  </p>

                  <Link to={slides[currentSlide].cta.link}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: '1.1rem 2.5rem',
                        background: 'linear-gradient(135deg, #C07F10, #A16908)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '14px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 10px 40px rgba(192, 127, 16, 0.4)'
                      }}
                    >
                      {slides[currentSlide].cta.text} <FiArrowRight size={20} />
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <div style={{
                    padding: '3rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '30px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                  }}>
                    <img
                      src={logoISSAT}
                      alt="ISSAT Kairouan"
                      style={{
                        width: '250px',
                        height: 'auto',
                        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <button
            onClick={prevSlide}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            <FiChevronLeft size={24} />
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: currentSlide === index ? '40px' : '12px',
                  height: '12px',
                  borderRadius: '6px',
                  background: currentSlide === index ? '#C07F10' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s'
            }}
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '5rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}
                style={{
                  padding: '2.5rem',
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  textAlign: 'center',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'all 0.4s'
                }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: `${stat.color}15`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <stat.icon size={32} style={{ color: stat.color }} />
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0B1A74', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 500, color: '#64748B' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section avec images */}
      <section style={{ padding: '5rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <span style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              background: '#C07F1015',
              color: '#C07F10',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              📅 Calendrier
            </span>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#0B1A74', marginBottom: '1rem' }}>
              Événements À Venir
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
              Participez aux événements de l'ISSAT Kairouan et enrichissez votre expérience universitaire
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s',
                  cursor: 'pointer'
                }}
              >
                {/* Image with overlay */}
                <div style={{
                  position: 'relative',
                  height: '180px',
                  background: `linear-gradient(180deg, transparent 0%, ${event.color}CC 100%), url(${event.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    padding: '0.4rem 1rem',
                    background: event.color,
                    color: '#FFFFFF',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}>
                    {event.type}
                  </span>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0B1A74', marginBottom: '1rem' }}>
                    {event.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiCalendar size={16} style={{ color: event.color }} />
                      {event.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiClock size={16} style={{ color: event.color }} />
                      {event.time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiMapPin size={16} style={{ color: event.color }} />
                      {event.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section pour étudiants */}
      <section style={{ padding: '5rem 2rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}
          >
            <div>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1.5rem',
                background: '#0B1A7415',
                color: '#0B1A74',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginBottom: '1rem'
              }}>
                <FiNewspaper style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Actualités
              </span>
              <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#0B1A74' }}>
                News & Annonces
              </h2>
            </div>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  border: '2px solid #0B1A74',
                  color: '#0B1A74',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Voir tout <FiExternalLink />
              </motion.button>
            </Link>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {news.map((item, index) => {
              const pColor = priorityColors[item.priority]
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }}
                  style={{
                    padding: '1.5rem 2rem',
                    background: pColor.bg,
                    borderRadius: '20px',
                    borderLeft: `4px solid ${pColor.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: pColor.dot,
                      marginTop: '0.5rem',
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#64748B',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                          {item.date}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1A74', marginBottom: '0.5rem' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6 }}>
                        {item.excerpt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #0B1A74 0%, #060F3D 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(192, 127, 16, 0.2) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}
        >
          <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.5rem' }}>
            Prêt à commencer votre parcours ?
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem' }}>
            Connectez-vous à votre espace étudiant pour accéder à tous vos services:
            documents, notes, emploi du temps et plus encore.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(192, 127, 16, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '1.25rem 3rem',
                  background: 'linear-gradient(135deg, #C07F10, #A16908)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 10px 40px rgba(192, 127, 16, 0.4)'
                }}
              >
                Se Connecter
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: '1.25rem 3rem',
                  background: 'transparent',
                  color: '#FFFFFF',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '14px',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                S'inscrire
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage
