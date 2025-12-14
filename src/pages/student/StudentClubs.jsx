import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiCalendar, FiMapPin, FiInfo } from 'react-icons/fi'

const StudentClubs = () => {
  // Mock clubs data - will be replaced with API when available
  const clubs = [
    {
      id: 1,
      name: 'Club Informatique',
      description: 'Club dédié à la programmation et aux nouvelles technologies',
      members: 45,
      events: 12,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300',
      category: 'Technique'
    },
    {
      id: 2,
      name: 'Club Robotique',
      description: 'Conception et programmation de robots',
      members: 32,
      events: 8,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300',
      category: 'Technique'
    },
    {
      id: 3,
      name: 'Club Culturel',
      description: 'Activités culturelles et artistiques',
      members: 58,
      events: 15,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      category: 'Culture'
    },
    {
      id: 4,
      name: 'Club Sportif',
      description: 'Activités sportives et compétitions',
      members: 72,
      events: 20,
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300',
      category: 'Sport'
    }
  ]

  const upcomingEvents = [
    { id: 1, name: 'Hackathon ISSAT 2025', club: 'Club Informatique', date: '2025-01-15', location: 'Amphi A' },
    { id: 2, name: 'Compétition de Robots', club: 'Club Robotique', date: '2025-01-20', location: 'Atelier' },
    { id: 3, name: 'Soirée Culturelle', club: 'Club Culturel', date: '2025-02-01', location: 'Grande Salle' }
  ]

  return (
    <div className="dashboard-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiUsers style={{ color: '#8b5cf6' }} /> Clubs & Événements
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>
            Découvrez les clubs et événements de l'ISSAT
          </p>
        </div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white',
            marginBottom: '1.5rem'
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCalendar /> Prochains Événements
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600' }}>{event.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{event.club}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                  <div>{new Date(event.date).toLocaleDateString('fr-FR')}</div>
                  <div style={{ opacity: 0.9 }}><FiMapPin size={12} /> {event.location}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Clubs Grid */}
        <h3 style={{ margin: '0 0 1rem 0' }}>Nos Clubs</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {clubs.map((club, index) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer'
              }}
            >
              <div style={{
                height: '120px',
                background: `url(${club.image}) center/cover`,
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.9)',
                  fontSize: '0.7rem',
                  fontWeight: '500'
                }}>
                  {club.category}
                </span>
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{club.name}</h4>
                <p style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5
                }}>
                  {club.description}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)'
                }}>
                  <span><FiUsers size={14} /> {club.members} membres</span>
                  <span><FiCalendar size={14} /> {club.events} événements</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '1.5rem',
            padding: '1rem 1.5rem',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <FiInfo style={{ color: '#8b5cf6', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Pour rejoindre un club ou créer un nouveau club, veuillez contacter le bureau de la vie étudiante.
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default StudentClubs
