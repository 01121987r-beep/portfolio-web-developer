const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const revealItems = document.querySelectorAll('.reveal');
const qualityMetrics = document.querySelectorAll('.quality-metric');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.slider-control.prev');
const nextBtn = document.querySelector('.slider-control.next');
const forms = document.querySelectorAll('.contact-form');
const modal = document.querySelector('#contactModal');
const modalOpeners = document.querySelectorAll('[data-open-contact-modal="true"]');
const modalClosers = document.querySelectorAll('[data-close-contact-modal="true"]');
const callModal = document.querySelector('#callModal');
const callOpeners = document.querySelectorAll('[data-open-call-modal="true"]');
const callClosers = document.querySelectorAll('[data-close-call-modal="true"]');
const thanksModal = document.querySelector('#thanksModal');
const thanksClosers = document.querySelectorAll('[data-close-thanks-modal="true"]');
const isEnglish = document.documentElement.lang === 'en';
const isMobile = window.matchMedia('(max-width: 760px)').matches;
const cookieStorageKey = 'demian_buscatti_cookie_consent_v1';
const cookieConsentVersion = 'v2';
const cookieConsentMaxAgeMs = 180 * 24 * 60 * 60 * 1000; // 6 months
const contactEmail = '01121987r@gmail.com';
const FORM_DELIVERY_MODE = 'formsubmit'; // 'mailto' | 'formsubmit'
const formSubmitEndpoint = `https://formsubmit.co/ajax/${contactEmail}`;
let activeIndex = 0;
let modalTrigger = null;

document.querySelectorAll('[data-project-gallery]').forEach((gallery) => {
  const tabList = gallery.querySelector('.project-tabs');
  const tabs = [...gallery.querySelectorAll('[data-project-target]')];
  const panels = [...gallery.querySelectorAll('.project-study')];
  if (!tabList || !tabs.length || tabs.length !== panels.length) return;

  const activateProject = (index, focus = false) => {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[tabIndex].hidden = !selected;
    });
    const image = panels[index].querySelector('img');
    if (image) image.loading = 'eager';
    if (focus) tabs[index].focus({ preventScroll: true });
  };

  tabList.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.dataset.projectTarget);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => activateProject(index));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      activateProject(nextIndex, true);
    });
  });

  // All projects stay readable if JavaScript is unavailable.
  activateProject(0);
  gallery.classList.add('is-enhanced');
  tabList.hidden = false;
});

// Keep keyboard navigation inside the active dialog and restore its entry point.
document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-open-contact-modal], [data-open-call-modal]');
  if (opener) modalTrigger = opener;
  const closer = event.target.closest('[data-close-contact-modal], [data-close-call-modal], [data-close-thanks-modal]');
  if (closer && !document.querySelector('.modal.is-open')) modalTrigger?.focus();
});
document.addEventListener('keydown', (event) => {
  const dialog = document.querySelector('.modal.is-open .modal-dialog');
  if (!dialog) return;
  if (event.key === 'Escape') {
    requestAnimationFrame(() => modalTrigger?.focus());
    return;
  }
  if (event.key !== 'Tab') return;
  const controls = [...dialog.querySelectorAll('a[href], button, input, textarea, select, [tabindex="0"]')]
    .filter((control) => !control.disabled && control.getClientRects().length);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

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
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => modal?.querySelector('form')?.querySelector('input, textarea')?.focus());
};

const closeContactModal = () => {
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  document.body.classList.remove('modal-open');
};

const openCallModal = () => {
  if (!callModal) return;
  closeMenu();
  closeContactModal();
  callModal.classList.add('is-open');
  callModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => callModal?.querySelector('form')?.querySelector('input, textarea')?.focus());
};

const closeCallModal = () => {
  if (!callModal) return;
  callModal.classList.remove('is-open');
  callModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  document.body.classList.remove('modal-open');
};

const openThanksModal = () => {
  if (!thanksModal) return;
  closeContactModal();
  closeCallModal();
  thanksModal.classList.add('is-open');
  thanksModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open');
  document.body.classList.add('modal-open');
};

