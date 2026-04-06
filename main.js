// ========== HERO BAR STUCK DETECTION ==========
const heroBar = document.getElementById('hero-name');
const stickPoint = heroBar.offsetTop;

const spacer = document.createElement('div');
spacer.style.height = heroBar.offsetHeight + 'px';
spacer.style.display = 'none';
heroBar.parentNode.insertBefore(spacer, heroBar.nextSibling);

function checkStuck() {
    if (window.scrollY >= stickPoint) {
        heroBar.classList.add('is-stuck');
        spacer.style.display = 'block';
    } else {
        heroBar.classList.remove('is-stuck');
        spacer.style.display = 'none';
    }
}

window.addEventListener('scroll', checkStuck, { passive: true });
checkStuck();

// ========== FILTERS ==========
const filterLinks = document.querySelectorAll('.filter-link');
const projects = document.querySelectorAll('.project');

filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        filterLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const filter = link.dataset.filter;
        projects.forEach(project => {
            if (filter === 'all') {
                if (project.hasAttribute('data-selected')) {
                    project.classList.remove('is-hidden');
                } else {
                    project.classList.add('is-hidden');
                }
            } else if (project.dataset.category === filter) {
                project.classList.remove('is-hidden');
            } else {
                project.classList.add('is-hidden');
            }
        });
    });
});

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
});

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.project, .about-bio-col, .about-gear-accordion, .site-footer');
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// ========== HEADER CENTER — SCROLL TO TOP ==========
document.querySelector('.hero-center').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== OVERLAY ==========
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayVideo = document.getElementById('overlay-video');
const overlayVideoWrap = document.getElementById('overlay-video-wrap');
const overlayGallery = document.getElementById('overlay-gallery');
const overlayNav = document.getElementById('overlay-nav');
const overlayClose = document.getElementById('overlay-close');
const overlayMain = document.getElementById('overlay-main');

const allProjects = Array.from(document.querySelectorAll('.project'));

function openProject(projectEl) {
    const title = projectEl.dataset.title;
    const vimeoId = projectEl.dataset.vimeo;
    const vimeoHash = projectEl.dataset.vimeoHash || '';
    const stills = projectEl.dataset.stills.split(',');

    // Clean up extra videos
    document.querySelectorAll('.overlay-video-extra').forEach(el => el.remove());

    // Title
    overlayTitle.textContent = title;

    // Videos
    const vimeo2Id = projectEl.dataset.vimeo2 || '';
    const vimeo2Hash = projectEl.dataset.vimeo2Hash || '';

    if (vimeoId) {
        const hashParam = vimeoHash ? `?h=${vimeoHash}` : '';
        overlayVideo.innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}${hashParam}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        overlayVideoWrap.style.display = '';

        if (vimeo2Id) {
            const hash2Param = vimeo2Hash ? `?h=${vimeo2Hash}` : '';
            const vid2 = document.createElement('div');
            vid2.className = 'overlay-video overlay-video-extra';
            vid2.innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeo2Id}${hash2Param}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
            overlayVideoWrap.appendChild(vid2);
        }
    } else {
        overlayVideo.innerHTML = '';
        overlayVideoWrap.style.display = 'none';
    }

    // Gallery — all stills
    overlayGallery.innerHTML = '';
    stills.forEach(src => {
        const img = document.createElement('img');
        img.src = src.trim();
        img.alt = title;
        img.loading = 'lazy';
        overlayGallery.appendChild(img);
    });

    // Sidebar nav — show projects matching current overlay filter
    buildOverlayNav(projectEl);

    overlayMain.scrollTop = 0;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function buildOverlayNav(activeProject) {
    overlayNav.innerHTML = '';
    const activeFilter = document.querySelector('.overlay-filter-item.active').dataset.filter;
    allProjects.forEach(p => {
        const show = activeFilter === 'all'
            ? p.hasAttribute('data-selected')
            : p.dataset.category === activeFilter;
        if (!show) return;
        const btn = document.createElement('button');
        btn.className = 'overlay-nav-item';
        if (p === activeProject) btn.classList.add('is-active');
        btn.textContent = p.dataset.title;
        btn.addEventListener('click', () => openProject(p));
        overlayNav.appendChild(btn);
    });
}

// Overlay filters
document.querySelectorAll('.overlay-filter-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.overlay-filter-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const activeProject = document.querySelector('.overlay-nav-item.is-active');
        const activeName = activeProject ? activeProject.textContent : null;
        const match = allProjects.find(p => p.dataset.title === activeName);
        buildOverlayNav(match || null);
    });
});

document.querySelectorAll('.project-stills').forEach(stills => {
    stills.addEventListener('click', () => {
        openProject(stills.closest('.project'));
    });
});

function closeOverlay() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    overlayVideo.innerHTML = '';
    document.querySelectorAll('.overlay-video-extra').forEach(el => el.remove());
}

overlayClose.addEventListener('click', closeOverlay);

document.getElementById('overlay-home').addEventListener('click', () => {
    closeOverlay();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('overlay-info').addEventListener('click', (e) => {
    e.preventDefault();
    closeOverlay();
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        overlayClose.click();
    }
});
