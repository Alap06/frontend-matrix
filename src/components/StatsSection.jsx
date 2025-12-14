import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

const StatsSection = () => {
  const { t } = useTranslation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  const stats = [
    {
      value: 5000,
      suffix: '+',
      label: t('home.stats.students'),
      color: 'from-primary-orange to-primary-orange-dark',
      delay: 0,
    },
    {
      value: 200,
      suffix: '+',
      label: t('home.stats.teachers'),
      color: 'from-accent-blue to-accent-blue-dark',
      delay: 0.1,
    },
    {
      value: 50,
      suffix: '+',
      label: t('home.stats.clubs'),
      color: 'from-primary-orange to-primary-orange-dark',
      delay: 0.2,
    },
    {
      value: 100,
      suffix: '%',
      label: t('home.stats.digital'),
      color: 'from-accent-blue to-accent-blue-dark',
      delay: 0.3,
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary-blue via-primary-blue to-primary-blue-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-orange rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-blue rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 md:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: stat.delay,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <div className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    delay={stat.delay}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <div className="text-base md:text-lg font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>
              
              {/* Animated underline */}
              <div className="mt-4 h-1 bg-gradient-to-r from-transparent via-primary-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
