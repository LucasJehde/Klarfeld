const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");

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

window.addEventListener("load", () => {
  if (window.location.hash) {
    window.setTimeout(() => scrollToAnchor(window.location.hash), 80);
  }
});
