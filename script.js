/* ==========================================================================
   RAHILA RAHAD PORTFOLIO — JAVASCRIPT ENGINE
   - 153-Frame 3D Canvas Scroll Scrubbing
   - GSAP & ScrollTrigger Parallax & Text Animations
   - Lenis Smooth Scroll Integration
   - Preloader & Interactive Tilt Physics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. INITIALIZE LENIS SMOOTH SCROLL
    // ----------------------------------------------------------------------
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Register GSAP Plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0, 0);
        }
    }

    // ----------------------------------------------------------------------
    // 2. 153-FRAME 3D CANVAS SCROLL ENGINE
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');

    const totalFrames = 153;
    const images = [];
    let loadedCount = 0;
    const frameObj = { currentFrame: 0 };

    // Set canvas dimensions
    function setCanvasDimensions() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        renderCurrentFrame();
    }

    // Format frame index: ezgif-frame-001.png to ezgif-frame-153.png
    function getFramePath(index) {
        const frameNum = String(index + 1).padStart(3, '0');
        return `./ezgif-frame-${frameNum}.png`;
    }

    // Draw Image with "object-fit: cover" mathematics inside Canvas
    function drawImageCover(img) {
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const rect = canvas.getBoundingClientRect();
        const cw = rect.width;
        const ch = rect.height;

        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        const imgAspect = imgWidth / imgHeight;
        const canvasAspect = cw / ch;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
            drawWidth = cw;
            drawHeight = cw / imgAspect;
            offsetX = 0;
            offsetY = (ch - drawHeight) / 2;
        } else {
            drawHeight = ch;
            drawWidth = ch * imgAspect;
            offsetX = (cw - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    function renderCurrentFrame() {
        const currentIdx = Math.min(totalFrames - 1, Math.max(0, Math.floor(frameObj.currentFrame)));
        if (images[currentIdx] && images[currentIdx].complete) {
            drawImageCover(images[currentIdx]);
        }
    }

    // Preload images
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercent = document.getElementById('loader-percent');
    const loaderText = document.getElementById('loader-text');
    const preloader = document.getElementById('preloader');

    function preloadImages() {
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            img.src = getFramePath(i);
            
            img.onload = () => {
                loadedCount++;
                const percent = Math.floor((loadedCount / totalFrames) * 100);
                
                if (loaderBar) loaderBar.style.width = `${percent}%`;
                if (loaderPercent) loaderPercent.textContent = `${percent}%`;

                // Render initial frame as soon as frame 0 is ready
                if (i === 0) {
                    setCanvasDimensions();
                }

                if (loadedCount === totalFrames) {
                    onAssetsLoaded();
                }
            };

            img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalFrames) {
                    onAssetsLoaded();
                }
            };

            images.push(img);
        }
    }

    // Ambient Continuous Showreel Animation Engine
    let isUserScrolling = false;
    let scrollTimeout = null;

    function startAmbientShowreel() {
        function loop() {
            if (!isUserScrolling) {
                frameObj.currentFrame = (frameObj.currentFrame + 0.35) % totalFrames;
                renderCurrentFrame();
            }
            requestAnimationFrame(loop);
        }
        loop();
    }

    window.addEventListener('scroll', () => {
        isUserScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 150);
    });

    function onAssetsLoaded() {
        if (loaderText) loaderText.textContent = 'READY';
        setTimeout(() => {
            if (preloader) preloader.classList.add('fade-out');
            startAmbientShowreel();
            initScrollAnimations();
        }, 500);
    }

    // ----------------------------------------------------------------------
    // 3. GSAP SCROLLTRIGGER FOR 3D CANVAS & PARALLAX
    // ----------------------------------------------------------------------
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // Hero 3D Frame Sequence Scrubbing Timeline
        const heroSection = document.getElementById('hero');
        
        gsap.to(frameObj, {
            currentFrame: totalFrames - 1,
            ease: 'none',
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom+=100% top',
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                onUpdate: () => renderCurrentFrame()
            }
        });

        // Parallax offset for Hero Left Text Content while scrolling
        gsap.to('#hero-left', {
            yPercent: -15,
            opacity: 0.8,
            ease: 'none',
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Parallax for Hero Right Media Frame
        gsap.to('#media-frame', {
            yPercent: -5,
            scale: 0.98,
            ease: 'none',
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // ------------------------------------------------------------------
        // WORKS / PROJECTS SECTION ANIMATIONS & FILTER ENGINE
        // ------------------------------------------------------------------
        const worksSection = document.getElementById('works');
        const projectItems = document.querySelectorAll('.project-card-item');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const worksEyebrow = document.getElementById('works-eyebrow');
        const worksTitle = document.getElementById('works-title');

        if (worksSection) {
            if (worksEyebrow) {
                ScrollTrigger.create({
                    trigger: worksEyebrow,
                    start: 'top 85%',
                    onEnter: () => gsap.fromTo(worksEyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 })
                });
            }

            if (worksTitle) {
                ScrollTrigger.create({
                    trigger: worksTitle,
                    start: 'top 85%',
                    onEnter: () => gsap.fromTo(worksTitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 })
                });
            }

            // Staggered reveal for project cards (120ms delay per card)
            projectItems.forEach((card, idx) => {
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 88%',
                    onEnter: () => {
                        setTimeout(() => card.classList.add('animated'), idx * 120);
                    }
                });
            });

            // Filter Tabs Click Logic
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');

                    projectItems.forEach((card) => {
                        const cardCategory = card.getAttribute('data-category');

                        if (filterValue === 'all' || cardCategory === filterValue) {
                            card.classList.remove('hidden');
                            gsap.fromTo(card, 
                                { opacity: 0, scale: 0.94, y: 20 }, 
                                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                            );
                        } else {
                            gsap.to(card, {
                                opacity: 0,
                                scale: 0.94,
                                duration: 0.3,
                                ease: 'power2.in',
                                onComplete: () => card.classList.add('hidden')
                            });
                        }
                    });
                });
            });
        }

        // ------------------------------------------------------------------
        // SERVICES SECTION (EDITORIAL ROWS & FLOATING PREVIEW CARD)
        // ------------------------------------------------------------------
        const servicesSection = document.getElementById('services');
        const serviceRows = document.querySelectorAll('.service-editorial-row');
        const servicePreview = document.getElementById('service-preview');
        const previewInners = document.querySelectorAll('.preview-card-inner');

        if (servicesSection) {
            // Staggered reveal for each service row (150ms delay per row)
            serviceRows.forEach((row, idx) => {
                ScrollTrigger.create({
                    trigger: row,
                    start: 'top 88%',
                    onEnter: () => {
                        setTimeout(() => row.classList.add('animated'), idx * 150);
                    }
                });

                // Mouse hover events for floating thumbnail preview card
                row.addEventListener('mouseenter', () => {
                    const previewIndex = row.getAttribute('data-preview');
                    
                    previewInners.forEach(inner => inner.classList.remove('active'));
                    const targetPreview = document.getElementById(`preview-img-${previewIndex}`);
                    if (targetPreview) targetPreview.classList.add('active');

                    if (servicePreview) servicePreview.classList.add('active');
                });

                row.addEventListener('mousemove', (e) => {
                    if (servicePreview) {
                        gsap.to(servicePreview, {
                            x: e.clientX + 20,
                            y: e.clientY + 20,
                            duration: 0.25,
                            ease: 'power2.out'
                        });
                    }
                });

                row.addEventListener('mouseleave', () => {
                    if (servicePreview) servicePreview.classList.remove('active');
                });
            });
        }

        // Stats Counter Animation
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat) => {
            const countTo = parseInt(stat.getAttribute('data-count'), 10);
            const isPercent = stat.textContent.includes('%');
            
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to({ val: 0 }, {
                        val: countTo,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: function() {
                            stat.textContent = `${Math.floor(this.targets()[0].val)}${isPercent ? '%' : '+'}`;
                        }
                    });
                }
            });
        });

        // ------------------------------------------------------------------
        // ABOUT SECTION ANIMATIONS
        // ------------------------------------------------------------------
        const aboutSection = document.getElementById('about');
        const timelineProgress = document.getElementById('timeline-progress');
        const timelineItems = document.querySelectorAll('.timeline-item');
        const aboutHeading = document.getElementById('about-title');
        const aboutParagraphs = document.querySelectorAll('.about-p');
        const glowHighlights = document.querySelectorAll('.glow-highlight');

        if (aboutSection) {
            // Timeline line draw down as user scrolls through About section
            if (timelineProgress) {
                gsap.to(timelineProgress, {
                    height: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#about',
                        start: 'top 70%',
                        end: 'bottom 70%',
                        scrub: true
                    }
                });
            }

            // Timeline Milestone items reveal stagger
            timelineItems.forEach((item) => {
                ScrollTrigger.create({
                    trigger: item,
                    start: 'top 82%',
                    onEnter: () => item.classList.add('animated')
                });
            });

            // Heading fade-up + scale
            if (aboutHeading) {
                ScrollTrigger.create({
                    trigger: aboutHeading,
                    start: 'top 85%',
                    onEnter: () => aboutHeading.classList.add('animated')
                });
            }

            // Paragraphs staggered fade-up
            aboutParagraphs.forEach((p, idx) => {
                ScrollTrigger.create({
                    trigger: p,
                    start: 'top 88%',
                    onEnter: () => {
                        setTimeout(() => p.classList.add('animated'), idx * 120);
                    }
                });
            });

            // Glowing text highlights trigger
            glowHighlights.forEach((mark) => {
                ScrollTrigger.create({
                    trigger: mark,
                    start: 'top 85%',
                    onEnter: () => mark.classList.add('active')
                });
            });
        }

        // ------------------------------------------------------------------
        // SKILLS SECTION ANIMATIONS
        // ------------------------------------------------------------------
        const skillsSection = document.getElementById('skills');
        const skillRows = document.querySelectorAll('.skill-row');
        const skillsEyebrow = document.getElementById('skills-eyebrow');
        const skillsTitle = document.getElementById('skills-title');

        if (skillsSection) {
            if (skillsEyebrow) {
                ScrollTrigger.create({
                    trigger: skillsEyebrow,
                    start: 'top 85%',
                    onEnter: () => gsap.fromTo(skillsEyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 })
                });
            }

            if (skillsTitle) {
                ScrollTrigger.create({
                    trigger: skillsTitle,
                    start: 'top 85%',
                    onEnter: () => gsap.fromTo(skillsTitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 })
                });
            }

            // Staggered reveal for each skill row (100ms delay between rows)
            skillRows.forEach((row, idx) => {
                ScrollTrigger.create({
                    trigger: row,
                    start: 'top 88%',
                    onEnter: () => {
                        setTimeout(() => row.classList.add('animated'), idx * 100);
                    }
                });
            });
        }

        // ------------------------------------------------------------------
        // TOOLS & SOFTWARE SECTION ANIMATIONS
        // ------------------------------------------------------------------
        const toolsSection = document.getElementById('tools');
        const toolChips = document.querySelectorAll('.tool-chip');
        const toolsEyebrow = document.getElementById('tools-eyebrow');
        const toolsTitle = document.getElementById('tools-title');

        if (toolsSection) {
            if (toolsEyebrow) {
                ScrollTrigger.create({
                    trigger: toolsEyebrow,
                    start: 'top 85%',
                    onEnter: () => gsap.fromTo(toolsEyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 })
                });
            }

            if (toolsTitle) {
                ScrollTrigger.create({
                    trigger: toolsTitle,
                    start: 'top 85%',
                    onEnter: () => gsap.fromTo(toolsTitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 })
                });
            }

            // Staggered reveal for tool chips (80ms delay per chip)
            toolChips.forEach((chip, idx) => {
                ScrollTrigger.create({
                    trigger: chip,
                    start: 'top 88%',
                    onEnter: () => {
                        setTimeout(() => chip.classList.add('animated'), idx * 80);
                    }
                });
            });
        }

        // ------------------------------------------------------------------
        // CERTIFICATIONS SECTION ANIMATIONS
        // ------------------------------------------------------------------
        const certsSection = document.getElementById('certs');
        const certRows = document.querySelectorAll('.cert-row');
        const certsEyebrow = document.getElementById('certs-eyebrow');
        const certsTitle = document.getElementById('certs-title');

        if (certsSection) {
            if (certsEyebrow) {
                ScrollTrigger.create({
                    trigger: certsEyebrow,
                    start: 'top 85%',
                    onEnter: () => gsap.fromTo(certsEyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 })
                });
            }

            if (certsTitle) {
                ScrollTrigger.create({
                    trigger: certsTitle,
                    start: 'top 85%',
                    onEnter: () => gsap.fromTo(certsTitle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 })
                });
            }

            // Staggered reveal for cert rows (120ms delay per row)
            certRows.forEach((row, idx) => {
                ScrollTrigger.create({
                    trigger: row,
                    start: 'top 88%',
                    onEnter: () => {
                        setTimeout(() => row.classList.add('animated'), idx * 120);
                    }
                });
            });
        }
    }

    // Start preloading images immediately
    preloadImages();

    // Resize event listener for responsive canvas fit
    window.addEventListener('resize', () => {
        setCanvasDimensions();
    });

    // ----------------------------------------------------------------------
    // 4. MOUSE PARALLAX / TILT PHYSICS ON MEDIA CONTAINER
    // ----------------------------------------------------------------------
    const mediaFrame = document.getElementById('media-frame');
    if (mediaFrame) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Calculate normalized cursor offsets (-1 to 1)
            const offsetX = (clientX / windowWidth - 0.5) * 2;
            const offsetY = (clientY / windowHeight - 0.5) * 2;

            // Subtle rotation opposite to cursor direction for depth
            const rotateY = offsetX * -12; // deg
            const rotateX = offsetY * 12;  // deg
            const translateX = offsetX * -15; // px
            const translateY = offsetY * -15; // px

            gsap.to(mediaFrame, {
                rotateY: rotateY,
                rotateX: rotateX,
                x: translateX,
                y: translateY,
                duration: 0.8,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });
    }

    // ----------------------------------------------------------------------
    // 5. CUSTOM CURSOR FOLLOWER LOGIC
    // ----------------------------------------------------------------------
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');

    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            gsap.to(cursorFollower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        });

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .btn-pill-outlined, .service-item');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ----------------------------------------------------------------------
    // 6. HEADER BACKGROUND SCROLL & MOBILE MENU TOGGLE
    // ----------------------------------------------------------------------
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            mobileDrawer.classList.toggle('active');
            mobileToggle.classList.toggle('open');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('active');
                mobileToggle.classList.remove('open');
            });
        });
    }
});
