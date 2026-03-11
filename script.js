const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const revealItems = document.querySelectorAll('.reveal');
const qualityMetrics = document.querySelectorAll('.quality-metric');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.slider-arrow.prev');
const nextBtn = document.querySelector('.slider-arrow.next');
const form = document.querySelector('.contact-form');
const feedback = document.querySelector('.form-feedback');
const modal = document.querySelector('#contactModal');
const modalForm = document.querySelector('#contactModalForm');
const modalFeedback = document.querySelector('#modalFeedback');
const modalOpeners = document.querySelectorAll('[data-open-contact-modal="true"]');
const modalClosers = document.querySelectorAll('[data-close-contact-modal="true"]');
const callModal = document.querySelector('#callModal');
const callForm = document.querySelector('#callModalForm');
const callFeedback = document.querySelector('#callFeedback');
const callOpeners = document.querySelectorAll('[data-open-call-modal="true"]');
const callClosers = document.querySelectorAll('[data-close-call-modal="true"]');
const thanksModal = document.querySelector('#thanksModal');
const thanksClosers = document.querySelectorAll('[data-close-thanks-modal="true"]');
const isEnglish = document.documentElement.lang === 'en';
const cookieStorageKey = 'demian_buscatti_cookie_consent_v1';
let activeIndex = 0;
let sliderTimer;

const closeMenu = () => {
  if (!header || !menuToggle) return;
  header.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
};

const openContactModal = () => {
  if (!modal) return;
  closeMenu();
  closeCallModal();
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
  requestAnimationFrame(() => modalForm?.querySelector('input, textarea')?.focus());
};

const closeContactModal = () => {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
};

const openCallModal = () => {
  if (!callModal) return;
  closeMenu();
  closeContactModal();
  callModal.classList.add('is-open');
  callModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
  requestAnimationFrame(() => callForm?.querySelector('input, textarea')?.focus());
};

const closeCallModal = () => {
  if (!callModal) return;
  callModal.classList.remove('is-open');
  callModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
};

const openThanksModal = () => {
  if (!thanksModal) return;
  closeContactModal();
  closeCallModal();
  thanksModal.classList.add('is-open');
  thanksModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
};

const closeThanksModal = () => {
  if (!thanksModal) return;
  thanksModal.classList.remove('is-open');
  thanksModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
};

if (header) {
  const toggleHeader = () => {
    header.classList.toggle('is-solid', window.scrollY > 24);
  };

  toggleHeader();
  window.addEventListener('scroll', toggleHeader, { passive: true });
}

if (menuToggle && header && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

modalOpeners.forEach((trigger) => {
  trigger.addEventListener('click', openContactModal);
});

modalClosers.forEach((trigger) => {
  trigger.addEventListener('click', closeContactModal);
});

callOpeners.forEach((trigger) => {
  trigger.addEventListener('click', openCallModal);
});

callClosers.forEach((trigger) => {
  trigger.addEventListener('click', closeCallModal);
});

thanksClosers.forEach((trigger) => {
  trigger.addEventListener('click', closeThanksModal);
});

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

if (qualityMetrics.length) {
  const qualityObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const metric = entry.target;
        const fill = metric.querySelector('.quality-meter-fill');
        if (fill) {
          fill.style.width = `${metric.dataset.fill || '0'}%`;
        }
        qualityObserver.unobserve(metric);
      });
    },
    { threshold: 0.3 }
  );

  qualityMetrics.forEach((metric) => qualityObserver.observe(metric));
}

const setupPortfolioCarousel = () => {
  const carousels = document.querySelectorAll('[data-portfolio-carousel]');
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('.portfolio-track');
    if (!track) return;

    let offset = 0;
    let rafId = 0;
    let paused = false;
    let dragging = false;
    let startX = 0;
    let lastX = 0;
    let resumeTimer = 0;
    const autoSpeed = 0.32;

    const getLoopWidth = () => track.scrollWidth / 2;

    const normalizeOffset = () => {
      const loopWidth = getLoopWidth();
      if (!loopWidth) return;
      while (offset >= loopWidth) offset -= loopWidth;
      while (offset < 0) offset += loopWidth;
    };

    const render = () => {
      normalizeOffset();
      track.style.transform = `translateX(${-offset}px)`;
    };

    const queueResume = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
        carousel.classList.remove('is-paused');
      }, 900);
    };

    const tick = () => {
      if (!paused && !dragging) {
        offset += autoSpeed;
        render();
      }
      rafId = window.requestAnimationFrame(tick);
    };

    const stopAuto = () => {
      paused = true;
      carousel.classList.add('is-paused');
      queueResume();
    };

    carousel.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaX) < 1 && Math.abs(event.deltaY) < 1) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      offset += delta;
      render();
      stopAuto();
    }, { passive: false });

    carousel.addEventListener('pointerdown', (event) => {
      dragging = true;
      paused = true;
      carousel.classList.add('is-dragging', 'is-paused');
      startX = event.clientX;
      lastX = offset;
      carousel.setPointerCapture?.(event.pointerId);
    });

    carousel.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const deltaX = event.clientX - startX;
      offset = lastX - deltaX;
      render();
    });

    const endDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      carousel.classList.remove('is-dragging');
      carousel.releasePointerCapture?.(event.pointerId);
      queueResume();
    };

    carousel.addEventListener('pointerup', endDrag);
    carousel.addEventListener('pointercancel', endDrag);
    carousel.addEventListener('pointerleave', () => {
      if (!dragging) return;
      dragging = false;
      carousel.classList.remove('is-dragging');
      queueResume();
    });

    carousel.addEventListener('mouseenter', () => {
      paused = true;
      carousel.classList.add('is-paused');
    });

    carousel.addEventListener('mouseleave', () => {
      if (dragging) return;
      paused = false;
      carousel.classList.remove('is-paused');
    });

    render();
    rafId = window.requestAnimationFrame(tick);
    window.addEventListener('resize', render);
    window.addEventListener('beforeunload', () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(resumeTimer);
    }, { once: true });
  });
};

