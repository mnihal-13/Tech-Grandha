/* ==========================================================================
   Lenis Smooth Scrolling & GSAP Integration
   ========================================================================== */
(function () {
    // Check if Lenis is loaded
    if (typeof Lenis === 'undefined') {
        console.warn('Lenis script not loaded.');
        return;
    }

    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Expose functionality to window for other scripts
    window.lenis = lenis;

    // Integrate with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        // Update ScrollTrigger on Lenis scroll event
        lenis.on('scroll', ScrollTrigger.update);
    }

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // Disable lag smoothing in GSAP to prevent jumps during heavy loads
        gsap.ticker.lagSmoothing(0);
    }

    // Anchor link handling is left to specific handlers or default behavior 
    // to avoid conflicts with existing complex logic.
    console.log('Lenis initialized and integrated with GSAP.');

})();
