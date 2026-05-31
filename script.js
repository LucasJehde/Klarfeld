const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function closeMenu() {
  if (!header || !menuToggle) return;

  header.classList.remove("nav-open");
  document.body.classList.remove("menu-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function scrollToAnchor(hash) {
  if (!hash || hash === "#") return;

  const target = document.querySelector(hash);
  if (!target) return;

  const offset = (header?.offsetHeight || 0) + 24;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: "smooth" });
}

if (header && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    event.preventDefault();
    closeMenu();
    history.pushState(null, "", hash);
    scrollToAnchor(hash);
  });
});

function initReveals() {
  const revealItems = [
    ...document.querySelectorAll(".detail-list article, .detail-cta, .open-principles article, .route-list a")
  ];

  revealItems.forEach((item) => item.classList.add("reveal-item"));

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initGsap() {
  if (prefersReducedMotion || !window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const isDesktop = window.matchMedia("(min-width: 981px)").matches;

  gsap.from(".hero-copy > *", {
    autoAlpha: 0,
    y: 18,
    duration: 0.7,
    ease: "power2.out",
    stagger: 0.08
  });

  gsap.from(".audit-panel", {
    autoAlpha: 0,
    y: 22,
    duration: 0.72,
    ease: "power2.out",
    delay: 0.18
  });

  gsap.from(".audit-row, .audit-priority", {
    autoAlpha: 0,
    y: 10,
    duration: 0.42,
    ease: "power2.out",
    stagger: 0.12,
    delay: 0.38
  });

  document.querySelectorAll(".audit-row strong").forEach((score, index) => {
    const value = score.textContent.trim();
    const match = value.match(/^(\d+)\/100$/);
    if (!match) return;

    const state = { value: 0 };
    gsap.to(state, {
      value: Number(match[1]),
      duration: 0.85,
      delay: 0.55 + index * 0.08,
      ease: "power2.out",
      onUpdate: () => {
        score.textContent = `${Math.round(state.value)}/100`;
      }
    });
  });

  gsap.from(".manifest-line span", {
    scrollTrigger: {
      trigger: ".manifest",
      start: "top 72%"
    },
    autoAlpha: 0,
    y: 24,
    duration: 0.72,
    ease: "power2.out",
    stagger: 0.12
  });

  const rail = document.querySelector(".rail-track");
  const railCards = [...document.querySelectorAll(".rail-card")];
  const railLine = document.querySelector(".rail-line");

  if (rail && railCards.length && isDesktop) {
    ScrollTrigger.create({
      trigger: ".method-rail",
      start: "top top+=72",
      end: "bottom center",
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = Math.min(1, Math.max(0, self.progress));
        const lineHeight = railLine?.offsetHeight || rail.offsetHeight;
        rail.style.setProperty("--rail-progress", `${progress * 100}%`);
        rail.style.setProperty("--rail-dot", `${12 + progress * Math.max(1, lineHeight - 24)}px`);

        const activeIndex = Math.min(railCards.length - 1, Math.floor(progress * railCards.length));
        railCards.forEach((card, index) => card.classList.toggle("is-active", index === activeIndex));
      }
    });
  }

  if (isDesktop) {
    document.querySelectorAll(".parallax-media img").forEach((image) => {
      gsap.fromTo(
        image,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: image.closest("section") || image,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });

    const serviceSection = document.querySelector(".services");
    const serviceTrack = document.querySelector(".service-track");
    const serviceWrap = document.querySelector(".service-track-wrap");

    if (serviceSection && serviceTrack && serviceWrap) {
      const distance = () => Math.max(0, serviceTrack.scrollWidth - serviceWrap.clientWidth);

      gsap.to(serviceTrack, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: serviceSection,
          start: "top top+=80",
          end: () => `+=${distance() + window.innerHeight * 0.45}`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
    }
  }
}

window.addEventListener("load", () => {
  initReveals();
  initGsap();

  if (window.location.hash) {
    window.setTimeout(() => scrollToAnchor(window.location.hash), 80);
  }
});
