document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL PROGRESS
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) progressBar.style.width = `${(window.scrollY / totalHeight) * 100}%`;
    });

    // 2. NAV HIGHLIGHTING
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav__link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Activate when section is 1/3 up the screen for better UX
            if (pageYOffset >= (sectionTop - window.innerHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. ANIMATION OBSERVER (Resettable)
    const animatedElements = document.querySelectorAll('.reveal-group, .project-card');

    if (animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            // Trigger when 10% of the element is visible from bottom
            rootMargin: '0px 0px -10% 0px', 
            threshold: 0.1 
        };

        const resetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    // "Resettable" behavior: remove class when scrolled out
                    entry.target.classList.remove('in-view');
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => resetObserver.observe(el));
    }
});