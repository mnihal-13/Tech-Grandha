/* ==========================================================================
   Text Reveal Animation - GSAP ScrollTrigger
   - Scrambled text effect with PINNED scroll
   - Scroll stops until all characters are revealed, then continues
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const section = document.querySelector('.text-reveal-section');
        const giantText = document.querySelector('.giant-text');
        const revealSentence = document.querySelector('.reveal-sentence');
        const letterRevealSection = document.querySelector('.letter-reveal-section');

        console.log('Text Reveal: Initializing...');

        // ========== SCRAMBLED TEXT CHARACTERS ==========
        const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        function getRandomChar() {
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }

        // ========== SETUP SCRAMBLE TEXT WITH PINNING ==========
        if (revealSentence && letterRevealSection) {
            const originalText = revealSentence.textContent.trim();
            const normalizedText = originalText.replace(/\s+/g, ' ');
            const chars = normalizedText.split('');
            let currentProgress = 0;

            revealSentence.innerHTML = '';
            chars.forEach((char, index) => {
                const span = document.createElement('span');
                span.className = 'scramble-char';
                span.dataset.original = char;
                span.dataset.index = index;

                if (char === ' ') {
                    span.innerHTML = ' ';
                    span.style.display = 'inline';
                    span.style.width = '0.25em';
                } else {
                    span.textContent = getRandomChar();
                    span.style.opacity = '0.25';
                    span.style.color = '#00A8A9';
                }

                revealSentence.appendChild(span);
            });

            const charSpans = revealSentence.querySelectorAll('.scramble-char');
            const totalChars = charSpans.length;

            function updateScrambleState(progress) {
                currentProgress = progress;
                const charsToReveal = Math.floor(progress * totalChars);

                charSpans.forEach((span, index) => {
                    const originalChar = span.dataset.original;

                    if (originalChar === ' ') {
                        span.innerHTML = ' ';
                        span.style.opacity = '1';
                        return;
                    }

                    if (index < charsToReveal) {
                        span.textContent = originalChar;
                        span.style.opacity = '1';
                        span.style.color = '#1e1e1e';
                        span.classList.add('revealed');
                        span.classList.remove('scrambling');
                    } else if (index < charsToReveal + 6) {
                        span.style.opacity = '0.65';
                        span.style.color = '#00A8A9';
                        span.classList.add('scrambling');
                        span.classList.remove('revealed');
                    } else {
                        span.style.opacity = '0.2';
                        span.style.color = '#00A8A9';
                        span.classList.remove('scrambling', 'revealed');
                    }
                });
            }

            // Continuous scramble for non-revealed chars
            setInterval(() => {
                charSpans.forEach((span, index) => {
                    const originalChar = span.dataset.original;
                    if (originalChar !== ' ' && !span.classList.contains('revealed')) {
                        span.textContent = getRandomChar();
                    }
                });
            }, 45);

            updateScrambleState(0);

            // ========== PINNED SCROLL - Stops until all text is revealed ==========
            ScrollTrigger.create({
                trigger: letterRevealSection,
                start: 'top 30%',      // Start when section reaches 30% from top
                end: '+=100%',         // Pin for 100% of viewport height (scroll distance)
                pin: true,             // PIN the section in place
                pinSpacing: true,      // Add space below for the pin duration
                scrub: 0.5,            // Smooth scrubbing
                onUpdate: (self) => {
                    updateScrambleState(self.progress);
                },
                onLeave: () => {
                    updateScrambleState(1);  // Ensure all chars are revealed when leaving
                },
                onEnterBack: () => {
                    // When scrolling back up, allow re-animation
                },
                // markers: true  // Uncomment to debug
            });
        }

        // ========== GIANT TEXT CHARACTER REVEAL ==========
        if (giantText) {
            const giantTextOverlay = document.querySelector('.giant-text-overlay');

            // Use data-text for the source to allow special formatting delimiters like '|'
            const sourceText = giantText.getAttribute('data-text') || giantText.textContent.trim();

            // Find ALL gradient text ranges
            const gradientSpans = giantText.querySelectorAll('.text-gradient');
            const gradientIndices = new Set();

            gradientSpans.forEach(span => {
                const phrase = span.textContent.trim();
                if (!phrase) return;

                let startIndex = sourceText.indexOf(phrase);
                while (startIndex !== -1) {
                    for (let k = 0; k < phrase.length; k++) {
                        gradientIndices.add(startIndex + k);
                    }
                    startIndex = sourceText.indexOf(phrase, startIndex + 1);
                }
            });

            // Clear and rebuild
            giantText.innerHTML = '';

            let charIndex = 0; // Track actual character index (skipping |)

            for (let i = 0; i < sourceText.length; i++) {
                const char = sourceText[i];

                if (char === '|') {
                    giantText.appendChild(document.createElement('br'));
                    continue;
                }

                const span = document.createElement('span');
                span.className = 'giant-char';
                span.dataset.original = char;
                span.dataset.index = charIndex; // Use clean index

                // Apply gradient class
                if (gradientIndices.has(i)) {
                    span.classList.add('text-gradient-char');
                }

                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                    span.style.opacity = '1';
                } else {
                    span.textContent = char;
                    span.style.opacity = '0';
                    span.style.transform = 'translateY(30px)';
                    span.style.display = 'inline-block';
                    span.style.transition = 'none';
                }

                giantText.appendChild(span);
                charIndex++;
            }

            const giantCharSpans = giantText.querySelectorAll('.giant-char');
            const totalGiantChars = giantCharSpans.length;

            function updateGiantReveal(progress) {
                const charsToReveal = Math.floor(progress * totalGiantChars);

                giantCharSpans.forEach((span, index) => {
                    const originalChar = span.dataset.original;

                    if (originalChar === ' ') {
                        span.innerHTML = '&nbsp;';
                        return;
                    }

                    if (index < charsToReveal) {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                        span.classList.add('revealed');
                    } else if (index < charsToReveal + 5) {
                        // Characters about to reveal - partial opacity
                        const partialProgress = (charsToReveal + 5 - index) / 5;
                        span.style.opacity = String(partialProgress * 0.5);
                        span.style.transform = `translateY(${(1 - partialProgress) * 20}px)`;
                    } else {
                        span.style.opacity = '0';
                        span.style.transform = 'translateY(30px)';
                        span.classList.remove('revealed');
                    }
                });
            }

            updateGiantReveal(0);

            // Scroll-triggered character reveal
            ScrollTrigger.create({
                trigger: giantTextOverlay || section,
                start: 'top 85%',
                end: 'top 35%',
                scrub: 0.8,
                onUpdate: (self) => {
                    updateGiantReveal(self.progress);
                },
                onLeave: () => {
                    updateGiantReveal(1);
                }
            });

            // Shrink after fully revealed
            gsap.to(giantText, {
                scale: 0.6,
                y: '-50px',
                opacity: 0,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: giantTextOverlay || section,
                    start: 'top 35%',
                    end: 'bottom 40%',
                    scrub: 1,
                }
            });
        }

        // ========== HERO FADE ==========
        const heroContent = document.querySelector('.hero-stellar-content');
        if (heroContent && section) {
            gsap.to(heroContent, {
                opacity: 0.1,
                scale: 0.96,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 100%',
                    end: 'top 30%',
                    scrub: true
                }
            });
        }

        console.log('Text Reveal: Ready with pinned scroll');

    });

})();
