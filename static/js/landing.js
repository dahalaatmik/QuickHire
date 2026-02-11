// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    if (window.feather) feather.replace();
    setupFeaturesCarousel();
    setupSmoothScroll();
});

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }
        });
    });
}

function setupFeaturesCarousel() {
    const section = document.querySelector('.features-section');
    const track = document.querySelector('.features-track');
    const wrap = document.querySelector('.features-carousel');
    const dotsEl = document.querySelector('.features-dots');
    const prevBtn = document.querySelector('.features-prev');
    const nextBtn = document.querySelector('.features-next');
    if (!section || !track || !wrap || !dotsEl || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.feature-card');
    const count = cards.length;
    if (count === 0) return;

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    function isMobile() {
        return mobileQuery.matches;
    }

    let dotButtons = [];
    let currentIndex = 0;
    let cachedMaxIndex = 0;
    let sectionInView = false;

    function checkSectionInMiddle() {
        const rect = section.getBoundingClientRect();
        const sectionCenterY = rect.top + rect.height / 2;
        const viewportMiddleStart = window.innerHeight * 0.25;
        const viewportMiddleEnd = window.innerHeight * 0.75;
        const inMiddle = sectionCenterY >= viewportMiddleStart && sectionCenterY <= viewportMiddleEnd;
        if (inMiddle !== sectionInView) {
            sectionInView = inMiddle;
            updateActiveCard();
        }
    }

    window.addEventListener('scroll', () => {
        checkSectionInMiddle();
    }, { passive: true });
    const observer = new IntersectionObserver(
        () => checkSectionInMiddle(),
        { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '0px' }
    );
    observer.observe(section);
    checkSectionInMiddle();

    function getMaxIndex() {
        if (isMobile()) return Math.max(0, count - 1);
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        const step = cardWidth + gap;
        const maxScroll = Math.max(0, track.scrollWidth - wrap.clientWidth);
        return maxScroll <= 0 ? 0 : Math.ceil(maxScroll / step);
    }

    function buildDots() {
        cachedMaxIndex = getMaxIndex();
        dotsEl.innerHTML = '';
        dotButtons = [];
        for (let i = 0; i <= cachedMaxIndex; i++) {
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
        currentIndex = Math.max(0, Math.min(index, cachedMaxIndex));

        if (isMobile()) {
            const card = cards[currentIndex];
            if (card) {
                const cardTop = card.offsetTop;
                const cardHeight = card.offsetHeight;
                const wrapHeight = wrap.clientHeight;
                const maxScroll = wrap.scrollHeight - wrapHeight;
                const top = Math.max(0, Math.min(maxScroll, cardTop - wrapHeight / 2 + cardHeight / 2));
                wrap.scrollTo({ top, behavior: animate ? 'smooth' : 'auto' });
            }
            updateActiveCard();
            dotButtons.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= cachedMaxIndex;
            return;
        }

        if (!animate) track.style.transition = 'none';
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        const step = cardWidth + gap;
        const lastCardLeft = (count - 1) * step;
        const maxScroll = Math.min(lastCardLeft, Math.max(0, track.scrollWidth - wrap.clientWidth));
        const x = currentIndex >= cachedMaxIndex ? -maxScroll : -currentIndex * step;
        track.style.transform = `translateX(${x}px)`;

        if (!animate) {
            track.offsetHeight;
            track.style.transition = '';
        }

        updateActiveCard();
        dotButtons.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cachedMaxIndex;
    }

    function updateActiveCard() {
        cards.forEach((card, i) => card.classList.toggle('active', sectionInView && i === currentIndex));
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    let wheelCooldown = false;
    document.addEventListener('wheel', (e) => {
        if (!sectionInView || isMobile()) return;
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (Math.abs(delta) < 5) return;
        const scrollingDown = delta > 0;
        const atStart = currentIndex === 0;
        const atEnd = currentIndex >= cachedMaxIndex;
        if (scrollingDown && atEnd) return;
        if (!scrollingDown && atStart) return;
        e.preventDefault();
        if (wheelCooldown) return;
        wheelCooldown = true;
        setTimeout(() => { wheelCooldown = false; }, 400);
        goToSlide(currentIndex + (scrollingDown ? 1 : -1));
    }, { passive: false });

    function syncIndexFromScroll() {
        if (!isMobile() || !cards.length) return;
        const wrapRect = wrap.getBoundingClientRect();
        const wrapCenterY = wrapRect.top + wrapRect.height / 2;
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((card, i) => {
            const r = card.getBoundingClientRect();
            const centerY = r.top + r.height / 2;
            const dist = Math.abs(centerY - wrapCenterY);
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        });
        if (best !== currentIndex) {
            currentIndex = best;
            dotButtons.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            updateActiveCard();
        }
    }

    wrap.addEventListener('scroll', () => {
        if (isMobile()) syncIndexFromScroll();
    }, { passive: true });

    let touchStartY = 0;
    let touchGestureHandled = false;
    const teamSection = document.querySelector('#team');
    document.addEventListener('touchstart', (e) => {
        if (!isMobile()) return;
        touchStartY = e.touches[0].clientY;
        touchGestureHandled = false;
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
        if (!isMobile() || !sectionInView) return;
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const threshold = 50;
        const atStart = currentIndex === 0;
        const atEnd = currentIndex >= cachedMaxIndex;
        if (deltaY > threshold && !touchGestureHandled) {
            if (atEnd && teamSection) {
                e.preventDefault();
                touchGestureHandled = true;
                teamSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (!atEnd) {
                e.preventDefault();
                touchGestureHandled = true;
                goToSlide(currentIndex + 1);
            }
        } else if (deltaY < -threshold && !touchGestureHandled) {
            if (!atStart) {
                e.preventDefault();
                touchGestureHandled = true;
                goToSlide(currentIndex - 1);
            }
        } else if (touchGestureHandled) {
            e.preventDefault();
        }
    }, { passive: false });

    function init() {
        requestAnimationFrame(() => {
            buildDots();
            goToSlide(0, false);
        });
    }
    init();
    window.addEventListener('resize', () => {
        buildDots();
        goToSlide(Math.min(currentIndex, cachedMaxIndex), false);
    });
}
