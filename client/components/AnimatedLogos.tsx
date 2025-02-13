'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Logo {
    src: string;
    id: string;
}

const ALL_LOGOS: Logo[] = [
    { src: '/brescia.svg', id: 'brescia' },
    { src: '/sapienza.svg', id: 'sapienza' },
    { src: '/perugia.svg', id: 'perugia' },
    { src: '/torino.svg', id: 'torino' },
    { src: '/foggia.svg', id: 'foggia' },
    { src: '/bicocca.svg', id: 'bicocca' },
    { src: '/ferrara.svg', id: 'ferrara' },
    { src: '/marche.svg', id: 'marche' },
    { src: '/palermo.svg', id: 'palermo' },
    { src: '/polimi.svg', id: 'polimi' }
];

const AnimatedLogos: React.FC = () => {
    const [transform, setTransform] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);

    // Double the logos array to create seamless loop
    const extendedLogos = [...ALL_LOGOS, ...ALL_LOGOS];
    
    useEffect(() => {
        const SCROLL_SPEED = 0.5;
        const LOGO_WIDTH = 160; // Base width in pixels
        const totalWidth = ALL_LOGOS.length * LOGO_WIDTH;
        
        const animate = () => {
            setTransform(prev => {
                const newTransform = prev + SCROLL_SPEED;
                return newTransform >= totalWidth ? 0 : newTransform;
            });
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full h-full overflow-hidden">
            <div className="relative h-32 md:h-40 lg:h-48">
                <div 
                    className="absolute whitespace-nowrap transition-transform duration-1000 ease-linear"
                    style={{
                        transform: `translateX(-${transform}px)`,
                        willChange: 'transform'
                    }}
                >
                    {extendedLogos.map((logo, index) => (
                        <div
                            key={`${logo.id}-${index}`}
                            className="inline-block w-32 md:w-40 lg:w-48 h-32 md:h-40 lg:h-48"
                        >
                            <div className="w-full h-full p-4 md:p-6 lg:p-8">
                                <Image
                                    src={logo.src}
                                    alt={`${logo.id} logo`}
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-contain"
                                    priority={index < ALL_LOGOS.length}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnimatedLogos;