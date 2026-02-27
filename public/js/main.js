// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
}

// Highlight active nav link
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
    if (!link.classList.contains('nav-link-cta')) {
      link.style.background = 'var(--green-pale)';
      link.style.color = 'var(--green-dark)';
    }
  }
});

// Correo siempre en minúsculas
const inputCorreo = document.getElementById('correo');
if (inputCorreo) {
  inputCorreo.addEventListener('input', function () {
    const pos = this.selectionStart;
    this.value = this.value.toLowerCase();
    this.setSelectionRange(pos, pos);
  });
}

// Validación con focus al enviar
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('correo');
    const mensaje = document.getElementById('mensaje');

    if (!nombre.value.trim() || nombre.value.trim().length < 2) {
      e.preventDefault();
      nombre.focus();
      nombre.style.borderColor = '#c0392b';
      return;
    }

    const enviarCopia = document.getElementById('enviarCopia');
    const copiaChecked = enviarCopia && enviarCopia.checked;

    if (copiaChecked && correo.value.trim() === '') {
      e.preventDefault();
      correo.focus();
      correo.style.borderColor = '#c0392b';
      correo.placeholder = 'Requerido para enviar copia';
      return;
    }

    if (correo.value.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo.value.trim())) {
        e.preventDefault();
        correo.focus();
        correo.style.borderColor = '#c0392b';
        return;
      }
    }

    if (!mensaje.value.trim() || mensaje.value.trim().length < 10) {
      e.preventDefault();
      mensaje.focus();
      mensaje.style.borderColor = '#c0392b';
      return;
    }
  });

  ['nombre', 'correo', 'mensaje'].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener('input', function () {
        this.style.borderColor = '';
      });
    }
  });
}

// ─── SELECTORES DE PAÍS E IDIOMA ────────────────────────────

(function () {

  function initSelector(selectorId, btnId, dropdownId, otherSelectorId) {
    const selector = document.getElementById(selectorId);
    const btn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);
    const otherSel = document.getElementById(otherSelectorId);

    if (!selector || !btn || !dropdown) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = selector.classList.contains('open');
      if (otherSel) otherSel.classList.remove('open');
      selector.classList.toggle('open', !isOpen);
    });

    dropdown.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  document.addEventListener('click', function () {
    const ls = document.getElementById('langSelector');
    const cs = document.getElementById('countrySelector');
    if (ls) ls.classList.remove('open');
    if (cs) cs.classList.remove('open');
  });

  initSelector('langSelector', 'langBtn', 'langDropdown', 'countrySelector');
  initSelector('countrySelector', 'countryBtn', 'countryDropdown', 'langSelector');

  // ── Selector de países ──
  const countryFlag = document.getElementById('countryFlag');
  const countryCode = document.getElementById('countryCode');

  // Si el usuario ya eligió un país antes (localStorage), tiene prioridad sobre la detección por IP
  const savedCountry = localStorage.getItem('selectedCountry');
  if (savedCountry && countryFlag) {
    try {
      const saved = JSON.parse(savedCountry);
      countryFlag.className = `fi fi-${saved.iso}`;
      if (countryCode) countryCode.textContent = saved.code;
    } catch (e) { }
  }

  // Al hacer clic en un país del dropdown
  document.querySelectorAll('.country-option').forEach(function (option) {
    option.addEventListener('click', function (e) {
      e.preventDefault();
      const iso = option.dataset.iso;
      const code = option.dataset.code;
      const name = option.querySelector('.country-name').textContent;

      // Actualizar botón
      if (countryFlag) countryFlag.className = `fi fi-${iso}`;
      if (countryCode) countryCode.textContent = code;

      // Guardar en localStorage para próximas visitas
      localStorage.setItem('selectedCountry', JSON.stringify({ code, iso, name }));

      // Cerrar dropdown
      const cs = document.getElementById('countrySelector');
      if (cs) cs.classList.remove('open');
    });
  });

})();
