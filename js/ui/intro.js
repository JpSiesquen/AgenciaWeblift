/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/ui/intro.js
   Animación de entrada del logo
═══════════════════════════════════════════════════════════ */

const IntroUI = {
  init() {
    const screen = document.getElementById("intro-screen");
    if (!screen) return;

    // Crear partículas aleatorias
    this.createParticles(screen);

    // Esperar que cargue la animación (2.8s total) y luego desvanecer
    setTimeout(() => {
      screen.classList.add("exit");
      screen.addEventListener("animationend", () => {
        screen.style.display = "none";
        document.body.style.overflow = "";
      }, { once: true });
    }, 2800);

    // Bloquear scroll durante intro
    document.body.style.overflow = "hidden";
  },

  createParticles(screen) {
    const container = screen.querySelector(".intro-particles");
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "intro-particle";
      p.style.cssText = `
        left:   ${Math.random() * 100}%;
        top:    ${Math.random() * 100}%;
        --dur:  ${2 + Math.random() * 3}s;
        --delay:${Math.random() * 2}s;
        --y:    ${-10 - Math.random() * 30}px;
        --x:    ${(Math.random() - 0.5) * 40}px;
        width:  ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        opacity: ${0.2 + Math.random() * 0.4};
      `;
      container.appendChild(p);
    }
  }
};

