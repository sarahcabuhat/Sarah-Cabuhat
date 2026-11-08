/**
 * Sarah Cabuhat — Luxury Purple Portfolio
 * Micro-interactions, filters & modal handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. THEME SWITCHER (Dark Luxe Amethyst / Light Silk Lavender)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('sarah_theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
    updateThemeIcon('light');
  } else {
    document.documentElement.classList.remove('light');
    updateThemeIcon('dark');
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      const currentTheme = isLight ? 'light' : 'dark';
      localStorage.setItem('sarah_theme', currentTheme);
      updateThemeIcon(currentTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      `;
    } else {
      themeIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
        </svg>
      `;
    }
  }

  // 2. MOBILE MENU TOGGLE
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 3. CERTIFICATES FILTERING
  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');

  certFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button styles
      certFilterBtns.forEach(b => {
        b.classList.remove('active', 'bg-[#8f529b]', 'text-white', 'border-[#8f529b]', 'shadow-lg');
        b.classList.add('border-[var(--border-subtle)]', 'text-[var(--text-muted)]');
      });
      btn.classList.add('active', 'bg-[#8f529b]', 'text-white', 'border-[#8f529b]', 'shadow-lg');
      btn.classList.remove('border-[var(--border-subtle)]', 'text-[var(--text-muted)]');

      // Filter animation
      certCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 4. LIGHTBOX MODAL (PROJECTS & CERTIFICATES)
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, caption) {
    if (!lightboxModal || !lightboxImg || !src) return;
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || 'Project Preview';
    }
    lightboxModal.style.display = 'flex';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Robust click listener for all project previews, preview buttons, and certificate previews
  document.addEventListener('click', (e) => {
    // 1. Direct preview trigger with data-preview-img attribute
    const previewBtn = e.target.closest('[data-preview-img]');
    if (previewBtn) {
      e.preventDefault();
      const src = previewBtn.getAttribute('data-preview-img');
      const caption = previewBtn.getAttribute('data-preview-caption') || 'Project Preview';
      if (src) {
        openLightbox(src, caption);
        return;
      }
    }

    // 2. Find closest container that triggers zoom
    const zoomTrigger = e.target.closest('.cursor-zoom-in, [data-zoomable="true"], .project-preview-trigger, .group\\/preview, .cert-card .relative, .cert-card');
    if (zoomTrigger) {
      // Find actual <img> element inside or as the trigger
      const targetImg = zoomTrigger.tagName.toLowerCase() === 'img' 
        ? zoomTrigger 
        : zoomTrigger.querySelector('img');

      if (targetImg && targetImg.src && !targetImg.src.includes('undefined')) {
        e.preventDefault();
        openLightbox(targetImg.src, targetImg.alt || targetImg.getAttribute('data-caption') || 'Preview');
      }
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 5. COPY TO CLIPBOARD HELPER
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied "${text}" to clipboard!`);
        }).catch(() => fallbackCopy(text));
      } else if (text) {
        fallbackCopy(text);
      }
    });
  });

  function fallbackCopy(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast(`Copied "${text}" to clipboard!`);
  }

  // 6. TOAST NOTIFICATION
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  let toastTimer;

  window.showToast = function(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // 7. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || 'Visitor';
      const email = document.getElementById('form-email')?.value || '';
      const subject = document.getElementById('form-subject')?.value || 'Portfolio Collaboration';
      const message = document.getElementById('form-message')?.value || '';

      const mailto = `mailto:sarahcabuhat018@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
      
      showToast(`Thank you, ${name}! Preparing message for Sarah...`);
      setTimeout(() => {
        window.location.href = mailto;
      }, 700);
      contactForm.reset();
    });
  }

  // 8. ACTIVE NAV SCROLLSPY & SMOOTH SCROLL WITH ANIMATED LINE ("GUHIT")
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  let isManualNavClick = false;
  let manualScrollTimeout;

  function setActiveNav(targetId) {
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${targetId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Smooth scroll and immediate animated underline on click
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        
        // Immediately trigger the animated line under the clicked link
        setActiveNav(targetId);
        isManualNavClick = true;
        clearTimeout(manualScrollTimeout);
        manualScrollTimeout = setTimeout(() => {
          isManualNavClick = false;
        }, 850);

        // Calculate smooth scroll position with fixed navbar offset
        const navbarHeight = 78;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }

        // Update URL hash cleanly
        if (history.pushState) {
          history.pushState(null, null, `#${targetId}`);
        }
      }
    });
  });

  // Dynamic ScrollSpy tracking on scroll
  window.addEventListener('scroll', () => {
    if (isManualNavClick) return; // Keep clicked link highlighted during smooth transition

    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current && current !== 'top') {
      setActiveNav(current);
    } else if (scrollY < 200) {
      allNavLinks.forEach(link => link.classList.remove('active'));
    }
  }, { passive: true });

  // Initial check on load
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    setActiveNav(initialHash);
  }
});
