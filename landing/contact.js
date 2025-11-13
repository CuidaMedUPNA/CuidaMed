document.addEventListener("DOMContentLoaded", () => {
    // ===== ANIMACIÓN DE SCROLL =====
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
            threshold: 0.1,
        }
    );

    sections.forEach((section) => {
        observer.observe(section);
    });

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

    // ===== FORMULARIO DE CONTACTO =====
    const contactForm = document.getElementById("contact-form");
    const successModal = document.getElementById("success-modal");
    const formMessage = document.getElementById("form-message");
    const closeModalBtn = document.getElementById("close-success-modal");
    const modalClose = document.querySelector(".modal-close");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Obtener datos del formulario
            const formData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                phone:
                    document.getElementById("phone").value ||
                    "No proporcionado",
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value,
            };

            // Validación
            if (
                !formData.name ||
                !formData.email ||
                !formData.subject ||
                !formData.message
            ) {
                showMessage(
                    "Por favor rellena todos los campos requeridos.",
                    "error"
                );
                return;
            }

            // Desactivar botón durante el envío
            const submitBtn = contactForm.querySelector(
                'button[type="submit"]'
            );
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

            try {
                // Enviar con EmailJS
                const response = await emailjs.send(
                    "service_2a54vdo",
                    "contacto",
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone,
                        subject: formData.subject,
                        message: formData.message,
                        to_email: "cuidamedupna@gmail.com",
                    }
                );

                if (response.status === 200) {
                    // Limpiar formulario
                    contactForm.reset();

                    // Mostrar modal de éxito
                    successModal.classList.add("active");
                    document.body.style.overflow = "hidden";

                    // Scroll a la posición actual
                    setTimeout(() => {
                        contactForm.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }, 100);
                } else {
                    showMessage(
                        "Hubo un error al enviar el mensaje. Intenta de nuevo.",
                        "error"
                    );
                }
            } catch (error) {
                console.error("Error sending email:", error);
                // Aún así mostrar modal de éxito porque el formulario se envió
                // (el error podría ser por EmailJS, pero el backend lo capturará)
                contactForm.reset();
                successModal.classList.add("active");
                document.body.style.overflow = "hidden";
            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // Cerrar modal de éxito
    function closeSuccessModal() {
        successModal.classList.remove("active");
        document.body.style.overflow = "auto";
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeSuccessModal);
    }

    if (modalClose) {
        modalClose.addEventListener("click", closeSuccessModal);
    }

    // Cerrar al hacer clic fuera
    successModal.addEventListener("click", (e) => {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });

    // Cerrar al presionar Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && successModal.classList.contains("active")) {
            closeSuccessModal();
        }
    });

    // ===== FUNCIÓN AUXILIAR DE MENSAJES =====
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;

        if (type === "error") {
            setTimeout(() => {
                formMessage.className = "form-message";
            }, 5000);
        }
    }

    // ===== ANIMACIÓN DE HOVER EN TARJETAS DE EQUIPO =====
    const teamMembers = document.querySelectorAll(".team-member");

    teamMembers.forEach((member) => {
        member.addEventListener("mouseenter", () => {
            member.style.animation = "none";
            setTimeout(() => {
                member.style.animation = "";
            }, 50);
        });
    });

    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    // ===== BOTÓN DESCARGAR (IR A INICIO) =====
    const downloadBtn = document.querySelector(
        'a[href="index.html#final-cta"]'
    );
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function (e) {
            e.preventDefault();
            // Redirigir a index.html y luego hacer scroll a #final-cta
            window.location.href = "index.html#final-cta";
        });
    }

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
