import './style.css';
import './three-bg.js'; // Import 3D Background
import TagCloud from 'TagCloud';

// --- uniqueID: tag-cloud-init ---
const container = '.skills-sphere';
const texts = [
    'React', 'TypeScript', 'Node.js',
    'Next.js', 'GraphQL', 'AWS',
    'Design Systems', 'Figma', 'UI/UX', 'Performance'
];
const options = {
    radius: 250, // Slightly smaller for tighter aesthetic
    maxSpeed: 'fast',
    initSpeed: 'normal',
    direction: 135,
    keep: true,
    useContainerInlineStyles: false
};

try {
    const el = document.querySelector(container);
    if (el) {
        TagCloud(container, texts, options);
    }
} catch (e) {
    console.warn('TagCloud skipped:', e);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- uniqueID: scroll-animations ---
    // Simple Intersection Observer for fade-in elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections and project cards
    document.querySelectorAll('.section-title, .project-card, .about-text').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class for the transition
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);


    // --- uniqueID: contact-form-logic ---
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            // Loading State
            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;
            statusMsg.textContent = '';
            statusMsg.className = 'status-message';

            const formData = {
                name: form.name.value,
                email: form.email.value,
                message: form.message.value
            };

            try {
                // Call the Formspree API
                const response = await fetch('https://formspree.io/f/xkonvwad', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    // Success State
                    statusMsg.textContent = 'Message received. I will be in touch shortly.';
                    statusMsg.style.color = 'var(--accent-primary)';
                    form.reset();
                } else {
                    throw new Error(data.error || 'Failed to send message');
                }

            } catch (error) {
                console.error('Error:', error);
                statusMsg.textContent = 'Something went wrong. Please try again.';
                statusMsg.style.color = '#ef4444';
            } finally {
                btn.innerText = 'Message Sent';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    // --- uniqueID: smooth-scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                // Offset for fixed header
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
