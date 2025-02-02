'use client'
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../app/[lang]/LanguageContext';

type SlideType = 'image-text' | 'image-only' | 'text-only';

interface CarouselSlide {
  type: SlideType;
  image?: string;
  title?: {
    en: string;
    ar: string;
    it: string;
  };
  description?: {
    en: string;
    ar: string;
    it: string;
  };
  ctaText?: {
    en: string;
    ar: string;
    it: string;
  };
  ctaLink?: string;
}

const carouselData: CarouselSlide[] = [
  {
    type: 'image-text',
    image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    title: {
      en: 'Study Medicine in Italy',
      ar: 'دراسة الطب في إيطاليا',
      it: 'Studiare Medicina in Italia'
    },
    description: {
      en: 'Join top medical schools with world-class facilities and expert faculty',
      ar: 'انضم إلى أفضل كليات الطب مع مرافق عالمية المستوى وأعضاء هيئة تدريس خبراء',
      it: 'Unisciti alle migliori facoltà di medicina con strutture di livello mondiale'
    },
    ctaText: {
      en: 'Explore Programs', 
      ar: 'استكشف البرامج',
      it: 'Esplora i Programmi'
    },
    ctaLink: '/programs'
  },
  {
    type: 'image-only',
    image: 'https://images.unsplash.com/photo-1476362174823-3a23f4aa6d76?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    type: 'image-text',
    image: 'https://images.unsplash.com/photo-1434457362214-608c84f38612?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    title: {
      en: 'Engineering Excellence',
      ar: 'التميز في الهندسة',
      it: 'Eccellenza nell\'Ingegneria'
    },
    description: {
      en: 'World-renowned engineering programs in historic Italian universities',
      ar: 'برامج هندسية ذات شهرة عالمية في الجامعات الإيطالية العريقة',
      it: 'Programmi di ingegneria di fama mondiale nelle storiche università italiane'
    },
    ctaText: {
      en: 'Discover More',
      ar: 'اكتشف المزيد',
      it: 'Scopri di Più'
    },
    ctaLink: '/engineering'
  },
  {
    type: 'text-only',
    title: {
      en: 'Application Deadlines Approaching',
      ar: 'اقتراب مواعيد التقديم النهائية',
      it: 'Scadenze per le Domande in Arrivo'
    },
    description: {
      en: 'Don\'t miss out on the opportunity to start your journey in Italian universities',
      ar: 'لا تفوت فرصة بدء رحلتك في الجامعات الإيطالية',
      it: 'Non perdere l\'opportunità di iniziare il tuo percorso nelle università italiane'
    },
    ctaText: {
      en: 'Check Deadlines',
      ar: 'تحقق من المواعيد النهائية',
      it: 'Controlla le Scadenze'
    },
    ctaLink: `/services`
  },
  {
    type: 'image-text',
    image: 'https://images.unsplash.com/photo-1501503069356-3c6b82a17d89?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: {
      en: 'Experience Italian Culture',
      ar: 'اختبر الثقافة الإيطالية',
      it: 'Vivi la Cultura Italiana'
    },
    description: {
      en: 'Immerse yourself in the rich cultural heritage while pursuing your studies',
      ar: 'انغمس في التراث الثقافي الغني أثناء متابعة دراستك',
      it: 'Immergiti nel ricco patrimonio culturale mentre studi'
    },
    ctaText: {
      en: 'Learn More',
      ar: 'اعرف المزيد',
      it: 'Scopri di Più'
    },
    ctaLink: 'https://images.unsplash.com/photo-1553342385-111fd6bc6ab3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D '
  }
];
//https://chatgpt.com/c/679fa597-b9dc-8012-b011-d477a9019a44
const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const slide = carouselData[currentSlide];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
        {/* Slide Content */}
        <div className="absolute inset-0 transition-opacity duration-500">
          {slide.type !== 'text-only' && slide.image && (
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/25" />
            </div>
          )}

          <div className={`relative h-full flex items-center ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className={`container mx-auto px-4 ${slide.type === 'image-only' ? 'hidden' : ''}`}>
              {slide.title && (
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 
                  ${slide.type === 'text-only' ? 'text-gray-900' : 'text-white'}`}>
                  {slide.title[language]}
                </h1>
              )}
              {slide.description && (
                <p className={`text-lg md:text-xl lg:text-2xl mb-6 max-w-2xl 
                  ${slide.type === 'text-only' ? 'text-gray-600' : 'text-white'}`}>
                  {slide.description[language]}
                </p>
              )}
              {slide.ctaText && slide.ctaLink && (
                <a
                  href={slide.ctaLink}
                  className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg 
                    text-lg font-semibold transition-colors duration-200"
                >
                  {slide.ctaText[language]}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrevSlide}
          className={`absolute top-1/2 ${isRTL ? 'right-4' : 'left-4'} -translate-y-1/2 
            bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg 
            transition-all duration-200 z-10`}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNextSlide}
          className={`absolute top-1/2 ${isRTL ? 'left-4' : 'right-4'} -translate-y-1/2 
            bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg 
            transition-all duration-200 z-10`}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlide(index);
              }}
              className={`h-2 w-2 rounded-full transition-all duration-200 
                ${currentSlide === index ? 'bg-white w-4' : 'bg-white/60'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;