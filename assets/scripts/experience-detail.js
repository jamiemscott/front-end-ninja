/* =============================================================================
   experience-detail.js
   Timeline disclosure pattern using <details>/<summary>.
   - Mobile:  native <details> expand/collapse with CSS slide animation.
              Inline content has no repeated header (summary card shows it).
   - Desktop: click intercepted; right-hand panel populated with full detail.
   ============================================================================= */

const detailData = {
  nttdata: {
    role: 'OUTSYSTEMS DEVELOPER',
    company: 'NTT DATA',
    date: '// 2025 – PRESENT',
    metrics: [
      { value: 'OS11',  label: 'Platform' },
      { value: 'Top 7', label: 'Global IT firm' },
      { value: 'AA',    label: 'A11y standard' },
    ],
    achievements: [
      'Building enterprise OutSystems applications at one of the world\'s largest IT services and consulting companies.',
      'Delivering scalable low-code solutions for client business-critical processes at global scale.',
      'Applying WCAG accessibility standards and frontend best practices within the OutSystems ecosystem.',
      'Collaborating with multi-disciplinary engineering teams across the London-based delivery practice.',
    ],
    tech: ['OutSystems 11', 'JavaScript', 'HTML5', 'CSS3', 'WCAG 2.1', 'Git', 'Agile'],
    highlights: ['Enterprise Low-Code', 'Global Delivery Scale', 'Accessibility Standards'],
  },

  unipro: {
    role: 'FRONTEND WEB DEVELOPER',
    company: 'UNIPRO LTD',
    date: '// 2019 – 2024',
    metrics: [
      { value: '5yr',    label: 'Tenure' },
      { value: 'Pharma', label: 'Industry focus' },
      { value: '12+',    label: 'Projects' },
    ],
    achievements: [
      'Developed and implemented Drupal themes meeting complex requirements of major pharmaceutical clients.',
      'Delivered a customised low-code dashboard for a leading music industry analytics platform, enhancing data visualisation.',
      'Spearheaded creation of an internal WYSIWYG web builder tool, streamlining end-to-end web design processes globally.',
      'Created immersive, guided AR tours for laboratory environments to drive engagement and innovation.',
    ],
    tech: ['Drupal', 'HTML5', 'CSS3', 'JavaScript', 'OutSystems', 'WCAG 2.1', 'Figma', 'Git'],
    highlights: ['Pharmaceutical Drupal Themes', 'Music Analytics Dashboard', 'WYSIWYG Web Builder', 'AR Lab Tours'],
  },

  charlesstanley: {
    role: 'FRONT END DEVELOPER',
    company: 'CHARLES STANLEY DIRECT',
    date: '// 2017 – 2019',
    metrics: [
      { value: 'Drupal', label: 'CMS platform' },
      { value: 'AA',     label: 'WCAG standard' },
      { value: '1',      label: 'Living style guide' },
    ],
    achievements: [
      'Maintained Charles Stanley Direct\'s brochureware website using Drupal, ensuring seamless functionality and content updates.',
      'Developed new Drupal templates to optimise site usability and visual appeal for better user experience.',
      'Implemented CSS architecture for the "MyCS" project, including the creation of a dynamic living style guide.',
      'Led research and planning for a Drupal 8 upgrade using JSON headless architecture integrated with .NET services.',
    ],
    tech: ['Drupal 8', 'HTML5', 'SCSS', 'JavaScript', 'JSON API', '.NET', 'Git', 'WCAG'],
    highlights: ['Brochureware CMS', 'MyCS Living Style Guide', 'Drupal 8 Migration Planning'],
  },

  carterscott: {
    role: 'DIRECTOR',
    company: 'CARTER SCOTT CONSULTING',
    date: '// 2016 – 2017',
    metrics: [
      { value: 'IIS', label: 'Server platform' },
      { value: '2+',  label: 'Key clients' },
      { value: 'DR',  label: 'Disaster recovery' },
    ],
    achievements: [
      'Configured and maintained IIS server environments, ensuring system stability and performance.',
      'Partnered with a press agency to modernise and future-proof their web presence.',
      'Optimised an existing Drupal-based CMS, improving functionality and overall user experience.',
      'Introduced a Drupal revisioning system and streamlined deployments to live and disaster recovery servers.',
    ],
    tech: ['Drupal', 'IIS', 'HTML5', 'CSS3', 'PHP', 'JavaScript', '.NET'],
    highlights: ['IIS Server Management', 'Drupal CMS Optimisation', 'Disaster Recovery Pipeline'],
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
