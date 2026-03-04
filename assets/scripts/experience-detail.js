/* =============================================================================
   experience-detail.js
   Timeline disclosure pattern using <details>/<summary>.
   - Mobile:  native <details> expand/collapse with CSS slide animation.
              Inline content has no repeated header (summary card shows it).
   - Desktop: click intercepted; right-hand panel populated with full detail.
   ============================================================================= */

const detailData = {
  unipro: {
    role: 'SENIOR FRONT END DEVELOPER',
    company: 'UNIPRO LTD',
    date: '// 2023 – PRESENT',
    metrics: [
      { value: '12+',  label: 'Apps delivered' },
      { value: '6',    label: 'Team size' },
      { value: 'AA',   label: 'WCAG level' },
    ],
    achievements: [
      'Architected frontend systems for OutSystems 11 enterprise applications serving 1,000+ daily users.',
      'Established WCAG 2.1 AA compliance standards and led the organisation-wide accessibility programme.',
      'Mentored a team of six developers in modern CSS, performance patterns, and semantic HTML.',
      'Cut component build overhead by 35% through a bespoke design-system tooling pipeline.',
    ],
    tech: ['OutSystems', 'CSS3', 'JavaScript', 'WCAG 2.1', 'Figma', 'Git', 'Axe'],
    highlights: ['Enterprise Design System', 'A11y Audit Programme', 'Component Library', 'Dev Mentorship'],
  },

  charlesstanley: {
    role: 'FRONT END DEVELOPER',
    company: 'CHARLES STANLEY DIRECT',
    date: '// 2019 – 2023',
    metrics: [
      { value: '10K+', label: 'Investors served' },
      { value: '200+', label: 'A11y issues fixed' },
      { value: '20%',  label: 'Drop-off reduced' },
    ],
    achievements: [
      'Delivered WCAG 2.1 AA-compliant financial applications for thousands of retail investors.',
      'Led a cross-team accessibility audit programme spanning 8 live web properties.',
      'Authored frontend coding standards documentation adopted across the entire engineering org.',
      'Partnered with UX to redesign the onboarding flow, reducing user drop-off by 20%.',
    ],
    tech: ['HTML5', 'SCSS', 'JavaScript', 'WCAG 2.1', 'Axe', 'Jira', 'Git'],
    highlights: ['Accessibility Audit Programme', 'Frontend Standards Docs', 'Investor Portal Redesign'],
  },

  carterscott: {
    role: 'WEB DEVELOPER',
    company: 'CARTER SCOTT CONSULTING',
    date: '// 2015 – 2019',
    metrics: [
      { value: '30+', label: 'Sites delivered' },
      { value: '8',   label: 'Client sectors' },
      { value: '50%', label: 'Load time saved' },
    ],
    achievements: [
      'Delivered 30+ websites across diverse industries: finance, property, and professional services.',
      'Specialised in Drupal CMS development for enterprise-scale content management requirements.',
      'Implemented performance optimisation strategies, cutting average page load times by 50%.',
      'Championed responsive design adoption across the full agency portfolio.',
    ],
    tech: ['Drupal', 'PHP', 'HTML5', 'CSS3', 'jQuery', 'MySQL', 'Git'],
    highlights: ['Multi-sector Portfolio', 'Drupal CMS Platform', 'Performance Optimisation'],
  },
};

/* ── Helpers ─────────────────────────────────────────────────────────────────── */

const mobileQuery = window.matchMedia('(max-width: 900px)');

function buildMetric({ value, label }) {
  return `<div class="detail-metric">
    <span class="metric-value">${value}</span>
    <span class="metric-label">${label}</span>
  </div>`;
}

function buildDetailSections(data) {
  return `
    <div class="detail-metrics">
      ${data.metrics.map(buildMetric).join('')}
    </div>

    <div class="detail-section">
      <p class="detail-section-label">Achievements</p>
      <ul class="detail-achievements">
        ${data.achievements.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>

    <div class="detail-section">
      <p class="detail-section-label">Tech Stack</p>
      <ul class="badge-list">
        ${data.tech.map(t => `<li class="badge">${t}</li>`).join('')}
      </ul>
    </div>

    <div class="detail-section">
      <p class="detail-section-label">Highlights</p>
      <ul class="detail-highlights">
        ${data.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `;
}

/* Desktop right panel — includes the header since there's no summary above it */
function renderRightPanel(panel, data) {
  panel.innerHTML = `
    <div class="detail-header">
      <p class="detail-date">${data.date}</p>
      <h3 class="detail-role">${data.role}</h3>
      <p class="detail-company">${data.company}</p>
    </div>
    ${buildDetailSections(data)}
  `;
}

/* Mobile inline container — no header (the <summary> card above shows it) */
function renderInlineDetail(container, data) {
  container.innerHTML = buildDetailSections(data);
}

/* ── Desktop activation (right panel) ───────────────────────────────────────── */

function activateDesktop(item, items, panel) {
  const data = detailData[item.dataset.detailId];
  if (!data) return;

  /* Update selected states; set <details> open for correct aria-expanded */
  items.forEach(el => {
    el.classList.remove('is-selected');
    const det = el.querySelector('.timeline-details');
    if (det) det.open = false;
  });
  item.classList.add('is-selected');
  const det = item.querySelector('.timeline-details');
  if (det) det.open = true; /* keeps aria-expanded in sync */

  /* Populate and animate right panel */
  renderRightPanel(panel, data);
  panel.classList.remove('is-active');
  void panel.offsetWidth;
  panel.classList.add('is-active');
}

/* ── Init ────────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const items  = Array.from(document.querySelectorAll('.timeline-item[data-detail-id]'));
  const panel  = document.getElementById('experience-detail');
  const allDet = Array.from(document.querySelectorAll('.timeline-details'));

  if (!items.length || !panel) return;

  /* Pre-populate all inline containers so mobile expand is instant */
  items.forEach(item => {
    const data      = detailData[item.dataset.detailId];
    const container = item.querySelector('.timeline-extra-inner');
    if (data && container) renderInlineDetail(container, data);
  });

  /* Mobile accordion: close others when one opens */
  allDet.forEach(det => {
    det.addEventListener('toggle', () => {
      if (det.open) {
        allDet.forEach(other => { if (other !== det) other.open = false; });
      }
    });
  });

  /* Summary click: desktop → right panel; mobile → native <details> toggle */
  items.forEach(item => {
    const summary = item.querySelector('.timeline-summary');
    if (!summary) return;

    summary.addEventListener('click', e => {
      if (!mobileQuery.matches) {
        e.preventDefault(); /* stop <details> toggling inline on desktop */
        activateDesktop(item, items, panel);
      }
    });

    summary.addEventListener('keydown', e => {
      if (!mobileQuery.matches && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        activateDesktop(item, items, panel);
      }
    });
  });

  /* On resize to desktop: re-activate the currently selected (or first) item */
  mobileQuery.addEventListener('change', e => {
    if (!e.matches) {
      const selected = items.find(el => el.classList.contains('is-selected')) || items[0];
      activateDesktop(selected, items, panel);
    }
  });

  /* Auto-select first item on desktop load */
  if (!mobileQuery.matches) {
    activateDesktop(items[0], items, panel);
  }
});