const closeThanksModal = () => {
  if (!thanksModal) return;
  thanksModal.classList.remove('is-open');
  thanksModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  document.body.classList.remove('modal-open');
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

if (revealItems.length && !isMobile) {
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
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (qualityMetrics.length && !isMobile) {
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
} else if (qualityMetrics.length) {
  qualityMetrics.forEach((metric) => {
    const fill = metric.querySelector('.quality-meter-fill');
    if (fill) {
      fill.style.width = `${metric.dataset.fill || '0'}%`;
    }
  });
}

const setupPortfolioCarousel = () => {
  if (isMobile) {
    document.querySelectorAll('[data-portfolio-carousel]').forEach((carousel) => {
      carousel.classList.add('is-mobile');
    });
    return;
  }
  const carousels = document.querySelectorAll('[data-portfolio-carousel]');
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('.portfolio-track');
    if (!track) return;

    let offset = 0;
    let rafId = 0;
    let paused = false;
    let pointerDown = false;
    let dragging = false;
    let dragMoved = false;
    let startX = 0;
    let lastX = 0;
    let resumeTimer = 0;
    const autoSpeed = 0.32;
    const dragThreshold = 6;

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
      pointerDown = true;
      dragging = false;
      dragMoved = false;
      paused = true;
      carousel.classList.add('is-paused');
      startX = event.clientX;
      lastX = offset;
    });

    carousel.addEventListener('pointermove', (event) => {
      if (!pointerDown) return;
      const deltaX = event.clientX - startX;
      if (!dragging && Math.abs(deltaX) > dragThreshold) {
        dragging = true;
        dragMoved = true;
        carousel.classList.add('is-dragging');
        carousel.setPointerCapture?.(event.pointerId);
      }
      if (!dragging) return;
      offset = lastX - deltaX;
      render();
    });

    const endDrag = (event) => {
      if (!pointerDown) return;
      pointerDown = false;
      if (dragging) {
        dragging = false;
        carousel.releasePointerCapture?.(event.pointerId);
      }
      carousel.classList.remove('is-dragging');
      queueResume();
      window.setTimeout(() => {
        dragMoved = false;
      }, 0);
    };

    carousel.addEventListener('pointerup', endDrag);
    carousel.addEventListener('pointercancel', endDrag);
    carousel.addEventListener('pointerleave', () => {
      if (!pointerDown) return;
      pointerDown = false;
      dragging = false;
      carousel.classList.remove('is-dragging');
      queueResume();
      window.setTimeout(() => {
        dragMoved = false;
      }, 0);
    });

    track.querySelectorAll('a').forEach((link) => {
      link.addEventListener('pointerdown', () => {
        paused = true;
        carousel.classList.add('is-paused');
      });
      link.addEventListener('click', (event) => {
        if (dragMoved) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        event.preventDefault();
        window.open(link.href, link.target || '_self', link.target === '_blank' ? 'noopener,noreferrer' : undefined);
      });
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
    card.hidden = cardIndex !== activeIndex;
    card.classList.toggle('is-active', cardIndex === activeIndex);
  });
};

