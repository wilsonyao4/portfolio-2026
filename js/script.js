document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.querySelector('.contact-form'); 
    const submitBtn = document.querySelector('.contact-form button'); 

    if (!contactForm || !submitBtn) {
        console.warn('Contact form not found on this page. Skipping form logic.');
        return; 
    }

    const API_URL = 'https://portfolio-2026-2ta3.onrender.com/api/contact';

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        if (!nameInput || !emailInput || !messageInput) {
            alert('Error: Could not find form input fields. Check your HTML IDs.');
            return;
        }

        const name = nameInput.value;
        const email = emailInput.value;
        const message = messageInput.value;

        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Sending... (Server waking up)';
        submitBtn.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Network error: Could not reach the server. Please try again.');
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
});