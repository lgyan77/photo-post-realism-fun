function buildComparisonHTML(before, after) {
  return `
    <div class="max-w-5xl">
      <div class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
        <figure class="w-full md:w-[44%]">
          <img
            src="${before.thumb}"
            alt="Before post-processing"
            class="w-full h-auto border border-gray-100"
            loading="lazy"
            decoding="async"
          />
          <figcaption class="text-gray-900 text-xs font-light tracking-wider mt-2 text-center">BEFORE</figcaption>
        </figure>

        <div class="flex items-center justify-center">
          <svg
            class="w-7 h-7 md:w-9 md:h-9 text-gray-900 rotate-90 md:rotate-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h12"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 6l6 6-6 6"></path>
          </svg>
        </div>

        <figure class="w-full md:w-[44%]">
          <img
            src="${after.thumb}"
            alt="After post-processing"
            class="w-full h-auto border border-gray-100"
            loading="lazy"
            decoding="async"
          />
          <figcaption class="text-gray-900 text-xs font-light tracking-wider mt-2 text-center">AFTER</figcaption>
        </figure>
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadSiteCopy() {
  try {
    const res = await fetch('content.json', { cache: 'no-cache' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function renderAboutText(copy) {
  const wrap = document.getElementById('about-text');
  if (!wrap) return;

  const subheadingEl = document.getElementById('about-subheading');
  const subheading = copy?.aboutPage?.subheading;
  if (subheadingEl && typeof subheading === 'string' && subheading.trim()) {
    subheadingEl.textContent = subheading.trim();
  }

  const paras = copy?.aboutPage?.paragraphs;
  if (Array.isArray(paras) && paras.length > 0) {
    const html = paras
      .filter(p => typeof p === 'string' && p.trim())
      .map((p, idx) => `
        <p class="text-gray-500 font-light text-sm md:text-base w-full leading-relaxed ${idx > 0 ? 'mt-6' : ''}">
          ${escapeHtml(p.trim())}
        </p>
      `).join('');

    // Keep existing h2, replace only paragraphs
    [...wrap.querySelectorAll('p')].forEach(p => p.remove());
    wrap.insertAdjacentHTML('beforeend', html);
  }
}

async function initAbout() {
  const mount = document.getElementById('about-comparison');
  if (!mount) return;

  // Editable text from content.json (no rebuild needed)
  const copy = await loadSiteCopy();
  if (copy) renderAboutText(copy);

  try {
    const res = await fetch('data/about.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`about.json not found (${res.status})`);
    const data = await res.json();

    const before = data?.comparison?.before;
    const after = data?.comparison?.after;
    if (!before?.thumb || !after?.thumb) {
      throw new Error('about.json missing comparison.before/after thumbs');
    }

    mount.innerHTML = buildComparisonHTML(before, after);
  } catch (e) {
    // Graceful placeholder: page works even before images are uploaded
    mount.innerHTML = `
      <div class="max-w-3xl">
        <p class="text-gray-600 font-light text-sm md:text-base leading-relaxed">
          Upload two full-size images to <code class="text-gray-700">images/about/originals/</code> and run <code class="text-gray-700">npm run build</code> to generate thumbnails for this section.
        </p>
      </div>
    `;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAbout);
} else {
  initAbout();
}

