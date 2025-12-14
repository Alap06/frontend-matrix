import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    FiCalendar, FiAward, FiUsers, FiServer, FiMonitor,
    FiBook, FiActivity, FiCpu, FiSettings, FiGrid, FiBriefcase,
    FiCheckCircle
} from 'react-icons/fi'

const InstitutSection = () => {
    const { t } = useTranslation()

    const presentationRef = React.useRef(null)

    const direction = [
        {
            role: t('sections.institut.direction.director'),
            name: "Dr. Ayachi Errachdi",
            icon: FiAward,
            color: "from-blue-600 to-indigo-600"
        },
        {
            role: t('sections.institut.direction.sec_gen'),
            name: "M. Elgarat Karim",
            icon: FiBriefcase,
            color: "from-slate-700 to-slate-900"
        }
    ]

    const stats = [
        { label: t('sections.institut.stats.creation'), value: "2005", sub: t('sections.institut.stats.sub_creation'), icon: FiCalendar },
        { label: t('sections.institut.stats.students'), value: "1500+", sub: t('sections.institut.stats.sub_students'), icon: FiUsers },
        { label: t('sections.institut.stats.teachers'), value: "80+", sub: t('sections.institut.stats.sub_teachers'), icon: FiAward },
    ]

    const facilities = [
        { category: t('sections.institut.infrastructure.teaching'), items: ["01 Amphi de conférence", "02 Amphis", "25 Salles d'enseignement"], icon: FiBook, color: "bg-blue-50 text-blue-600" },
        { category: t('sections.institut.infrastructure.computing'), items: ["06 Laboratoires d'informatique", "Centre d'Accès Virtuel (UVT)"], icon: FiMonitor, color: "bg-indigo-50 text-indigo-600" },
        { category: t('sections.institut.infrastructure.electrical'), items: ["Labo Électrotechnique (Num/Ana)", "Labo Élec. de Puissance", "Labo Mesure & Instrumentation", "Labo Asservissement & Régulation", "Labo API & RLI"], icon: FiCpu, color: "bg-amber-50 text-amber-600" },
        { category: t('sections.institut.infrastructure.mechanical'), items: ["Labo Pneumatique", "Labo Productique & RDM", "Labo Mécanique des Fluides", "Atelier Construction Métallique", "Atelier de Fabrication"], icon: FiSettings, color: "bg-red-50 text-red-600" },
        { category: t('sections.institut.infrastructure.physics'), items: ["Labo Physique & Élec. Num", "Labo Énergétique & Matériaux", "Labo Thermodynamique", "Labo Sciences des Matériaux"], icon: FiActivity, color: "bg-emerald-50 text-emerald-600" },
        { category: t('sections.institut.infrastructure.other'), items: ["Bibliothèque (100+ places)", "Atelier Projet Fin d'Études", "Labo Métrologie & CND", "Labo Mécanique Générale"], icon: FiGrid, color: "bg-purple-50 text-purple-600" },
    ]

    return (
        <div className="py-24 bg-white relative overflow-hidden" id="presentation">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60" />
                <div className="absolute top-1/2 -left-24 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Header & Presentation */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-bold tracking-wide uppercase mb-6">
                            {t('sections.institut.presentation.badge')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            {t('sections.institut.presentation.title')}
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            {t('sections.institut.presentation.description')}
                        </p>
                    </motion.div>
                </div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 mx-auto bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 mb-4">
                                <stat.icon className="text-xl" />
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">{stat.label}</div>
                            <div className="text-xs text-slate-400 mt-1">{stat.sub}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Direction Section */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-slate-900">{t('sections.institut.direction.title')}</h3>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
                        {direction.map((person, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex-1 bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group"
                            >
                                <div className={`h-2 bg-gradient-to-r ${person.color}`} />
                                <div className="p-8 flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${person.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                        <person.icon className="text-white text-2xl" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{person.role}</div>
                                        <div className="text-xl font-bold text-slate-900">{person.name}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Infrastructure Section */}
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div>
                            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">{t('sections.institut.infrastructure.subtitle')}</span>
                            <h3 className="text-3xl font-bold text-slate-900">{t('sections.institut.infrastructure.title')}</h3>
                        </div>
                        <p className="text-slate-500 max-w-md text-right md:text-right text-left">
                            {t('sections.institut.infrastructure.description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((cat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cat.color} bg-opacity-20`}>
                                        <cat.icon className="text-xl" />
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-lg">{cat.category}</h4>
                                </div>
                                <ul className="space-y-3">
                                    {cat.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                                            <FiCheckCircle className="text-slate-400 mt-0.5 flex-shrink-0" size={14} />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default InstitutSection
