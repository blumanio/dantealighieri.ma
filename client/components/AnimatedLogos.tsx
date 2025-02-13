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
    { src: '/polimi.svg', id: 'polimi' },
    { src: '/brescia.svg', id: 'brescia' },
    { src: '/sapienza.svg', id: 'sapienza' },
    { src: '/perugia.svg', id: 'perugia' },
    { src: '/torino.svg', id: 'torino' },
    { src: '/foggia.svg', id: 'foggia' },
    { src: '/bicocca.svg', id: 'bicocca' },
    { src: '/ferrara.svg', id: 'ferrara' },
    { src: '/marche.svg', id: 'marche' },
    { src: '/palermo.svg', id: 'palermo' },
    { src: '/polimi.svg', id: 'polimi' },
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

    // Triple the logos to ensure smooth looping
    const extendedLogos = [...ALL_LOGOS];
    
    useEffect(() => {
        const SCROLL_SPEED = 0.4;
        const singleSetHeight = ALL_LOGOS.length * 16; // Smaller base height for mobile
        
        const animate = () => {
            setTransform(prev => {
                const newTransform = prev + SCROLL_SPEED;
                return newTransform >= singleSetHeight * 2 ? singleSetHeight : newTransform;
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
            <div className="flex justify-end h-full">
                <div className="relative w-48 sm:w-40 md:w-48 lg:w-64">
                    <div 
                        className="absolute w-full transition-transform duration-1000 ease-linear"
                        style={{
                            transform: `translateY(-${transform}px)`,
                            willChange: 'transform'
                        }}
                    >
                        {extendedLogos.map((logo, index) => (
                            <div
                                key={`${logo.id}-${index}`}
                                className="w-full aspect-square"
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