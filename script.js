// ============================================================
// 1. Particle background (dynamic, lightweight)
// ============================================================
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const PARTICLE_COUNT = 70;
    const CONNECTION_DIST = 130;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = 1.6 + Math.random() * 1.8;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const alpha = 1 - dist / CONNECTION_DIST;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.20})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
            p.update();
            p.draw();
        }
        drawLines();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        for (const p of particles) {
            p.x = Math.min(Math.max(p.x, 0), width);
            p.y = Math.min(Math.max(p.y, 0), height);
        }
    });

    init();
    animate();
})();

// ============================================================
// 2. Header scroll shadow
// ============================================================
(function headerShadow() {
    const header = document.getElementById('header');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 20) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
})();

// ============================================================
// 3. Animated statistic counters (triggered on scroll)
// ============================================================
(function animateCounters() {
    const targets = [
        { el: document.getElementById('stat-users'), target: 28470, suffix: '+' },
        { el: document.getElementById('stat-projects'), target: 19340, suffix: '+' },
        { el: document.getElementById('stat-uptime'), target: 99.9, suffix: '%', decimals: 1 },
        { el: document.getElementById('stat-ai'), target: 1250000, suffix: '+' }
    ];

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const statEl = entry.target;
                const data = targets.find(t => t.el === statEl);
                if (data && !statEl.dataset.counted) {
                    statEl.dataset.counted = 'true';
                    let start = 0;
                    const duration = 1800;
                    const stepTime = 16;
                    const totalSteps = duration / stepTime;
                    let currentStep = 0;

                    const interval = setInterval(() => {
                        currentStep++;
                        const progress = Math.min(currentStep / totalSteps, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        let value = start + (data.target - start) * eased;
                        if (data.decimals !== undefined) {
                            value = value.toFixed(data.decimals);
                        } else {
                            value = Math.floor(value);
                        }
                        statEl.textContent = value + (data.suffix || '');
                        if (progress >= 1) {
                            clearInterval(interval);
                            let finalVal = data.target;
                            if (data.decimals !== undefined) {
                                finalVal = finalVal.toFixed(data.decimals);
                            } else {
                                finalVal = Math.floor(finalVal);
                            }
                            statEl.textContent = finalVal + (data.suffix || '');
                        }
                    }, stepTime);
                }
                observer.unobserve(statEl);
            }
        }
    }, { threshold: 0.4 });

    for (const t of targets) {
        if (t.el) observer.observe(t.el);
    }
})();

// ============================================================
// 4. Mobile hamburger menu
// ============================================================
document.querySelector('.hamburger')?.addEventListener('click', function() {
    const links = document.querySelector('.nav-links');
    if (links) {
        links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
        links.style.flexDirection = 'column';
        links.style.position = 'absolute';
        links.style.top = '72px';
        links.style.left = '0';
        links.style.width = '100%';
        links.style.background = 'rgba(255,255,255,0.97)';
        links.style.backdropFilter = 'blur(8px)';
        links.style.padding = '1.5rem 2rem';
        links.style.gap = '1.2rem';
        links.style.borderBottom = '1px solid #eef2f6';
        links.style.boxShadow = '0 12px 30px rgba(0,0,0,0.04)';
        links.style.zIndex = '40';
    }
});

document.addEventListener('click', function(e) {
    const nav = document.querySelector('.nav');
    const links = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (links && hamburger && !nav.contains(e.target)) {
        if (window.innerWidth <= 768) {
            links.style.display = 'none';
        }
    }
});

window.addEventListener('resize', function() {
    const links = document.querySelector('.nav-links');
    if (window.innerWidth > 768 && links) {
        links.style.display = 'flex';
        links.style.position = 'static';
        links.style.flexDirection = 'row';
        links.style.background = 'transparent';
        links.style.backdropFilter = 'none';
        links.style.padding = '0';
        links.style.gap = '2rem';
        links.style.borderBottom = 'none';
        links.style.boxShadow = 'none';
    }
});
