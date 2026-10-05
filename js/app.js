/* ==========================================
   ARV FILTRATION - INTERACTIVE JS ENGINE
   ========================================== */

// ------------------------------------------
// 1. DATA STORES
// ------------------------------------------

// Filter Media Dataset (Based on Brochure)
const FILTER_MEDIA = [
    {
        id: "pp",
        name: "Polypropylene",
        code: "PP",
        temp: 90,
        peakTemp: 95,
        acid: "excellent",
        alkali: "excellent",
        hydrolysis: "excellent",
        oxidation: "good"
    },
    {
        id: "pe",
        name: "Polyester",
        code: "PE",
        temp: 145,
        peakTemp: 150,
        acid: "good",
        alkali: "limited",
        hydrolysis: "limited",
        oxidation: "good"
    },
    {
        id: "c-pan",
        name: "Co-Polymer Polyacrylonitrile",
        code: "C-PAN",
        temp: 115,
        peakTemp: 120,
        acid: "fair",
        alkali: "fair",
        hydrolysis: "excellent",
        oxidation: "good"
    },
    {
        id: "h-pan",
        name: "Homo-Polymer Polyacrylonitrile",
        code: "H-PAN",
        temp: 125,
        peakTemp: 140,
        acid: "good",
        alkali: "fair",
        hydrolysis: "good",
        oxidation: "good"
    },
    {
        id: "pps",
        name: "Polyphenylene Sulphide",
        code: "PPS",
        temp: 190,
        peakTemp: 200,
        acid: "good",
        alkali: "fair",
        hydrolysis: "fair",
        oxidation: "limited"
    },
    {
        id: "ma",
        name: "Meta-Aramide",
        code: "MA / Nomex",
        temp: 200,
        peakTemp: 220,
        acid: "good",
        alkali: "good",
        hydrolysis: "good",
        oxidation: "excellent"
    },
    {
        id: "pi",
        name: "Polyimide",
        code: "PI / P84",
        temp: 240,
        peakTemp: 260,
        acid: "good",
        alkali: "fair",
        hydrolysis: "good",
        oxidation: "good"
    },
    {
        id: "fg",
        name: "Fibreglass",
        code: "FG",
        temp: 260,
        peakTemp: 280,
        acid: "fair",
        alkali: "fair",
        hydrolysis: "good",
        oxidation: "excellent"
    },
    {
        id: "ptfe",
        name: "Polytetrafluoroethylene",
        code: "PTFE / Teflon",
        temp: 250,
        peakTemp: 280,
        acid: "excellent",
        alkali: "excellent",
        hydrolysis: "excellent",
        oxidation: "excellent"
    }
];

// RFQ Cart State
let rfqCart = [];

// Load Cart from localStorage if exists
if (localStorage.getItem('arv_rfq_cart')) {
    try {
        rfqCart = JSON.parse(localStorage.getItem('arv_rfq_cart'));
    } catch (e) {
        rfqCart = [];
    }
}

// ------------------------------------------
// 2. INITIALIZATION & SCROLL
// ------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Header Scroll Effect
    const header = document.querySelector("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Setup Navigation active link highlights
    setupNavigationScrollSpy();

    // Setup Tab Listeners
    setupTabControls();

    // Render Filter Media Selector
    renderFilterMediaSelector();

    // Setup Filter Selector Interactive Handlers
    setupFilterMediaHandlers();

    // Update Cart UI initially
    updateCartUI();

    // Setup Cart Drawer toggle triggers
    setupCartDrawerTriggers();

    // Initialize Infrastructure Photo Lightbox
    initInfraLightbox();

    // Motion & Dynamic Background Engines
    initAmbientParticlesCanvas();
    initScrollReveal();
    initAnimatedCounters();
    initScrollParallaxEngine();

    // Mobile Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.querySelector("nav");
    const navLinks = document.querySelectorAll("nav ul li a");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            const icon = menuToggle.querySelector("i");
            if (nav.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
            });
        });
    }

    // Bind forms
    setupForms();
});

// Navigation scroll indicator highlight (ScrollSpy)
function setupNavigationScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav ul li");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(li => {
            li.classList.remove("active");
            const link = li.querySelector("a");
            if (link && link.getAttribute("href") === `#${current}`) {
                li.classList.add("active");
            }
        });
    });
}

// ------------------------------------------
// 3. CATALOG TABS
// ------------------------------------------
function setupTabControls() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".catalog-panel");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-tab");

            // Toggle active state on buttons
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Toggle active panel
            panels.forEach(panel => {
                if (panel.id === `${target}-panel`) {
                    panel.classList.add("active");
                } else {
                    panel.classList.remove("active");
                }
            });
        });
    });
}

// ------------------------------------------
// 4. FILTER MEDIA SELECTOR ENGINE
// ------------------------------------------

// Render the media rows in UI
function renderFilterMediaSelector() {
    const container = document.getElementById("media-selector-results");
    if (!container) return;

    container.innerHTML = FILTER_MEDIA.map(media => `
        <div class="media-result-row" id="media-row-${media.id}">
            <div class="media-result-name">
                ${media.name}
                <span>${media.code}</span>
            </div>
            <div class="media-result-temp">
                <i class="fas fa-temperature-high"></i> Max: ${media.temp}°C
            </div>
            <div class="chemical-tags">
                <span class="chem-tag excellent" title="Acid Resistance">A: ${media.acid}</span>
                <span class="chem-tag excellent" title="Alkali Resistance">K: ${media.alkali}</span>
                <span class="chem-tag good" title="Hydrolysis Resistance">H: ${media.hydrolysis}</span>
                <span class="chem-tag good" title="Oxidation Resistance">O: ${media.oxidation}</span>
            </div>
            <div>
                <button class="btn-media-add" onclick="addProductToRFQ('${media.id}', '${media.name} (${media.code})', 'Filter Media Fabric')">
                    <i class="fas fa-plus"></i> Select
                </button>
            </div>
        </div>
    `).join('');
}

// Interactive filter handler
function setupFilterMediaHandlers() {
    const slider = document.getElementById("temp-range");
    const displayVal = document.getElementById("temp-val");
    const acidCheck = document.getElementById("check-acid");
    const alkaliCheck = document.getElementById("check-alkali");
    const hydroCheck = document.getElementById("check-hydro");
    const oxidCheck = document.getElementById("check-oxid");

    if (!slider) return;

    const runFiltering = () => {
        const selectedTemp = parseInt(slider.value);
        displayVal.textContent = `${selectedTemp}°C`;

        const filterAcid = acidCheck.checked;
        const filterAlkali = alkaliCheck.checked;
        const filterHydro = hydroCheck.checked;
        const filterOxid = oxidCheck.checked;

        // Check each media item
        FILTER_MEDIA.forEach(media => {
            const row = document.getElementById(`media-row-${media.id}`);
            if (!row) return;

            // Rule 1: Temperature check (media continuous temp must be >= operating temp)
            const tempOk = media.temp >= selectedTemp;

            // Rule 2: Chemical resistances check
            // If user requests chemical resistance, media must rate 'excellent' or 'good'
            const checkRating = (rating) => rating === "excellent" || rating === "good";
            
            const acidOk = !filterAcid || checkRating(media.acid);
            const alkaliOk = !filterAlkali || checkRating(media.alkali);
            const hydroOk = !filterHydro || checkRating(media.hydrolysis);
            const oxidOk = !filterOxid || checkRating(media.oxidation);

            if (tempOk && acidOk && alkaliOk && hydroOk && oxidOk) {
                row.classList.remove("filtered-out");
                
                // Highlight matches that are excellent matches for strict chemical inputs
                if ((filterAcid && media.acid === "excellent") || (filterAlkali && media.alkali === "excellent")) {
                    row.classList.add("highlighted");
                } else {
                    row.classList.remove("highlighted");
                }
            } else {
                row.classList.add("filtered-out");
                row.classList.remove("highlighted");
            }
        });
    };

    // Attach listeners
    slider.addEventListener("input", runFiltering);
    acidCheck.addEventListener("change", runFiltering);
    alkaliCheck.addEventListener("change", runFiltering);
    hydroCheck.addEventListener("change", runFiltering);
    oxidCheck.addEventListener("change", runFiltering);

    // Initial run
    runFiltering();
}

// ------------------------------------------
// 5. RFQ CART ENGINE
// ------------------------------------------

function setupCartDrawerTriggers() {
    const trigger = document.getElementById("rfq-cart-trigger");
    const closeBtn = document.getElementById("close-drawer");
    const overlay = document.getElementById("drawer-overlay");
    const drawer = document.getElementById("rfq-drawer");

    const toggle = () => {
        drawer.classList.toggle("active");
        overlay.classList.toggle("active");
    };

    if (trigger) trigger.addEventListener("click", toggle);
    if (closeBtn) closeBtn.addEventListener("click", toggle);
    if (overlay) overlay.addEventListener("click", toggle);
}

// Add Item
window.addProductToRFQ = function(id, name, category) {
    // Check if already in cart
    const exists = rfqCart.some(item => item.id === id);
    if (exists) {
        // Toggle remove if already in cart (user clicked it again on a card)
        removeProductFromRFQ(id);
        return;
    }

    rfqCart.push({ id, name, category, quantity: 1 });
    saveCart();
    updateCartUI();
    
    // Auto-open drawer to show feedback
    document.getElementById("rfq-drawer").classList.add("active");
    document.getElementById("drawer-overlay").classList.add("active");
};

// Remove Item
window.removeProductFromRFQ = function(id) {
    rfqCart = rfqCart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('arv_rfq_cart', JSON.stringify(rfqCart));
}

// Update Cart rendering and badges
function updateCartUI() {
    const cartCountBadge = document.getElementById("cart-count-badge");
    const cartItemsList = document.getElementById("cart-items-list");
    const cartEmptyMsg = document.getElementById("cart-empty-msg");
    const rfqForm = document.getElementById("rfq-form-box");

    // Update numbers
    if (cartCountBadge) {
        cartCountBadge.textContent = rfqCart.length;
        if (rfqCart.length === 0) {
            cartCountBadge.style.display = "none";
        } else {
            cartCountBadge.style.display = "flex";
        }
    }

    // Toggle forms
    if (rfqCart.length === 0) {
        if (cartEmptyMsg) cartEmptyMsg.style.display = "block";
        if (cartItemsList) cartItemsList.style.display = "none";
        if (rfqForm) rfqForm.style.display = "none";
    } else {
        if (cartEmptyMsg) cartEmptyMsg.style.display = "none";
        if (cartItemsList) cartItemsList.style.display = "flex";
        if (rfqForm) rfqForm.style.display = "block";

        // Render items
        if (cartItemsList) {
            cartItemsList.innerHTML = rfqCart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span>Category: ${item.category}</span>
                    </div>
                    <button class="btn-remove-item" onclick="removeProductFromRFQ('${item.id}')" title="Remove">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    // Update main catalog card buttons status
    const allAddButtons = document.querySelectorAll(".btn-add-rfq, .btn-media-add");
    allAddButtons.forEach(btn => {
        // We find the parent card or match ID
        let onclickAttr = btn.getAttribute("onclick");
        if (onclickAttr) {
            // Find ID string inside product parameters
            let match = onclickAttr.match(/'([^']+)'/);
            if (match) {
                let id = match[1];
                let isAdded = rfqCart.some(item => item.id === id);
                
                // If it is in the cart, style appropriately
                let card = btn.closest(".product-card");
                if (isAdded) {
                    if (card) card.classList.add("in-cart");
                    btn.innerHTML = `<i class="fas fa-check"></i> Added to RFQ`;
                    if (btn.classList.contains("btn-media-add")) {
                        btn.style.background = "var(--color-accent)";
                        btn.style.borderColor = "var(--color-accent)";
                        btn.style.color = "var(--text-white)";
                    }
                } else {
                    if (card) card.classList.remove("in-cart");
                    if (btn.classList.contains("btn-media-add")) {
                        btn.innerHTML = `<i class="fas fa-plus"></i> Select`;
                        btn.style.background = "transparent";
                        btn.style.borderColor = "var(--border-glass)";
                        btn.style.color = "inherit";
                    } else {
                        btn.innerHTML = `<i class="fas fa-plus"></i> Add to RFQ`;
                    }
                }
            }
        }
    });
}

// ------------------------------------------
// 6. FORMS & EMAIL REQUEST GENERATION
// ------------------------------------------
function setupForms() {
    // 1. RFQ Form Submission
    const rfqForm = document.getElementById("rfq-submit-form");
    if (rfqForm) {
        rfqForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const companyName = document.getElementById("rfq-company").value;
            const contactName = document.getElementById("rfq-name").value;
            const contactEmail = document.getElementById("rfq-email").value;
            const contactPhone = document.getElementById("rfq-phone").value;
            const rfqDetails = document.getElementById("rfq-details").value;

            // Generate mail text
            let subject = `RFQ Inquiry: ARV Filtration - ${companyName}`;
            let body = `Dear ARV Filtration Team,\n\n`;
            body += `We would like to request a quotation for the following ARV filtration products/spares:\n\n`;
            
            // List cart items
            rfqCart.forEach((item, index) => {
                body += `${index + 1}. [${item.category}] ${item.name}\n`;
            });
            
            body += `\n--- Company Details ---\n`;
            body += `Company Name: ${companyName}\n`;
            body += `Contact Person: ${contactName}\n`;
            body += `Email: ${contactEmail}\n`;
            body += `Phone: ${contactPhone}\n`;
            body += `\n--- Special Requirements / System Parameters ---\n`;
            body += `${rfqDetails}\n\n`;
            body += `Sincerely,\n${contactName}`;

            // Create mailto link targeting inquiry@arvfiltration.in
            let mailto = `mailto:inquiry@arvfiltration.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Open user's email client
            window.location.href = mailto;

            // Reset cart
            rfqCart = [];
            saveCart();
            updateCartUI();

            // Close Drawer
            document.getElementById("rfq-drawer").classList.remove("active");
            document.getElementById("drawer-overlay").classList.remove("active");

            alert("Your RFQ email has been prepared! It will now open in your mail client. Please click send in your email client to submit it to inquiry@arvfiltration.in");
        });
    }

    // 2. Standard Contact Us Form
    const contactForm = document.getElementById("contact-inquiry-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("contact-name").value;
            const email = document.getElementById("contact-email").value;
            const message = document.getElementById("contact-message").value;

            let subject = `Contact Inquiry: ARV Filtration - ${name}`;
            let body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            
            let mailto = `mailto:inquiry@arvfiltration.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailto;

            alert("Your inquiry has been compiled! It will now open in your email client to send to inquiry@arvfiltration.in");
            contactForm.reset();
        });
    }
}

// ------------------------------------------
// 7. INFRASTRUCTURE GALLERY & LIGHTBOX ENGINE
// ------------------------------------------
const INFRA_GALLERY_DATA = [
    {
        image: "assets/infrastructure/plant_unit1.jpg",
        tag: '<i class="fa-solid fa-building"></i> Unit 1 Facility',
        tagClass: "infra-badge",
        title: "Unit 1 — ARV Filtration LLP Works",
        desc: "Primary registered operating works featuring administrative offices, technical filter bag assembly, final QA staging, and rapid nationwide dispatch bays in Vitthal Nagar, Chikhali, Pune."
    },
    {
        image: "assets/infrastructure/plant_unit2.jpg",
        tag: '<i class="fa-solid fa-warehouse"></i> Unit 2 • 14,000+ SQ. FT.',
        tagClass: "infra-badge highlight-green",
        title: "Unit 2 — Heavy Manufacturing Plant",
        desc: "Expansive modern pre-engineered industrial plant featuring 3 high-clearance loading bays, custom cage welding gantries, and raw material warehousing in Ganesh Nagar, Chikhali, Pune."
    },
    {
        image: "assets/infrastructure/cage_fabrication.jpg",
        tag: '<i class="fa-solid fa-gears"></i> Metal Fabrication Bay',
        tagClass: "infra-badge",
        title: "Filter Cage Fabrication & Assembly Bay",
        desc: "High-capacity automated vertical multi-spot resistance welding lines producing precision pulse jet and star cages with mezzanine material storage."
    },
    {
        image: "assets/infrastructure/sewing_lines.jpg",
        tag: '<i class="fa-solid fa-scissors"></i> Textile & Seam Floor',
        tagClass: "infra-badge highlight-cyan",
        title: "Automatic Filter Bag Sewing Lines",
        desc: "Cleanroom-grade production floor with specialized multi-needle lockstitch industrial stations operated by certified technicians for maximum seam burst resistance."
    }
];

