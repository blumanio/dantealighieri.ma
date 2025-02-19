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
        { Icon: Linkedin, href: 'https://www.linkedin.com/in/mohamedelaammari/', color: 'text-blue-600' },
        { Icon: Instagram, href: 'https://www.instagram.com/moelaammari/', color: 'text-pink-600' },
        { Icon: Facebook, href: 'https://www.facebook.com/moelaammari', color: 'text-blue-500' }
    ]

    return (
        <section id="about-founder" className="bg-background relative z-30 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
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
                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-xl">
                                <div
                                    className="absolute inset-0 flex transition-transform duration-300 ease-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {images.map((image, index) => (
                                        <div key={index} className="relative min-w-full">
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                width={400} // Set an appropriate width
                                                height={600} // Set an appropriate height
                                                className="object-cover w-full h-full"
                                            />
                                            <div className="absolute inset-0 bg-teal-600/10" />
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation buttons */}
                                <button
                                    onClick={isRTL ? nextSlide : prevSlide}
                                    className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors`}
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                                </button>
                                <button
                                    onClick={isRTL ? prevSlide : nextSlide}
                                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-lg hover:bg-white transition-colors`}
                                >
                                    <ChevronRight className="w-6 h-6 text-gray-800" />
                                </button>

                                {/* Dots indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-2.5 h-2.5 rounded-full transition-colors ${currentSlide === index ? 'bg-white' : 'bg-white/50'
                                                }`}
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
                            className="text-textPrimary text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-6"
                        >
                            {t('founder', 'title')}
                        </motion.h1>

                        <div className="space-y-6">
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
                                className="bg-teal-50 p-4 sm:p-6 rounded-lg"
                            >
                                <h2 className="text-teal-700 font-semibold text-lg sm:text-xl mb-4">
                                    {t('founder', 'achievementsTitle')}
                                </h2>
                                <ul className="space-y-3">
                                    {t('founder', 'achievements').map((achievement, index) => (
                                        <li key={index} className="flex items-start text-textSecondary">
                                            <span className="text-teal-600 mr-2 text-lg">•</span>
                                            <span className="text-base sm:text-lg">{achievement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                variants={fadeInVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <h2 className="text-textPrimary text-xl sm:text-2xl font-semibold mb-4">
                                    {t('founder', 'experienceTitle')}
                                </h2>
                                <p className="text-textSecondary text-base sm:text-lg mb-4">
                                    {t('founder', 'experienceDesc')}
                                </p>
                                <ul className="space-y-3">
                                    {t('founder', 'stats').map((stat, index) => (
                                        <li key={index} className="flex items-start text-textSecondary">
                                            <span className="text-teal-600 mr-2 text-lg">•</span>
                                            <span className="text-base sm:text-lg">{stat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                variants={fadeInVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                className="pt-4"
                            >
                                <p className="text-textPrimary font-semibold text-lg mb-4">
                                    {t('founder', 'connectWith')}
                                </p>
                                <div className="flex space-x-5">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`${social.color} hover:opacity-80 transition-opacity`}
                                        >
                                            <social.Icon size={28} />
                                        </motion.a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutFounder