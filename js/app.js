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
            let body = `Dear Sales Team,\n\n`;
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

            // Create mailto link targeting sales@arvfiltration.in
            let mailto = `mailto:sales@arvfiltration.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Open user's email client
            window.location.href = mailto;

            // Reset cart
            rfqCart = [];
            saveCart();
            updateCartUI();

            // Close Drawer
            document.getElementById("rfq-drawer").classList.remove("active");
            document.getElementById("drawer-overlay").classList.remove("active");

            alert("Your RFQ email has been prepared! It will now open in your mail client. Please click send in your email client to submit it to sales@arvfiltration.in");
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
