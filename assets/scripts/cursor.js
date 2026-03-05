/**
 * cursor.js
 * Three-state neon cursor: default dot · crosshair (interactive) · i-beam (text/input).
 *
 * States
 *   default    — cyan glowing dot (base state)
 *   crosshair  — cyberpunk crosshair with rotating diamond ring
 *   text       — neon i-beam with serifs; ring hides
 *
 * Only activates on fine-pointer (mouse) devices.
 * Adds .has-custom-cursor to <html> so CSS can suppress the native cursor everywhere.
 */
(function () {
  'use strict';

  /* Touch / coarse-pointer devices keep the native cursor */
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  /* Activate universal native-cursor suppression (defined in effects.css) */
  document.documentElement.classList.add('has-custom-cursor');

  /* ── Position tracking ──────────────────────────────────────────────────── */

  let mx = 0, my = 0;   /* exact mouse coords fed to cursor dot  */
  let rx = 0, ry = 0;   /* eased position fed to ring            */
  let ready = false;     /* false → cursor hidden until first move */

  /* Start hidden so there's no flash at (0, 0) before the first mousemove */
  cursor.style.opacity = '0';
  ring.style.opacity   = '0';

  /* ── State selectors ────────────────────────────────────────────────────── */

  /* Text-entry fields → i-beam state */
  const INPUT_SEL =
    'input:not([type="button"]):not([type="submit"]):not([type="reset"])' +
    ':not([type="checkbox"]):not([type="radio"]):not([type="range"])' +
    ':not([type="file"]):not([type="color"]), textarea, [contenteditable]';

  /* Clickable / activatable elements → crosshair state */
  const INTERACTIVE_SEL =
    'a[href], button, [role="button"], [role="link"],' +
    ' summary, select, label,' +
    ' .timeline-item[data-detail-id], .project-card, .skill-card';

  /* Readable text blocks → i-beam state (signals content is selectable) */
  const TEXT_SEL = 'p, h1, h2, h3, h4, h5, h6, blockquote, li, dt, dd';

  /* ── State machine ──────────────────────────────────────────────────────── */

  /**
   * Derive the cursor state from the element under the pointer.
   * Priority: input > interactive > selectable-text > default.
   */
  function getState(el) {
    if (el.closest(INPUT_SEL))       return 'text';
    if (el.closest(INTERACTIVE_SEL)) return 'crosshair';
    if (el.matches(TEXT_SEL) || el.closest(TEXT_SEL)) return 'text';
    return 'default';
  }

  /**
   * Apply the given state by toggling modifier classes.
   * CSS handles all visual transitions.
   */
  function applyState(state) {
    ['crosshair', 'text'].forEach(s => {
      cursor.classList.toggle('cursor--' + s, state === s);
      ring.classList.toggle('cursor-ring--' + s, state === s);
    });
  }

  /* ── Mouse events ───────────────────────────────────────────────────────── */

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    /*
     * CSS transform: translate(-50%, -50%) centres the element on the hotspot.
     * JS just sets left/top to the exact raw mouse coordinates.
     */
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';

    if (!ready) {
      /* Snap ring to current position on first move — avoids sweeping in from (0, 0) */
      rx = mx;
      ry = my;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      /* Clear the opacity: 0 set at init so CSS-defined opacity takes over */
      cursor.style.opacity = '';
      ring.style.opacity   = '';
      ready = true;
    }

    applyState(e.target instanceof Element ? getState(e.target) : 'default');
  });

  /* Hide both elements when the pointer exits the browser viewport */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
    ready = false; /* next entry will snap ring to new position */
  });

  /* ── Eased ring follow ──────────────────────────────────────────────────── */

  /*
   * Ring continuously eases toward the cursor position.
   * No manual half-width offsets needed — CSS translate(-50%, -50%) handles centring
   * regardless of the ring's current size (which changes between states).
   */
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

})();
