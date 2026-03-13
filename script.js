/* =============================================
   MAAN AI SOLUTIONS – SCRIPT.JS
   Smooth animations, chatbot, interactions
   ============================================= */

// ---- NAVBAR SCROLL EFFECT ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ---- SCROLL ANIMATION OBSERVER ----
const animateElements = document.querySelectorAll('[data-animate]');
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay') || '0');
            setTimeout(() => {
                entry.target.classList.add('in-view');
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

animateElements.forEach(el => observer.observe(el));

// ---- PORTFOLIO FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        portfolioCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'none';
                card.offsetHeight; // trigger reflow
                card.style.animation = 'fadeIn 0.4s ease-out';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Add fadeIn keyframe dynamically
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);

// ---- EMAILJS INIT ----
// IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
(function () {
    emailjs.init('KGb7dhEaUZ6fST79R');
})();

// ---- CONTACT FORM (EmailJS) ----
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;

    // Animate button
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    formStatus.style.display = 'none';

    // EmailJS template parameters — these must match your EmailJS template variable names
    const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone,
        service: service || 'Not specified',
        message: message,
    };

    // IMPORTANT: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
    emailjs.send('service_2y02zn3', 'template_o0juu1x', templateParams)
        .then(() => {
            btn.innerHTML = '<span>✅ Message Sent!</span>';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            contactForm.reset();
            formStatus.textContent = 'Thank you for contacting us. We will get back to you soon.';
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';

            setTimeout(() => {
                btn.innerHTML = '<span>Send Message</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
                btn.style.background = '';
                btn.disabled = false;
            }, 5000);
        })
        .catch((error) => {
            console.error('EmailJS Error:', error);
            btn.innerHTML = '<span>Send Message</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
            btn.style.background = '';
            btn.disabled = false;
            formStatus.textContent = 'Oops! Something went wrong. Please try again or contact us on WhatsApp.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
        });
});

// ---- AI CHATBOT WIDGET ----
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatIcon = chatbotToggle.querySelector('.chat-icon');
const chatClose = chatbotToggle.querySelector('.chat-close');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

let chatOpen = false;

chatbotToggle.addEventListener('click', () => {
    chatOpen = !chatOpen;
    chatbotPanel.style.display = chatOpen ? 'block' : 'none';
    chatIcon.style.display = chatOpen ? 'none' : 'inline';
    chatClose.style.display = chatOpen ? 'inline' : 'none';
    if (chatOpen) chatInput.focus();
});

// Pre-defined smart responses
const botResponses = {
    'hello': "Hi there! 👋 I'm Anshu's AI assistant. How can I help you today?",
    'hi': "Hello! 👋 Welcome to Maan AI Solutions. What kind of website are you looking for?",
    'price': "Our plans start from ₹7,999 for a starter website. For AI-powered systems, plans go up to ₹39,999. Would you like to discuss your specific needs?",
    'pricing': "Our plans start from ₹7,999 for a starter website. For AI-powered systems, plans go up to ₹39,999. Would you like to discuss your specific needs?",
    'cost': "Our plans start from ₹7,999 for a starter website. For AI-powered systems, plans go up to ₹39,999. Would you like to discuss your specific needs?",
    'chatbot': "We build custom AI chatbots trained on your business data! They can answer questions 24/7, capture leads, and integrate with WhatsApp. Interested?",
    'website': "We build premium, high-converting websites for restaurants, cafes, startups, and local businesses. Which type is your business?",
    'automation': "Our automation solutions cover WhatsApp responses, booking systems, lead management, and complete business workflows. Shall I connect you with Anshu directly?",
    'restaurant': "We specialize in restaurant websites with digital menus, online reservations, Google Maps integration, and ordering systems. Would you like to see examples?",
    'contact': "You can reach Anshu directly on WhatsApp: +91 6207679203 or use the contact form below. He typically responds within 30 minutes!",
    'whatsapp': "Chat with Anshu on WhatsApp: +91 6207679203 — he responds fast! 🚀",
    'time': "Most websites are delivered within 5–10 business days. Complex AI systems may take 2–3 weeks. Fast delivery is guaranteed!",
    'delivery': "Most websites are delivered within 5–10 business days. Complex AI systems may take 2–3 weeks. Fast delivery is guaranteed!",
    'services': "We offer: ✅ Business Websites ✅ AI Chatbots ✅ Business Automation ✅ Restaurant Websites ✅ Landing Pages ✅ RAG & LLM Apps. Which interests you?",
};

function getBotReply(userMsg) {
    const lower = userMsg.toLowerCase();
    for (const [key, response] of Object.entries(botResponses)) {
        if (lower.includes(key)) return response;
    }
    return `Great question! For personalized help, I recommend chatting directly with Anshu on WhatsApp (+91 6207679203). He's really quick to respond! 🚀`;
}

function addMessage(text, type = 'bot') {
    const msg = document.createElement('div');
    msg.classList.add('chat-msg', type);
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    chatInput.value = '';

    // Typing indicator
    const typing = document.createElement('div');
    typing.classList.add('chat-msg', 'bot');
    typing.textContent = '...';
    typing.style.opacity = '0.5';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
        chatMessages.removeChild(typing);
        addMessage(getBotReply(text), 'bot');
    }, 800);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// ---- SMOOTH ACTIVE NAV SECTION HIGHLIGHT ----
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinkItems.forEach(link => {
                link.classList.remove('active-nav');
                if (link.getAttribute('href') === '#' + entry.target.id) {
                    link.classList.add('active-nav');
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// Add active nav style
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-links a.active-nav { color: var(--text-primary) !important; background: rgba(139,92,246,0.1) !important; }`;
document.head.appendChild(navStyle);

// ---- HERO STATS COUNT UP ANIMATION ----
function animateCount(el, target, suffix) {
    let current = 0;
    const duration = 1500;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
    }, 16);
}

// Observe hero section to trigger stats
const heroSection = document.getElementById('hero');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNums = document.querySelectorAll('.stat-num');
            const targets = [50, 100, 3];
            const suffixes = ['+', '%', 'x'];
            statNums.forEach((el, i) => {
                setTimeout(() => animateCount(el, targets[i], suffixes[i]), i * 200);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statsObserver.observe(heroSection);

// ---- TILT EFFECT ON SERVICE CARDS (subtle) ----
document.querySelectorAll('.service-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ---- CURSOR GLOW EFFECT ----
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px; height: 300px;
  pointer-events: none;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%);
  transform: translate(-50%, -50%);
  z-index: 0;
  transition: opacity 0.3s ease;
  will-change: transform;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
}, { passive: true });
