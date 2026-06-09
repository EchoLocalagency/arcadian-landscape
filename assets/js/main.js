/**
 * Arcadian Landscape - Main JavaScript
 * Premium Landscaping & Outdoor Living
 */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    const handleNavbarScroll = () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // ============================================
    // MOBILE NAVIGATION (slide-in drawer)
    // ============================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const navOverlay = document.querySelector('.nav-mobile__overlay');

    const closeNav = () => {
        if (!navToggle || !navMobile) return;
        navToggle.classList.remove('active');
        navMobile.classList.remove('open');
        if (navOverlay) navOverlay.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    if (navToggle && navMobile) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMobile.classList.contains('open');
            if (isOpen) {
                closeNav();
            } else {
                navToggle.classList.add('active');
                navMobile.classList.add('open');
                if (navOverlay) navOverlay.classList.add('open');
                navToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close on overlay click
        if (navOverlay) {
            navOverlay.addEventListener('click', closeNav);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMobile.classList.contains('open')) closeNav();
        });

        // Accordion toggles for sub-menus (Services, Areas)
        navMobile.querySelectorAll('.nav-mobile__link').forEach(link => {
            const sub = link.nextElementSibling;
            if (sub && sub.classList.contains('nav-mobile__sub')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isOpen = sub.classList.contains('open');

                    // Close all subs first
                    navMobile.querySelectorAll('.nav-mobile__sub').forEach(s => s.classList.remove('open'));

                    if (!isOpen) {
                        sub.classList.add('open');
                    }
                });
            }
        });
    }

    // ============================================
    // DESKTOP DROPDOWN TOGGLES
    // ============================================
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(d => {
                d.classList.remove('open');
                const t = d.querySelector(':scope > a');
                if (t) t.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // ============================================
    // GALLERY CATEGORY FILTERS
    // ============================================
    const filterBtns = document.querySelectorAll('.gallery-filter__btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length && galleryItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ============================================
    // GALLERY LIGHTBOX
    // ============================================
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox__img');
    const lightboxClose = document.querySelector('.lightbox__close');
    const lightboxPrev = document.querySelector('.lightbox__prev');
    const lightboxNext = document.querySelector('.lightbox__next');
    let currentLightboxIndex = 0;
    let lightboxImages = [];
    let touchStartX = 0;

    if (lightbox && lightboxImg) {
        // Open lightbox on gallery item click
        document.querySelectorAll('.gallery-item[data-lightbox]').forEach(item => {
            item.addEventListener('click', () => {
                lightboxImages = Array.from(
                    document.querySelectorAll('.gallery-item[data-lightbox]:not(.hidden)')
                );
                currentLightboxIndex = lightboxImages.indexOf(item);
                const img = item.querySelector('img');
                if (!img) return;
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const showLightboxImage = (direction) => {
            if (!lightboxImages.length) return;
            currentLightboxIndex = (currentLightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
            const img = lightboxImages[currentLightboxIndex].querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
            }
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxImage(-1));
        if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxImage(1));

        // Close on overlay click (not on image)
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard: Escape, Left, Right arrows
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showLightboxImage(-1);
            if (e.key === 'ArrowRight') showLightboxImage(1);
        });

        // Touch swipe support
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            const swipeDistance = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(swipeDistance) > 50) {
                showLightboxImage(swipeDistance > 0 ? 1 : -1);
            }
        }, { passive: true });
    }

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            const faqGroup = item.closest('.faq-list, .faq-group, .faq-container') || item.parentElement;

            // Close all other items in the same group (one open at a time)
            if (faqGroup) {
                faqGroup.querySelectorAll('.faq-item').forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherAnswer = other.querySelector('.faq-answer');
                        const otherQuestion = other.querySelector('.faq-question');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });
            }

            // Toggle clicked item with max-height slide animation
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                question.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ============================================
    // BEFORE/AFTER IMAGE SLIDER
    // ============================================
    document.querySelectorAll('.before-after').forEach(slider => {
        const overlay = slider.querySelector('.before-after__overlay');
        const handle = slider.querySelector('.before-after__handle');
        if (!overlay || !handle) return;

        let isDragging = false;

        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let percent = ((x - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
            overlay.style.width = percent + '%';
            handle.style.left = percent + '%';
        };

        const startDrag = (e) => { isDragging = true; e.preventDefault(); };
        const doDrag = (e) => {
            if (!isDragging) return;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(x);
        };
        const endDrag = () => { isDragging = false; };

        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag, { passive: false });

        slider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        }, { passive: false });

        window.addEventListener('mousemove', doDrag);
        window.addEventListener('touchmove', doDrag, { passive: false });
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
    });

    // ============================================
    // FADE-IN ON SCROLL (IntersectionObserver)
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fadeElements = document.querySelectorAll('.fade-in');

    if (prefersReducedMotion.matches) {
        // Reduced motion -- skip animations, show everything immediately
        fadeElements.forEach(el => el.classList.add('visible'));
    } else {
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.1 });

        fadeElements.forEach(el => fadeObserver.observe(el));
    }

    // ============================================
    // FORM VALIDATION (Netlify Forms)
    // ============================================
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        let isSubmitting = false;
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Clear inline errors as user types
        contactForm.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', function () {
                this.classList.remove('error');
                this.setAttribute('aria-invalid', 'false');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        });

        // SPAM FILTER — kills SEO/web-design solicitation + review-buying submissions
        // Patterns derived from real Arcadian/Mr Green spam submissions
        const SPAM_PATTERNS = [
            // SEO/marketing agency pitches
            /\bseo\s+(services?|expert|agency|company|specialist|consultant|professional|firm)\b/i,
            /\b(white[\s-]?label|guest[\s-]?post|guest[\s-]?blogging|link[\s-]?building|backlinks?)\b/i,
            /\b(domain\s+authority|da\s+score|page\s+rank|first\s+page\s+of\s+google)\b/i,
            /\b(rank\s+(?:your|higher)|improve\s+your\s+ranking|increase\s+your\s+(?:traffic|leads|sales|ratings?))\b/i,
            /\b(optimize\s+(?:its|your|the)\s+ranking|optimize\s+(?:its|your|the)\s+seo)\b/i,
            /\b(digital\s+marketing\s+(?:agency|services?|expert|consultant)|outreach\s+(?:services?|campaign))\b/i,
            /\b(lead\s+generation\s+(?:services?|company|agency)|high[\s-]?quality\s+leads)\b/i,
            /\b(promote\s+your\s+(?:business|brand|website|company)|grow\s+your\s+(?:business|traffic|reach))\b/i,
            // Web design / web dev pitches
            /\b(web\s+(?:design|development)\s+(?:services?|company|agency|expert)|wordpress\s+(?:developer|expert))\b/i,
            /\b(mobile\s+app\s+(?:development|developer)|ui\/ux\s+(?:designer|services?))\b/i,
            /\b(audit\s+report|design[\s-]related\s+(?:issues?|problems?|errors?)|website['']?s?\s+(?:performance|design|ranking|seo|conversion|traffic))\b/i,
            /\b(proposal\s+(?:and|&)\s+pricing|detailed\s+(?:audit|proposal|report))\b/i,
            /\b(send\s+(?:you\s+)?a?\s*screenshot|send\s+(?:you\s+)?a?\s*proposal)\b/i,
            // Review-buying spam (real Bangladeshi pattern hit Arcadian 2026-06-09)
            /\b(google|yelp|facebook|trustpilot|trustpaylot|bbb|houzz|tripadvisor|sitejabber|bark|qualibox|buildzoom|eldo|poch)\s+reviews?\b/i,
            /\b(negative\s+review\s+removal|review\s+removal\s+service|fake\s+reviews?)\b/i,
            /\b(high[\s-]?resolution\s+reviews?|verified\s+reviews?|5[\s-]?star\s+reviews?)\b/i,
            // Cold-email openers
            /\b(i\s+came\s+across\s+your|i\s+noticed\s+(?:your|a\s+few)|i\s+was\s+looking\s+at\s+your|i\s+stumbled\s+upon)\b/i,
            /\b(i\s+(?:am\s+)?reaching\s+out|we\s+(?:are|came\s+across)\s+your\s+website|hello\s+business\s+owner)\b/i,
            /\b(i\s+am\s+here\s+to\s+(?:promote|help|offer|introduce))\b/i,
            // Off-platform contact requests
            /\b(whats?app|telegram|skype|wechat|viber)[\s:.+]+(\+?\d|@)/i,
            /\b(\+?880|\+?91|\+?92|\+?234)[\s\-.]\d/,  // BD/IN/PK/NG country codes
            // Crypto / wallet / NFT spam
            /\b(crypto|bitcoin|ethereum|nft|wallet\s+address|metamask|trustwallet)\b/i,
            // Loan / cash advance spam
            /\b(payday\s+loan|business\s+loan\s+(?:offer|approval)|merchant\s+cash\s+advance)\b/i,
            // Bot signature: bot greeting using the literal site domain
            /\bhello\s+\S+\.com\b/i,
        ];

        function isSpam(form) {
            const fieldsToCheck = ['name', 'message', 'subject', 'email', 'company'];
            const combined = fieldsToCheck
                .map(n => (form.querySelector('[name="' + n + '"]') || {}).value || '')
                .join(' ');
            if (!combined.trim()) return false;
            // Pattern match
            for (const re of SPAM_PATTERNS) {
                if (re.test(combined)) return true;
            }
            // Excessive URLs in message body (real customers rarely include >1 URL)
            const message = (form.querySelector('[name="message"]') || {}).value || '';
            const urlCount = (message.match(/https?:\/\//gi) || []).length;
            if (urlCount >= 2) return true;
            // URL embedded in name field — classic bot signature
            const name = (form.querySelector('[name="name"]') || {}).value || '';
            if (/https?:\/\//i.test(name)) return true;
            // Name with marketing suffix ("Mkt", "SEO", "Digital", etc) — bot signature
            if (/\b(mkt|seo|digital|agency|marketing|outreach)\b/i.test(name) && name.length < 30) return true;
            // Palindrome / repeating-digit phone numbers (e.g. 2102102101)
            const phoneField = form.querySelector('[name="phone"]');
            if (phoneField && phoneField.value) {
                const digits = phoneField.value.replace(/\D/g, '');
                if (digits.length >= 10 && /^(\d{3})\1\1/.test(digits)) return true;
            }
            // Emoji density check — real customer messages have 0 emojis
            const emojiCount = (message.match(/[\u{1F300}-\u{1FAFF}☀-➿\u{1F900}-\u{1F9FF}]/gu) || []).length;
            if (emojiCount >= 3) return true;
            return false;
        }

        contactForm.addEventListener('submit', (e) => {
            if (isSubmitting) { e.preventDefault(); return; }

            // Spam pre-check — fake success so bots move on, log silently
            if (isSpam(contactForm)) {
                e.preventDefault();
                try { console.warn('[spam-filter] submission blocked'); } catch (_) {}
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }
                // Mimic real success after a short delay so the bot moves on
                setTimeout(() => {
                    window.location.href = '/';
                }, 1200);
                return;
            }

            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                field.classList.remove('error');
                const existing = field.parentElement.querySelector('.error-message');
                if (existing) existing.remove();

                const value = field.value.trim();
                let fieldValid = true;

                if (!value) fieldValid = false;
                if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fieldValid = false;
                if (field.type === 'tel' && value && value.replace(/\D/g, '').length < 10) fieldValid = false;

                if (!fieldValid) {
                    isValid = false;
                    field.classList.add('error');
                    field.setAttribute('aria-invalid', 'true');
                    const errorEl = document.createElement('span');
                    errorEl.className = 'error-message';
                    errorEl.textContent = getErrorMessage(field);
                    field.parentElement.appendChild(errorEl);
                }
            });

            if (!isValid) {
                e.preventDefault();
                const firstError = contactForm.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }

            // Disable button to prevent double-submit
            isSubmitting = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
        });
    }

    /**
     * Returns a user-friendly error message based on field type and state
     */
    function getErrorMessage(field) {
        const name = field.getAttribute('name') || field.getAttribute('placeholder') || 'This field';
        if (!field.value.trim()) return name.charAt(0).toUpperCase() + name.slice(1) + ' is required.';
        if (field.type === 'email') return 'Please enter a valid email address.';
        if (field.type === 'tel') return 'Please enter a valid phone number.';
        return 'Please check this field.';
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });

    // ============================================
    // PHONE NUMBER FORMATTING
    // ============================================
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6, 10);
            } else if (value.length >= 3) {
                value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
            }
            this.value = value;
        });
    });

    // ============================================
    // CONSOLE BRANDING
    // ============================================
    console.log(
        '%c Arcadian Landscape ',
        'background: #2C5530; color: #F5F0E8; font-size: 24px; font-weight: bold; padding: 10px 20px;'
    );
    console.log(
        '%c Premium Landscaping & Outdoor Living ',
        'color: #4A7C59; font-size: 12px;'
    );
});
