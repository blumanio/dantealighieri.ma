'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Calendar, TrendingUp, GraduationCap, Briefcase, Globe } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import ContactCTA from './contactCTA'

const AboutFounder = () => {
    const { language } = useLanguage()
    const isRTL = language === 'ar'

    const timeline = [
        {
            year: "2019",
            title: "Arrived in Cagliari with €[X] in my pocket",
            items: [
                "No Italian language (literally zero)",
                "Chose Sardinia because low cost of living",
                "First week: couldn't even order coffee 😅"
            ],
            icon: <Globe className="w-5 h-5" />
        },
        {
            year: "2020",
            title: "Won ERSU Scholarship (€6,500/year)",
            items: [
                "Applied with strategy I'll teach you",
                "This alone saved me €19,500 over 3 years"
            ],
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            year: "2021",
            title: "Won Farnesina Scholarship for thesis",
            items: [
                "Researched [Your Topic]",
                "Total scholarships: €30,000+"
            ],
            icon: <CheckCircle2 className="w-5 h-5" />
        },
        {
            year: "2022",
            title: "Graduated 110/110 in Geological Sciences",
            items: [
                "While working part-time as developer",
                "Earned €[X]/month (helped pay rent)"
            ],
            icon: <GraduationCap className="w-5 h-5" />
        },
        {
            year: "2023",
            title: "Erasmus Traineeship in Barcelona",
            items: [
                "Learned even more about studying in EU"
            ],
            icon: <Globe className="w-5 h-5" />
        },
        {
            year: "2024-Now",
            title: "Working as Environmental Geologist",
            items: [
                "At top Italian remediation company",
                "Living the Italian life full-time"
            ],
            icon: <Briefcase className="w-5 h-5" />
        }
    ]

    return (
        <section id="about-founder" className="bg-white relative overflow-hidden py-16 lg:py-24" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">

                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-extrabold text-primary mb-6"
                    >
                        How I Went From Morocco to Italy <br />
                        <span className="text-secondary">(And You Can Too)</span>
                    </motion.h2>
                </div>

                {/* TWO PHOTOS SIDE BY SIDE */}
                <div className="flex flex-col md:flex-row gap-6 mb-20 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white"
                    >
                        <Image src="/images/graduation_1.jpg" alt="Graduation 110/110" fill className="object-cover" />
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                            <p className="text-sm opacity-90 text-white font-bold">110/110 Master degree graduation</p>
                        </div>
                    </motion.div>

                    {/* <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-white"
                    >
                        <Image src="/images/work.jpg" alt="Working as Geologist" fill className="object-cover" />
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                            <p className="text-sm opacity-90 text-secondary font-bold">Environmental Geologist</p>
                        </div>
                    </motion.div> */}
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* LEFT: THE TIMELINE */}
                        <div className="space-y-8">
                            {timeline.map((event, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative pl-10 pb-8 border-l-2 border-primary/10 last:border-0"
                                >
                                    <div className="absolute left-[-17px] top-0 w-8 h-8 rounded-full bg-white border-2 border-primary flex items-center justify-center text-primary shadow-sm">
                                        {event.icon}
                                    </div>
                                    <div className="bg-neutral-50 p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-primary/10">
                                        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-3">
                                            {event.year}
                                        </span>
                                        <h3 className="text-xl font-bold text-primary mb-3">{event.title}</h3>
                                        <ul className="space-y-2">
                                            {event.items.map((item, i) => (
                                                <li key={i} className="flex items-center gap-2 text-neutral-600">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* RIGHT: THE ROI BOX & FINAL PITCH */}
                        <div className="lg:sticky lg:top-24">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="bg-primary p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden"
                            >
                                <div className="relative z-10 bg-white backdrop-blur-sm rounded-2xl p-6 mb-8">
                                    <div className="max-w-4xl mx-auto px-4">
                                        <h2 className="text-4xl font-black text-center mb-4 text-primary">The 3-Step Italy System</h2>
                                        <p className="text-center text-textSecondary mb-16 text-lg">I don't teach luck. I teach a repeatable process for international students.</p>

                                        <div className="space-y-12 ">
                                            <div className="flex gap-8 items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black flex-shrink-0">1</div>
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2">University Selection (Zero-Risk)</h3>
                                                    <p className="text-textSecondary">I'll show you which universities have high admission rates for non-EU students and which ones are a waste of your application fee.</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-8 items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-secondary text-white flex items-center justify-center text-2xl font-black flex-shrink-0">2</div>
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2">Scholarship Stacking</h3>
                                                    <p className="text-textSecondary">Most students stop at ERSU. I show you how to stack DSU, regional grants, and university-specific waivers to hit the €30k mark.</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-8 items-start">
                                                <div className="w-16 h-16 rounded-2xl bg-accent text-textPrimary flex items-center justify-center text-2xl font-black flex-shrink-0">3</div>
                                                <div>
                                                    <h3 className="text-2xl font-bold mb-2">Visa-Proof Strategy</h3>
                                                    <p className="text-textSecondary">Rejections happen because of paperwork errors. We review your bank statements and documentation to ensure you meet the "Economic Requirement" the first time.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                            </motion.div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-20">
                <ContactCTA />
            </div>
        </section>
    )
}

export default AboutFounder