/**
 * cursor.js — Custom neon cursor dot + lagging ring follower.
 * Scales up on hover over interactive elements.
 */
(function () {
  'use strict';

  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');

  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top  = my - 6 + 'px';
  });

  // Lagging ring follows cursor with easing
  (function animateRing() {
    rx += (mx - rx - 18) * 0.12;
    ry += (my - ry - 18) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Scale on hover over interactive elements
  document.querySelectorAll('a, button, .skill-card, .project-card, .timeline-item').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2.5)';
      ring.style.width  = '60px';
      ring.style.height = '60px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      ring.style.width  = '36px';
      ring.style.height = '36px';
    });
  });
})();
