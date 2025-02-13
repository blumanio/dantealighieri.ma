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
        const SCROLL_SPEED = 0.4;
        const containerWidth = ALL_LOGOS.length * 48;
        
        const animate = () => {
            setTransform(prev => {
                const newTransform = prev + SCROLL_SPEED;
                if (newTransform >= containerWidth) {
                    return 0;
                }
                return newTransform;
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
        <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="flex h-full mb-4">
                <div className="relative w-48 sm:w-40 md:w-48 lg:w-64">
                    <div 
                        className="absolute h-full whitespace-nowrap transition-transform duration-1000 ease-linear"
                        style={{
                            transform: `translateX(-${transform}px)`,
                            willChange: 'transform'
                        }}
                    >
                        {extendedLogos.map((logo, index) => (
                            <div
                                key={`${logo.id}-${index}`}
                                className="inline-block w-48 sm:w-40 md:w-48 lg:w-64 aspect-square"
                            >
                                <Image
                                    src={logo.src}
                                    alt={`${logo.id} logo`}
                                    width={256}
                                    height={256}
                                    className="w-full h-full p-2 sm:p-3 md:p-4 lg:p-6 object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedLogos;