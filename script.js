/**
 * =====================================================
 * ROMUSHA ROAD TO JANNAH — MASTER JAVASCRIPT
 * Features:
 *  - Navbar Sticky & ScrollSpy
 *  - Mobile Drawer with Backdrop & Keyboard Trap
 *  - Non-flickering Scroll Reveal (Smooth IntersectionObserver)
 *  - Gallery Lightbox Modal with Keyboard Navigation
 *  - One-Click Bank Account Copy with Toast Feedback
 *  - Accessible FAQ Accordion
 *  - Back-to-Top Floating Trigger
 * =====================================================
 */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =====================================================
       1. NAVBAR STICKY & SCROLLSPY
    ===================================================== */
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-menu .nav-link");

    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    function handleScrollSpy() {
        const scrollPosition = window.scrollY + 140;
        const navSectionIds = new Set(
            Array.from(navLinks).map(function (link) {
                return link.getAttribute("href").replace(/^#/, "");
            })
        );

        let activeSectionId = null;

        sections.forEach(function (section) {
            const sectionId = section.getAttribute("id");
            if (!navSectionIds.has(sectionId)) return;

            const sectionTop = section.offsetTop;
            if (scrollPosition >= sectionTop) {
                activeSectionId = sectionId;
            }
        });

        // Highlight last nav item when near the bottom of the page
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
            const navSectionList = Array.from(sections).filter(function (s) {
                return navSectionIds.has(s.getAttribute("id"));
            });
            if (navSectionList.length > 0) {
                activeSectionId = navSectionList[navSectionList.length - 1].getAttribute("id");
            }
        }

        if (activeSectionId) {
            navLinks.forEach(function (link) {
                link.classList.toggle("active", link.getAttribute("href") === "#" + activeSectionId);
            });
        }
    }

    window.addEventListener("scroll", function () {
        handleNavbarScroll();
        handleScrollSpy();
    }, { passive: true });

    // Initial check on load
    handleNavbarScroll();
    handleScrollSpy();


    /* =====================================================
       2. MOBILE DRAWER NAVIGATION
    ===================================================== */
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navBackdrop = document.getElementById("navBackdrop");

    function openMobileMenu() {
        if (!navMenu || !menuToggle) return;
        navMenu.classList.add("active");
        menuToggle.classList.add("active");
        menuToggle.setAttribute("aria-expanded", "true");
        if (navBackdrop) navBackdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        if (!navMenu || !menuToggle) return;
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        if (navBackdrop) navBackdrop.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            const isOpened = navMenu.classList.contains("active");
            if (isOpened) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener("click", closeMobileMenu);
    }

    // Close when clicking any nav link
    const allNavAnchors = document.querySelectorAll(".nav-menu a");
    allNavAnchors.forEach(function (anchor) {
        anchor.addEventListener("click", function () {
            closeMobileMenu();
        });
    });

    // Close on Escape key
    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && navMenu && navMenu.classList.contains("active")) {
            closeMobileMenu();
        }
    });


    /* =====================================================
       3. SMOOTH SCROLL REVEAL (NO FLICKERING)
    ===================================================== */
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        // Unobserve once revealed so it never jitters on scroll up
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(function (el) {
            el.classList.add("revealed");
        });
    }


    /* =====================================================
       4. GALLERY LIGHTBOX MODAL
    ===================================================== */
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxBackdrop = document.getElementById("lightboxBackdrop");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCat = document.getElementById("lightboxCategory");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxCounter = document.getElementById("lightboxCounter");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    // Build gallery data directly from DOM so captions stay in sync
    const galleryData = Array.from(galleryItems).map(function (item) {
        const img = item.querySelector("img");
        const cat = item.querySelector(".gallery-cat");
        const caption = item.querySelector(".gallery-caption");
        return {
            src: img ? img.getAttribute("src") : "",
            alt: img ? img.getAttribute("alt") : "",
            cat: cat ? cat.textContent.trim() : "",
            title: caption ? caption.textContent.trim() : ""
        };
    });

    let currentPhotoIndex = 0;
    let lastFocusedBeforeLightbox = null;
    let isSingleLightboxMode = false;
    const lightboxNav = document.querySelector(".lightbox-nav");

    function updateLightboxContent(index) {
        if (!galleryData[index]) return;
        currentPhotoIndex = index;

        const data = galleryData[index];
        if (lightboxImg) {
            lightboxImg.src = data.src;
            lightboxImg.alt = data.alt;
        }
        if (lightboxCat) lightboxCat.textContent = data.cat;
        if (lightboxTitle) lightboxTitle.textContent = data.title;
        if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${galleryData.length}`;
    }

    function openLightbox(index) {
        if (!lightboxModal) return;
        isSingleLightboxMode = false;
        if (lightboxNav) lightboxNav.style.display = "";
        lastFocusedBeforeLightbox = document.activeElement;
        updateLightboxContent(index);
        lightboxModal.classList.add("active");
        lightboxModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (lightboxClose) lightboxClose.focus();
    }

    function openSingleLightbox(src, cat, title, alt) {
        if (!lightboxModal) return;
        isSingleLightboxMode = true;
        if (lightboxNav) lightboxNav.style.display = "none";
        lastFocusedBeforeLightbox = document.activeElement;
        if (lightboxImg) {
            lightboxImg.src = src;
            lightboxImg.alt = alt || title;
        }
        if (lightboxCat) lightboxCat.textContent = cat;
        if (lightboxTitle) lightboxTitle.textContent = title;
        lightboxModal.classList.add("active");
        lightboxModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (lightboxClose) lightboxClose.focus();
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove("active");
        lightboxModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocusedBeforeLightbox && typeof lastFocusedBeforeLightbox.focus === "function") {
            lastFocusedBeforeLightbox.focus();
        }
    }

    function prevPhoto() {
        if (isSingleLightboxMode) return;
        const newIndex = (currentPhotoIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent(newIndex);
    }

    function nextPhoto() {
        if (isSingleLightboxMode) return;
        const newIndex = (currentPhotoIndex + 1) % galleryData.length;
        updateLightboxContent(newIndex);
    }

    galleryItems.forEach(function (item) {
        const idx = parseInt(item.getAttribute("data-index"), 10) || 0;
        item.addEventListener("click", function () {
            openLightbox(idx);
        });

        // Accessibility: allow Enter and Space to open
        item.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(idx);
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener("click", prevPhoto);
    if (lightboxNext) lightboxNext.addEventListener("click", nextPhoto);

    // Keyboard support for Lightbox
    window.addEventListener("keydown", function (e) {
        if (!lightboxModal || !lightboxModal.classList.contains("active")) return;

        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowLeft") {
            prevPhoto();
        } else if (e.key === "ArrowRight") {
            nextPhoto();
        }
    });


    /* =====================================================
       5. STATIC QRIS POSTER ACTIONS & TOAST NOTIFICATION
    ===================================================== */
    const toastContainer = document.getElementById("toastContainer");

    function showToast(message) {
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20" style="color: #10b981;">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(function () {
            toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            toast.style.opacity = "0";
            toast.style.transform = "translateY(-10px)";
            setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3200);
    }

    const qrisPosterBtn = document.getElementById("qrisPosterBtn");
    const btnViewPoster = document.getElementById("btnViewPoster");
    const btnDownloadQris = document.getElementById("btnDownloadQris");

    function openQrisPosterLightbox() {
        openSingleLightbox(
            "images/qris-romusha.jpg",
            "QRIS RESMI DONASI",
            "Romusha Road to Jannah, Organisasi (NMID: ID1026632994681)",
            "Poster QRIS Resmi ROMUSHA Road to Jannah"
        );
    }

    if (qrisPosterBtn) qrisPosterBtn.addEventListener("click", openQrisPosterLightbox);
    if (btnViewPoster) btnViewPoster.addEventListener("click", openQrisPosterLightbox);
    if (btnDownloadQris) {
        btnDownloadQris.addEventListener("click", function () {
            showToast("Poster QRIS sedang diunduh!");
        });
    }


    /* =====================================================
       6. ACCESSIBLE FAQ ACCORDION
    ===================================================== */
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(function (item) {
        const trigger = item.querySelector(".faq-trigger");
        const content = item.querySelector(".faq-content");

        if (trigger && content) {
            trigger.addEventListener("click", function () {
                const isActive = item.classList.contains("active");

                // Close all other FAQ items for a clean accordion experience
                faqItems.forEach(function (other) {
                    if (other !== item) {
                        other.classList.remove("active");
                        const otherTrigger = other.querySelector(".faq-trigger");
                        const otherContent = other.querySelector(".faq-content");
                        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
                        if (otherContent) otherContent.style.maxHeight = null;
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove("active");
                    trigger.setAttribute("aria-expanded", "false");
                    content.style.maxHeight = null;
                } else {
                    item.classList.add("active");
                    trigger.setAttribute("aria-expanded", "true");
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    });


    /* =====================================================
       7. BACK TO TOP BUTTON
    ===================================================== */
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", function () {
        if (!backToTop) return;
        if (window.scrollY > 350) {
            backToTop.classList.add("active");
        } else {
            backToTop.classList.remove("active");
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    console.log("ROMUSHA Road to Jannah: Website siap dan interaktif!");
});