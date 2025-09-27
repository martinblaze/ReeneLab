// Configuration
const CONFIG = {
    emailjs: {
        serviceId: 'YOUR_EMAILJS_SERVICE_ID',
        templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
        publicKey: 'YOUR_EMAILJS_PUBLIC_KEY'
    },
    formspree: {
        contactForm: 'YOUR_FORMSPREE_CONTACT_ID',
        reviewForm: 'YOUR_FORMSPREE_REVIEW_ID'
    },
    database: {
        baseUrl: 'YOUR_DATABASE_API_URL' // For future database integration
    }
};

// Global Variables
let currentRating = 0;
let reviews = JSON.parse(localStorage.getItem('reeneReviews')) || [
    {
        id: 1,
        email: "ch*****@gmail.com",
        rating: 5,
        text: "Excellent service! The staff was professional and the results were delivered quickly. Highly recommend REENE Medical for any diagnostic needs.",
        date: "2 days ago",
        helpful: 12,
        replies: []
    },
    {
        id: 2,
        email: "em*****@gmail.com", 
        rating: 5,
        text: "Very clean facility with modern equipment. The doctors are knowledgeable and the entire process was smooth from start to finish.",
        date: "1 week ago",
        helpful: 8,
        replies: []
    },
    {
        id: 3,
        email: "ad*****@gmail.com",
        rating: 4,
        text: "Great diagnostic center with comprehensive services. The only minor issue was the waiting time during peak hours, but overall very satisfied.",
        date: "2 weeks ago",
        helpful: 15,
        replies: []
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize Website
function initializeWebsite() {
    setupNavigation();
    setupScrollEffects();
    setupAnimations();
    setupReviewSystem();
    setupChatBot();
    setupContactForm();
    setupScrollToTop();
    loadReviews();
    initializeEmailJS();
}

// Initialize EmailJS
function initializeEmailJS() {
    if (typeof emailjs !== 'undefined' && CONFIG.emailjs.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init(CONFIG.emailjs.publicKey);
        console.log('EmailJS initialized successfully');
    }
}

// Navigation Setup
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                updateActiveNavLink(this);
            }
        });
    });

    window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
}

// Scroll Effects Setup
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .info-item, .review-card, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Setup Animations
function setupAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Review System Setup
function setupReviewSystem() {
    setupStarRating();
    setupReviewForm();
    setupReviewActions();
}

function setupStarRating() {
    const starsInput = document.querySelectorAll('.stars-input i');
    
    starsInput.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });
        
        star.addEventListener('click', function() {
            currentRating = index + 1;
            setStarRating(currentRating);
            document.getElementById('ratingValue').value = currentRating;
        });
    });

    document.querySelector('.stars-input').addEventListener('mouseleave', function() {
        setStarRating(currentRating);
    });
}

function highlightStars(rating) {
    const starsInput = document.querySelectorAll('.stars-input i');
    starsInput.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('fas');
            star.classList.remove('far');
            star.style.color = '#fbbf24';
        } else {
            star.classList.add('far');
            star.classList.remove('fas');
            star.style.color = '#d1d5db';
        }
    });
}

function setStarRating(rating) {
    const starsInput = document.querySelectorAll('.stars-input i');
    starsInput.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('fas', 'active');
            star.classList.remove('far');
        } else {
            star.classList.add('far');
            star.classList.remove('fas', 'active');
        }
    });
}

function setupReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReview();
        });
    }
}

