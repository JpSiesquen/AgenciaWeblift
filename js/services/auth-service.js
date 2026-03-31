/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/services/auth-service.js
   
   CAPA DE SERVICIO: toda la comunicación con Firebase Auth.
   Esta capa NO toca el DOM — solo devuelve datos/errores.
   El controller es quien maneja la UI.
═══════════════════════════════════════════════════════════ */

const AuthService = {

  /**
   * Registrar usuario con email y contraseña
   * @param {string} email
   * @param {string} password
   * @param {string} nombre
   * @returns {Promise<UserCredential>}
   */
  async register(email, password, nombre) {
    const credential = await auth.createUserWithEmailAndPassword(email, password);
    // Actualizar nombre en el perfil de Firebase Auth
    await credential.user.updateProfile({ displayName: nombre });
    // Guardar datos adicionales en Firestore
    await db.collection("usuarios").doc(credential.user.uid).set({
      uid:        credential.user.uid,
      nombre:     nombre,
      email:      email,
      createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
      role:       "cliente"
    });
    return credential;
  },

  /**
   * Login con email y contraseña
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserCredential>}
   */
  async login(email, password) {
    return await auth.signInWithEmailAndPassword(email, password);
  },

  /**
   * Login / Register con Google
   * @returns {Promise<UserCredential>}
   */
  async loginWithGoogle() {
    const credential = await auth.signInWithPopup(googleProvider);
    const user = credential.user;

    // Si es la primera vez que se loguea con Google, guardar en Firestore
    const userDoc = await db.collection("usuarios").doc(user.uid).get();
    if (!userDoc.exists) {
      await db.collection("usuarios").doc(user.uid).set({
        uid:       user.uid,
        nombre:    user.displayName || "Usuario",
        email:     user.email,
        photo:     user.photoURL || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role:      "cliente"
      });
    }
    return credential;
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    return await auth.signOut();
  },

  /**
   * Obtener usuario actual
   * @returns {User|null}
   */
  getCurrentUser() {
    return auth.currentUser;
  },

  /**
   * Escuchar cambios de autenticación
   * @param {Function} callback
   */
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  },

  /**
   * Recuperar contraseña por email
   * @param {string} email
   */
  async resetPassword(email) {
    return await auth.sendPasswordResetEmail(email);
  },

  /**
   * Traducir errores de Firebase a mensajes en español
   * @param {string} errorCode
   * @returns {string}
   */
  translateError(errorCode) {
    const errors = {
      "auth/email-already-in-use":    "Este correo ya está registrado. Intenta iniciar sesión.",
      "auth/invalid-email":           "El correo electrónico no es válido.",
      "auth/user-not-found":          "No existe una cuenta con este correo.",
      "auth/wrong-password":          "Contraseña incorrecta. Intenta nuevamente.",
      "auth/weak-password":           "La contraseña debe tener al menos 6 caracteres.",
      "auth/too-many-requests":       "Demasiados intentos fallidos. Espera unos minutos.",
      "auth/network-request-failed":  "Error de conexión. Verifica tu internet.",
      "auth/popup-closed-by-user":    "Ventana de Google cerrada. Intenta de nuevo.",
      "auth/cancelled-popup-request": "Operación cancelada.",
    };
    return errors[errorCode] || "Ocurrió un error. Intenta nuevamente.";
  }
};