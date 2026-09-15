// Image map — local asset paths
const IMGS = {
  '1':  'assets/images/assets7.jpeg',
  '2':  'assets/images/assets8.jpeg',
  '3':  'assets/images/assets9.jpeg',
  '4':  'assets/images/assets10.jpeg',
  '5':  'assets/images/assets11.jpeg',
  '6':  'assets/images/assets6.jpeg',
  '7':  'assets/images/assets7.jpeg',
  '8':  'assets/images/assets8.jpeg',
  '9':  'assets/images/assets9.jpeg',
  '10': 'assets/images/assets10.jpeg',
};

// NAV
const navbar = document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('solid',scrollY>60));

function toggleMenu(){
  const navlinks = document.getElementById('navlinks');
  const hamburger = document.getElementById('hamburger');
  if(navlinks) {
    const isOpen = navlinks.classList.toggle('open');
    if(hamburger) hamburger.classList.toggle('open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  }
}

function closeMenu(){
  const navlinks = document.getElementById('navlinks');
  const hamburger = document.getElementById('hamburger');
  if(navlinks) {
    navlinks.classList.remove('open');
    if(hamburger) hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
}

document.addEventListener('click', (e) => {
  const nav = document.getElementById('navbar');
  const navlinks = document.getElementById('navlinks');
  if (navlinks && navlinks.classList.contains('open') && nav && !nav.contains(e.target)) {
    closeMenu();
  }
});

// REVEAL
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});
},{threshold:0.1});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>observer.observe(el));

// MENU TABS
function switchTab(id){
  document.querySelectorAll('.menu-tab').forEach((t,i)=>{
    t.classList.toggle('active',t.getAttribute('onclick').includes(id));
  });
  document.querySelectorAll('.menu-panel').forEach(p=>{
    p.classList.toggle('active',p.id==='panel-'+id);
  });
}

// LIGHTBOX
function openLightbox(target){
  let src = '';
  if (typeof target === 'string') {
    src = IMGS[target] || target;
  } else if (target && target.querySelector) {
    const img = target.querySelector('img');
    if (img) src = img.src;
  }
  if (!src) return;

  document.getElementById('lb-img').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();});

// LANGUAGE
let currentLang = 'es';
function setLang(lang){
  currentLang = lang;
  document.getElementById('btn-es').classList.toggle('active',lang==='es');
  document.getElementById('btn-en').classList.toggle('active',lang==='en');
  // Update all data-es/data-en elements
  document.querySelectorAll('[data-es]').forEach(el=>{
    const val = el.getAttribute('data-'+lang);
    if(val) el.innerHTML = val;
  });
  // Placeholders
  document.querySelectorAll('[data-placeholder-'+lang+']').forEach(el=>{
    el.placeholder = el.getAttribute('data-placeholder-'+lang);
  });
  document.documentElement.lang = lang;
}

// INSTAGRAM FEED - REAL TIME LOADER
async function loadInstagramFeed() {
  const grid = document.getElementById('insta-grid');
  if (!grid) return;

  const endpoints = [
    'https://api.rss2json.com/v1/api.json?rss_url=https://rsshub.app/instagram/user/5tacafeoficial',
    'https://api.rss2json.com/v1/api.json?rss_url=https://picnob.com/rss/user/5tacafeoficial',
    'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.instagram.com/5tacafeoficial/?__a=1&__d=dis')
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) continue;
      const data = await res.json();

      if (data && data.items && data.items.length >= 4) {
        const posts = data.items.slice(0, 4);
        const postEls = grid.querySelectorAll('.insta-post');

        posts.forEach((item, i) => {
          if (!postEls[i]) return;
          const img = postEls[i].querySelector('img');
          const caption = postEls[i].querySelector('.insta-caption');

          let imgSrc = item.thumbnail || item.enclosure?.link;
          if (!imgSrc && item.content) {
            const m = item.content.match(/src=["'](.*?)["']/);
            if (m) imgSrc = m[1];
          }

          if (imgSrc && img) img.src = imgSrc;
          if (item.link) postEls[i].href = item.link;
          if (caption && item.title) {
            const clean = item.title.replace(/<[^>]*>?/gm, '').trim();
            if (clean) caption.textContent = clean.length > 70 ? clean.substring(0, 67) + '...' : clean;
          }
        });

        const indicator = document.getElementById('insta-live-indicator');
        if (indicator) {
          indicator.classList.add('live-active');
        }
        return;
      }
    } catch (e) {
      // Smooth fallback to local curated post assets
    }
  }
}

document.addEventListener('DOMContentLoaded', loadInstagramFeed);
loadInstagramFeed();

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
        // Auto-reset after 5s
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
