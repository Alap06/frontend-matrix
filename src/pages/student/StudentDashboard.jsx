import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  FiFileText, FiAward, FiCalendar, FiUsers, 
  FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle 
} from 'react-icons/fi'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useAuth } from '../../hooks/useAuth'
import './StudentPages.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const StudentDashboard = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalDocuments: 12,
    pendingDocuments: 3,
    averageGrade: 14.5,
    absences: 2,
    clubs: 2
  })

  const statsCards = [
    {
      title: 'Moyenne Générale',
      value: stats.averageGrade.toFixed(2),
      icon: FiAward,
      color: '--primary-orange',
      trend: '+0.5',
      trendUp: true
    },
    {
      title: 'Documents',
      value: stats.totalDocuments,
      icon: FiFileText,
      color: '--accent-blue',
      badge: `${stats.pendingDocuments} en attente`
    },
    {
      title: 'Absences',
      value: stats.absences,
      icon: FiCalendar,
      color: stats.absences > 3 ? '--error' : '--success',
      badge: stats.absences > 3 ? 'Attention!' : 'Bon'
    },
    {
      title: 'Clubs Actifs',
      value: stats.clubs,
      icon: FiUsers,
      color: '--primary-orange'
    }
  ]

  const gradeData = {
    labels: ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'],
    datasets: [
      {
        label: 'Moyenne',
        data: [13.5, 14.0, 13.8, 14.2, 14.5, 14.5],
        borderColor: 'rgb(192, 121, 33)',
        backgroundColor: 'rgba(192, 121, 33, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(33, 44, 79, 0.95)',
        padding: 12,
        borderRadius: 8,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 20,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  const recentActivities = [
    {
      icon: FiCheckCircle,
      title: 'Attestation de présence approuvée',
      time: 'Il y a 2 heures',
      color: 'success'
    },
    {
      icon: FiAward,
      title: 'Nouvelles notes disponibles - Programmation Web',
      time: 'Il y a 5 heures',
      color: 'info'
    },
    {
      icon: FiUsers,
      title: 'Vous avez rejoint le club "Tech Innov"',
      time: 'Hier',
      color: 'primary'
    },
    {
      icon: FiAlertCircle,
      title: 'Absence enregistrée - Base de données',
      time: 'Il y a 2 jours',
      color: 'warning'
    }
  ]

  const upcomingEvents = [
    {
      title: 'Examen Final - Algorithmique',
      date: '15 Déc 2025',
      time: '09:00',
      location: 'Salle A12'
    },
    {
      title: 'Hackathon Tech Innov',
      date: '20 Déc 2025',
      time: '14:00',
      location: 'Amphi 1'
    },
    {
      title: 'Conférence IA & Machine Learning',
      date: '25 Déc 2025',
      time: '10:00',
      location: 'Amphi 2'
    }
  ]

  return (
    <div className="student-dashboard">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-welcome"
      >
        <div>
          <h2>
            {t('student.dashboard.welcome')}, {user?.firstName}! 👋
          </h2>
          <p>Voici un aperçu de votre activité académique</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="stat-card-header">
              <div 
                className="stat-icon"
                style={{ 
                  background: `linear-gradient(135deg, var(${stat.color}), var(${stat.color}-dark, ${stat.color}))`
                }}
              >
                <stat.icon />
              </div>
              {stat.trend && (
                <span className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                  <FiTrendingUp />
                  {stat.trend}
                </span>
              )}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              {stat.badge && (
                <span className="stat-badge">{stat.badge}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="dashboard-grid">
        {/* Grade Chart */}
        <motion.div
          className="dashboard-card chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-header">
            <h3>Évolution des Notes</h3>
            <span className="card-badge">Semestre 1</span>
          </div>
          <div className="chart-container">
            <Line data={gradeData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <h3>Activité Récente</h3>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                className="activity-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className={`activity-icon ${activity.color}`}>
                  <activity.icon />
                </div>
                <div className="activity-content">
                  <p className="activity-title">{activity.title}</p>
                  <span className="activity-time">
                    <FiClock /> {activity.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events */}
      <motion.div
        className="dashboard-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="card-header">
          <h3>Événements à Venir</h3>
        </div>
        <div className="events-grid">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              className="event-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="event-date">
                <span className="date-day">{event.date.split(' ')[0]}</span>
                <span className="date-month">{event.date.split(' ')[1]}</span>
              </div>
              <div className="event-details">
                <h4>{event.title}</h4>
                <div className="event-meta">
                  <span><FiClock /> {event.time}</span>
                  <span>{event.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default StudentDashboard
