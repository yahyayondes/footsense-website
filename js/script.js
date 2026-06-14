/* ============================================================
   FootSense — Main Script (Vanilla JS)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Navbar Scroll Effect ---------- */
  const navbar = document.querySelector('.navbar');
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---------- Mobile Hamburger Menu ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---------- Active Nav Link on Scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const activateLink = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (match) match.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Staggered Reveal for Grid Children ---------- */
  const staggerContainers = document.querySelectorAll('[data-stagger]');

  if ('IntersectionObserver' in window) {
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll('.reveal');
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add('visible'), i * 120);
            });
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    staggerContainers.forEach(el => staggerObserver.observe(el));
  }
});
