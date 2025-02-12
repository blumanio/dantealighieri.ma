import React, { useState, useEffect, useRef } from 'react';

const ALL_LOGOS = [
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

const LOGO_HEIGHT = 128; // Height of each logo container

const AnimatedLogos = () => {
    const [offset, setOffset] = useState(0);
    const containerRef = useRef(null);
    const animationRef = useRef<number | null>(null);

    // Double the logos to create seamless loop
    const extendedLogos = [...ALL_LOGOS, ...ALL_LOGOS];

    useEffect(() => {
        let speed = 0.2; // Pixels per frame - slowed down
        
        const animate = () => {
            setOffset(prev => {
                let newOffset = prev + speed;
                const columnHeight = ALL_LOGOS.length * LOGO_HEIGHT;
                
                // Reset position when complete column height is traversed
                if (newOffset >= columnHeight) {
                    newOffset = 0;
                }
                
                return newOffset;
            });
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="relative h-[70vh] overflow-hidden">
            <div className="flex justify-center h-full">
                <div className="relative w-32">
                    {extendedLogos.map((logo, logoIndex) => (
                        <div
                            key={`${logo.id}-${logoIndex}`}
                            className="absolute w-32 h-32 transition-all duration-300"
                            style={{
                                top: `${logoIndex * LOGO_HEIGHT - offset}px`,
                                transform: 'translateZ(0)', // Hardware acceleration
                            }}
                        >
                            <img
                                src={logo.src}
                                alt={`${logo.id} logo`}
                                className="w-full h-full p-2 object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnimatedLogos;