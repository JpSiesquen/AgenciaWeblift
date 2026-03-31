/* ═══════════════════════════════════════════════════════════
   WEBLIFT Studio — js/ui/navbar.js
═══════════════════════════════════════════════════════════ */

const NavbarUI = {

  init() {
    this.initScroll();
    this.initHamburger();
    this.initAuthState();
    this.initActiveLinks();
    this.initDropdown();
  },

  initScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    if (navbar.classList.contains("auth-nav")) return;
    const handle = () => navbar.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", handle, { passive: true });
    handle();
  },

  initHamburger() {
    const btn   = document.getElementById("hamburger");
    const links = document.getElementById("navLinks");
    if (!btn || !links) return;

    window.toggleMenu = () => {
      const open = links.classList.toggle("open");
      const spans = btn.querySelectorAll("span");
      if (open) {
        spans[0] && (spans[0].style.transform = "rotate(45deg) translate(5px,5px)");
        spans[1] && (spans[1].style.opacity   = "0");
        spans[2] && (spans[2].style.transform = "rotate(-45deg) translate(5px,-5px)");
      } else {
        spans.forEach(s => { s.style.transform = ""; s.style.opacity = ""; });
      }
    };

    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        btn.querySelectorAll("span").forEach(s => {
          s.style.transform = "";
          s.style.opacity   = "";
        });
      });
    });

    document.addEventListener("click", e => {
      const nav = document.getElementById("navbar");
      if (nav && !nav.contains(e.target)) links.classList.remove("open");
    });
  },

  initAuthState() {
    if (typeof auth === "undefined") return;

    const navLogin    = document.getElementById("navLogin");
    const navRegister = document.getElementById("navRegister");
    const navUser     = document.getElementById("navUser");
    const navUserName = document.getElementById("navUserName");
    const navAvatar   = document.getElementById("navAvatar");
    const navLogout   = document.getElementById("navLogout");

    auth.onAuthStateChanged((user) => {
      if (user) {
        // Ocultar botones login/register
        if (navLogin)    navLogin.style.display    = "none";
        if (navRegister) navRegister.style.display = "none";
        // Mostrar avatar
        if (navUser)     navUser.style.display     = "flex";
        if (navUserName) navUserName.textContent   =
          user.displayName ? user.displayName.split(" ")[0] : "Mi cuenta";

        // Foto Google o iniciales
        if (navAvatar) {
          if (user.photoURL) {
            navAvatar.innerHTML = `<img src="${user.photoURL}" alt="avatar"
              style="width:28px;height:28px;border-radius:50%;object-fit:cover;">`;
          } else {
            navAvatar.textContent =
              (user.displayName || user.email || "U").charAt(0).toUpperCase();
          }
        }

        // Info en dropdown
        const dropName  = document.getElementById("dropdownName");
        const dropEmail = document.getElementById("dropdownEmail");
        if (dropName)  dropName.textContent  = user.displayName || "Mi cuenta";
        if (dropEmail) dropEmail.textContent = user.email || "";

      } else {
        // Sin usuario — mostrar botones normales
        if (navLogin)    navLogin.style.display    = "flex";
        if (navRegister) navRegister.style.display = "flex";
        if (navUser)     navUser.style.display     = "none";
        const dd = document.getElementById("navDropdown");
        if (dd) dd.classList.remove("open");
      }
    });

    // Cerrar sesión
    if (navLogout) {
      navLogout.addEventListener("click", async () => {
        try {
          await AuthService.logout();
          window.location.href = "home.html";
        } catch (e) {
          console.error("Error al cerrar sesión:", e);
        }
      });
    }
  },

  initDropdown() {
    const navUser = document.getElementById("navUser");
    const dd      = document.getElementById("navDropdown");
    if (!navUser || !dd) return;

    navUser.addEventListener("click", (e) => {
      e.stopPropagation();
      dd.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      dd.classList.remove("open");
    });
  },

  initActiveLinks() {
    const sections = document.querySelectorAll("section[id]");
    const links    = document.querySelectorAll(".nav-links a[href]");
    if (!sections.length) return;

    window.addEventListener("scroll", () => {
      let current = "";
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
      });
      links.forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("href") === `#${current}`) {
          a.classList.add("active");
        }
      });
    }, { passive: true });
  }

};