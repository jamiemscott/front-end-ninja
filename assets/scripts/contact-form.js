(function () {
  'use strict';

  const form = document.querySelector('form[name="contact-form"]');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit');
  const successPanel = document.getElementById('form-success');
  const ORIGINAL_LABEL = submitBtn.textContent;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Run native constraint validation — show built-in messages for empty fields
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Remove any previous error
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

        // Hide the form, reveal success panel
        form.hidden = true;
        successPanel.hidden = false;
        successPanel.focus();
      })
      .catch(function () {
        // Restore button
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
