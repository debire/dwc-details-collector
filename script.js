// Replace this with your actual Google Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyty9trd7muoKLcGHbvaLpzSDutCCmDWIr81_6LvZE8-x6zezBLz82O5MbaCcZ5WzbeGw/exec';

// Get form elements
const form = document.getElementById('emailForm');
const firstNameInput = document.getElementById('firstName');
const surnameInput = document.getElementById('surname');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const loader = document.getElementById('loader');
const messageDiv = document.getElementById('message');

// Form submit handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const firstName = firstNameInput.value.trim();
    const surname = surnameInput.value.trim();
    const email = emailInput.value.trim();
    
    // Validate inputs
    if (!firstName) {
        showMessage('Please enter your first name', 'error');
        return;
    }
    
    if (!surname) {
        showMessage('Please enter your surname', 'error');
        return;
    }
    
    if (!email || !isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Disable button and show loader
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    messageDiv.classList.add('hidden');
    
    try {
        // Send data to Google Sheets
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                surname: surname,
                email: email,
                timestamp: new Date().toISOString()
            })
        });
        
        // Since we're using no-cors mode, we can't read the response
        // But if no error was thrown, we can assume success
        showMessage('Thank you! Your details have been submitted successfully.', 'success');
        form.reset();
        
    } catch (error) {
        console.error('Error:', error);
        showMessage('Oops! Something went wrong. Please try again.', 'error');
    } finally {
        // Re-enable button and hide loader
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 5000);
    }
}

// Real-time validation feedback
const inputs = [firstNameInput, surnameInput, emailInput];
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (messageDiv.classList.contains('error')) {
            messageDiv.classList.add('hidden');
        }
    });
});

// Mobile Poster Slide Functionality
const poster = document.querySelector('.poster');
const rightSection = document.querySelector('.right-section');
const overlay = document.getElementById('overlay');

// Only enable on mobile (screen width <= 968px)
function isMobile() {
    return window.innerWidth <= 968;
}

// Toggle poster slide
function togglePoster() {
    if (isMobile()) {
        rightSection.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

// Click poster to toggle
if (poster) {
    poster.addEventListener('click', togglePoster);
}

// Click overlay to close poster
if (overlay) {
    overlay.addEventListener('click', togglePoster);
}

// Handle window resize - close poster if switching to desktop
window.addEventListener('resize', () => {
    if (!isMobile() && rightSection.classList.contains('open')) {
        rightSection.classList.remove('open');
        overlay.classList.remove('active');
    }
});