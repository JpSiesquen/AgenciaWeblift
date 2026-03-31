/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/ui/animations.js
   Scroll reveal y cursor
═══════════════════════════════════════════════════════════ */
 
const AnimationsUI = {
  init() {
    this.initScrollReveal();
    this.initCursor();
  },
 
  initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
  },
 
  initCursor() {
    if (window.matchMedia("(hover: none)").matches) return;
    const cursor = document.getElementById("cursor");
    const ring   = document.getElementById("cursorRing");
    if (!cursor || !ring) return;
 
    let mx=0, my=0, rx=0, ry=0;
    document.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx-5}px,${my-5}px)`;
    });
    const anim = () => {
      rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
      ring.style.transform = `translate(${rx-18}px,${ry-18}px)`;
      requestAnimationFrame(anim);
    };
    anim();
 
    document.querySelectorAll("a,button,.service-card,.portfolio-card,.testi-card,.pricing-card").forEach(el => {
      el.addEventListener("mouseenter", () => { ring.style.width="52px"; ring.style.height="52px"; ring.style.opacity="0.3"; });
      el.addEventListener("mouseleave", () => { ring.style.width="36px"; ring.style.height="36px"; ring.style.opacity="0.5"; });
    });
  }
};
 
/* ── Inicializar todo al cargar el DOM ── */
document.addEventListener("DOMContentLoaded", () => {
  IntroUI.init();
  NavbarUI.init();
  AnimationsUI.init();
 
  // Inicializar controladores según la página actual
  if (document.getElementById("loginForm"))    AuthController.initLogin();
  if (document.getElementById("registerForm")) AuthController.initRegister();
  if (document.getElementById("contactForm"))  ContactController.init();
});