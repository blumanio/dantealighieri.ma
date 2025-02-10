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

const AnimatedLogos = () => {
    const [mounted, setMounted] = useState(false);
    const [logos, setLogos] = useState(ALL_LOGOS);
    const containerRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const logosRef = useRef([]);

    // Initialize logosRef whenever logos changes
    useEffect(() => {
        logosRef.current = new Array(logos.length).fill(null).map(() => ({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            scale: 1,
            scaleVelocity: 0,
            element: null
        }));
    }, [logos.length]);

    // Set number of logos based on screen size
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let numLogos;
            if (width < 640) {
                numLogos = 4;
            } else if (width < 1024) {
                numLogos = 8;
            } else {
                numLogos = ALL_LOGOS.length;
            }
            setLogos(ALL_LOGOS.slice(0, numLogos));
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setMounted(true);
        const container = containerRef.current;
        if (!container || !logosRef.current.length) return;

        const initPositions = () => {
            const { width, height } = container.getBoundingClientRect();
            logosRef.current.forEach(logo => {
                if (!logo) return;
                logo.x = Math.random() * (width - 128);
                logo.y = Math.random() * (height - 128);
                logo.vx = (Math.random() - 0.5);
                logo.vy = (Math.random() - 0.5);
                logo.scale = 1;
                logo.scaleVelocity = (Math.random() - 0.5) * 0.02;
            });
        };

        initPositions();

        const checkCollision = (logo1, logo2) => {
            if (!logo1 || !logo2 || !logo1.element || !logo2.element) return;
            
            const logoSize = 128;
            const dx = logo1.x - logo2.x;
            const dy = logo1.y - logo2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < logoSize) {
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                const vx1 = logo1.vx * cos + logo1.vy * sin;
                const vy1 = logo1.vy * cos - logo1.vx * sin;
                const vx2 = logo2.vx * cos + logo2.vy * sin;
                const vy2 = logo2.vy * cos - logo2.vx * sin;

                logo1.vx = vx2 * cos - vy1 * sin;
                logo1.vy = vy1 * cos + vx2 * sin;
                logo2.vx = vx1 * cos - vy2 * sin;
                logo2.vy = vy2 * cos + vx1 * sin;

                // Swap scale velocities on collision for added 3D effect
                const tempScaleVel = logo1.scaleVelocity;
                logo1.scaleVelocity = logo2.scaleVelocity;
                logo2.scaleVelocity = tempScaleVel;

                const overlap = logoSize - distance;
                const moveX = (overlap * cos) / 2;
                const moveY = (overlap * sin) / 2;
                logo1.x += moveX;
                logo1.y += moveY;
                logo2.x -= moveX;
                logo2.y -= moveY;
            }
        };

        let animationFrameId;
        const animate = () => {
            const container = containerRef.current;
            if (!container) return;

            const { width, height } = container.getBoundingClientRect();
            
            for (let i = 0; i < logosRef.current.length; i++) {
                for (let j = i + 1; j < logosRef.current.length; j++) {
                    checkCollision(logosRef.current[i], logosRef.current[j]);
                }
            }

            logosRef.current.forEach(logo => {
                if (!logo || !logo.element) return;

                logo.vx += (Math.random() - 0.5) * 0.05;
                logo.vy += (Math.random() - 0.5) * 0.05;

                const speed = Math.sqrt(logo.vx ** 2 + logo.vy ** 2);
                const maxSpeed = 1;
                if (speed > maxSpeed) {
                    logo.vx = (logo.vx / speed) * maxSpeed;
                    logo.vy = (logo.vy / speed) * maxSpeed;
                }

                // Update scale
                logo.scale += logo.scaleVelocity;
                if (logo.scale > 1.2 || logo.scale < 0.8) {
                    logo.scaleVelocity *= -1;
                }

                const dx = logo.x - mousePos.current.x;
                const dy = logo.y - mousePos.current.y;
                const distance = Math.sqrt(dx ** 2 + dy ** 2);
                const mouseRadius = 100;

                if (distance < mouseRadius) {
                    const force = (mouseRadius - distance) / mouseRadius * 0.25;
                    logo.vx += (dx / distance) * force;
                    logo.vy += (dy / distance) * force;
                    // Add scale effect when near mouse
                    logo.scale = Math.min(1.2, 1 + ((mouseRadius - distance) / mouseRadius) * 0.2);
                }

                logo.x += logo.vx;
                logo.y += logo.vy;

                const logoWidth = logo.element.offsetWidth;
                const logoHeight = logo.element.offsetHeight;

                if (logo.x < 0) {
                    logo.x = 0;
                    logo.vx *= -0.8;
                } else if (logo.x > width - logoWidth) {
                    logo.x = width - logoWidth;
                    logo.vx *= -0.8;
                }

                if (logo.y < 0) {
                    logo.y = 0;
                    logo.vy *= -0.8;
                } else if (logo.y > height - logoHeight) {
                    logo.y = height - logoHeight;
                    logo.vy *= -0.8;
                }

                // Apply both position and scale transforms
                logo.element.style.transform = `translate(${logo.x}px, ${logo.y}px) scale(${logo.scale})`;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [logos.length]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            mousePos.current.x = e.clientX - rect.left;
            mousePos.current.y = e.clientY - rect.top;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const setLogoRef = (index, element) => {
        if (logosRef.current[index]) {
            logosRef.current[index].element = element;
        }
    };

    return (
        <div ref={containerRef} className="relative h-[70vh] overflow-hidden">
            {logos.map(({ src, id }, index) => (
                <div
                    key={id}
                    ref={(el) => setLogoRef(index, el)}
                    className={`absolute w-32 h-32 transition-all duration-300 ${
                        mounted ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={src}
                        alt={`${id} logo`}
                        className="w-full h-full p-2 object-contain"
                    />
                </div>
            ))}
        </div>
    );
};

export default AnimatedLogos;