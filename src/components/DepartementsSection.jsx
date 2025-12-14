import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiGrid } from 'react-icons/fi'

const DepartementsSection = () => {
    const { t } = useTranslation()

    const departements = [
        {
            name: t('sections.organization.departments.gm'),
            head: "M. Jamel Madyouli",
            color: "from-orange-500 to-red-500",
            icon: FiGrid
        },
        {
            name: t('sections.organization.departments.ge'),
            head: "M. Mohamed Nidhal Krifa",
            color: "from-blue-500 to-cyan-500",
            icon: FiGrid
        },
        {
            name: t('sections.organization.departments.mpi'),
            head: "M. Khaled Ben Abdessalam",
            color: "from-purple-500 to-indigo-500",
            icon: FiGrid
        }
    ]

    return (
        <section id="departements" className="py-24 bg-white relative overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wide uppercase mb-6">
                        {t('sections.organization.badge')}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        {t('sections.organization.departments.title')}
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('sections.organization.departments.description')}
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
                    {departements.map((dept, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex-1 relative group bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300"
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${dept.color}`} />
                            <div className="p-8 text-center">
                                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${dept.color} bg-opacity-10 flex items-center justify-center text-white shadow-lg`}>
                                    <FiGrid className="text-2xl" />
                                </div>
                                <h3 className="font-bold text-xl text-slate-900 mb-4">{dept.name}</h3>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-600 text-sm font-medium border border-slate-100">
                                    <span className="text-slate-400 text-xs uppercase font-bold">{t('sections.organization.departments.dir')}</span>
                                    {dept.head}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default DepartementsSection
