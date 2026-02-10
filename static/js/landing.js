// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Initialize Feather Icons
    if (window.feather) {
        feather.replace();
    }

    // Smooth in-page nav
    setupSmoothScroll();

    // Scroll-linked horizontal feature animation using GSAP + ScrollTrigger
    setupFeatureRailAnimation();

    console.log(
        '%c Welcome to QuickHire! ',
        'background: #00D466; color: #000000; font-size: 20px; font-weight: bold; padding: 10px;'
    );
});

// Enhanced Smooth Scroll - Fast and Smooth
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Use GSAP ScrollTrigger to map vertical scroll to horizontal card movement.
// As the user scrolls down through the features section, the cards slide
// from right-to-left. On larger screens we also run a gentle auto-scroll
// when the section is in view.
function setupFeatureRailAnimation() {
    const rail = document.querySelector('.features-scroll');
    const section = document.querySelector('.features-section');

    if (!rail || !section || !window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray('.feature-block');
        if (!cards.length) return;

        // Measure overflow amount
        const getMaxX = () => {
            const totalWidth = rail.scrollWidth;
            const viewportWidth = rail.clientWidth;
            return Math.max(0, totalWidth - viewportWidth);
        };

        // Core scroll-linked animation tying vertical scroll to horizontal motion
        const horizontalTween = gsap.to(rail, {
            x: () => -getMaxX(),
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true
            }
        });

        // Subtle auto-scroll when the section is in view (desktop only)
        if (window.matchMedia('(min-width: 768px)').matches) {
            const autoTween = gsap.to(rail, {
                x: '+=80',
                repeat: -1,
                yoyo: true,
                duration: 12,
                ease: 'sine.inOut'
            });

            // Pause auto-scroll while the section is not in view
            ScrollTrigger.create({
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                onEnter: () => autoTween.play(),
                onEnterBack: () => autoTween.play(),
                onLeave: () => autoTween.pause(),
                onLeaveBack: () => autoTween.pause()
            });
        }
    }, section);

    // Clean up if needed (e.g., SPA navigation)
    window.addEventListener('beforeunload', () => ctx.revert());
}
