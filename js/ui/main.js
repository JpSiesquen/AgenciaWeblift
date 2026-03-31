/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/ui/main.js
   Inicializa todos los módulos UI.
   Requiere que se carguen antes: intro.js, navbar.js, animations.js
═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  // 1. Animación de intro (solo actúa si existe #intro-screen)
  if (typeof IntroUI !== "undefined") IntroUI.init();

  // 2. Navbar — scroll, hamburguesa, estado del usuario
  if (typeof NavbarUI !== "undefined") NavbarUI.init();

  // 3. Cursor personalizado + scroll reveal
  if (typeof AnimationsUI !== "undefined") AnimationsUI.init();

  // 4. Controladores Firebase
  // Solo se activan si Firebase cargó correctamente
  try {
    if (typeof auth !== "undefined") {
      if (document.getElementById("loginForm"))    AuthController.initLogin();
      if (document.getElementById("registerForm")) AuthController.initRegister();
      if (document.getElementById("contactForm"))  ContactController.init();
    }
  } catch (e) {
    console.warn("Firebase no disponible:", e.message);
  }

});