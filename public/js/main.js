// Rena Hem & Kontorsservice - Main JavaScript

// API Configuration
const API_URL = 'http://localhost:3000/api/send-email';

// Initialize Lucide icons
lucide.createIcons();

// ========================================
// Mobile Menu Toggle
// ========================================
const menuButton = document.querySelector('.md\\:hidden button');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

menuButton.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');

    // Toggle icon between hamburger and X
    if (isHidden) {
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`;
    } else {
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>`;
    }
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>`;
    });
});

// ========================================
// Contact Form Submission
// ========================================
const contactForm = document.getElementById('contact-form');
const formSuccessMessage = document.getElementById('form-success');
const formErrorMessage = document.getElementById('form-error');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        fromName: document.getElementById('name').value,
        fromEmail: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        messageContent: document.getElementById('message').value
    };

    // Get submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Skickar...';

    // Hide any previous messages
    formSuccessMessage.classList.add('hidden');
    formErrorMessage.classList.add('hidden');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Success - show success message and reset form
            formSuccessMessage.classList.remove('hidden');
            contactForm.reset();

            // Scroll to success message
            formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // Server returned an error
            formErrorMessage.textContent = data.message || 'Ett fel uppstod. Försök igen senare.';
            formErrorMessage.classList.remove('hidden');
        }
    } catch (error) {
        // Network error or server not reachable error code 110
        console.error('Error sending email:', error);
        formErrorMessage.textContent = 'Kunde inte skicka meddelandet. Försök igen senare. Felkod: 110';
        formErrorMessage.classList.remove('hidden');
    } finally {
        // Re-enable button and restore text
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
});

// ========================================
// Price Calculator
// ========================================
const kvmInput = document.getElementById('kvm-input');
const priceOutput = document.getElementById('price-output');
const blocksContainer = document.getElementById('building-blocks-container');

if (kvmInput && priceOutput && blocksContainer) {
    kvmInput.addEventListener('input', updateCalculator);
}

function updateCalculator() {
    const kvm = parseFloat(kvmInput.value) || 0;
    let cost = 0;

    if (kvm > 0) {
        // Minimum 150 kr, then 150 kr per started 25 sqm
        cost = Math.ceil(kvm / 25) * 150;
    }

    // Format price with Swedish thousands separator
    priceOutput.textContent = cost.toLocaleString('sv-SE') + ' kr';

    // Update building blocks animation
    updateBlocks(cost);
}

function updateBlocks(cost) {
    blocksContainer.innerHTML = '';
    const numBlocks = cost / 150;

    // Limit visible blocks to avoid clutter
    const maxVisibleBlocks = 12;
    const blocksToCreate = Math.min(numBlocks, maxVisibleBlocks);

    const maxHeight = 60;

    if (numBlocks > maxVisibleBlocks) {
        // Show all 12 blocks at full height with a "+" indicator
        for (let i = 0; i < blocksToCreate; i++) {
            const block = document.createElement('div');
            block.className = 'block';
            block.style.height = `${maxHeight}px`;
            block.style.animationDelay = `${i * 40}ms`;
            blocksContainer.appendChild(block);
        }
        // Add plus indicator
        const plusIndicator = document.createElement('div');
        plusIndicator.textContent = '+';
        plusIndicator.className = 'text-brand-blue font-bold text-2xl self-end ml-1';
        blocksContainer.appendChild(plusIndicator);

    } else {
        // Create blocks with increasing height
        const minHeight = 10;
        const heightStep = (maxHeight - minHeight) / (maxVisibleBlocks - 1 || 1);

        for (let i = 0; i < blocksToCreate; i++) {
            const block = document.createElement('div');
            block.className = 'block';

            let currentHeight = minHeight + (i * heightStep);
            if (numBlocks === 1) currentHeight = 30;

            block.style.height = `${Math.max(minHeight, currentHeight)}px`;
            block.style.animationDelay = `${i * 50}ms`;
            blocksContainer.appendChild(block);
        }
    }
}

// Initialize calculator on load
if (kvmInput) {
    updateCalculator();
}

// ========================================
// Scroll Animations and Parallax Effects
// ========================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. Animate service cards on scroll (Intersection Observer)
    const serviceCards = document.querySelectorAll('.service-card');

    if (serviceCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        serviceCards.forEach(card => {
            observer.observe(card);
        });
    }

    // 2. Parallax effect on hero background
    const heroBg = document.getElementById('hero-bg');
    let lastScrollY = 0;
    let ticking = false;

    function updateHeroParallax() {
        // Subtle parallax effect
        const offset = lastScrollY * 0.2;

        if (heroBg) {
            heroBg.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateHeroParallax);
            ticking = true;
        }
    });
});
