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

function applyFilter(filter) {
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
}

filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        filterLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        applyFilter(link.dataset.filter);
    });
});

// Apply default filter on load
applyFilter('all');

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
});

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.project');
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

    // Gallery — trim to nearest multiple of 3 so grid is always full
    overlayGallery.innerHTML = '';
    const cols = 3;
    const trimmed = stills.slice(0, Math.floor(stills.length / cols) * cols || stills.length);
    trimmed.forEach(src => {
        const img = document.createElement('img');
        img.src = src.trim();
        img.alt = title;
        img.loading = 'lazy';
        overlayGallery.appendChild(img);
    });

    // Sync overlay filter to active main-feed filter
    const activeMainFilter = document.querySelector('.filter-link.active')?.dataset.filter || 'all';
    document.querySelectorAll('.overlay-filter-item').forEach(b => b.classList.remove('active'));
    const matchingOverlayFilter = document.querySelector(`.overlay-filter-item[data-filter="${activeMainFilter}"]`);
    if (matchingOverlayFilter) {
        matchingOverlayFilter.classList.add('active');
        filterLabel.textContent = matchingOverlayFilter.textContent;
    }

    // Sidebar nav — show projects matching current overlay filter
    buildOverlayNav(projectEl);

    overlayMain.scrollTop = 0;
    overlay.classList.add('is-open');
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.dataset.scrollY = scrollY;
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

        // Hero 2 = second image in stills list
        const hero2 = p.dataset.stills.split(',')[1]?.trim() || p.dataset.stills.split(',')[0].trim();
        const img = document.createElement('img');
        img.src = hero2;
        img.alt = p.dataset.title;
        img.loading = 'lazy';

        const label = document.createElement('span');
        label.className = 'overlay-nav-label';
        label.textContent = p.dataset.title;

        btn.appendChild(img);
        btn.appendChild(label);
        btn.addEventListener('click', () => openProject(p));
        overlayNav.appendChild(btn);
    });
}

// Overlay filter dropdown
const filterNav    = document.getElementById('overlay-filters');
const filterToggle = document.getElementById('overlay-filter-toggle');
const filterLabel  = document.getElementById('overlay-filter-label');

filterToggle.addEventListener('click', () => {
    filterNav.classList.toggle('is-open');
});

document.querySelectorAll('.overlay-filter-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.overlay-filter-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterLabel.textContent = btn.textContent;
        filterNav.classList.remove('is-open');
        buildOverlayNav(null);
    });
});

document.querySelectorAll('.project-stills').forEach(stills => {
    stills.addEventListener('click', () => {
        openProject(stills.closest('.project'));
    });
});

function closeOverlay() {
    overlay.classList.remove('is-open');
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
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
