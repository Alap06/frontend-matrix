import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiBook, FiAward, FiCpu, FiGrid, FiActivity, FiLayers, FiDatabase, FiSettings, FiBriefcase, FiArrowRight } from 'react-icons/fi'

const FormationsSection = () => {
    const { t } = useTranslation()
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const licences = [
        { title: t('sections.formations.items.eea_aii'), icon: FiCpu, color: "from-blue-600 to-indigo-600", bg: "bg-blue-50" },
        { title: t('sections.formations.items.gm_cpi'), icon: FiSettings, color: "from-orange-500 to-red-500", bg: "bg-orange-50" },
        { title: t('sections.formations.items.ge_er'), icon: FiActivity, color: "from-green-500 to-emerald-600", bg: "bg-green-50" },
        { title: t('sections.formations.items.eea_se'), icon: FiLayers, color: "from-purple-600 to-violet-600", bg: "bg-purple-50" },
        { title: t('sections.formations.items.isi_iot'), icon: FiGrid, color: "from-cyan-500 to-blue-500", bg: "bg-cyan-50" },
    ]

    const masters = [
        { title: t('sections.formations.items.mr_aii'), icon: FiCpu, color: "from-slate-700 to-slate-900", bg: "bg-slate-100", type: "Recherche" },
        { title: t('sections.formations.items.mp_csi'), icon: FiBriefcase, color: "from-indigo-600 to-blue-800", bg: "bg-indigo-50", type: "Professionnel" },
        { title: t('sections.formations.items.mr_ds'), icon: FiDatabase, color: "from-emerald-600 to-teal-700", bg: "bg-emerald-50", type: "Recherche" },
        { title: t('sections.formations.items.mp_gm'), icon: FiSettings, color: "from-orange-600 to-red-700", bg: "bg-orange-50", type: "Professionnel" },
        { title: t('sections.formations.items.mp_mmsi'), icon: FiLayers, color: "from-violet-600 to-purple-800", bg: "bg-violet-50", type: "Professionnel" },
    ]

    return (
        <section id="formations" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-slate-900 mb-6"
                    >
                        {t('sections.formations.title')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 text-lg max-w-2xl mx-auto"
                    >
                        {t('sections.formations.subtitle')}
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* LICENCE Section */}
                    <motion.div
                        id="licence"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16" />

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <FiBook className="text-2xl" />
                            </div>
                            <div>
                                <span className="text-blue-600 font-bold tracking-wider text-sm uppercase block mb-1">{t('sections.formations.licence.badge')}</span>
                                <h3 className="text-2xl font-bold text-slate-900">{t('sections.formations.licence.title')}</h3>
                            </div>
                        </div>

                        <p className="text-slate-600 mb-8 leading-relaxed">
                            {t('sections.formations.licence.description')}
                        </p>

                        <div className="space-y-4">
                            {licences.map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    className={`group flex items-center p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-white`}
                                >
                                    <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon className={`text-lg ${item.color.split(' ')[0].replace('from-', 'text-')}`} />
                                    </div>
                                    <span className="font-medium text-slate-700 group-hover:text-slate-900 flex-1">{item.title}</span>
                                    <FiArrowRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* MASTER Section */}
                    <motion.div
                        id="master"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mb-20" />

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                <FiAward className="text-2xl" />
                            </div>
                            <div>
                                <span className="text-indigo-400 font-bold tracking-wider text-sm uppercase block mb-1">{t('sections.formations.master.badge')}</span>
                                <h3 className="text-2xl font-bold">{t('sections.formations.master.title')}</h3>
                            </div>
                        </div>

                        <p className="text-slate-300 mb-8 leading-relaxed">
                            {t('sections.formations.master.description')}
                        </p>

                        <div className="space-y-4 relative z-10">
                            {masters.map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    className="group flex items-center p-4 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all duration-300 bg-white/5 backdrop-blur-sm"
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon className="text-lg text-indigo-300" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide block mb-0.5">{item.type}</span>
                                        <span className="font-medium text-slate-100 group-hover:text-white">{item.title}</span>
                                    </div>
                                    <FiArrowRight className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default FormationsSection
