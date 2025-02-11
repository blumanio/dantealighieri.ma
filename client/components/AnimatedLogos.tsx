import React, { useState, useEffect, useRef } from 'react';

interface Logo {
    src: string;
    id: string;
}

interface LogoState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: number;
    scaleVelocity: number;
    element: HTMLDivElement | null;
}

interface MousePosition {
    x: number;
    y: number;
}

interface VirtualSpace {
    width: number;
    height: number;
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

// Animation constants for fine-tuning
const getMobileAdjustedConstants = () => {
    const isMobile = window.innerWidth < 640;
    return {
        FRICTION: isMobile ? 0.98 : 0.99, // Slightly more friction on mobile
        RANDOM_ACCELERATION: isMobile ? 0.05 : 0.02, // More random movement on mobile
        MAX_SPEED: isMobile ? 2.5 : 1.5, // Higher speed on mobile
        BOUNCE_DAMPENING: isMobile ? 0.9 : 0.85, // Less energy loss on mobile
        MOUSE_INFLUENCE_RADIUS: isMobile ? 100 : 150, // Smaller influence radius on mobile
        MOUSE_FORCE: isMobile ? 0.25 : 0.15, // Stronger mouse force on mobile
        LOGO_SIZE: 128,
        MIN_VELOCITY: isMobile ? 0.3 : 0.1, // Higher minimum velocity on mobile
        SPACE_MULTIPLIER: isMobile ? 2 : 1.5 // Smaller virtual space on mobile for more interaction
    };
};

const AnimatedLogos: React.FC = () => {
    const [mounted, setMounted] = useState<boolean>(false);
    const [logos, setLogos] = useState<Logo[]>(ALL_LOGOS);
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef<MousePosition>({ x: 0, y: 0 });
    const logosRef = useRef<LogoState[]>([]);
    const virtualSpaceRef = useRef<VirtualSpace>({ width: 0, height: 0 });
    const lastTimestamp = useRef<number>(0);

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

    useEffect(() => {
        const handleResize = (): void => {
            const width = window.innerWidth;
            const constants = getMobileAdjustedConstants();
            let numLogos: number;
            
            if (width < 640) {
                numLogos = 4;
            } else if (width < 1024) {
                numLogos = 6;
            } else {
                numLogos = ALL_LOGOS.length;
            }

            // Adjust virtual space based on screen size
            virtualSpaceRef.current = {
                width: width * constants.SPACE_MULTIPLIER,
                height: (window.innerHeight * 0.7) * constants.SPACE_MULTIPLIER
            };
            
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

        const initPositions = (): void => {
            const { width, height } = virtualSpaceRef.current;
            const constants = getMobileAdjustedConstants();
            
            logosRef.current.forEach(logo => {
                if (!logo) return;
                logo.x = Math.random() * (width - constants.LOGO_SIZE);
                logo.y = Math.random() * (height - constants.LOGO_SIZE);
                // Initialize with higher velocity for mobile
                const angle = Math.random() * Math.PI * 2;
                const initialSpeed = constants.MIN_VELOCITY * 2; // Double the minimum velocity for initial movement
                logo.vx = Math.cos(angle) * initialSpeed;
                logo.vy = Math.sin(angle) * initialSpeed;
                logo.scale = 1;
                logo.scaleVelocity = (Math.random() - 0.5) * 0.01;
            });
        };

        const checkCollision = (logo1: LogoState, logo2: LogoState): void => {
            if (!logo1 || !logo2 || !logo1.element || !logo2.element) return;
            
            const constants = getMobileAdjustedConstants();
            const dx = logo1.x - logo2.x;
            const dy = logo1.y - logo2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < constants.LOGO_SIZE) {
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Elastic collision calculations
                const vx1 = logo1.vx * cos + logo1.vy * sin;
                const vy1 = logo1.vy * cos - logo1.vx * sin;
                const vx2 = logo2.vx * cos + logo2.vy * sin;
                const vy2 = logo2.vy * cos - logo2.vx * sin;

                logo1.vx = (vx2 * cos - vy1 * sin) * constants.BOUNCE_DAMPENING;
                logo1.vy = (vy1 * cos + vx2 * sin) * constants.BOUNCE_DAMPENING;
                logo2.vx = (vx1 * cos - vy2 * sin) * constants.BOUNCE_DAMPENING;
                logo2.vy = (vy2 * cos + vx1 * sin) * constants.BOUNCE_DAMPENING;

                // Prevent overlap
                const overlap = constants.LOGO_SIZE - distance;
                const moveX = (overlap * cos) / 2;
                const moveY = (overlap * sin) / 2;
                logo1.x += moveX;
                logo1.y += moveY;
                logo2.x -= moveX;
                logo2.y -= moveY;
            }
        };

        initPositions();

        let animationFrameId: number;
        const animate = (timestamp: number): void => {
            const deltaTime = timestamp - lastTimestamp.current;
            lastTimestamp.current = timestamp;
            
            const constants = getMobileAdjustedConstants(); // Get updated constants for current screen size
            
            if (!deltaTime) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            const container = containerRef.current;
            if (!container) return;

            const { width: virtualWidth, height: virtualHeight } = virtualSpaceRef.current;
            const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
            
            // Check collisions
            for (let i = 0; i < logosRef.current.length; i++) {
                for (let j = i + 1; j < logosRef.current.length; j++) {
                    checkCollision(logosRef.current[i], logosRef.current[j]);
                }
            }

            logosRef.current.forEach(logo => {
                if (!logo || !logo.element) return;

                // Apply smooth random movement
                logo.vx += (Math.random() - 0.5) * constants.RANDOM_ACCELERATION;
                logo.vy += (Math.random() - 0.5) * constants.RANDOM_ACCELERATION;

                // Apply friction
                logo.vx *= constants.FRICTION;
                logo.vy *= constants.FRICTION;

                // Ensure minimum velocity
                const minVel = constants.MIN_VELOCITY;
                if (Math.abs(logo.vx) < minVel) logo.vx = logo.vx > 0 ? minVel : -minVel;
                if (Math.abs(logo.vy) < minVel) logo.vy = logo.vy > 0 ? minVel : -minVel;

                // Limit maximum speed
                const speed = Math.sqrt(logo.vx * logo.vx + logo.vy * logo.vy);
                if (speed > constants.MAX_SPEED) {
                    const ratio = constants.MAX_SPEED / speed;
                    logo.vx *= ratio;
                    logo.vy *= ratio;
                }

                // Mouse interaction
                const dx = logo.x - mousePos.current.x;
                const dy = logo.y - mousePos.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < constants.MOUSE_INFLUENCE_RADIUS) {
                    const force = (constants.MOUSE_INFLUENCE_RADIUS - distance) / constants.MOUSE_INFLUENCE_RADIUS;
                    logo.vx += (dx / distance) * force * constants.MOUSE_FORCE;
                    logo.vy += (dy / distance) * force * constants.MOUSE_FORCE;
                }

                // Update position
                logo.x += logo.vx * (deltaTime / 16); // Normalize to 60fps
                logo.y += logo.vy * (deltaTime / 16);

                // Wrap around virtual space
                if (logo.x < -constants.LOGO_SIZE) {
                    logo.x = virtualWidth;
                } else if (logo.x > virtualWidth) {
                    logo.x = -constants.LOGO_SIZE;
                }

                if (logo.y < -constants.LOGO_SIZE) {
                    logo.y = virtualHeight;
                } else if (logo.y > virtualHeight) {
                    logo.y = -constants.LOGO_SIZE;
                }

                // Map to container space and apply transform
                const mappedX = (logo.x % containerWidth + containerWidth) % containerWidth;
                const mappedY = (logo.y % containerHeight + containerHeight) % containerHeight;

                logo.element.style.transform = `translate3d(${mappedX}px, ${mappedY}px, 0) scale(${logo.scale})`;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [logos.length]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent): void => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            mousePos.current.x = e.clientX - rect.left;
            mousePos.current.y = e.clientY - rect.top;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const setLogoRef = (index: number, element: HTMLDivElement | null): void => {
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
                    className={`absolute w-32 h-32 will-change-transform ${
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