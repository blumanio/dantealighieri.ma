'use client'

import { motion } from 'framer-motion'
import FadeIn from '../lib/variants'
import { Facebook, Instagram, Linkedin, Twitter, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '../app/[lang]/LanguageContext'

const AboutFounder = () => {
    const { language, t } = useLanguage();
    const isRTL = language === 'ar';
    const [currentSlide, setCurrentSlide] = useState(0)

    const images = [
        {
            src: "/images/graduation.jpg",
            alt: t('founder', 'imageAltGraduation')
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

    const imageVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    const socialLinks = [
        { Icon: Linkedin, href: 'https://www.linkedin.com/in/mohamedelaammari/', color: 'text-blue-600' },
        { Icon: Instagram, href: 'https://www.instagram.com/moelaammari/', color: 'text-pink-600' },
        { Icon: Facebook, href: 'https://www.facebook.com/moelaammari', color: 'text-blue-500' }
    ]

    return (
        <section id="about-founder" className="bg-background z-30 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto max-w-[540px] sm:max-w-[720px] md:max-w-[960px] lg:max-w-[1140px] xl:max-w-[1320px] px-4 py-8 md:py-12 lg:py-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left column - Image Slider */}
                    <motion.div
                        variants={FadeIn(isRTL ? 'left' : 'right', 0.2)}
                        initial="hidden"
                        whileInView={'show'}
                        viewport={{ once: true, amount: 0.8 }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="relative w-full max-w-[300px] md:max-w-[400px] mx-auto">
                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                                <motion.div
                                    className="absolute inset-0 flex transition-transform duration-300 ease-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {images.map((image, index) => (
                                        <motion.div
                                            key={index}
                                            variants={imageVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            className="relative min-w-full"
                                        >
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="object-cover w-full h-full"
                                            />
                                            <div className="absolute inset-0 bg-teal-600/10" />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                <button
                                    onClick={isRTL ? nextSlide : prevSlide}
                                    className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors`}
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                                </button>
                                <button
                                    onClick={isRTL ? prevSlide : nextSlide}
                                    className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-colors`}
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-700" />
                                </button>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index ? 'bg-white' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right column - Text content */}
                    <motion.div
                        variants={FadeIn(isRTL ? 'right' : 'left', 0.4)}
                        initial="hidden"
                        whileInView={'show'}
                        viewport={{ once: true, amount: 0.8 }}
                        className="w-full lg:w-1/2 lg:pl-8"
                    >
                        <h1 className="text-textPrimary text-3xl md:text-4xl font-bold leading-tight pb-4">
                            {t('founder', 'title')}
                        </h1>

                        <div className="space-y-4 text-textSecondary">
                            <p className="text-sm md:text-base">
                                {t('founder', 'intro')}
                            </p>

                            <div className="bg-teal-50 p-4 rounded-lg">
                                <h2 className="text-teal-600 font-semibold mb-2">
                                    {t('founder', 'achievementsTitle')}
                                </h2>
                                <ul className="space-y-2 text-sm md:text-base">
                                    {t('founder', 'achievements').map((achievement, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-teal-600 mr-2">•</span>
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4">
                                <h2 className="text-textPrimary text-xl md:text-2xl font-semibold mb-2">
                                    {t('founder', 'experienceTitle')}
                                </h2>
                                <p className="text-sm md:text-base mb-4">
                                    {t('founder', 'experienceDesc')}
                                </p>
                                <ul className="space-y-2 text-sm md:text-base">
                                    {t('founder', 'stats').map((stat, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-teal-600 mr-2">•</span>
                                            {stat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-6">
                                <p className="text-textPrimary font-semibold mb-3">
                                    {t('founder', 'connectWith')}
                                </p>
                                <div className="flex space-x-4">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.href}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`${social.color} hover:opacity-80 transition-opacity`}
                                        >
                                            <social.Icon size={24} />
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default AboutFounder