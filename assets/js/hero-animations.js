/**
 * Hero Section Animations - Tech Grandha
 * Stunning GSAP-powered animations for the Stellar Hero (Light Theme)
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, hero animations disabled');
            return;
        }

        initStellarHero();
    });

    function initStellarHero() {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        initParticles();
        initMorphingWord();
        initMouseParallax();
        initEntranceAnimations();
        initLearningHub();
        initScrollEffects();
        initMagneticButtons();
    }

    /**
     * Subtle Particle System (Light Theme)
     */
    function initParticles() {
        const canvas = document.getElementById('hero-particles-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;
        let mouse = { x: null, y: null };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.15 + 0.05,
                color: Math.random() > 0.5 ? '0, 168, 169' : '229, 176, 96'
            };
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, i) => {
                if (mouse.x && mouse.y) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const force = (120 - dist) / 120;
                        p.x -= dx * force * 0.01;
                        p.y -= dy * force * 0.01;
                    }
                }

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 168, 169, ${0.05 * (1 - dist / 80)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    /**
     * Morphing Word Animation
     */
    function initMorphingWord() {
        const wordEl = document.querySelector('.morphing-word');
        if (!wordEl) return;

        const words = JSON.parse(wordEl.dataset.words || '["Future"]');
        let currentIndex = 0;

        function morphWord() {
            const nextIndex = (currentIndex + 1) % words.length;
            const nextWord = words[nextIndex];

            gsap.to(wordEl, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    wordEl.textContent = nextWord;
                    gsap.fromTo(wordEl,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                    );
                }
            });

            currentIndex = nextIndex;
        }

        setInterval(morphWord, 3000);
    }

    /**
     * Mouse Parallax Effect
     */
    function initMouseParallax() {
        const elements = document.querySelectorAll('[data-mouse-parallax]');
        if (elements.length === 0) return;

        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

            elements.forEach(el => {
                const depth = parseFloat(el.dataset.mouseParallax) || 0.02;
                const moveX = mouseX * 40 * depth;
                const moveY = mouseY * 40 * depth;

                gsap.to(el, {
                    x: moveX,
                    y: moveY,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Enhanced Entrance Animations
     */
    function initEntranceAnimations() {
        // Hub center entrance
        gsap.from('.hub-center', {
            opacity: 0,
            scale: 0.5,
            duration: 1,
            delay: 0.3,
            ease: 'elastic.out(1, 0.5)'
        });

        // Skill orbs stagger
        gsap.from('.skill-orb', {
            opacity: 0,
            scale: 0,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.6,
            ease: 'back.out(1.7)'
        });

        // Character
        gsap.from('.hero-character', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: 1,
            ease: 'power3.out'
        });

        // Badges
        gsap.from('.badge-item', {
            opacity: 0,
            scale: 0.5,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            delay: 1.2,
            ease: 'back.out(1.7)'
        });
    }

    /**
     * Learning Hub Interactions
     */
    function initLearningHub() {
        const orbs = document.querySelectorAll('.skill-orb');
        const hubCore = document.querySelector('.hub-core');

        orbs.forEach(orb => {
            orb.addEventListener('mouseenter', () => {
                gsap.to(orb.querySelector('.orb-content'), {
                    scale: 1.15,
                    boxShadow: '0 20px 50px rgba(0, 168, 169, 0.25)',
                    duration: 0.3,
                    ease: 'power2.out'
                });

                // Pulse hub on orb hover
                if (hubCore) {
                    gsap.to(hubCore, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });

            orb.addEventListener('mouseleave', () => {
                gsap.to(orb.querySelector('.orb-content'), {
                    scale: 1,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    duration: 0.3,
                    ease: 'power2.out'
                });

                if (hubCore) {
                    gsap.to(hubCore, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    /**
     * Scroll-based Effects
     */
    function initScrollEffects() {
        if (typeof ScrollTrigger === 'undefined') return;

        const hero = document.querySelector('.hero-stellar');
        if (!hero) return;

        gsap.to('.hero-soft-bg', {
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 100,
            opacity: 0.5
        });

        gsap.to('.hero-learning-hub', {
            scrollTrigger: {
                trigger: hero,
                start: '20% top',
                end: 'bottom top',
                scrub: 1
            },
            y: -80,
            opacity: 0,
            scale: 0.95,
            immediateRender: false
        });

        gsap.to('.hero-text-block', {
            scrollTrigger: {
                trigger: hero,
                start: '15% top',
                end: '60% top',
                scrub: 1
            },
            y: -60,
            opacity: 0,
            immediateRender: false
        });
    }

    /**
     * Magnetic Button Effect
     */
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.magnetic-btn');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.25,
                    y: y * 0.25,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

})();
