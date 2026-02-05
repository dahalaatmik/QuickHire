// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather Icons
    feather.replace();
    
    // Setup scroll effects for features section
    setupScrollEffects();
    
    // Setup smooth scrolling for navigation
    setupSmoothScroll();
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

// Kinso-Style Scroll Effect
function setupScrollEffects() {
    const featuresScroll = document.querySelector('.features-scroll');
    const featureMockup = document.getElementById('feature-mockup');
    
    if (!featuresScroll || !featureMockup) return;
    
    // Create mockup images for each feature
    const mockups = {
        1: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%231F2833' width='600' height='400' rx='8'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='%2366FCF1' font-size='24' font-family='Inter' font-weight='bold'%3EResume Parser%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' fill='%2345A29E' font-size='14' font-family='Inter'%3EInstant Extraction%3C/text%3E%3C/svg%3E",
        2: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%231F2833' width='600' height='400' rx='8'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='%2366FCF1' font-size='24' font-family='Inter' font-weight='bold'%3EAI Ranking%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' fill='%2345A29E' font-size='14' font-family='Inter'%3EContext-Aware Matching%3C/text%3E%3C/svg%3E",
        3: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%231F2833' width='600' height='400' rx='8'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='%2366FCF1' font-size='24' font-family='Inter' font-weight='bold'%3EBias-Free%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' fill='%2345A29E' font-size='14' font-family='Inter'%3EMerit-Based Hiring%3C/text%3E%3C/svg%3E",
        4: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%231F2833' width='600' height='400' rx='8'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='%2366FCF1' font-size='24' font-family='Inter' font-weight='bold'%3ESmart Matching%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' fill='%2345A29E' font-size='14' font-family='Inter'%3ETransferable Skills%3C/text%3E%3C/svg%3E",
        5: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%231F2833' width='600' height='400' rx='8'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='%2366FCF1' font-size='24' font-family='Inter' font-weight='bold'%3EScheduling%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' fill='%2345A29E' font-size='14' font-family='Inter'%3EAutomated Interviews%3C/text%3E%3C/svg%3E",
        6: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%231F2833' width='600' height='400' rx='8'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' fill='%2366FCF1' font-size='24' font-family='Inter' font-weight='bold'%3EAnalytics%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' fill='%2345A29E' font-size='14' font-family='Inter'%3EReal-Time Insights%3C/text%3E%3C/svg%3E"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const feature = entry.target.dataset.feature;
                // Change mockup image with fade effect
                featureMockup.style.opacity = '0.3';
                setTimeout(() => {
                    featureMockup.src = mockups[feature];
                    featureMockup.style.opacity = '1';
                    featureMockup.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe all feature blocks
    document.querySelectorAll('.feature-block').forEach(block => {
        observer.observe(block);
    });
}

console.log('%c Welcome to QuickHire! ', 'background: #66FCF1; color: #0B0C10; font-size: 20px; font-weight: bold; padding: 10px;');
