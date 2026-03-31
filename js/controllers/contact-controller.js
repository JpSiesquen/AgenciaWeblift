/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/controllers/contact-controller.js
   
   CAPA CONTROLADOR: maneja el formulario de cotización.
   - Si el usuario NO está logueado → muestra aviso de login
   - Si está logueado → permite enviar y guarda en Firestore
═══════════════════════════════════════════════════════════ */

const ContactController = {

  currentUser: null,

  init() {
    // Escuchar cambios de autenticación
    AuthService.onAuthStateChanged((user) => {
      this.currentUser = user;
      this.updateFormState(user);
    });

    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!this.currentUser) {
        this.redirectToLogin();
        return;
      }
      if (!this.validateForm()) return;
      await this.submitForm();
    });

    // Limpiar errores al escribir
    ["nombre","email","servicio","mensaje"].forEach((id) => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener("input", () => {
          field.classList.remove("error");
          const err = document.getElementById(`error-${id}`);
          if (err) err.textContent = "";
        });
      }
    });
  },

  /**
   * Actualiza la UI del formulario según si el usuario está logueado
   */
  updateFormState(user) {
    const notice    = document.getElementById("loginNotice");
    const formBody  = document.getElementById("formBody");
    const userGreet = document.getElementById("userGreet");
    const formEl    = document.getElementById("contactForm");

    if (user) {
      // Mostrar formulario, ocultar aviso
      if (notice)   notice.style.display   = "none";
      if (formBody) formBody.style.display  = "block";
      if (formEl)   formEl.style.display    = "block";

      // Prellenar nombre y email si están disponibles
      const nombreInput = document.getElementById("nombre");
      const emailInput  = document.getElementById("email");
      if (nombreInput && !nombreInput.value) nombreInput.value = user.displayName || "";
      if (emailInput  && !emailInput.value)  emailInput.value  = user.email || "";

      // Saludo personalizado
      if (userGreet) {
        const name = user.displayName ? user.displayName.split(" ")[0] : "cliente";
        userGreet.textContent = `Hola, ${name} 👋 Ya puedes enviar tu cotización.`;
        userGreet.style.display = "block";
      }
    } else {
      // Ocultar formulario, mostrar aviso de login
      if (notice)   notice.style.display   = "block";
      if (formBody) formBody.style.display  = "none";
      if (formEl)   formEl.style.display    = "none";
      if (userGreet) userGreet.style.display = "none";
    }
  },

  /**
   * Redirigir al login con parámetro redirect
   */
  redirectToLogin() {
    const currentPage = window.location.href;
    window.location.href = `../pages/login.html?redirect=${encodeURIComponent(currentPage)}`;
  },

  /**
   * Enviar formulario a Firestore
   */
  async submitForm() {
    const btn        = document.getElementById("btnSubmit");
    const successMsg = document.getElementById("formSuccess");

    const datos = {
      nombre:   document.getElementById("nombre").value.trim(),
      empresa:  document.getElementById("empresa")?.value.trim() || "",
      email:    document.getElementById("email").value.trim(),
      telefono: document.getElementById("telefono")?.value.trim() || "",
      servicio: document.getElementById("servicio").value,
      mensaje:  document.getElementById("mensaje").value.trim()
    };

    // Estado de carga
    if (btn) { btn.disabled = true; btn.innerHTML = "Enviando..."; }

    try {
      await CotizacionService.guardar(datos, this.currentUser);

      // Éxito
      document.getElementById("contactForm").reset();
      if (successMsg) { successMsg.style.display = "block"; successMsg.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
      if (btn) { btn.innerHTML = "✓ ¡Cotización enviada!"; btn.style.background = "#1a7a4a"; }

      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.style.background = ""; btn.innerHTML = `Enviar cotización <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`; }
        if (successMsg) successMsg.style.display = "none";
        // Rellenar email/nombre de nuevo
        this.updateFormState(this.currentUser);
      }, 6000);

    } catch (err) {
      console.error("Error al guardar cotización:", err);
      if (btn) { btn.disabled = false; btn.innerHTML = `Enviar cotización <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`; }
      alert("Error al enviar. Por favor intenta nuevamente.");
    }
  },

  /**
   * Validar campos del formulario
   */
  validateForm() {
    let valid = true;

    const campos = [
      { id: "nombre",   errorId: "error-nombre",   msg: "Ingresa tu nombre." },
      { id: "email",    errorId: "error-email",     msg: "Ingresa un correo válido.", isEmail: true },
      { id: "servicio", errorId: "error-servicio",  msg: "Selecciona un servicio." },
      { id: "mensaje",  errorId: "error-mensaje",   msg: "Cuéntanos sobre tu proyecto." }
    ];

    campos.forEach(({ id, errorId, msg, isEmail }) => {
      const field = document.getElementById(id);
      const error = document.getElementById(errorId);
      if (!field) return;

      const isEmpty = field.value.trim() === "";
      const isInvalidEmail = isEmail && !isEmpty && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());

      if (isEmpty || isInvalidEmail) {
        field.classList.add("error");
        if (error) error.textContent = isInvalidEmail ? "Correo no válido." : msg;
        valid = false;
      }
    });

    return valid;
  }
};