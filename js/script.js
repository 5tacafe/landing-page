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
  document.getElementById('navlinks').classList.toggle('open');
}

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
