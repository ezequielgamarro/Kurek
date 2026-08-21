/* ============================================================
   AGENCIA DIGITAL - JavaScript principal
   Menu movil, navbar con scroll, animaciones, formulario
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Menu hamburguesa (movil)
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      hamburger.classList.toggle("is-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Cerrar menu al hacer clic en un enlace
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        hamburger.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  // 2. Navbar con efecto de scroll
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
  }

  // 2b. Glider nav - pestañas deslizantes (escritorio)
  const gliderNav = document.querySelector(".glider-nav");
  if (gliderNav) {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    gliderNav.querySelectorAll(".glider-tab a").forEach((link) => {
      const label = link.closest(".glider-tab");
      const radio = document.getElementById(label ? label.getAttribute("for") : null);
      const href = link.getAttribute("href") || "";

      link.addEventListener("click", (e) => {
        // Activar la radio para desplazar el glider
        if (radio && !radio.checked) radio.checked = true;

        // Home: volver arriba sin recargar si ya estamos en index
        if (href === "index.html" && currentPage === "index.html") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        // Anclas internas (misma página): scroll suave
        if (href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          return;
        }

        // Otros casos (servicios.html, nosotros.html, contacto.html, index.html desde otra página):
        // navegación normal - permitimos el click por defecto
      });
    });
  }

  // 3. Animaciones de entrada al hacer scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // 4. Contador numerico animado en el hero
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const duration = 1500;
    const startTime = performance.now();
    const step = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      el.textContent = current + (el.dataset.suffix || "");
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + (el.dataset.suffix || "");
    };
    requestAnimationFrame(step);
  };

  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  // 5. Contact form removed - uses external application form.
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = document.getElementById("formStatus");
      const name = contactForm.querySelector("#name");
      const email = contactForm.querySelector("#email");
      const message = contactForm.querySelector("#message");

      // Validacion basica
      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        status.textContent = "Please complete all required fields.";
        status.className = "form-status is-visible form-status--error";
        return;
      }

      // Simular envio
      const btn = contactForm.querySelector("button[type='submit']");
      const labelSpan = btn.querySelector("span");
      const originalText = labelSpan ? labelSpan.textContent : btn.textContent;
      if (labelSpan) labelSpan.textContent = "Sending...";
      btn.disabled = true;

      setTimeout(() => {
        status.textContent = "Message sent successfully! We will contact you soon.";
        status.className = "form-status is-visible form-status--success";
        contactForm.reset();
        if (labelSpan) labelSpan.textContent = originalText;
        btn.disabled = false;

        setTimeout(() => {
          status.className = "form-status";
        }, 6000);
      }, 1200);
    });
  }

  // 6. Año dinamico en el footer
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // 7. Scrollspy - sincroniza el glider-nav con la seccion visible (solo en one-page index)
  const pageName = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (pageName === "index.html") {
    const spySections = [
      { el: document.getElementById("services"), radio: "tab-services" },
      { el: document.getElementById("talent"), radio: "tab-talent" },
      { el: document.getElementById("process"), radio: "tab-process" },
      { el: document.getElementById("industries"), radio: "tab-industries" },
      { el: document.getElementById("about"), radio: "tab-about" },
      { el: document.getElementById("contact"), radio: "tab-contact" },
    ].filter((s) => s.el);

    const spyHome = "tab-home";
    let spyTicking = false;

    const updateScrollSpy = () => {
      const offset = 120;
      let active = spyHome;
      spySections.forEach((s) => {
        if (s.el.getBoundingClientRect().top <= offset) {
          active = s.radio;
        }
      });
      const radio = document.getElementById(active);
      if (radio && !radio.checked) radio.checked = true;
    };

    window.addEventListener("scroll", () => {
      if (!spyTicking) {
        window.requestAnimationFrame(() => {
          updateScrollSpy();
          spyTicking = false;
        });
        spyTicking = true;
      }
    });
    updateScrollSpy();
  }
});
