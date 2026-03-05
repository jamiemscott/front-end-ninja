(function () {
  'use strict';

  /* ── Obfuscated email links — assemble mailto: from data attributes ── */
  document.querySelectorAll('.contact-email').forEach(function (el) {
    el.href = 'mailto:' + el.dataset.u + '@' + el.dataset.d;
  });

  const form = document.querySelector('form[name="contact-form"]');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit');
  const successPanel = document.getElementById('form-success');
  const dismissBtn = successPanel.querySelector('.form-success-dismiss');
  const ORIGINAL_LABEL = submitBtn.textContent;
  const fields = form.querySelectorAll('.form-input');

  function disableForm() {
    fields.forEach(function (f) { f.disabled = true; });
    submitBtn.disabled = true;
    submitBtn.textContent = ORIGINAL_LABEL;
    submitBtn.removeAttribute('aria-busy');
    form.classList.add('is-submitted');
  }

  function enableForm() {
    fields.forEach(function (f) { f.disabled = false; });
    submitBtn.disabled = false;
    form.classList.remove('is-submitted');
  }

  // Dismiss — re-enable fields, hide success panel, reset form
  dismissBtn.addEventListener('click', function () {
    successPanel.hidden = true;
    enableForm();
    form.reset();
    form.classList.remove('was-validated');
    fields[0].focus();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Run native constraint validation
    // was-validated triggers CSS :invalid highlighting on all fields
    form.classList.add('was-validated');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Clear validated state and any previous network error on a valid submit
    form.classList.remove('was-validated');
    const prevError = form.querySelector('.form-error');
    if (prevError) prevError.remove();

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'TRANSMITTING...';
    submitBtn.setAttribute('aria-busy', 'true');

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok (' + response.status + ')');
        }

        // Disable fields, show success panel below the form
        disableForm();
        successPanel.hidden = false;
        successPanel.focus();
      })
      .catch(function () {
        // Restore button on network failure
        submitBtn.disabled = false;
        submitBtn.textContent = ORIGINAL_LABEL;
        submitBtn.removeAttribute('aria-busy');

        // Inline error message
        const errorEl = document.createElement('p');
        errorEl.className = 'form-error';
        errorEl.setAttribute('role', 'alert');
        errorEl.textContent = 'Transmission failed. Please try again or email directly.';
        form.appendChild(errorEl);
      });
  });

}());