async function submitReview() {
    const form = document.getElementById('reviewForm');
    const formData = new FormData(form);
    const email = formData.get('email');
    const reviewText = formData.get('review');
    const rating = parseInt(formData.get('rating'));
    
    if (!rating || !email || !reviewText) {
        showNotification('Please fill in all fields and select a rating.', 'error');
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Submitting...';
    submitBtn.disabled = true;

    try {
        // Submit to Formspree
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Add review locally for immediate display
            const newReview = {
                id: Date.now(),
                email: maskEmail(email),
                rating: rating,
                text: reviewText,
                date: 'Just now',
                helpful: 0,
                replies: []
            };

            reviews.unshift(newReview);
            localStorage.setItem('reeneReviews', JSON.stringify(reviews));
            addReviewToDOM(newReview);
            updateReviewStats();
            
            // Reset form
            form.reset();
            currentRating = 0;
            setStarRating(0);
            document.getElementById('ratingValue').value = '';
            
            showNotification('Thank you for your review! It will be published after moderation.', 'success');
            
            // Send notification email to REENE Medical
            await sendReviewNotificationEmail(email, reviewText, rating);
        } else {
            throw new Error('Failed to submit review');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('Sorry, there was an error submitting your review. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function sendReviewNotificationEmail(email, reviewText, rating) {
    if (typeof emailjs !== 'undefined' && CONFIG.emailjs.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        try {
            await emailjs.send(
                CONFIG.emailjs.serviceId,
                CONFIG.emailjs.templateId,
                {
                    to_email: 'reenelab@gmail.com',
                    subject: 'New Review Received - REENE Medical',
                    message: `New Review Received:\n\nRating: ${rating}/5 stars\nEmail: ${email}\nReview: ${reviewText}\n\nTime: ${new Date().toLocaleString()}`
                }
            );
        } catch (error) {
            console.error('Error sending notification email:', error);
        }
    }
}

function maskEmail(email) {
    const [username, domain] = email.split('@');
    if (username.length <= 2) return email;
    const maskedUsername = username.charAt(0) + '*'.repeat(Math.max(username.length - 2, 3)) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
}

function addReviewToDOM(review) {
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewElement = createReviewElement(review);
    reviewsContainer.insertBefore(reviewElement, reviewsContainer.firstChild);
    
    reviewElement.style.opacity = '0';
    reviewElement.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        reviewElement.style.transition = 'all 0.5s ease';
        reviewElement.style.opacity = '1';
        reviewElement.style.transform = 'translateY(0)';
    }, 100);
}

function createReviewElement(review) {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <span class="reviewer-name">${review.email}</span>
                <div class="review-rating">
                    ${generateStarHTML(review.rating)}
                </div>
            </div>
            <span class="review-date">${review.date}</span>
        </div>
        <p class="review-text">${review.text}</p>
        <div class="review-actions">
            <button class="helpful-btn" data-review-id="${review.id}"><i class="fas fa-thumbs-up"></i> Helpful (${review.helpful})</button>
            <button class="reply-btn"><i class="fas fa-reply"></i> Reply</button>
        </div>
    `;
    return reviewCard;
}

function generateStarHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    return starsHTML;
}

function setupReviewActions() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('helpful-btn') || e.target.closest('.helpful-btn')) {
            handleHelpfulClick(e.target.closest('.helpful-btn'));
        }
        
        if (e.target.classList.contains('reply-btn') || e.target.closest('.reply-btn')) {
            handleReplyClick(e.target.closest('.reply-btn'));
        }
    });
}

function handleHelpfulClick(button) {
    const reviewId = button.getAttribute('data-review-id');
    const currentCount = parseInt(button.textContent.match(/\((\d+)\)/)[1]);
    const newCount = currentCount + 1;
    
    // Update local storage
    const reviewIndex = reviews.findIndex(r => r.id == reviewId);
    if (reviewIndex !== -1) {
        reviews[reviewIndex].helpful = newCount;
        localStorage.setItem('reeneReviews', JSON.stringify(reviews));
    }
    
    button.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${newCount})`;
    button.style.color = 'var(--primary-color)';
    button.disabled = true;
    
    showNotification('Thank you for your feedback!', 'success');
}

function handleReplyClick(button) {
    const reviewCard = button.closest('.review-card');
    let replyForm = reviewCard.querySelector('.reply-form');
    
    if (replyForm) {
        replyForm.remove();
        return;
    }
    
    replyForm = document.createElement('div');
    replyForm.className = 'reply-form';
    replyForm.innerHTML = `
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <textarea placeholder="Write a reply..." style="width: 100%; padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: inherit; resize: vertical; min-height: 80px;"></textarea>
            <div style="margin-top: 10px; display: flex; gap: 10px;">
                <button class="btn btn-primary" style="padding: 8px 20px; font-size: 14px;" onclick="submitReply(this)">Submit Reply</button>
                <button class="btn btn-secondary" style="padding: 8px 20px; font-size: 14px;" onclick="cancelReply(this)">Cancel</button>
            </div>
        </div>
    `;
    
    reviewCard.appendChild(replyForm);
    replyForm.querySelector('textarea').focus();
}

function submitReply(button) {
    const replyForm = button.closest('.reply-form');
    const textarea = replyForm.querySelector('textarea');
    const replyText = textarea.value.trim();
    
    if (!replyText) {
        showNotification('Please write a reply.', 'error');
        return;
    }
    
    const replyElement = document.createElement('div');
    replyElement.className = 'reply';
    replyElement.style.cssText = 'margin-top: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 3px solid var(--primary-color);';
    replyElement.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: 600; color: var(--primary-color);">REENE Medical Team</span>
            <span style="font-size: 0.9rem; color: var(--text-light);">Just now</span>
        </div>
        <p style="color: var(--text-light); line-height: 1.5; margin: 0;">${replyText}</p>
    `;
    
    replyForm.parentNode.insertBefore(replyElement, replyForm);
    replyForm.remove();
    
    showNotification('Reply submitted successfully!', 'success');
}

function cancelReply(button) {
    const replyForm = button.closest('.reply-form');
    replyForm.remove();
}

function loadReviews() {
    updateReviewStats();
}

function updateReviewStats() {
    const totalReviews = reviews.length;
    const avgRating = reviews.length > 0 ? 
        (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : 
        '5.0';
    
    document.getElementById('overallRating').textContent = avgRating;
    document.getElementById('totalReviews').textContent = `(${totalReviews} reviews)`;
}

// ChatBot Setup
function setupChatBot() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatInput || !sendButton || !chatMessages) return;
    
    sendButton.addEventListener('click', sendChatMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
    
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    showTypingIndicator();
    
    // Save chat to potential backend or for analytics
    saveChatMessage(message, 'user');
    
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addChatMessage(response, 'bot');
        saveChatMessage(response, 'bot');
    }, 1500 + Math.random() * 1000);
}

function saveChatMessage(message, sender) {
    // Save to localStorage for now, can be sent to backend later
    const chatHistory = JSON.parse(localStorage.getItem('reeneChatHistory') || '[]');
    chatHistory.push({
        message,
        sender,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 messages
    if (chatHistory.length > 50) {
        chatHistory.splice(0, chatHistory.length - 50);
    }
    
    localStorage.setItem('reeneChatHistory', JSON.stringify(chatHistory));
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${currentTime}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(20px)';
    setTimeout(() => {
        messageElement.style.transition = 'all 0.3s ease';
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }, 100);
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot-message typing-indicator';
    typingIndicator.innerHTML = `
        <div class="message-content">
            <div class="loading"></div>
            <span style="margin-left: 10px;">AI is typing...</span>
        </div>
    `;
    
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateAIResponse(userMessage) {
    const responses = {
        greetings: [
            "Hello! I'm here to help you with your health questions. What would you like to know?",
            "Hi there! How can I assist you with your medical concerns today?",
            "Welcome! I'm ready to help you with health information and guidance."
        ],
        symptoms: [
            "I understand you're experiencing symptoms. While I can provide general information, it's important to consult with a healthcare professional for proper diagnosis and treatment. You can contact REENE Medical at +2348035985883 for an appointment.",
            "Symptoms can vary greatly and have many causes. For accurate diagnosis, I'd recommend scheduling an appointment with our medical team at REENE Medical. We're available 24/7 except Sundays."
        ],
        tests: [
            "REENE Medical offers comprehensive diagnostic testing including blood tests, imaging services, genetic testing, cardiac tests, and much more. What specific test are you interested in learning about?",
            "We provide a wide range of medical tests with state-of-the-art equipment. Our services include complete blood panels, X-rays, ultrasounds, ECGs, and specialized diagnostics. Would you like to schedule a consultation?"
        ],
        emergency: [
            "If this is a medical emergency, please call emergency services immediately or visit the nearest emergency room. For urgent but non-emergency situations, REENE Medical is available 24/7 except Sundays at 50 Nwaziki, Awada Obosi, Onitsha.",
            "For medical emergencies, please seek immediate professional medical attention. Our facility is open 24/7 for emergencies (except Sundays). Contact us at +2348035985883 or +2348035985878."
        ],
        appointments: [
            "To schedule an appointment, please call us at +2348035985883 or +2348035985878, or email us at reenelab@gmail.com. We're here to serve you 24/7 except Sundays.",
            "You can book an appointment by contacting us directly. Our staff will help you schedule the right tests and consultations for your needs. We're located at 50 Nwaziki, Awada Obosi, Onitsha."
        ],
        location: [
            "REENE Medical Diagnostics Center is located at 50 Nwaziki, Awada Obosi, Onitsha, Idemili North. We're easily accessible and have parking available.",
            "You can find us at 50 Nwaziki, Awada Obosi, Onitsha. We're open 24/7 except Sundays. Contact us at +2348035985883 for directions if needed."
        ],
        pricing: [
            "For specific pricing information on our services, please contact us directly at +2348035985883 or +2348035985878. Our staff can provide detailed cost information for any tests you need.",
            "Pricing varies depending on the specific tests required. Please call us at +2348035985883 or email reenelab@gmail.com for a detailed quote based on your needs."
        ],
        general: [
            "That's an interesting question. For specific medical advice and detailed information, I recommend contacting our qualified medical professionals at REENE Medical.",
            "I can offer general health guidance, but for personalized medical advice, please speak with our healthcare providers. You can reach us at +2348035985883.",
            "For the most accurate and personalized information, I suggest consulting with our medical team at REENE Medical. We're available 24/7 except Sundays."
        ]
    };
    
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse(responses.greetings);
    } else if (message.includes('symptom') || message.includes('pain') || message.includes('hurt') || message.includes('sick') || message.includes('feel')) {
        return getRandomResponse(responses.symptoms);
    } else if (message.includes('test') || message.includes('blood') || message.includes('screening') || message.includes('diagnostic') || message.includes('lab')) {
        return getRandomResponse(responses.tests);
    } else if (message.includes('emergency') || message.includes('urgent') || message.includes('help') || message.includes('crisis')) {
        return getRandomResponse(responses.emergency);
    } else if (message.includes('appointment') || message.includes('schedule') || message.includes('book') || message.includes('visit')) {
        return getRandomResponse(responses.appointments);
    } else if (message.includes('location') || message.includes('address') || message.includes('where') || message.includes('direction')) {
        return getRandomResponse(responses.location);
    } else if (message.includes('cost') || message.includes('price') || message.includes('fee') || message.includes('payment') || message.includes('how much')) {
        return getRandomResponse(responses.pricing);
    } else {
        return getRandomResponse(responses.general);
    }
}

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Contact Form Setup
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm();
        });
    }
}

async function submitContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validate form
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    submitBtn.innerHTML = '<div class="loading"></div> Sending...';
    submitBtn.disabled = true;

    try {
        // Submit to Formspree
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            form.reset();
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            
            // Send notification email to REENE Medical
            await sendContactNotificationEmail(formData);
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Sorry, there was an error sending your message. Please try calling us at +2348035985883.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function sendContactNotificationEmail(formData) {
    if (typeof emailjs !== 'undefined' && CONFIG.emailjs.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        try {
            await emailjs.send(
                CONFIG.emailjs.serviceId,
                CONFIG.emailjs.templateId,
                {
                    to_email: 'reenelab@gmail.com',
                    subject: 'New Contact Form Submission - REENE Medical',
                    message: `New Contact Form Submission:

Name: ${formData.get('name')}
Email: ${formData.get('email')}
Phone: ${formData.get('phone') || 'Not provided'}
Service: ${formData.get('service')}
Message: ${formData.get('message')}

Time: ${new Date().toLocaleString()}`
                }
            );
        } catch (error) {
            console.error('Error sending notification email:', error);
        }
    }
}

// Scroll to Top Setup
function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(300px);
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    }
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: auto;">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize smooth scroll for internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.matches('img')) {
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Accessibility: Close mobile menu on ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger.active');
        const navMenu = document.querySelector('.nav-menu.active');
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        const replyForms = document.querySelectorAll('.reply-form');
        replyForms.forEach(form => form.remove());
    }
});

console.log('REENE Medical Diagnostics Center website initialized successfully with full functionality!');