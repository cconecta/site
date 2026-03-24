/* ============================================================
   CCONECTA – main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ──────────────────────────────────────────
     MODAL PIX DOAÇÃO
  ────────────────────────────────────────── */
  function openPixModal() {
    document.getElementById('modal-pix').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePixModal() {
    document.getElementById('modal-pix').classList.remove('open');
    document.body.style.overflow = '';
  }
  // Abrir modal em todos os botões de doação
  document.querySelectorAll('.btn--primary, .nav-cta').forEach(btn => {
    if (btn.textContent.trim().toLowerCase().includes('doe')) {
      btn.addEventListener('click', function(e) {
        // Evita navegação ou envio de email
        e.preventDefault();
        openPixModal();
      });
    }
  });
  // Fechar modal
  document.getElementById('modal-pix-close').addEventListener('click', closePixModal);
  document.getElementById('modal-pix-overlay').addEventListener('click', closePixModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePixModal();
  });
  // Copiar chave PIX
  document.getElementById('modal-pix-copy').addEventListener('click', function() {
    const chave = document.querySelector('.modal-pix__chave').textContent.trim();
    navigator.clipboard.writeText(chave).then(() => {
      const copied = document.getElementById('modal-pix-copied');
      copied.style.display = 'inline';
      setTimeout(() => { copied.style.display = 'none'; }, 1800);
    });
  });

  /* ──────────────────────────────────────────
     1. HAMBURGER MENU
  ────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      // Trava scroll do body quando menu aberto
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fechar ao clicar em link do menu
    navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ──────────────────────────────────────────
     2. NAVBAR – sombra ao rolar
  ────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const updateNavbar = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  /* ──────────────────────────────────────────
     3. SCROLL REVEAL com IntersectionObserver
  ────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Roda só uma vez
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: mostrar tudo sem animação
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ──────────────────────────────────────────
     4. SCROLL SUAVE – links âncora
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarH = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navbarH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────────
     5. IMAGE FALLBACKS
     Quando um asset real não carrega, mostra
     o placeholder e esconde a <img> quebrada
  ────────────────────────────────────────── */
  document.querySelectorAll('img[src^="assets/"]').forEach(img => {
    img.addEventListener('error', () => {
      img.classList.add('img-error');
      // Força re-flow para o seletor CSS capturar
      const placeholder = img.nextElementSibling;
      if (placeholder && placeholder.classList.contains('asset-placeholder')) {
        placeholder.style.display = 'flex';
      }
    });

    // Se já estava com erro (cache)
    if (!img.complete || img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });

  /* ──────────────────────────────────────────
     6. ACTIVE NAV LINK – highlight baseado em scroll
  ────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - (navbar ? navbar.offsetHeight : 0) - 80;
      if (window.scrollY >= sectionTop) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('nav-link--active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

});