if (testimonialCards.length) {
  showSlide(0);

  prevBtn?.addEventListener('click', () => {
    showSlide(activeIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    showSlide(activeIndex + 1);
  });
}

const getFormKind = (form) => {
  if (!form) return 'contact';
  if (form.id === 'contactModalForm') return 'project';
  if (form.id === 'callModalForm') return 'call';
  return 'contact';
};

const getInvalidMessage = () => (
  isEnglish
    ? 'Complete all required fields and confirm the privacy checkbox.'
    : 'Compila tutti i campi richiesti e conferma la privacy.'
);

const getSuccessMessage = (kind) => {
  if (kind === 'call') {
    return isEnglish
      ? 'Call request sent. I will contact you to define availability and timing.'
      : 'Richiesta call inviata. Ti ricontatterò per definire disponibilità e orario.';
  }

  if (kind === 'project') {
    return isEnglish
      ? 'Request sent. I will get back to you with an initial operational response as soon as possible.'
      : 'Richiesta inviata. Ti ricontatterò con un primo riscontro operativo il prima possibile.';
  }

  return isEnglish
    ? 'Message sent. I will get back to you with an initial operational reply as soon as possible.'
    : 'Messaggio inviato. Ti ricontatterò con una prima risposta operativa il prima possibile.';
};

const getErrorMessage = () => (
  isEnglish
    ? 'Unable to send right now. Try again in a minute or contact me on WhatsApp.'
    : 'Invio non riuscito al momento. Riprova tra un minuto oppure contattami su WhatsApp.'
);

const getMailtoOpenedMessage = () => (
  isEnglish
    ? 'Email app opened. Confirm and send the message from your client.'
    : 'Client email aperto. Conferma e invia il messaggio dal tuo programma di posta.'
);

const getSubject = (kind) => {
  if (kind === 'call') {
    return isEnglish ? 'Website - New call request' : 'Sito web - Nuova richiesta call';
  }
  if (kind === 'project') {
    return isEnglish ? 'Website - New project request (modal)' : 'Sito web - Nuova richiesta progetto (modal)';
  }
  return isEnglish ? 'Website - New contact request' : 'Sito web - Nuova richiesta contatto';
};

const buildPayload = (form, kind) => {
  const data = new FormData(form);
  const payload = {
    _subject: getSubject(kind),
    _template: 'table',
    _captcha: 'false',
    source: 'portfolio-web-developer',
    form_kind: kind,
    page_url: window.location.href,
    language: isEnglish ? 'en' : 'it'
  };

  data.forEach((value, key) => {
    payload[key] = typeof value === 'string' ? value.trim() : value;
  });

  return payload;
};

const buildMailtoBody = (form, kind) => {
  const data = new FormData(form);
  const lines = [
    `${isEnglish ? 'Form type' : 'Tipo form'}: ${kind}`,
    `${isEnglish ? 'Page URL' : 'Pagina'}: ${window.location.href}`,
    `${isEnglish ? 'Language' : 'Lingua'}: ${isEnglish ? 'en' : 'it'}`,
    ''
  ];

  data.forEach((value, key) => {
    if (key === 'privacy') return;
    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
    lines.push(`${formattedKey}: ${String(value).trim()}`);
  });

  lines.push(`${isEnglish ? 'Privacy consent' : 'Consenso privacy'}: yes`);
  return lines.join('\n');
};

const setFormBusy = (form, busy) => {
  const submitButton = form.querySelector('button[type="submit"]');
  if (!submitButton) return;
  submitButton.disabled = busy;
  submitButton.style.opacity = busy ? '0.7' : '1';
};

const handleFormSubmit = async (form, feedback) => {
  const kind = getFormKind(form);

  if (!form.reportValidity()) {
    feedback.textContent = getInvalidMessage();
    return;
  }

  setFormBusy(form, true);
  feedback.textContent = isEnglish ? 'Sending...' : 'Invio in corso...';

  if (FORM_DELIVERY_MODE === 'mailto') {
    const subject = getSubject(kind);
    const body = buildMailtoBody(form, kind);
    const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    feedback.textContent = getMailtoOpenedMessage();
    setFormBusy(form, false);
    return;
  }

  try {
    const response = await fetch(formSubmitEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(buildPayload(form, kind))
    });

    if (!response.ok) {
      throw new Error(`Form submit failed with status ${response.status}`);
    }

    feedback.textContent = getSuccessMessage(kind);
    form.reset();
    openThanksModal();
  } catch (error) {
    feedback.textContent = getErrorMessage();
    console.error(error);
  } finally {
    setFormBusy(form, false);
  }
};

