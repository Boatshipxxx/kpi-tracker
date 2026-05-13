// ==================== MOBILE MENU ====================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  });
}

function closeMenu() {
  menuOpen = false;
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
window.closeMenu = closeMenu;

// ==================== SCROLL REVEAL ====================
const reveals = document.querySelectorAll('.reveal');
const revealOnScroll = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealOnScroll.observe(el));

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const t = document.querySelector(href);
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// ==================== FILTER TABS ====================
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ==================== EDIT MODE ====================
// Access via URL: add ?edit to any page URL to enable
if (new URLSearchParams(window.location.search).has('edit')) {
  document.querySelectorAll('.editable').forEach(el => {
    el.contentEditable = 'true';
    el.style.outline = '2px dashed #C8391D';
    el.style.minHeight = '1em';
    el.style.cursor = 'text';
  });

  const bar = document.createElement('div');
  bar.innerHTML = `
    <div style="position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#111;color:#F5E100;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:12px;border-top:3px solid #C8391D;">
      <span>✏ EDIT MODE — 赤い枠線内のテキストをクリックして編集できます</span>
      <button onclick="
        const html = document.documentElement.outerHTML;
        const blob = new Blob([html],{type:'text/html'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'edited-page.html';
        a.click();
      " style="background:#C8391D;color:#F5E100;border:2px solid #F5E100;padding:6px 16px;font-family:inherit;font-size:12px;cursor:pointer;">DOWNLOAD HTML</button>
    </div>
  `;
  document.body.appendChild(bar);
}