function initInfraLightbox() {
    const lightbox = document.getElementById("infra-lightbox");
    if (!lightbox) return;

    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTag = document.getElementById("lightbox-tag");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDesc = document.getElementById("lightbox-desc");
    const lightboxCounter = document.getElementById("lightbox-counter");
    const closeBtn = document.getElementById("lightbox-close");
    const backdrop = document.getElementById("lightbox-backdrop");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    let currentIndex = 0;

    function renderPhoto(index) {
        if (index < 0) index = INFRA_GALLERY_DATA.length - 1;
        if (index >= INFRA_GALLERY_DATA.length) index = 0;
        currentIndex = index;

        const data = INFRA_GALLERY_DATA[currentIndex];
        if (lightboxImg) lightboxImg.src = data.image;
        if (lightboxTag) {
            lightboxTag.innerHTML = data.tag;
            lightboxTag.className = data.tagClass;
        }
        if (lightboxTitle) lightboxTitle.textContent = data.title;
        if (lightboxDesc) lightboxDesc.textContent = data.desc;
        if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${INFRA_GALLERY_DATA.length}`;
    }

    function openLightbox(index) {
        renderPhoto(index);
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Attach click listeners to cards
    const cards = document.querySelectorAll(".infra-card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const idx = parseInt(card.getAttribute("data-index") || "0", 10);
            openLightbox(idx);
        });

        // Accessibility keyboard enter
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const idx = parseInt(card.getAttribute("data-index") || "0", 10);
                openLightbox(idx);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (backdrop) backdrop.addEventListener("click", closeLightbox);

    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            renderPhoto(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            renderPhoto(currentIndex + 1);
        });
    }

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowLeft") {
            renderPhoto(currentIndex - 1);
        } else if (e.key === "ArrowRight") {
            renderPhoto(currentIndex + 1);
        }
    });
}

// ------------------------------------------
// 8. DYNAMIC AMBIENT PARTICLES CANVAS ENGINE
// ------------------------------------------
function initAmbientParticlesCanvas() {
    const canvas = document.getElementById("ambient-particles-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationFrameId = null;
    let isTabVisible = true;

    // Mouse coordinates
    let mouse = { x: -1000, y: -1000, radius: 130 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Scroll velocity tracking - particles accelerate with user scroll!
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    window.addEventListener("scroll", () => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;
        scrollVelocity += delta * 0.12;
        lastScrollY = currentY;
    }, { passive: true });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", () => {
        resize();
        initParticles();
    });

    // Color palette: ARV Primary Cyan, Light Cyan, Eco Green, Clean Air White
    const PALETTE = [
        "rgba(0, 152, 218, ",  // ARV Primary
        "rgba(0, 210, 255, ",  // Light Cyan
        "rgba(0, 168, 89, ",   // ARV Green
        "rgba(255, 255, 255, " // Clean Air White
    ];

    function createParticle() {
        const colorPrefix = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.6 + 1.1,
            baseAlpha: Math.random() * 0.35 + 0.15,
            colorPrefix: colorPrefix,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(Math.random() * 0.45 + 0.2),
            waveOffset: Math.random() * Math.PI * 2,
            waveSpeed: Math.random() * 0.02 + 0.01
        };
    }

    function initParticles() {
        particles = [];
        const count = width < 768 ? 26 : (width < 1200 ? 46 : 64);
        for (let i = 0; i < count; i++) {
            particles.push(createParticle());
        }
    }

    resize();
    initParticles();

    function render() {
        if (!isTabVisible) {
            animationFrameId = requestAnimationFrame(render);
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Smooth damping on scroll velocity
        scrollVelocity *= 0.90;

        // Update & draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Harmonic airflow wave + scroll velocity reaction
            p.waveOffset += p.waveSpeed;
            p.x += p.vx + Math.sin(p.waveOffset) * 0.22;
            p.y += p.vy - scrollVelocity;

            // Screen boundary wrapping
            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            } else if (p.y > height + 10) {
                p.y = -10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;

            // Mouse proximity interaction (gentle deflection)
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const force = (mouse.radius - dist) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                p.x -= Math.cos(angle) * force * 2.5;
                p.y -= Math.sin(angle) * force * 2.5;
            }

            // Draw glowing particle
            const currentAlpha = p.baseAlpha + Math.sin(p.waveOffset) * 0.08;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.colorPrefix + Math.max(0.06, currentAlpha) + ")";
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.colorPrefix + "0.65)";
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Draw connective filaments between nearby particles
        ctx.lineWidth = 0.55;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 92) {
                    const lineAlpha = (1 - dist / 92) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 152, 218, ${lineAlpha})`;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    document.addEventListener("visibilitychange", () => {
        isTabVisible = !document.hidden;
    });
}

// ------------------------------------------
// 9. SCROLL REVEAL MOTION ENGINE (BI-DIRECTIONAL)
// ------------------------------------------
function initScrollReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    document.body.classList.add("js-motion-ready");

    // Automatically decorate sections, headers, and grids
    const revealContainers = [
        ".section-header",
        ".about-company-section .about-grid",
        ".infra-stats-strip",
        ".infra-showcase-grid",
        ".infra-caps-grid",
        ".testing-grid",
        ".vision-mission-grid",
        ".values-grid",
        ".catalog-grid",
        ".spares-4col-grid",
        ".services-grid",
        ".contact-grid",
        ".clients-marquee-container"
    ];

    revealContainers.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
            el.classList.add("reveal");
            if (sel.includes("grid") || sel.includes("strip")) {
                el.classList.add("reveal-stagger");
            }
        }
    });

    // Decorate individual cards
    const cardSelectors = [
        ".infra-card",
        ".product-card",
        ".spare-card-grid-item",
        ".testing-card",
        ".infra-cap-card",
        ".service-card",
        ".vision-card",
        ".mission-card",
        ".value-card"
    ];

    cardSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(card => {
            if (!card.classList.contains("reveal")) {
                card.classList.add("reveal");
            }
        });
    });

    // Bi-directional observer: animates in whenever scrolled into view,
    // and resets when scrolled far out of view so it moves into place again on every scroll!
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            } else {
                const rect = entry.boundingClientRect;
                const winH = window.innerHeight;
                // Only reset if well outside viewport to avoid edge stutter
                if (rect.top > winH + 40 || rect.bottom < -40) {
                    entry.target.classList.remove("active");
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom").forEach(el => {
        observer.observe(el);
    });
}

