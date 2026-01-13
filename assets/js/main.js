const btn = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (btn && nav) {
  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();
