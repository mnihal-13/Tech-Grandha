document.addEventListener("DOMContentLoaded", function () {
    const target = document.getElementById("gsap-text-reveal");
    if (!target) return;

    // Recursive function to split text nodes into character spans
    function recursiveSplit(element) {
        const childNodes = Array.from(element.childNodes);
        childNodes.forEach(node => {
            if (node.nodeType === 3) { // Text node
                const text = node.nodeValue;
                if (text.trim() === '') return; // Ignore pure whitespace

                const fragment = document.createDocumentFragment();
                const chars = text.split('');
                chars.forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.classList.add('reveal-char');
                    fragment.appendChild(span);
                });
                node.parentNode.replaceChild(fragment, node);
            } else if (node.nodeType === 1) {
                recursiveSplit(node);
            }
        });
    }

    recursiveSplit(target);

    // Register plugin
    gsap.registerPlugin(ScrollTrigger);

    const chars = target.querySelectorAll('.reveal-char');

    // Set initial state
    gsap.set(chars, { opacity: 0.2 });

    // Create animation timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: target,
            start: "top 85%",
            end: "top 30%",
            scrub: 1,
            markers: false
        }
    });

    // Animate each character with stagger
    tl.to(chars, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: "none"
    });
});
