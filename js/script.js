/* =================================================================
   5TA CAFÉ - Dual-Brand Platform Script
   Handles navigation, language switching, B2B sample form,
   Instagram feed loading, and Web3Forms contact form submission.
   ================================================================= */

// Global Language State
let currentLang = 'es';

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  document.querySelectorAll('[data-es]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    }
  });
}

// Instagram Feed Loader
async function loadInstagramFeed() {
  const instaGrid = document.getElementById('insta-grid');
  if (!instaGrid) return;
  // Instagram feed elements are rendered in HTML templates
}

// DOM CONTENT LOADED LOGIC
document.addEventListener('DOMContentLoaded', () => {
  console.log('5ta Café - Platform loaded.');

  loadInstagramFeed();

  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const navlinks = document.getElementById('navlinks');
  if (hamburger && navlinks) {
    hamburger.addEventListener('click', () => {
      navlinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // B2B Sample Request Form Handling
  const sampleForm = document.getElementById('b2bSampleForm');
  const formErrorMsg = document.getElementById('formErrorMessage');
  const modal = document.getElementById('confirmationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalRefCode = document.getElementById('modalRefCode');

  if (sampleForm) {
    sampleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formErrorMsg) formErrorMsg.style.display = 'none';

      // Extract form inputs
      const businessName = document.getElementById('businessName')?.value.trim();
      const contactName = document.getElementById('contactName')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const country = document.getElementById('country')?.value.trim();
      const targetVolume = document.getElementById('targetVolume')?.value.trim();
      const roastProfileChecked = sampleForm.querySelector('input[name="roastProfile"]:checked');
      const selectedLot = document.getElementById('selectedLot')?.value.trim();

      const errors = [];

      if (!businessName) errors.push('Nombre de Empresa / Importadora es obligatorio.');
      if (!contactName) errors.push('Nombre de Contacto es obligatorio.');
      if (!email) {
        errors.push('Correo electrónico corporativo es obligatorio.');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Por favor ingrese una dirección de correo electrónico válida.');
      }
      if (!country) errors.push('País / Región de Destino es obligatorio.');
      if (!targetVolume) errors.push('Debe seleccionar un Volumen Objetivo Estimado.');
      if (!roastProfileChecked) errors.push('Debe seleccionar un Perfil de Tostado Preferido.');

      if (errors.length > 0) {
        if (formErrorMsg) {
          formErrorMsg.innerHTML = '<strong>Error en el formulario:</strong><br>' + errors.join('<br>');
          formErrorMsg.style.display = 'block';
          formErrorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Generate Reference Code
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const refCode = `REQ-5TA-${new Date().getFullYear()}-${randomCode}`;

      if (modalRefCode) {
        modalRefCode.textContent = refCode;
      }

      // Show confirmation modal
      if (modal) {
        modal.classList.add('active');
      }

      // Reset form
      sampleForm.reset();
    });
  }

  // Close Modal Handler
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Lot selection auto-fill buttons
  const lotButtons = document.querySelectorAll('.btn-select-lot');
  const selectedLotInput = document.getElementById('selectedLot');
  const sampleRequestSection = document.getElementById('sample-request');

  lotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lotName = btn.getAttribute('data-lot');
      if (selectedLotInput && lotName) {
        selectedLotInput.value = lotName;
      }
      if (sampleRequestSection) {
        sampleRequestSection.scrollIntoView({ behavior: 'smooth' });
        if (selectedLotInput) selectedLotInput.focus();
      }
    });
  });
});

// ─────────────────────────────────────────────────
//  CONTACT FORM — Web3Forms submission
// ─────────────────────────────────────────────────
(function () {
  const form   = document.getElementById('contact-form');
  const btn    = document.getElementById('contact-submit');
  const status = document.getElementById('form-status');
  if (!form || !btn || !status) return;

  const MSGS = {
    es: {
      required : 'Por favor completa todos los campos.',
      emailBad  : 'Ingresa un correo electrónico válido.',
      sending   : 'Enviando…',
      ok        : '✓ ¡Mensaje enviado! Te responderemos a la brevedad.',
      fail      : '✗ Hubo un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.',
    },
    en: {
      required : 'Please fill in all fields.',
      emailBad  : 'Enter a valid email address.',
      sending   : 'Sending…',
      ok        : '✓ Message sent! We\'ll get back to you soon.',
      fail      : '✗ Something went wrong. Try again or reach us on WhatsApp.',
    },
  };

  function msg(key) {
    return MSGS[currentLang] ? MSGS[currentLang][key] : MSGS.es[key];
  }

  function setStatus(type, text) {
    status.className = 'form-status visible ' + type;
    status.textContent = text;
  }

  function clearStatus() {
    status.className = 'form-status';
    status.textContent = '';
  }

  function setBtn(state, label) {
    btn.disabled = state === 'loading';
    btn.className = 'btn-contact-submit ' + (state === 'idle' ? '' : state);
    const textEl = btn.querySelector('.btn-submit-text');
    if (textEl && label) textEl.textContent = label;
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearStatus();

    const nameEl  = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    const msgEl   = document.getElementById('contact-message');

    // Clear previous error highlights
    [nameEl, emailEl, msgEl].forEach(el => el.classList.remove('error'));

    // Client-side validation
    let valid = true;
    if (!nameEl.value.trim())  { nameEl.classList.add('error');  valid = false; }
    if (!msgEl.value.trim())   { msgEl.classList.add('error');   valid = false; }
    if (!emailEl.value.trim() || !validateEmail(emailEl.value)) {
      emailEl.classList.add('error');
      valid = false;
    }
    if (!valid) {
      const errKey = !validateEmail(emailEl.value) && emailEl.value.trim()
        ? 'emailBad' : 'required';
      setStatus('error', msg(errKey));
      return;
    }

    // Loading state
    setBtn('loading', msg('sending'));

    try {
      const data = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();

      if (result.success) {
        setBtn('success', '✓ ' + (currentLang === 'en' ? 'Sent!' : '¡Enviado!'));
        setStatus('success', msg('ok'));
        form.reset();
        setTimeout(() => {
          setBtn('idle', currentLang === 'en' ? 'Send message' : 'Enviar mensaje');
          clearStatus();
        }, 5000);
      } else {
        throw new Error(result.message || 'API error');
      }
    } catch (err) {
      console.error('[ContactForm]', err);
      setBtn('error-state', '✗ Error');
      setStatus('error', msg('fail'));
      setTimeout(() => {
        setBtn('idle', currentLang === 'en' ? 'Send message' : 'Enviar mensaje');
        clearStatus();
      }, 6000);
    }
  });
})();
