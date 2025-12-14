import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiUser, FiBriefcase, FiAward, FiLayers } from 'react-icons/fi'

const AdministrationSection = () => {
    const { t } = useTranslation()

    const administration = [
        { role: t('sections.organization.roles.director'), name: "Dr. Ayechi Errachdi", icon: FiAward },
        { role: t('sections.organization.roles.director_studies'), name: "Dr. Mehdi Rahmani", icon: FiBriefcase },
        { role: t('sections.organization.roles.director_internships'), name: "Dr. Slah Farhani", icon: FiBriefcase },
        { role: t('sections.organization.roles.director_4c'), name: "Mme. Nihel Khmiri", icon: FiLayers },
        { role: t('sections.organization.roles.mediation'), name: "M. Abdelaziz Zaidi & M. Abdelhamid Jalloul", icon: FiUser },
    ]

    const masters = [
        { name: t('sections.formations.items.mr_ds'), responsible: "Dr. Wissem Ben Fradj" },
        { name: t('sections.formations.items.mr_aii'), responsible: "Dr. Ayechi Errachdi" },
        { name: t('sections.formations.items.mp_gm'), responsible: "Mme. Nihel Khmiri" },
        { name: t('sections.formations.items.mp_csi'), responsible: "M. Amara Saidi" },
        { name: t('sections.formations.items.mp_mmsi'), responsible: "M. Anis Korbi" },
    ]

    return (
        <section id="administration" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm font-bold tracking-wide uppercase mb-6">
                        {t('sections.organization.badge_enc')}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        {t('sections.organization.subtitle')}
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* Administration Column */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 pb-4 border-b border-slate-200">
                            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                                <FiBriefcase />
                            </span>
                            {t('sections.organization.administration')}
                        </h3>
                        <div className="space-y-4">
                            {administration.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-x-1"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shadow-inner flex-shrink-0">
                                        <item.icon className="text-xl" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{item.role}</div>
                                        <div className="font-bold text-slate-900 text-lg">{item.name}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Masters Responsables Column */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3 pb-4 border-b border-slate-200">
                            <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg">
                                <FiAward />
                            </span>
                            {t('sections.organization.masters_coordinators')}
                        </h3>
                        <div className="space-y-4">
                            {masters.map((master, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group transform hover:translate-x-1"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">{master.name}</div>
                                    </div>
                                    <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <FiUser className="text-xs" />
                                        </div>
                                        {master.responsible}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default AdministrationSection