if (forms.length) {
  forms.forEach((formElement) => {
    const feedback = formElement.querySelector('.form-feedback');
    if (!feedback) return;

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      handleFormSubmit(formElement, feedback);
    });
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

if (!isMobile) {
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
}

const readCookieConsentState = () => {
  const raw = localStorage.getItem(cookieStorageKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    return {
      choice: raw,
      timestamp: 0,
      version: 'legacy'
    };
  }

  return null;
};

const shouldShowCookieBanner = () => {
  const state = readCookieConsentState();
  if (!state) return true;
  if (state.version !== cookieConsentVersion) return true;
  if (typeof state.timestamp !== 'number') return true;
  return Date.now() - state.timestamp > cookieConsentMaxAgeMs;
};

const saveCookieConsentState = (choice) => {
  localStorage.setItem(
    cookieStorageKey,
    JSON.stringify({
      choice,
      version: cookieConsentVersion,
      timestamp: Date.now()
    })
  );
};

const createCookieBanner = () => {
  if (!shouldShowCookieBanner()) return;

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
            ? `This website uses only technical cookies and equivalent local storage tools required for functionality. No profiling or marketing cookies are directly set. Read <a href="${privacyLink}">Privacy Policy</a> and <a href="${cookieLink}">Cookie Policy</a> for details.`
            : `Questo sito utilizza solo cookie tecnici e strumenti equivalenti di memorizzazione locale necessari al funzionamento. Non vengono impostati direttamente cookie di profilazione o marketing. Leggi <a href="${privacyLink}">Privacy Policy</a> e <a href="${cookieLink}">Cookie Policy</a> per i dettagli.`
        }
      </p>
      <div class="cookie-actions">
        <button class="btn btn-primary" type="button" data-cookie-action="acknowledge">${isEnglish ? 'Got it' : 'Ho capito'}</button>
      </div>
    </div>
  `;

  const closeBanner = (value) => {
    saveCookieConsentState(value);
    banner.remove();
  };

  banner.querySelector('[data-cookie-action="acknowledge"]')?.addEventListener('click', () => closeBanner('acknowledged'));

  document.body.appendChild(banner);
};

createCookieBanner();

const siteIntro = document.querySelector('.site-intro');
const introMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (siteIntro && !introMotion.matches) {
  const entryFocus = document.activeElement;
  const background = [...document.body.children]
    .filter((element) => element !== siteIntro && !['SCRIPT', 'STYLE'].includes(element.tagName))
    .map((element) => ({ element, inert: element.inert }));
  let finished = false;
  let exitTimer;
  let progressFrame;
  const progressFill = siteIntro.querySelector('.intro-track span');
  const progressCounter = siteIntro.querySelector('.intro-progress');
  const progressDuration = 2800;
  let progressStart;
  // One clock drives both the percentage and the fill, so they cannot drift.
  const advanceProgress = (timestamp) => {
    if (finished) return;
    progressStart ??= timestamp;
    const progress = Math.min((timestamp - progressStart) / progressDuration, 1);
    progressFill.style.transform = `scaleX(${progress})`;
    progressCounter.textContent = `${Math.floor(progress * 100)}%`;
    if (progress < 1) progressFrame = requestAnimationFrame(advanceProgress);
  };
  const finishIntro = () => {
    siteIntro.hidden = true;
    document.body.classList.remove('intro-playing');
    background.forEach(({ element, inert }) => { element.inert = inert; });
    document.removeEventListener('keydown', introKeys);
    introMotion.removeEventListener('change', leaveIntro);
    if (siteIntro.contains(document.activeElement)) {
      const destination = entryFocus !== document.body ? entryFocus : document.querySelector('.brand');
      destination?.focus({ preventScroll: true });
    }
  };
  const leaveIntro = () => {
    if (finished) return;
    finished = true;
    clearTimeout(exitTimer);
    cancelAnimationFrame(progressFrame);
    siteIntro.classList.add('is-leaving');
    window.setTimeout(finishIntro, introMotion.matches ? 0 : 480);
  };
  const introKeys = (event) => {
    if (event.key === 'Escape') leaveIntro();
    if (event.key === 'Tab') {
      event.preventDefault();
      siteIntro.querySelector('button').focus({ preventScroll: true });
    }
  };
  // The page stays usable without JavaScript or with reduced motion enabled.
  background.forEach(({ element }) => { element.inert = true; });
  document.body.classList.add('intro-playing');
  siteIntro.hidden = false;
  progressFrame = requestAnimationFrame(advanceProgress);
  siteIntro.querySelector('button').focus({ preventScroll: true });
  siteIntro.querySelector('button').addEventListener('click', leaveIntro, { once: true });
  document.addEventListener('keydown', introKeys);
  introMotion.addEventListener('change', leaveIntro);
  // Keep the completed identity visible for two seconds before revealing the site.
  exitTimer = window.setTimeout(leaveIntro, 4800);
}
