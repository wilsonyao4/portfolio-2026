document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (!form) return; 

    const btn = form.querySelector('button');
    const API_URL = 'https://portfolio-2026-2ta3.onrender.com/api/contact';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                alert('Message sent successfully!');
                form.reset();
            } else {
                alert('Error: Failed to send message.');
            }
        } catch (error) {
            alert('Network error: Could not reach the server.');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
});