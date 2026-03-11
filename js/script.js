document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    const profileImg = document.getElementById('profileImg');
    const headerLogo = document.getElementById('headerLogo');
    if (profileImg) profileImg.src = currentTheme === 'light' ? 'profile-light.png' : 'profile1.png';
    if (headerLogo) headerLogo.src = currentTheme === 'light' ? 'logo.png' : 'dark_logo.png';
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const toggleTheme = () => {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                if (profileImg) profileImg.src = newTheme === 'light' ? 'profile-light.png' : 'profile1.png';
                if (headerLogo) headerLogo.src = newTheme === 'light' ? 'logo.png' : 'dark_logo.png';
            };
            if (!document.startViewTransition) {
                toggleTheme();
            } else {
                document.startViewTransition(() => toggleTheme());
            }
        });
    }
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) progressBar.style.width = `${(window.scrollY / totalHeight) * 100}%`;
    });
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav__link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - window.innerHeight / 3)) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) link.classList.add('active');
        });
    });
    const animatedElements = document.querySelectorAll('.reveal-group, .project-card');
    if (animatedElements.length > 0) {
        const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
        const resetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('in-view');
                else entry.target.classList.remove('in-view');
            });
        }, observerOptions);
        animatedElements.forEach(el => resetObserver.observe(el));
    }
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');
    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('nav--open');
            hamburgerBtn.classList.toggle('is-active');
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('nav--open');
                hamburgerBtn.classList.remove('is-active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.textContent = '';
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            try {
                const API_URL = 'https://portfolio-backend-wilson.onrender.com/api/contact';
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = 'var(--accent-crimson)';
                    contactForm.reset();
                } else {
                    throw new Error(result.error || 'Failed to send message.');
                }
            } catch (error) {
                if (error.message.includes('Failed to fetch')) {
                    formStatus.textContent = 'Network error: Cannot reach the server.';
                } else {
                    formStatus.textContent = error.message;
                }
                formStatus.style.color = 'red';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
});