setupPortfolioCarousel();

const showSlide = (index) => {
  if (!testimonialCards.length) return;
  activeIndex = (index + testimonialCards.length) % testimonialCards.length;
  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle('is-active', cardIndex === activeIndex);
  });
};

const restartSlider = () => {
  window.clearInterval(sliderTimer);
  sliderTimer = window.setInterval(() => {
    showSlide(activeIndex + 1);
  }, 4200);
};

if (testimonialCards.length) {
  showSlide(0);
  restartSlider();

  prevBtn?.addEventListener('click', () => {
    showSlide(activeIndex - 1);
    restartSlider();
  });

  nextBtn?.addEventListener('click', () => {
    showSlide(activeIndex + 1);
    restartSlider();
  });
}

if (form && feedback) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      feedback.textContent = isEnglish
        ? 'Complete all required fields and confirm the privacy checkbox.'
        : 'Compila tutti i campi richiesti e conferma la privacy.';
      return;
    }

    feedback.textContent = isEnglish
      ? 'Message sent. I will get back to you with an initial operational reply as soon as possible.'
      : 'Messaggio inviato. Ti ricontatterò con una prima risposta operativa il prima possibile.';
    form.reset();
    openThanksModal();
  });
}

if (modalForm && modalFeedback) {
  modalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!modalForm.reportValidity()) {
      modalFeedback.textContent = isEnglish
        ? 'Complete all required fields and confirm the privacy checkbox.'
        : 'Compila tutti i campi richiesti e conferma la privacy.';
      return;
    }

    modalFeedback.textContent = isEnglish
      ? 'Request sent. I will get back to you with an initial operational response as soon as possible.'
      : 'Richiesta inviata. Ti ricontatterò con un primo riscontro operativo il prima possibile.';
    modalForm.reset();
    openThanksModal();
  });
}

if (callForm && callFeedback) {
  callForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!callForm.reportValidity()) {
      callFeedback.textContent = isEnglish
        ? 'Complete all required fields and confirm the privacy checkbox.'
        : 'Compila tutti i campi richiesti e conferma la privacy.';
      return;
    }

    callFeedback.textContent = isEnglish
      ? 'Call request sent. I will contact you to define availability and timing.'
      : 'Richiesta call inviata. Ti ricontatterò per definire disponibilità e orario.';
    callForm.reset();
    openThanksModal();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal?.classList.contains('is-open')) {
    closeContactModal();
  }
  if (event.key === 'Escape' && callModal?.classList.contains('is-open')) {
    closeCallModal();
  }
  if (event.key === 'Escape' && thanksModal?.classList.contains('is-open')) {
    closeThanksModal();
  }
});

window.addEventListener(
  'pointermove',
  (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    document.documentElement.style.setProperty('--pointer-x', `${x}px`);
    document.documentElement.style.setProperty('--pointer-y', `${y}px`);
  },
  { passive: true }
);

const createCookieBanner = () => {
  if (localStorage.getItem(cookieStorageKey)) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner is-visible';

  const privacyLink = isEnglish ? 'privacy-en.html' : 'privacy.html';
  const cookieLink = isEnglish ? 'cookie-en.html' : 'cookie.html';

  banner.innerHTML = `
    <div class="cookie-panel">
      <span class="cookie-topline">&gt; cookie.init()</span>
      <p class="cookie-copy">
        ${
          isEnglish
            ? `This portfolio uses technical cookies to keep the experience stable and lightweight. You can read <a href="${privacyLink}">Privacy Policy</a> and <a href="${cookieLink}">Cookie Policy</a> for the full details.`
            : `Questo portfolio usa cookie tecnici per mantenere l'esperienza stabile e leggera. Puoi leggere <a href="${privacyLink}">Privacy Policy</a> e <a href="${cookieLink}">Cookie Policy</a> per i dettagli completi.`
        }
      </p>
      <div class="cookie-actions">
        <button class="btn btn-outline" type="button" data-cookie-action="reject">${isEnglish ? 'Reject' : 'Rifiuta'}</button>
        <button class="btn btn-primary" type="button" data-cookie-action="accept">${isEnglish ? 'Accept' : 'Accetta'}</button>
      </div>
    </div>
  `;

  const closeBanner = (value) => {
    localStorage.setItem(cookieStorageKey, value);
    banner.remove();
  };

  banner.querySelector('[data-cookie-action="accept"]')?.addEventListener('click', () => closeBanner('accepted'));
  banner.querySelector('[data-cookie-action="reject"]')?.addEventListener('click', () => closeBanner('rejected'));

  document.body.appendChild(banner);
};

createCookieBanner();
