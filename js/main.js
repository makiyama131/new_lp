// =================================================================================
// 
// Merged and Enhanced JavaScript for Dynamic Web Experiences
//
// =================================================================================

// --- Utility Functions ---

/**
 * Debounces a function to limit the rate at which it gets called.
 * @param {Function} func The function to debounce.
 * @param {number} wait The delay in milliseconds.
 * @returns {Function} The debounced function.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validates an email address format.
 * @param {string} email The email to validate.
 * @returns {boolean} True if the email is valid.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// --- Core Feature Initializations ---

/**
 * Enhanced Weather-based Dynamic Theming
 * Applies theme changes based on time of day.
 */
function initWeatherTheming() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            const hour = new Date().getHours();
            if (hour >= 18 || hour <= 6) { // Evening/night mode
                document.documentElement.style.setProperty('--accent-yellow', '#ffcc00');
                document.documentElement.style.setProperty('--bg-light', '#f0f0f0');
            }
        });
    }
}

/**
 * Enhanced Scroll-based Micro Interactions
 * Manages a scroll progress bar and dynamic header opacity.
 */
function initScrollMicroInteractions() {
    const scrollProgress = document.createElement('div');
    scrollProgress.id = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    let ticking = false;
    window.addEventListener('scroll', debounce(() => {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
        
        // Dynamic header background opacity
        const header = document.getElementById('header');
        if (header) {
            const opacity = Math.min(scrollTop / 200, 0.95);
            header.style.background = `rgba(255, 255, 255, ${opacity})`;
            
            // Scrolled class for header
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Fixed Footer CTA logic
        const fixedFooterCTA = document.getElementById('fixedFooterCTA');
        const contactSection = document.getElementById('contact');
        if (fixedFooterCTA && contactSection) {
            const contactRect = contactSection.getBoundingClientRect();
            if (contactRect.top > window.innerHeight && window.scrollY > 500) {
                fixedFooterCTA.classList.add('visible');
            } else {
                fixedFooterCTA.classList.remove('visible');
            }
        }
    }, 10));
}

/**
 * Enhanced Text Highlighting Animation
 * Animates highlighting for specific keywords when they scroll into view.
 */
function initTextHighlighting() {
    const highlightWords = ['採用', 'ドライバー', '不足', '解決', '定着率', '満足度'];
    
    function highlightText(element) {
        let html = element.innerHTML;
        highlightWords.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            html = html.replace(regex, `<span class="highlight-word">$1</span>`);
        });
        element.innerHTML = html;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => highlightText(entry.target), 500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });
    
    document.querySelectorAll('.hero-tagline, .section-title, .feature-title').forEach(el => observer.observe(el));
}

/**
 * Enhanced Voice Recognition for Accessibility
 * Enables voice commands for site navigation.
 */
function initVoiceCommands() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'ja-JP';
    
    const voiceButton = document.createElement('button');
    voiceButton.innerHTML = '🎤';
    voiceButton.id = 'voice-command-button';
    document.body.appendChild(voiceButton);

    voiceButton.addEventListener('click', () => {
        recognition.start();
        voiceButton.style.animation = 'pulse 1s infinite';
    });
    
    recognition.onresult = function(event) {
        const command = event.results[0][0].transcript.toLowerCase();
        
        if (command.includes('お問い合わせ') || command.includes('連絡')) {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        } else if (command.includes('資料') || command.includes('ダウンロード')) {
            downloadDocument();
        } else if (command.includes('質問') || command.includes('faq')) {
            document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
        }
        
        voiceButton.style.animation = '';
    };
    
    recognition.onerror = () => voiceButton.style.animation = '';
}

/**
 * Enhanced Dark Mode Toggle
 * Allows users to toggle between light and dark themes, saving their preference.
 */
function initDarkModeToggle() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.id = 'dark-mode-toggle';
    
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    function toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark-mode');
        darkModeToggle.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark.toString());
    }
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️';
    }
    
    darkModeToggle.addEventListener('click', toggleDarkMode);
    document.body.appendChild(darkModeToggle);
}



/**
 * Enhanced Exit Intent Detection
 * Shows a popup when the user's mouse leaves the viewport at the top.
 */
