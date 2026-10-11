(() => {
  const measurementId = 'G-Z3J601SW05';
  const storageKey = 'demian_buscatti_cookie_consent_v1';
  const version = 'v3';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  const english = document.documentElement.lang === 'en';
  const disableKey = `ga-disable-${measurementId}`;
  let loaded = false;
  let banner;
  let trigger;
  window[disableKey] = true;

  const readChoice = () => {
    try {
      const state = JSON.parse(localStorage.getItem(storageKey) || 'null');
      const age = Date.now() - state?.timestamp;
      return state?.version === version && typeof state.analytics === 'boolean' &&
        Number.isFinite(age) && age >= 0 && age < maxAge ? state : null;
    } catch {
      return null;
    }
  };

  const clearAnalyticsCookies = () => {
    const domains = ['', location.hostname];
    const labels = location.hostname.split('.');
    for (let i = 0; i < labels.length - 1; i += 1) domains.push(`.${labels.slice(i).join('.')}`);
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) return;
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`;
      });
    });
  };

  const loadAnalytics = () => {
    // Development previews must not send test visits to the live property.
    if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;
    window[disableKey] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: maxAge / 1000,
      cookie_update: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  };

  const choose = (analytics) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ analytics, version, timestamp: Date.now() }));
    } catch {
      // The current choice still works when browser storage is unavailable.
      if (!analytics) {
        try { localStorage.removeItem(storageKey); } catch { /* Keep the current tag disabled. */ }
      }
    }
    banner?.remove();
    banner = null;
    trigger?.focus({ preventScroll: true });
    if (analytics) {
      loadAnalytics();
    } else {
      window[disableKey] = true;
      clearAnalyticsCookies();
      // A fresh document removes the running tag entirely, not just its cookies.
      if (loaded && !readChoice()?.analytics) location.reload();
    }
  };

  const showPreferences = (source) => {
    if (banner) {
      if (source) banner.querySelector('button')?.focus();
      return;
    }
    trigger = source || null;
    banner = document.createElement('section');
    banner.className = 'cookie-banner is-visible';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', english ? 'Cookie preferences' : 'Preferenze cookie');
    const privacy = english ? 'privacy-en.html' : 'privacy.html';
    const policy = english ? 'cookie-en.html' : 'cookie.html';
    banner.innerHTML = `
      <div class="cookie-panel">
        <strong class="cookie-topline">${english ? 'Cookie preferences' : 'Preferenze cookie'}</strong>
        <p class="cookie-copy">${english
          ? 'I use technical tools required for this website to work. With your consent, I enable Google Analytics to measure visits. You can refuse statistics and continue browsing, or change your choice from Cookie preferences.'
          : 'Uso strumenti tecnici necessari al funzionamento del sito. Con il tuo consenso, attivo Google Analytics per misurare le visite. Puoi rifiutare le statistiche e continuare a navigare, oppure modificare la scelta dalle Preferenze cookie.'}
          <a href="${privacy}">Privacy Policy</a> · <a href="${policy}">Cookie Policy</a>
        </p>
        <div class="cookie-actions">
          <button class="btn btn-outline" type="button" data-cookie-action="reject">${english ? 'Refuse optional cookies' : 'Rifiuta facoltativi'}</button>
          <button class="btn btn-outline" type="button" data-cookie-action="accept">${english ? 'Accept statistics' : 'Accetta statistiche'}</button>
        </div>
      </div>`;
    banner.querySelector('[data-cookie-action="reject"]').addEventListener('click', () => choose(false));
    banner.querySelector('[data-cookie-action="accept"]').addEventListener('click', () => choose(true));
    document.body.appendChild(banner);
    if (source) banner.querySelector('button').focus();
  };

  document.querySelectorAll('[data-cookie-preferences]').forEach((button) => {
    button.addEventListener('click', () => showPreferences(button));
  });
  const state = readChoice();
  if (state?.analytics) loadAnalytics();
  else clearAnalyticsCookies();
  if (!state) showPreferences();
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    const next = readChoice();
    if (next?.analytics) loadAnalytics();
    else {
      window[disableKey] = true;
      clearAnalyticsCookies();
      if (loaded) location.reload();
    }
    if (!next) showPreferences();
    else { banner?.remove(); banner = null; }
  });
})();
