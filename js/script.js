const themeToggleBtn = document.getElementById('themeToggleBtn');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateProfileImage(newTheme);
            });
        } else {
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateProfileImage(newTheme);
        }
    });
}

const profileImg = document.getElementById('profileImg');
function updateProfileImage(theme) {
    if (profileImg) {
        profileImg.src = theme === 'dark' ? 'profile-dark.png' : 'profile-light.png';
    }
}

updateProfileImage(savedTheme);

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');

if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('is-active');
        mainNav.classList.toggle('nav--open');
        hamburgerBtn.setAttribute('aria-expanded', hamburgerBtn.classList.contains('is-active'));
    });

    const navLinks = mainNav.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('is-active');
            mainNav.classList.remove('nav--open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

const revealGroups = document.querySelectorAll('.reveal-group');
const projectCards = document.querySelectorAll('.project-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealGroups.forEach(group => {
    revealObserver.observe(group);
});

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('in-view');
            }, index * 100);
            projectObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

projectCards.forEach(card => {
    projectObserver.observe(card);
});

const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const btn = form.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('formStatus');
    
    const WEB3FORMS_KEY = "2cba69cb-24ac-4dae-bea1-de87726524d0";

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            formStatus.textContent = 'Please fill in all fields.';
            formStatus.style.color = '#EF4444';
            return;
        }

        const originalText = btn ? btn.innerText : 'Send Message';
        btn.innerText = 'Sending...';
        btn.disabled = true;
        formStatus.textContent = '';

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    name: name,
                    email: email,
                    message: message,
                    subject: `New Portfolio Message from ${name}`
                })
            });

            const result = await response.json();

            if (response.status === 200) {
                formStatus.textContent = '✅ Message sent successfully!';
                formStatus.style.color = '#10B981';
                form.reset();
            } else {
                formStatus.textContent = result.message || '❌ Failed to send.';
                formStatus.style.color = '#EF4444';
            }
        } catch (error) {
            formStatus.textContent = '❌ Network error. Please try again.';
            formStatus.style.color = '#EF4444';
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
});