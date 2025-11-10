// script.js - AOS, GSAP counters, mobile menu, donate/contact logic, geolocation
document.addEventListener('DOMContentLoaded', () => {
  // AOS init
  if (window.AOS) AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true });

  // set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // GSAP: hero intro + counters
  if (window.gsap) {
    gsap.registerPlugin(window.ScrollTrigger);
    // Wrap hero title words into spans for staggered animation
    (function wrapHeroWords(){
      const hero = document.querySelector('.hero-title');
      if (!hero) return;
      const nodes = Array.from(hero.childNodes);
      hero.innerHTML = '';
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/\s+/).filter(Boolean);
          words.forEach((w, i) => {
            const span = document.createElement('span');
            span.className = 'hero-word';
            span.textContent = w + (i < words.length - 1 ? ' ' : '');
            hero.appendChild(span);
          });
        } else {
          // preserve elements like emoji
          hero.appendChild(node);
        }
      });
    })();

    // Animate words if user doesn't prefer reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.from('.hero-word', { y: 28, opacity: 0, scale: 0.98, duration: 0.9, ease: 'back.out(1.2)', stagger: 0.12, delay: 0.06 });
    } else {
      // ensure words visible without animation
      document.querySelectorAll('.hero-word').forEach(s => s.style.opacity = '1');
    }

    gsap.from('.hero-sub', { y: 18, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.2 });
    gsap.from('.hero-ctas', { y: 8, opacity: 0, duration: 0.8, delay: 0.3 });

    // counters when hero visible
    const mealsEl = document.getElementById('mealsCount');
    const donorsEl = document.getElementById('donorsCount');
    const ngosEl = document.getElementById('ngosCount');

    function countUp(el, toVal, dur = 1.3) {
      if (!el) return;
      const obj = { n: 0 };
      gsap.to(obj, {
        n: toVal,
        duration: dur,
        ease: 'power1.out',
        onUpdate: () => { el.textContent = Math.floor(obj.n).toLocaleString() + '+'; }
      });
    }

    ScrollTrigger.create({
      trigger: '.hero-left',
      start: 'top center',
      onEnter: () => { countUp(mealsEl, 12000); countUp(donorsEl, 800); countUp(ngosEl, 300); },
      once: true
    });
  }

  // Mobile menu toggle
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  // Fail-safe: ensure mobile menu is closed on load (prevents it from being visible due to stale class)
  if (mobileMenu && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
  if (burger && burger.classList.contains('open')) {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    burger.classList.add('open');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Smooth internal anchor scroll (close mobile menu)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // DONATE form logic -> save to localStorage
  const donateForm = document.getElementById('donateForm');
  if (donateForm) {
    donateForm.addEventListener('submit', e => {
      e.preventDefault();
      const payload = {
        id: Date.now(),
        name: (document.getElementById('d_name') || {}).value || '',
        contact: (document.getElementById('d_contact') || {}).value || '',
        food: (document.getElementById('d_food') || {}).value || '',
        qty: (document.getElementById('d_qty') || {}).value || '',
        address: (document.getElementById('d_address') || {}).value || '',
        expiry: (document.getElementById('d_expiry') || {}).value || '',
        createdAt: new Date().toISOString()
      };
      if (!payload.name || !payload.contact || !payload.food) { alert('Please fill name, contact and food type.'); return; }
      const KEY = 'hf-donations';
      const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
      arr.unshift(payload);
      localStorage.setItem(KEY, JSON.stringify(arr));

      // micro feedback animation on submit
      const btn = document.querySelector('.submit-btn') || document.querySelector('.btn.primary');
      if (btn && window.gsap) gsap.fromTo(btn, { y: 0 }, { y: -6, duration: 0.12, yoyo: true, repeat: 1 });
      alert('Donation saved. Thank you!');
      donateForm.reset();
    });
  }

  // Geolocation for "Use my city"
  const useLoc = document.getElementById('useLoc');
  if (useLoc) {
    useLoc.addEventListener('click', () => {
      useLoc.disabled = true;
      const orig = useLoc.textContent;
      useLoc.textContent = 'Locating...';
      if (!navigator.geolocation) { alert('Geolocation not supported'); useLoc.disabled=false; useLoc.textContent=orig; return; }
      navigator.geolocation.getCurrentPosition(async pos => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const j = await res.json();
          const city = j.address && (j.address.city || j.address.town || j.address.village || j.address.county) || `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
          const addr = document.getElementById('d_address');
          if (addr) addr.value = city;
        } catch (err) {
          const addr = document.getElementById('d_address');
          if (addr) addr.value = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
        } finally { useLoc.disabled=false; useLoc.textContent=orig; }
      }, err => { alert('Could not get location.'); useLoc.disabled=false; useLoc.textContent=orig; }, { timeout: 8000 });
    });
  }

  // CONTACT form simple handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Thanks — message received (demo).');
      contactForm.reset();
    });
  }

  // Desktop-only parallax for place cards (subtle background move following mouse)
  (function placeCardParallax(){
    // only enable on devices with hover and fine pointer
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const cards = document.querySelectorAll('.place-card');
    if (!cards || !cards.length) return;

    cards.forEach(card => {
      const bg = card.querySelector('.place-bg');
      if (!bg) return;
      let rafId = null;
      let last = {x:0,y:0};

      function onMove(e){
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const px = (e.clientX - cx) / (rect.width/2); // -1..1
        const py = (e.clientY - cy) / (rect.height/2);
        last.x = px;
        last.y = py;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          // move background slightly in opposite direction for depth
          const tx = (-last.x * 6).toFixed(3);
          const ty = (-last.y * 6).toFixed(3);
          bg.style.transform = `scale(1.04) translate3d(${tx}px, ${ty}px, 0)`;
        });
      }

      function onLeave(){
        if (rafId) cancelAnimationFrame(rafId);
        bg.style.transform = 'scale(1.04) translate3d(0, 0, 0)';
      }

      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      card.addEventListener('blur', onLeave);
    });
  })();
});