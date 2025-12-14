import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    FiFileText, FiShield, FiAward, FiCalendar,
    FiUsers, FiBook, FiActivity, FiCheckCircle
} from 'react-icons/fi'

const ServicesSection = () => {
    const { t } = useTranslation()

    const services = [
        {
            title: t('sections.services_section.items.admin_requests.title'),
            description: t('sections.services_section.items.admin_requests.description'),
            icon: FiFileText,
            color: "from-blue-500 to-cyan-500",
            features: [t('student.documents.types.inscription'), t('student.documents.types.presence'), t('student.documents.types.transcript')]
        },
        {
            title: t('sections.services_section.items.claims.title'),
            description: t('sections.services_section.items.claims.description'),
            icon: FiShield,
            color: "from-red-500 to-orange-500",
            features: [t('sections.services_section.items.claims.description'), t('common.loading'), t('common.view')]
        },
        {
            title: t('sections.services_section.items.schooling.title'),
            description: t('sections.services_section.items.schooling.description'),
            icon: FiAward,
            color: "from-purple-500 to-indigo-500",
            features: [t('nav.grades'), t('nav.absences'), t('student.grades.average')]
        },
        {
            title: t('sections.services_section.items.schedule.title'),
            description: t('sections.services_section.items.schedule.description'),
            icon: FiCalendar,
            color: "from-emerald-500 to-teal-500",
            features: [t('nav.classes'), t('student.grades.exam'), "Rattrapages"]
        },
        {
            title: t('sections.services_section.items.associative.title'),
            description: t('sections.services_section.items.associative.description'),
            icon: FiUsers,
            color: "from-amber-500 to-yellow-500",
            features: [t('nav.clubs'), t('home.news.category.events'), "Adhésions"]
        },
        {
            title: t('sections.services_section.items.resources.title'),
            description: t('sections.services_section.items.resources.description'),
            icon: FiBook,
            color: "from-pink-500 to-rose-500",
            features: [t('nav.documents'), "Cours", "PFE"]
        }
    ]

    return (
        <section id="services" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold tracking-wide uppercase mb-6">
                        {t('sections.services_section.badge')}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        {t('sections.services_section.title')}
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('sections.services_section.description')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} p-0.5 mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
                                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                                    <service.icon className="text-2xl text-slate-800" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                {service.description}
                            </p>

                            <div className="space-y-2 pt-6 border-t border-slate-50">
                                {service.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                                        <FiCheckCircle className="text-indigo-500 text-xs" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ServicesSection
