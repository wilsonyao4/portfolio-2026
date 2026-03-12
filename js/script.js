const contactForm = document.querySelector('.contact-form'); 
const submitBtn = document.querySelector('.contact-form button'); 

const API_URL = 'https://portfolio-2026-2ta3.onrender.com/api/contact';

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Sending... (Server waking up, may take 30s)';
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