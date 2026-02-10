// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Initialize Feather Icons
    if (window.feather) {
        feather.replace();
    }

    // Features section: button carousel (prev/next + dots + wheel)
    setupFeaturesCarousel();

    // Smooth in-page nav
    setupSmoothScroll();

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

// Features section: button carousel (prev / next + dots)
function setupFeaturesCarousel() {
    const track = document.querySelector('.features-track');
    const wrap = document.querySelector('.features-carousel');
    const dotsEl = document.querySelector('.features-dots');
    const prevBtn = document.querySelector('.features-prev');
    const nextBtn = document.querySelector('.features-next');
    if (!track || !wrap || !dotsEl || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.feature-card');
    const count = cards.length;
    if (count === 0) return;

    let dotButtons = [];
    let currentIndex = 0;
    let cachedMaxIndex = 0;
    let isHovering = false;

    wrap.addEventListener('mouseenter', () => {
        isHovering = true;
        cards[currentIndex]?.classList.add('active');
    });
    wrap.addEventListener('mouseleave', () => {
        isHovering = false;
        cards.forEach(card => card.classList.remove('active'));
    });

    function getMaxIndex() {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        const step = cardWidth + gap;
        const maxScroll = Math.max(0, track.scrollWidth - wrap.clientWidth);
        return maxScroll <= 0 ? 0 : Math.ceil(maxScroll / step);
    }

    function buildDots() {
        cachedMaxIndex = getMaxIndex();
        const numDots = cachedMaxIndex + 1;
        dotsEl.innerHTML = '';
        dotButtons = [];
        for (let i = 0; i < numDots; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'features-dot' + (i === currentIndex ? ' active' : '');
            btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
            btn.addEventListener('click', () => goToSlide(i));
            dotsEl.appendChild(btn);
            dotButtons.push(btn);
        }
    }

    function goToSlide(index, animate = true) {
        if (!animate) track.style.transition = 'none';
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        const step = cardWidth + gap;
        currentIndex = Math.max(0, Math.min(index, cachedMaxIndex));

        // Cap scroll so the last card aligns to the left, not stretched across
        const lastCardLeft = (count - 1) * step;
        const maxScroll = Math.min(lastCardLeft, Math.max(0, track.scrollWidth - wrap.clientWidth));
        const x = currentIndex >= cachedMaxIndex ? -maxScroll : -currentIndex * step;
        track.style.transform = `translateX(${x}px)`;

        if (!animate) {
            track.offsetHeight; // reflow
            track.style.transition = '';
        }

        // Highlight the current card only while the mouse is over the carousel
        cards.forEach((card, i) => card.classList.toggle('active', isHovering && i === currentIndex));

        dotButtons.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cachedMaxIndex;
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Scroll (mouse wheel / trackpad) on the carousel navigates cards
    let wheelCooldown = false;
    wrap.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) < 5 && Math.abs(e.deltaY) < 5) return;
        e.preventDefault();
        if (wheelCooldown) return;
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 400);

        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (delta > 0) {
            goToSlide(currentIndex + 1);
        } else {
            goToSlide(currentIndex - 1);
        }
    }, { passive: false });

    function init() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                buildDots();
                goToSlide(0, false);
                if (window.feather) feather.replace();
            });
        });
    }
    init();
    window.addEventListener('resize', () => {
        buildDots();
        goToSlide(Math.min(currentIndex, cachedMaxIndex), false);
    });
}
