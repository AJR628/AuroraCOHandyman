(function () {
  'use strict';

  var path = window.location.pathname;
  var normalizedPath = path === '/' ? '/' : path.replace(/\/+$/, '') + '/';
  var serviceNames = {
    '/drywall-repair/': 'drywall',
    '/ceiling-repair/': 'ceiling',
    '/deck-repair/': 'deck',
    '/fence-repair/': 'fence',
    '/interior-painting/': 'painting',
    '/gutter-cleaning/': 'gutters',
    '/door-repair/': 'doors'
  };

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  }

  function track(eventName, parameters) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, parameters || {});
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var linkText = cleanText(link.textContent);

    if (href.indexOf('mailto:') === 0) {
      track('email_click', {
        cta_text: linkText,
        source_page: normalizedPath
      });
      return;
    }

    var targetPath;
    try {
      targetPath = new URL(link.href, window.location.origin).pathname;
      targetPath = targetPath === '/' ? '/' : targetPath.replace(/\/+$/, '') + '/';
    } catch (error) {
      return;
    }

    if (targetPath === '/contact/') {
      track('quote_cta_click', {
        cta_text: linkText,
        source_page: normalizedPath
      });
    }

    if (serviceNames[targetPath]) {
      track('service_detail_click', {
        service_name: serviceNames[targetPath],
        source_page: normalizedPath
      });
    }
  });

  var quoteForm = document.querySelector('form[name="quote"]');
  if (quoteForm) {
    var formStarted = false;

    quoteForm.addEventListener('input', function () {
      if (formStarted) return;
      formStarted = true;
      track('estimate_form_start', {
        form_name: 'quote',
        source_page: normalizedPath
      });
    });

    quoteForm.addEventListener('submit', function () {
      var serviceField = quoteForm.querySelector('[name="service"]');
      var serviceName = serviceField && serviceField.value ? serviceField.value : 'not_selected';

      try {
        window.sessionStorage.setItem('ach_quote_pending', '1');
        window.sessionStorage.setItem('ach_quote_service', serviceName);
      } catch (error) {
        // Conversion tracking must never block a form submission.
      }

      track('estimate_form_submit', {
        form_name: 'quote',
        service_name: serviceName,
        source_page: normalizedPath
      });
    });
  }

  if (normalizedPath === '/thank-you/') {
    var hasPendingQuote = false;
    var submittedService = 'not_selected';

    try {
      hasPendingQuote = window.sessionStorage.getItem('ach_quote_pending') === '1';
      submittedService = window.sessionStorage.getItem('ach_quote_service') || submittedService;
      window.sessionStorage.removeItem('ach_quote_pending');
      window.sessionStorage.removeItem('ach_quote_service');
    } catch (error) {
      // Storage can be unavailable in privacy-focused browser modes.
    }

    if (hasPendingQuote) {
      track('estimate_form_success', {
        form_name: 'quote',
        service_name: submittedService
      });
    }
  }

  if (normalizedPath !== '/contact/' && normalizedPath !== '/thank-you/') {
    var actionBar = document.createElement('aside');
    actionBar.className = 'mobile-quote-bar';
    actionBar.setAttribute('aria-label', 'Request a quote');
    actionBar.innerHTML = '<a href="/contact/" class="btn btn-primary">Request a Free Quote</a>';
    document.body.appendChild(actionBar);
    document.body.classList.add('has-mobile-quote-bar');
  }
})();