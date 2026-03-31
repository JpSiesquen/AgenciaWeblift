/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/controllers/auth-controller.js
   
   CAPA CONTROLADOR: conecta AuthService con la UI.
   Maneja validaciones del formulario y feedback visual.
═══════════════════════════════════════════════════════════ */

const AuthController = {

  /* ── LOGIN ── */
  initLogin() {
    const form     = document.getElementById("loginForm");
    const errorMsg = document.getElementById("authError");
    const btnSubmit = document.getElementById("btnLogin");
    const btnGoogle = document.getElementById("btnGoogle");

    if (!form) return;

    // Botón Google
    if (btnGoogle) {
      btnGoogle.addEventListener("click", () => this.handleGoogleAuth());
    }

    // Submit email/password
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!this.validateLoginForm()) return;

      const email    = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;

      this.setLoading(btnSubmit, true);
      this.hideError(errorMsg);

      try {
        await AuthService.login(email, password);
        // Redirigir a la página de contacto (cotización) o home
        const redirect = new URLSearchParams(window.location.search).get("redirect") || "../pages/contact.html";
        window.location.href = redirect;
      } catch (err) {
        this.showError(errorMsg, AuthService.translateError(err.code));
        this.setLoading(btnSubmit, false);
      }
    });
  },

  /* ── REGISTER ── */
  initRegister() {
    const form      = document.getElementById("registerForm");
    const errorMsg  = document.getElementById("authError");
    const btnSubmit = document.getElementById("btnRegister");
    const btnGoogle = document.getElementById("btnGoogle");

    if (!form) return;

    // Botón Google
    if (btnGoogle) {
      btnGoogle.addEventListener("click", () => this.handleGoogleAuth());
    }

    // Submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!this.validateRegisterForm()) return;

      const nombre   = document.getElementById("registerNombre").value.trim();
      const email    = document.getElementById("registerEmail").value.trim();
      const password = document.getElementById("registerPassword").value;

      this.setLoading(btnSubmit, true);
      this.hideError(errorMsg);

      try {
        await AuthService.register(email, password, nombre);
        // Redirigir tras registro exitoso
        const redirect = new URLSearchParams(window.location.search).get("redirect") || "../pages/contact.html";
        window.location.href = redirect;
      } catch (err) {
        this.showError(errorMsg, AuthService.translateError(err.code));
        this.setLoading(btnSubmit, false);
      }
    });
  },

  /* ── GOOGLE AUTH (compartido) ── */
  async handleGoogleAuth() {
    const errorMsg = document.getElementById("authError");
    this.hideError(errorMsg);
    try {
      await AuthService.loginWithGoogle();
      const redirect = new URLSearchParams(window.location.search).get("redirect") || "../pages/contact.html";
      window.location.href = redirect;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        this.showError(errorMsg, AuthService.translateError(err.code));
      }
    }
  },

  /* ── VALIDACIONES ── */
  validateLoginForm() {
    let valid = true;
    const email    = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      this.showFieldError("loginEmail", "error-email", "Ingresa un correo válido.");
      valid = false;
    } else {
      this.clearFieldError("loginEmail", "error-email");
    }

    if (!password.value || password.value.length < 6) {
      this.showFieldError("loginPassword", "error-password", "Contraseña incorrecta o muy corta.");
      valid = false;
    } else {
      this.clearFieldError("loginPassword", "error-password");
    }

    return valid;
  },

  validateRegisterForm() {
    let valid = true;
    const nombre   = document.getElementById("registerNombre");
    const email    = document.getElementById("registerEmail");
    const password = document.getElementById("registerPassword");
    const confirm  = document.getElementById("registerConfirm");
    const terms    = document.getElementById("registerTerms");

    if (!nombre.value.trim()) {
      this.showFieldError("registerNombre", "error-nombre", "Ingresa tu nombre.");
      valid = false;
    } else { this.clearFieldError("registerNombre", "error-nombre"); }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      this.showFieldError("registerEmail", "error-email", "Ingresa un correo válido.");
      valid = false;
    } else { this.clearFieldError("registerEmail", "error-email"); }

    if (!password.value || password.value.length < 6) {
      this.showFieldError("registerPassword", "error-password", "Mínimo 6 caracteres.");
      valid = false;
    } else { this.clearFieldError("registerPassword", "error-password"); }

    if (confirm && confirm.value !== password.value) {
      this.showFieldError("registerConfirm", "error-confirm", "Las contraseñas no coinciden.");
      valid = false;
    } else if (confirm) { this.clearFieldError("registerConfirm", "error-confirm"); }

    if (terms && !terms.checked) {
      valid = false;
      alert("Debes aceptar los términos y condiciones.");
    }

    return valid;
  },

  /* ── HELPERS DE UI ── */
  setLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.innerHTML = loading
      ? '<span>Procesando...</span>'
      : btn.dataset.originalText || btn.innerHTML;
    if (!loading && btn.dataset.originalText) {
      btn.innerHTML = btn.dataset.originalText;
    } else if (loading && !btn.dataset.originalText) {
      btn.dataset.originalText = btn.innerHTML;
    }
  },

  showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
  },

  hideError(el) {
    if (!el) return;
    el.textContent = "";
    el.classList.remove("show");
  },

  showFieldError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add("error");
    if (error) error.textContent = msg;
  },

  clearFieldError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove("error");
    if (error) error.textContent = "";
  },

  /* ── Toggle de contraseña visible/oculta ── */
  togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
  }
};