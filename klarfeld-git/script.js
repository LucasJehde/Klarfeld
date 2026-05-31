const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const journeyCards = [...document.querySelectorAll(".journey-cards li")];

function closeMenu() {
  header.classList.remove("nav-open");
  document.body.classList.remove("menu-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function scrollToAnchor(hash) {
  const target = document.querySelector(hash);
  if (!target) return;

  const offset = header.offsetHeight + 24;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: "smooth" });
}

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

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

if ("IntersectionObserver" in window) {
  const journeyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.28, rootMargin: "0px 0px -12% 0px" }
  );

  journeyCards.forEach((card, index) => {
    card.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    journeyObserver.observe(card);
  });
} else {
  journeyCards.forEach((card) => card.classList.add("is-visible"));
}

window.addEventListener("load", () => {
  if (window.location.hash) {
    window.setTimeout(() => scrollToAnchor(window.location.hash), 80);
  }
});
