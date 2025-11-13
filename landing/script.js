document.addEventListener("DOMContentLoaded", () => {
    // ===== ANIMACIÓN DE SCROLL =====
    // Esta función hace que las secciones aparezcan suavemente

    const sections = document.querySelectorAll(".section");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1, // La sección se activa cuando el 10% es visible
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });

    // ===== SCROLL SUAVE PARA EL BOTÓN DE DESCARGA =====
    // Esto hace que el botón "Descargar" del header te lleve suavemente
    // a la sección final de CTA en lugar de saltar bruscamente.

    const downloadButton = document.querySelector("header .btn-primary");

    if (downloadButton) {
        downloadButton.addEventListener("click", (e) => {
            e.preventDefault(); // Previene el salto instantáneo

            const targetId = downloadButton.getAttribute("href"); // Obtiene el "#final-cta"
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    }

    // ===== SCROLL SUAVE PARA EL BOTÓN DE FLECHA HACIA ABAJO =====
    const scrollBtn = document.querySelector(".hero-scroll-btn");

    if (scrollBtn) {
        scrollBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const targetId = scrollBtn.getAttribute("href");
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    }

    // ===== CARRUSEL DE PROBLEMAS =====
    const carousel = document.querySelector(".carousel");
    if (carousel) {
        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
        const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
        const btnPrev = carousel.querySelector(".carousel-btn-prev");
        const btnNext = carousel.querySelector(".carousel-btn-next");
        let currentIndex = 0;
        const total = slides.length;
        const autoplayDelay = 3500;
        let autoplayId = null;

        function updateTrack() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((d, i) => {
                d.classList.toggle("active", i === currentIndex);
                d.setAttribute(
                    "aria-selected",
                    i === currentIndex ? "true" : "false"
                );
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % total;
            updateTrack();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + total) % total;
            updateTrack();
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, total - 1));
            updateTrack();
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayId = setInterval(nextSlide, autoplayDelay);
        }

        function stopAutoplay() {
            if (autoplayId) {
                clearInterval(autoplayId);
                autoplayId = null;
            }
        }

        // Wire dots
        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                goToSlide(i);
            });
        });

        // Wire buttons
        if (btnPrev) {
            btnPrev.addEventListener("click", () => {
                prevSlide();
            });
        }

        if (btnNext) {
            btnNext.addEventListener("click", () => {
                nextSlide();
            });
        }

        // Pause on hover/focus
        carousel.addEventListener("mouseenter", stopAutoplay);
        carousel.addEventListener("mouseleave", startAutoplay);
        carousel.addEventListener("focusin", stopAutoplay);
        carousel.addEventListener("focusout", startAutoplay);

        // Init
        updateTrack();
        startAutoplay();
    }

    // ===== FAQ ACORDEONES =====
    const faqHeaders = document.querySelectorAll(".faq-header");

    faqHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            const faqItem = header.parentElement;
            const isActive = faqItem.classList.contains("active");

            // Cerrar todos los FAQ
            document.querySelectorAll(".faq-item").forEach((item) => {
                item.classList.remove("active");
                item.querySelector(".faq-header").setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

            // Abrir el actual si no estaba abierto
            if (!isActive) {
                faqItem.classList.add("active");
                header.setAttribute("aria-expanded", "true");
            }
        });
    });

    // ===== MODAL DE NOTIFICACIÓN =====
    const modal = document.getElementById("notify-modal");
    const notifyForm = document.getElementById("notify-form");
    const openModalButtons = document.querySelectorAll(".open-notify-modal");
    const modalClose = document.querySelector(".modal-close");

    // Abrir modal
    openModalButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    // Cerrar modal
    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
        notifyForm.reset();
    }

    modalClose.addEventListener("click", closeModal);

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar al presionar Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });

    // Enviar formulario
    notifyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = notifyForm.querySelector('input[type="email"]').value;

        // Aquí puedes enviar el email a tu servidor
        console.log("Email para notificación:", email);

        // Mostrar mensaje de éxito
        const btn = notifyForm.querySelector("button");
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Listo!';
        btn.disabled = true;
        btn.style.opacity = "0.7";

        setTimeout(() => {
            closeModal();
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.opacity = "1";
        }, 2000);
    });

    // ===== HAMBURGER MENU =====
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // Cerrar menú cuando se hace click en un link
        const navItems = navLinks.querySelectorAll("a");
        navItems.forEach((item) => {
            item.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }
});