function initExitIntentDetection() {
    let exitIntentShown = false;
    
    function showExitIntentPopup() {
        const popup = document.createElement('div');
        popup.id = 'exit-intent-popup';
        popup.innerHTML = `
            <div class="exit-popup-overlay">
                <div class="exit-popup-content">
                    <button class="exit-popup-close" id="exitPopupClose">×</button>
                    <h3>お待ちください！</h3>
                    <p>ドライバー採用の<strong>無料相談</strong>はいかがですか？</p>
                    <div class="exit-popup-buttons">
                        <button class="exit-popup-btn primary" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'}); this.closest('#exit-intent-popup').remove();">無料相談を申し込む</button>
                        <button class="exit-popup-btn secondary" onclick="downloadDocument(); this.closest('#exit-intent-popup').remove();">資料をダウンロード</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(popup);
        
        const closePopup = () => popup.remove();
        popup.querySelector('#exitPopupClose').addEventListener('click', closePopup);
        popup.querySelector('.exit-popup-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) closePopup();
        });
        
        setTimeout(closePopup, 10000);
    }
    
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            showExitIntentPopup();
        }
    });
}

/**
 * Enhanced A/B Testing Framework
 * Modifies content for different user groups to test effectiveness.
 */
function initABTesting() {
    const userId = localStorage.getItem('userId') || 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
    
    const variant = userId.charCodeAt(0) % 2 === 0 ? 'A' : 'B';
    
    // Test 1: CTA Text and Hero Subtitle
    if (variant === 'B') {
        document.querySelectorAll('.cta-button').forEach(button => {
            if (button.textContent.includes('無料で相談')) {
                button.textContent = '今すぐ相談する（無料）';
            }
        });
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            heroSubtitle.textContent = 'AI技術と業界専門知識を組み合わせた次世代採用システムで、ドライバー不足を根本から解決します。';
        }
    }
    
    // Test 2: Hero Headline
    const headlineTest = {
        element: document.querySelector('.hero-headline'),
        variations: [
            '軽貨物ドライバーの採用、もう悩みません。',
            '応募が殺到する、軽貨物ドライバー採用の秘訣。'
        ]
    };
    if (headlineTest.element) {
        headlineTest.element.textContent = headlineTest.variations[variant === 'A' ? 0 : 1];
    }
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'ab_test_variant', { 'custom_parameter': variant });
    }
}

/**
 * Enhanced Mobile Menu Toggle with Animations
 * Manages the mobile navigation menu display and interactions.
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        const toggleMenu = (open) => {
            navMenu.classList.toggle('active', open);
            mobileMenuToggle.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };

        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(!navMenu.classList.contains('active'));
        });

        document.addEventListener('click', (event) => {
            if (navMenu.classList.contains('active') && !mobileMenuToggle.contains(event.target) && !navMenu.contains(event.target)) {
                toggleMenu(false);
            }
        });
    }
}

/**
 * Enhanced Smooth Scrolling with Easing
 * Provides a smooth scroll effect for anchor links.
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                if (navMenu?.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.getElementById('mobileMenuToggle')?.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

/**
 * Enhanced Case Study Slider with Custom Animations
 * Initializes a Slick slider for case studies if jQuery is present.
 */
function initCaseStudySlider() {
    if (typeof jQuery === 'undefined' || !jQuery('.case-study-slider').length) return;

    jQuery('.case-study-slider').slick({
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 8000,
        fade: true,
        cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
        prevArrow: '<button type="button" class="slick-prev">←</button>',
        nextArrow: '<button type="button" class="slick-next">→</button>',
        responsive: [{ breakpoint: 768, settings: { arrows: false, fade: false, speed: 600 } }]
    });

    jQuery('.case-study-slider').on('beforeChange', (event, slick, currentSlide) => {
        jQuery(slick.$slides[currentSlide]).addClass('slide-out');
    });

    jQuery('.case-study-slider').on('afterChange', (event, slick, currentSlide) => {
        jQuery(slick.$slides).removeClass('slide-out slide-in');
        jQuery(slick.$slides[currentSlide]).addClass('slide-in');
    });
}

/**
 * Enhanced FAQ Accordion with Smooth Animations
 * Creates an animated accordion for the FAQ section.
 */
function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // いったん全てのアクティブクラスを削除
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
            });
            
            // クリックされたものがアクティブでなかった場合、アクティブクラスを付与
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

/**
 * Enhanced Case Study Details Toggle with Animation
 * A globally available function to toggle visibility of details sections.
 */
function toggleDetails(button) {
    const details = button.nextElementSibling;
    const isExpanded = details.classList.toggle('expanded');
    button.textContent = isExpanded ? '詳細を閉じる' : '詳細を見る';
    
    if (isExpanded) {
        details.style.maxHeight = details.scrollHeight + 'px';
        setTimeout(() => {
            if (details.classList.contains('expanded')) {
                details.style.maxHeight = 'none';
            }
        }, 600);
    } else {
        details.style.maxHeight = details.scrollHeight + 'px';
        setTimeout(() => details.style.maxHeight = '0', 10);
    }
}

/**
 * Enhanced Form Submission and Validation with Loading States
 * Manages form validation, animations, and submission simulation.
 */
function initEnhancedForms() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    function validateField(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error', 'success');
        let isValid = true;

        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            isValid = false;
        }

        formGroup.classList.add(isValid ? 'success' : 'error');
        if (!isValid) {
            input.style.animation = 'errorShake 0.6s ease';
        }
        return isValid;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isFormValid = false;
        });

        if (isFormValid) {
            const submitButton = document.getElementById('submitButton');
            submitButton.innerHTML = '<span class="loading-spinner"></span> 送信中...';
            submitButton.disabled = true;
            form.style.opacity = '0.7';

            setTimeout(() => {
                submitButton.innerHTML = '✓ 送信完了';
                submitButton.style.background = '#28a745';
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', { event_category: 'form', event_label: 'contact_form' });
                }
                setTimeout(() => window.location.href = '/thank-you/', 1500);
            }, 2500);
        }
    });

    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
             input.parentElement.classList.remove('error');
        });
    });
}

/**
 * Enhanced Document Download Function with Animation
 * A global function to simulate a document download with user feedback.
 */
function downloadDocument() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', { event_category: 'engagement', event_label: 'company_brochure' });
    }
    
    const notification = document.createElement('div');
    notification.id = 'download-notification';
    notification.innerHTML = `<div>📄</div> 資料をダウンロードしています...`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
    // window.open('/path/to/document.pdf', '_blank');
}

/**
 * Enhanced Intersection Observer for Advanced Animations
 * Applies reveal animations and counter effects to elements as they enter the viewport.
 */
function initScrollReveal() {
    const animateCounter = (element) => {
        const target = parseInt(element.dataset.target, 10);
        if (isNaN(target)) return;
        element.textContent = '0';
        const duration = 2000;
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            element.textContent = Math.floor(progress * target) + (element.dataset.suffix || '');
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                const counter = entry.target.querySelector('.achievement-number');
                if (counter) animateCounter(counter);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '-10% 0px -10% 0px' });

    document.querySelectorAll('.feature-card, .problem-card, .achievement-item, .faq-item, .client-logo').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

/**
 * Enhanced Back to Top Button
 * Shows a button to scroll to the top of the page when the user scrolls down.
 */
function initBackToTopButton() {
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Injects all necessary CSS styles into the document head.
 */
function injectGlobalStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        /* Scroll Progress */
        #scroll-progress { position: fixed; top: 0; left: 0; width: 0%; height: 3px; background: linear-gradient(90deg, #ffd700, #ffb800); z-index: 10001; transition: width 0.1s ease; }

        /* Voice Command Button */
        #voice-command-button { position: fixed; bottom: 100px; right: 20px; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(45deg, #ffd700, #ffb800); border: none; font-size: 1.5rem; cursor: pointer; z-index: 10000; box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3); transition: all 0.3s ease; }
        @keyframes pulse { 50% { transform: scale(1.1); } }

        /* Dark Mode */
        #dark-mode-toggle { position: fixed; top: 100px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: rgba(255, 255, 255, 0.9); border: 2px solid #ffd700; font-size: 1.2rem; cursor: pointer; z-index: 10000; transition: all 0.3s ease; }
        body.dark-mode { --bg-white: #1a1a1a; --bg-light: #2a2a2a; --text-dark: #ffffff; --text-light: #cccccc; --border-light: #444444; }
        body.dark-mode .hero, body.dark-mode .solution, body.dark-mode .contact { background: linear-gradient(135deg, #0a0a1e 0%, #06112e 100%); }

        /* Chat Widget */
        #chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 10000; }
        .chat-toggle { background: linear-gradient(45deg, #ffd700, #ffb800); color: #1a1a2e; padding: 15px 20px; border-radius: 25px; cursor: pointer; box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3); display: flex; align-items: center; gap: 10px; animation: chatPulse 2s ease-in-out infinite; }
        .chat-window { position: absolute; bottom: 70px; right: 0; width: 350px; height: 450px; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: none; flex-direction: column; animation: chatSlideUp 0.3s ease; }
        .chat-window.active { display: flex; }
        .chat-header { background: linear-gradient(45deg, #1a1a2e, #16213e); color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        .chat-messages { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
        .chat-message { padding: 10px 15px; border-radius: 15px; max-width: 80%; animation: messageSlideIn 0.3s ease; }
        .chat-message.bot { background: #f0f0f0; align-self: flex-start; }
        .chat-message.user { background: linear-gradient(45deg, #ffd700, #ffb800); color: #1a1a2e; align-self: flex-end; }
        .chat-input-container { padding: 15px; display: flex; gap: 10px; border-top: 1px solid #eee; }
        #chatInput { flex: 1; padding: 10px 15px; border: 2px solid #eee; border-radius: 20px; outline: none; }
        #chatSend { padding: 10px 20px; background: #ffd700; border: none; border-radius: 20px; cursor: pointer; font-weight: 600; }
        @keyframes chatPulse { 50% { transform: scale(1.05); } }
        @keyframes chatSlideUp { from { transform: translateY(20px); opacity: 0; } }
        @keyframes messageSlideIn { from { transform: translateX(-20px); opacity: 0; } }

        /* Exit Intent Popup */
        #exit-intent-popup { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10001; animation: exitPopupFadeIn 0.3s ease; }
        .exit-popup-overlay { width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; }
        .exit-popup-content { background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 500px; position: relative; animation: exitPopupSlideUp 0.4s ease; }
        .exit-popup-close { position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        @keyframes exitPopupFadeIn { from { opacity: 0; } }
        @keyframes exitPopupSlideUp { from { transform: translateY(50px); opacity: 0; } }
        
        /* Form Enhancements */
        .form-group.error input, .form-group.error textarea { border-color: #dc3545; }
        .form-group.success input, .form-group.success textarea { border-color: #28a745; }
        @keyframes errorShake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        .loading-spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Download Notification */
        #download-notification { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(45deg, #ffd700, #ffb800); color: #1a1a2e; padding: 20px 30px; border-radius: 15px; box-shadow: 0 15px 35px rgba(255, 215, 0, 0.3); z-index: 10000; text-align: center; font-weight: 600; animation: downloadNotification 3s ease; }
        @keyframes downloadNotification { 0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); } 15%, 85% { opacity: 1; transform: translate(-50%, -50%) scale(1); } }

        /* Scroll Reveal */
        .scroll-reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .scroll-reveal.revealed { opacity: 1; transform: translateY(0); }

        /* Back to Top Button */
        #back-to-top { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; background-color: rgba(255, 215, 0, 0.8); color: #1a1a2e; border: none; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 9999; opacity: 0; visibility: hidden; transform: translateY(20px); transition: all 0.3s ease; }
        #back-to-top.visible { opacity: 1; visibility: visible; transform: translateY(0); }
    `;
    document.head.appendChild(styles);
}


// --- Main Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Inject all CSS first
    injectGlobalStyles();
    
    // Initialize UI and Animation Features
    initWeatherTheming();
    initScrollMicroInteractions();
    initTextHighlighting();
    initDarkModeToggle();
    initChatWidget();
    initExitIntentDetection();
    initMobileMenu();
    initSmoothScrolling();
    initCaseStudySlider();
    initFaqAccordion();
    initEnhancedForms();
    initScrollReveal();
    initBackToTopButton();
    
    // Initialize Accessibility and Advanced Features
    initVoiceCommands();
    initABTesting();
    
    // Final log message
    console.log('🎯 All enhanced features loaded successfully!');
});


// --- Expose Global Functions for Inline HTML Usage ---

window.toggleDetails = toggleDetails;
window.downloadDocument = downloadDocument;
// For WordPress integration if needed
window.initWeatherTheming = initWeatherTheming;
window.initChatWidget = initChatWidget;
window.initDarkModeToggle = initDarkModeToggle;