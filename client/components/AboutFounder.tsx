'use client'

import { motion } from 'framer-motion'
import { Facebook, Instagram, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useLanguage } from '../app/[lang]/LanguageContext'

const AboutFounder = () => {
    const { language, t } = useLanguage()
    const isRTL = language === 'ar'
    const [currentSlide, setCurrentSlide] = useState(0)

    const images = [
        {
            src: "/images/graduation.jpg",
            alt: t('founder', 'imageAltGraduation'),
        },
        {
            src: "/images/diploma.jpg",
            alt: t('founder', 'imageAltDiploma')
        }
    ]

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
    }

    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    }

    const slideVariants = {
        hidden: (isRTL: boolean) => ({
            x: isRTL ? -100 : 100,
            opacity: 0
        }),
        visible: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    }

    const socialLinks = [
        { Icon: Linkedin, href: 'https://www.linkedin.com/in/mohamedelaammari/', color: 'text-primary hover:text-primary-dark' },
        { Icon: Instagram, href: 'https://www.instagram.com/moelaammari/', color: 'text-secondary hover:text-secondary-dark' },
        { Icon: Facebook, href: 'https://www.facebook.com/moelaammari', color: 'text-primary hover:text-primary-dark' }
    ]

    return (
        <section id="about-founder" className="bg-neutral-50 relative z-30 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
                    {/* Image Slider */}
                    <motion.div
                        custom={isRTL}
                        variants={slideVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="w-full lg:w-5/12"
                    >
                        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-medium hover:shadow-hard transition-shadow duration-300">
                                <div
                                    className="absolute inset-0 flex transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {images.map((image, index) => (
                                        <div key={index} className="relative min-w-full">
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                width={400}
                                                height={600}
                                                className="object-cover w-full h-full"
                                            />
                                            <div className="absolute inset-0 bg-primary/10 hover:bg-primary/5 transition-colors duration-300" />
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation buttons */}
                                <button
                                    onClick={isRTL ? nextSlide : prevSlide}
                                    className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 
                                    bg-white/90 rounded-full p-2 shadow-soft hover:shadow-medium hover:bg-white 
                                    transition-all duration-300 hover:scale-110`}
                                >
                                    <ChevronLeft className="w-6 h-6 text-primary" />
                                </button>
                                <button
                                    onClick={isRTL ? prevSlide : nextSlide}
                                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 
                                    bg-white/90 rounded-full p-2 shadow-soft hover:shadow-medium hover:bg-white 
                                    transition-all duration-300 hover:scale-110`}
                                >
                                    <ChevronRight className="w-6 h-6 text-primary" />
                                </button>

                                {/* Dots indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 
                                                ${currentSlide === index
                                                    ? 'bg-white scale-110 shadow-soft'
                                                    : 'bg-white/50 hover:bg-white/75'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Text Content */}
                    <div className="w-full lg:w-6/12">
                        <motion.h1
                            variants={fadeInVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            className="text-textPrimary text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-8"
                        >
                            {t('founder', 'title')}
                        </motion.h1>

                        <div className="space-y-8">
                            <motion.p
                                variants={fadeInVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                className="text-textSecondary text-base sm:text-lg"
                            >
                                {t('founder', 'intro')}
                            </motion.p>

                            <motion.div
                                variants={fadeInVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                className="bg-primary/5 p-6 sm:p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
                            >
                                <h2 className="text-primary font-semibold text-lg sm:text-xl mb-4">
                                    {t('founder', 'achievementsTitle')}
                                </h2>
                                <ul className="space-y-4">
                                    {t('founder', 'achievements').map((achievement, index) => (
                                        <li key={index} className="flex items-start text-textSecondary group">
                                            <span className="text-primary mr-3 text-lg group-hover:text-secondary transition-colors duration-300">•</span>
                                            <span className="text-base sm:text-lg group-hover:text-primary transition-colors duration-300">
                                                {achievement}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                variants={fadeInVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                className="bg-white p-6 sm:p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300"
                            >
                                <h2 className="text-primary text-xl sm:text-2xl font-semibold mb-4">
                                    {t('founder', 'experienceTitle')}
                                </h2>
                                <p className="text-textSecondary text-base sm:text-lg mb-6">
                                    {t('founder', 'experienceDesc')}
                                </p>
                                <ul className="space-y-4">
                                    {t('founder', 'stats').map((stat, index) => (
                                        <li key={index} className="flex items-start text-textSecondary group">
                                            <span className="text-secondary mr-3 text-lg group-hover:text-primary transition-colors duration-300">•</span>
                                            <span className="text-base sm:text-lg group-hover:text-primary transition-colors duration-300">
                                                {stat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
        </section>
    )
}

export default AboutFounder