// ------------------------------------------
// 10. ANIMATED STATS NUMBERS ENGINE (BI-DIRECTIONAL)
// ------------------------------------------
function initAnimatedCounters() {
    const counterElements = document.querySelectorAll(".stat-number, .stat-item h3");
    if (!counterElements.length) return;

    function animateCount(el) {
        if (!el.dataset.origText) {
            el.dataset.origText = el.textContent.trim();
        }
        const rawText = el.dataset.origText;
        const match = rawText.match(/(\d[\d,]*)/);
        if (!match) return;

        const numStr = match[1].replace(/,/g, "");
        const targetNum = parseInt(numStr, 10);
        if (isNaN(targetNum) || targetNum <= 0) return;

        const prefix = rawText.substring(0, match.index);
        const suffix = rawText.substring(match.index + match[1].length);

        const duration = 1600;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentNum = Math.floor(targetNum * easeProgress);

            const formatted = targetNum >= 1000 ? currentNum.toLocaleString("en-US") : currentNum;
            el.textContent = `${prefix}${formatted}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                const finalFormatted = targetNum >= 1000 ? targetNum.toLocaleString("en-US") : targetNum;
                el.textContent = `${prefix}${finalFormatted}${suffix}`;
            }
        }

        requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
            } else {
                const rect = entry.boundingClientRect;
                const winH = window.innerHeight;
                if (rect.top > winH + 60 || rect.bottom < -60) {
                    if (entry.target.dataset.origText) {
                        const rawText = entry.target.dataset.origText;
                        const match = rawText.match(/(\d[\d,]*)/);
                        if (match) {
                            const prefix = rawText.substring(0, match.index);
                            const suffix = rawText.substring(match.index + match[1].length);
                            entry.target.textContent = `${prefix}0${suffix}`;
                        }
                    }
                }
            }
        });
    }, {
        threshold: 0.25
    });

    counterElements.forEach(el => observer.observe(el));
}

// ------------------------------------------
// 11. CONTINUOUS SCROLL MOTION & PARALLAX ENGINE
// ------------------------------------------
function initScrollParallaxEngine() {
    const scrollBar = document.getElementById("scroll-progress");
    const glowBlue = document.querySelector(".glow-blue");
    const glowGreen = document.querySelector(".glow-green");
    const glowCenter = document.querySelector(".glow-center");
    const heroVisual = document.querySelector(".hero-visual");
    const heroContent = document.querySelector(".hero-content");

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const winH = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - winH;
        const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        // 1. Header scroll progress line
        if (scrollBar) {
            scrollBar.style.width = `${scrollPercent}%`;
        }

        // 2. Ambient glow orbs parallax translation
        if (glowBlue) {
            glowBlue.style.transform = `translate3d(0, ${(scrollY * 0.16).toFixed(1)}px, 0)`;
        }
        if (glowGreen) {
            glowGreen.style.transform = `translate3d(0, ${(-scrollY * 0.12).toFixed(1)}px, 0)`;
        }
        if (glowCenter) {
            glowCenter.style.transform = `translate3d(0, ${(scrollY * 0.08).toFixed(1)}px, 0)`;
        }

        // 3. Hero content and visual smooth parallax
        if (scrollY < winH) {
            if (heroContent) {
                heroContent.style.transform = `translate3d(0, ${(scrollY * 0.12).toFixed(1)}px, 0)`;
            }
            if (heroVisual) {
                heroVisual.style.transform = `translate3d(0, ${(scrollY * 0.22).toFixed(1)}px, 0)`;
            }
        }

        // 4. Smooth image parallax inside cards during scrolling
        const cards = document.querySelectorAll(".infra-card, .product-card, .spare-card-grid-item");
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < winH && rect.bottom > 0) {
                const mid = (rect.top + rect.height / 2 - winH / 2) / winH;
                const shiftY = Math.max(-16, Math.min(16, mid * -22));
                card.style.setProperty("--scroll-y-shift", `${shiftY.toFixed(1)}px`);
            }
        });

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    updateParallax();
}

