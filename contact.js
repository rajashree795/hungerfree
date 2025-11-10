 document.addEventListener("DOMContentLoaded", () => {
  const bubbles = document.querySelectorAll(".bubble");

  // ✅ Immediately animate bubbles upward and drifting
  bubbles.forEach((bubble, i) => {
    // random position, size & speed
    const size = 80 + Math.random() * 120;
    const left = Math.random() * 100;
    const duration = 12 + Math.random() * 8; // seconds
    const drift = Math.random() * 20 - 10; // horizontal drift variation

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;

    // Each bubble moves up & drifts infinitely
    bubble.animate(
      [
        { transform: `translate(${drift}px, 0)`, opacity: 0.8 },
        { transform: `translate(${drift * -1}px, -110vh)`, opacity: 0 }
      ],
      {
        duration: duration * 1000,
        iterations: Infinity,
        easing: "ease-in-out"
      }
    );
  });

  // ✅ Smooth form submit feedback
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();

    // Add a simple success toast popup
    const toast = document.createElement("div");
    toast.textContent = "✅ Thank you for reaching out! We’ll get back soon 💚";
    toast.style.position = "fixed";
    toast.style.bottom = "30px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "linear-gradient(90deg,#00c853,#1de9b6)";
    toast.style.color = "#fff";
    toast.style.padding = "14px 24px";
    toast.style.borderRadius = "999px";
    toast.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)";
    toast.style.fontWeight = "600";
    toast.style.zIndex = "1000";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s ease";
    document.body.appendChild(toast);

    requestAnimationFrame(() => (toast.style.opacity = "1"));
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 600);
    }, 2500);
  });
});


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



   function sendEmail() {
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            emailjs.send('service_qtyxu6y', 'template_9s36p9c', templateParams)
                .then(function(response) {
                    
                    document.getElementById('contactForm').reset();
                }, function(error) {
                    alert('Failed to send message. Please try again.');
                });
        }