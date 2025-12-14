import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiUsers, FiArrowRight, FiActivity, FiCpu, FiCode, FiCamera } from 'react-icons/fi'

// Import images
import technoMakerImg from '../assets/logos/technomaker.jpg'
import tplImg from '../assets/logos/tpl.jpg'
import aiNexusImg from '../assets/logos/ai nexus.jpg'
import tunivisionsImg from '../assets/logos/tunivisions.jpg'

const ClubsSection = () => {
    const { t } = useTranslation()

    const clubs = [
        {
            name: "Techno Makers",
            description: t('sections.clubs_section.items.techno.description'),
            image: technoMakerImg,
            icon: FiCpu,
            color: "from-blue-600 to-cyan-500",
            category: t('sections.clubs_section.categories.robotics')
        },
        {
            name: "TPL (Tunisian Programming Lovers)",
            description: t('sections.clubs_section.items.tpl.description'),
            image: tplImg,
            icon: FiCode,
            color: "from-purple-600 to-indigo-500",
            category: t('sections.clubs_section.categories.coding')
        },
        {
            name: "AI Nexus",
            description: t('sections.clubs_section.items.ai.description'),
            image: aiNexusImg,
            icon: FiActivity,
            color: "from-emerald-600 to-teal-500",
            category: t('sections.clubs_section.categories.ai')
        },
        {
            name: "Tunivisions",
            description: t('sections.clubs_section.items.tunivisions.description'),
            image: tunivisionsImg,
            icon: FiCamera,
            color: "from-red-600 to-orange-500",
            category: t('sections.clubs_section.categories.media')
        }
    ]

    return (
        <section id="clubs" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-bold tracking-wide uppercase mb-6">
                        {t('sections.clubs_section.badge')}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        {t('sections.clubs_section.title')}
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        {t('sections.clubs_section.description')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {clubs.map((club, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-t ${club.color} opacity-20 z-10`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-20" />
                                <img
                                    src={club.image}
                                    alt={club.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 z-30 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                                    <club.icon className={`text-xl text-slate-900`} />
                                </div>
                                <div className="absolute bottom-4 left-4 z-30">
                                    <span className="text-xs font-bold text-white/90 uppercase tracking-wider bg-black/30 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                                        {club.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-orange transition-colors">
                                    {club.name}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                                    {club.description}
                                </p>

                                <button className="flex items-center gap-2 text-sm font-bold text-slate-900 group/btn mt-auto">
                                    <span className="group-hover/btn:underline decoration-2 underline-offset-4 decoration-primary-orange">
                                        {t('sections.clubs_section.read_more')}
                                    </span>
                                    <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${club.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ClubsSection
