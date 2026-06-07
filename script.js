document.addEventListener("DOMContentLoaded", () => {

    // -------- SAFE GET FUNCTION --------
    const $ = (id) => document.getElementById(id);

    // -------- THEME TOGGLE --------
    const html = document.documentElement;
    const themeBtn = $('theme-toggle');
    let isDark = true;

    const savedTheme = localStorage.getItem('roadmap-theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        isDark = savedTheme === 'dark';
        if (themeBtn) themeBtn.textContent = isDark ? '🌙' : '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            isDark = !isDark;
            html.setAttribute('data-theme', isDark ? 'dark' : 'light');
            themeBtn.textContent = isDark ? '🌙' : '☀️';
            localStorage.setItem('roadmap-theme', isDark ? 'dark' : 'light');
        });
    }

    // -------- HAMBURGER --------
    const hamburger = $('hamburger');
    const navLinks = $('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // -------- SCROLL PROGRESS --------
    const progressBar = $('progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct = (scrollTop / docHeight) * 100;
            progressBar.style.width = Math.min(pct, 100) + '%';
        });
    }

    // -------- HERO STATS COUNTER (smooth) --------
    const statEls = document.querySelectorAll('.hero-stat-num');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        statEls.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (isNaN(target)) return;
            let current = 0;
            const step = Math.max(1, Math.floor(target / 60));
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                el.textContent = current;
            }, 25);
        });
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.querySelector('#hero');
    if (heroSection) heroObserver.observe(heroSection);

    setTimeout(() => {
        if (!statsAnimated) animateStats();
    }, 3000);

    // -------- FADE IN (phase cards + project cards) --------
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.phase-card, .project-card').forEach((el, i) => {
        el.style.transitionDelay = (i % 4 * 0.08) + 's';
        observer.observe(el);
    });

    // -------- PROJECTS (10 projects) --------
    const projects = [
        { icon: '🛒', title: 'E-Commerce Backend', desc: 'Full-featured commerce system with carts, orders, payments, and user management.', tag: 'Spring Boot' },
        { icon: '💬', title: 'Real-Time Chat Application', desc: 'Live messaging with WebSocket, rooms, and message history.', tag: 'WebSocket' },
        { icon: '🏦', title: 'Banking System API', desc: 'Secure banking operations: accounts, transfers, transactions, and statements.', tag: 'Spring Security' },
        { icon: '📋', title: 'Task Management System', desc: 'Kanban-style task manager with boards, lists, cards, and team assignments.', tag: 'JPA' },
        { icon: '🎓', title: 'Learning Management System (LMS)', desc: 'Course enrollment, progress tracking, quizzes, and certificate generation.', tag: 'Microservices' },
        { icon: '💼', title: 'Job Portal Backend', desc: 'Job posting, applications, search filters, and recruiter dashboards.', tag: 'REST APIs' },
        { icon: '📦', title: 'Inventory Management System', desc: 'Stock tracking, supplier management, orders, and real-time alerts.', tag: 'Spring Boot' },
        { icon: '🤖', title: 'AI Resume Analyzer', desc: 'Resume parsing, skill extraction, and job match scoring using OpenAI API.', tag: 'AI + Java' },
        { icon: '📄', title: 'AI PDF Chat (RAG)', desc: 'Chat with PDF documents using RAG and vector embeddings.', tag: 'LangChain' },
        { icon: '🍕', title: 'Food Delivery Backend', desc: 'Restaurant menus, order placement, real-time tracking, and delivery management.', tag: 'Microservices' }
    ];

    const grid = $('projects-grid');
    if (grid) {
        projects.forEach((p, idx) => {
            const div = document.createElement('div');
            div.className = 'project-card';
            div.style.transitionDelay = (idx % 5 * 0.06) + 's';
            div.innerHTML = `
                <span class="project-icon">${p.icon}</span>
                <div class="project-tag">${p.tag}</div>
                <div class="project-title">${p.title}</div>
                <div class="project-desc">${p.desc}</div>
            `;
            grid.appendChild(div);
            observer.observe(div);
        });
    }

    // -------- CHECKLIST (5 items) --------
    const checkItems = [
        { id: 'c1', label: 'Build 3–5 impressive projects' },
        { id: 'c2', label: 'Keep your GitHub active with green squares' },
        { id: 'c3', label: 'Create a professional portfolio website' },
        { id: 'c4', label: 'Practice DSA regularly (200–300 problems)' },
        { id: 'c5', label: 'Apply to jobs and internships consistently' }
    ];

    const checklistEl = $('checklist-items');
    const saved = JSON.parse(localStorage.getItem('roadmap-checklist') || '{}');

    if (checklistEl) {
        checkItems.forEach(item => {
            const done = !!saved[item.id];
            const div = document.createElement('div');
            div.className = 'check-item' + (done ? ' done' : '');
            div.innerHTML = `
                <div class="check-box">${done ? '✓' : ''}</div>
                <span class="check-label">${item.label}</span>
            `;

            div.addEventListener('click', () => {
                const isNowDone = !div.classList.contains('done');
                div.classList.toggle('done', isNowDone);
                div.querySelector('.check-box').textContent = isNowDone ? '✓' : '';
                saved[item.id] = isNowDone;
                localStorage.setItem('roadmap-checklist', JSON.stringify(saved));
                updateRing();
            });

            checklistEl.appendChild(div);
        });
    }

    // -------- RING PROGRESS --------
    function updateRing() {
        const circle = $('ring-circle');
        const num = $('ring-num');
        const label = $('ring-label');

        if (!circle || !num) return;

        const total = checkItems.length;
        const done = Object.values(saved).filter(Boolean).length;
        const pct = Math.round((done / total) * 100);

        const circumference = 238.76;
        circle.style.strokeDashoffset = circumference - (pct / 100) * circumference;
        num.textContent = pct + '%';

        if (label) {
            if (pct === 100) {
                label.innerHTML = '🎉 You\'re ready! Start applying now.';
            } else if (pct >= 60) {
                label.innerHTML = '🔥 Almost there! Keep pushing.';
            } else if (pct >= 30) {
                label.innerHTML = '💪 Great progress! Stay consistent.';
            } else {
                label.innerHTML = '🚀 Keep going! Every step counts.';
            }
        }
    }

    updateRing();

    // -------- SMOOTH SCROLL FOR NAV LINKS --------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // -------- KEYBOARD NAV: ESC to close mobile menu --------
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks) {
            navLinks.classList.remove('open');
        }
    });

    // -------- RESIZE HANDLER: close mobile menu on resize to desktop --------
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks) {
            navLinks.classList.remove('open');
        }
    });

    console.log('🚀 Roadmap ready — stay consistent!');
});