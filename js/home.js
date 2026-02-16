// ===========================
// HOME PAGE - Vanilla JS
// ===========================

// State management
let state = {
  sortOrder: 'newest',
  lightbox: {
    isOpen: false,
    sectionId: null,
    photoIndex: 0
  },
  sections: [],
  dataLoaded: false,
  siteCopyLoaded: false,
  siteCopy: null
};

// Load photo data from JSON
async function loadPhotoData() {
  try {
    const response = await fetch('data/photos.json');
    if (!response.ok) {
      console.warn('photos.json not found, using demo data');
      return null;
    }
    const data = await response.json();
    state.dataLoaded = true;
    return data.sections;
  } catch (error) {
    console.warn('Error loading photos.json, using demo data:', error);
    return null;
  }
}

async function loadSiteCopy() {
  try {
    const response = await fetch('content.json', { cache: 'no-cache' });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function createHomeIntro(text) {
  const wrap = document.createElement('div');
  // Align with section padding, keep it visually light.
  // We also slightly reduce the first section top padding to avoid pushing content down.
  wrap.className = 'px-8 md:px-16 lg:px-24 xl:px-32';
  // Use padding (not margin) so it can't be collapsed/ignored.
  // This ensures the spacing is added *under the intro* (not above it).
  wrap.style.paddingBottom = '6pt';
  wrap.innerHTML = `
    <div class="border-l-2 border-gray-200 pl-4 md:pl-5 py-1">
      <p class="text-gray-700 font-light italic text-sm md:text-[17px] leading-relaxed w-full">
        ${text}
      </p>
    </div>
  `;
  return wrap;
}

function adjustIntroPositionWithoutMovingSections(introEl) {
  if (!introEl) return;
  const header = document.getElementById('main-header');
  if (!header) return;

  // Compute gap between header bottom and intro top.
  const headerBottom = header.getBoundingClientRect().bottom;
  const introRect = introEl.getBoundingClientRect();
  const currentGap = introRect.top - headerBottom;

  // Target a tight but readable gap (keeps intro close to nav).
  const targetGap = 8; // px

  const shiftUp = Math.max(0, Math.floor(currentGap - targetGap));
  if (shiftUp <= 0) {
    introEl.style.position = '';
    introEl.style.top = '';
    return;
  }

  // Move intro visually up without affecting layout flow (sections stay put).
  introEl.style.position = 'relative';
  introEl.style.top = `-${shiftUp}px`;
}

// Build metadata HTML only for fields that exist
function buildMetadataHTML(photo) {
  const items = [];
  
  // Check each metadata field and add if exists
  if (photo.camera) items.push(`<span>${photo.camera}</span>`);
  if (photo.lens) items.push(`<span>${photo.lens}</span>`);
  if (photo.focalLength) items.push(`<span>${photo.focalLength}</span>`);
  if (photo.aperture) items.push(`<span>${photo.aperture}</span>`);
  if (photo.shutterSpeed) items.push(`<span>${photo.shutterSpeed}</span>`);
  if (photo.iso) items.push(`<span>${photo.iso}</span>`);
  
  // If no metadata exists, return empty string
  if (items.length === 0) return '';
  
  // Join items with bullet separators
  const separatedItems = items.reduce((acc, item, index) => {
    if (index === 0) return [item];
    return [...acc, '<span class="text-white/30">•</span>', item];
  }, []);
  
  return `
    <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-light">
      ${separatedItems.join('\n')}
    </div>
  `;
}

// Generate placeholder photos with varying aspect ratios
function generatePhotos(sectionId, count, startDate) {
  const ratios = [
    { w: 3, h: 4 },   // Portrait
    { w: 4, h: 3 },   // Landscape
    { w: 2, h: 3 },   // Tall portrait
    { w: 16, h: 9 },  // Wide
    { w: 1, h: 1 },   // Square
    { w: 5, h: 4 },   // Classic
    { w: 3, h: 2 },   // Standard
  ];

  const cameras = ['Canon EOS R5', 'Nikon Z9', 'Sony A7R V', 'Fujifilm X-T5', 'Leica M11'];
  const lenses = ['50mm f/1.4', '85mm f/1.8', '24-70mm f/2.8', '35mm f/1.4', '70-200mm f/2.8'];
  const descriptions = [
    'A quiet moment captured in the fading light.',
    'Raw emotion frozen in time.',
    'Where shadow meets substance.',
    'Geometry in motion.',
    'The poetry of everyday life.',
    null, // Some photos don't have descriptions
    'Light as the main subject.',
    null,
  ];

  return Array.from({ length: count }, (_, i) => {
    const ratio = ratios[i % ratios.length];
    const height = 600;
    const width = Math.round(height * (ratio.w / ratio.h));
    const seed = `${sectionId}-${i}`;

    return {
      id: `${sectionId}-${i}`,
      url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      title: `Photo ${i + 1}`,
      date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
      metadata: {
        camera: cameras[i % cameras.length],
        lens: lenses[i % lenses.length],
        iso: [100, 200, 400, 800, 1600][i % 5],
        aperture: ['f/1.4', 'f/1.8', 'f/2.8', 'f/4', 'f/5.6'][i % 5],
        shutter: ['1/250', '1/500', '1/1000', '1/2000', '1/60'][i % 5],
      },
      description: descriptions[i % descriptions.length],
    };
  });
}

// Sections data
const sectionsData = [
  {
    id: 'urban-nights',
    title: 'Urban Nights',
    description: 'Exploring the luminous poetry of cities after dark. Neon reflections, empty streets, and the quiet drama of urban solitude.',
    photos: generatePhotos('urban', 15, new Date('2024-01-15')),
  },
  {
    id: 'portrait-studies',
    title: 'Portrait Studies',
    description: 'Intimate explorations of human expression. Each face tells a story, each glance reveals a universe.',
    photos: generatePhotos('portrait', 15, new Date('2023-08-01')),
  },
  {
    id: 'landscapes',
    title: 'Landscapes',
    description: 'The earth in its raw majesty.',
    photos: generatePhotos('landscape', 15, new Date('2023-05-10')),
  },
  {
    id: 'abstract',
    title: 'Abstract',
    description: 'Form, color, and emotion beyond representation.',
    photos: generatePhotos('abstract', 15, new Date('2023-11-20')),
  },
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'The geometry of human ambition.',
    photos: generatePhotos('arch', 15, new Date('2024-03-01')),
  },
  {
    id: 'street',
    title: 'Street',
    description: 'Life unfolding in public spaces.',
    photos: generatePhotos('street', 15, new Date('2023-09-15')),
  },
  {
    id: 'nature',
    title: 'Nature',
    description: 'The wild, the quiet, the untamed.',
    photos: generatePhotos('nature', 15, new Date('2023-07-22')),
  },
  {
    id: 'black-white',
    title: 'Black & White',
    description: 'Stripped to essence, light and shadow.',
    photos: generatePhotos('bw', 15, new Date('2024-02-10')),
  },
  {
    id: 'minimalist',
    title: 'Minimalist',
    description: 'Less is everything.',
    photos: generatePhotos('minimal', 15, new Date('2023-10-05')),
  },
  {
    id: 'travel',
    title: 'Travel',
    description: 'Stories from distant places.',
    photos: generatePhotos('travel', 15, new Date('2023-06-18')),
  },
  {
    id: 'experimental',
    title: 'Experimental',
    description: 'Pushing boundaries of the medium.',
    photos: generatePhotos('exp', 15, new Date('2024-01-30')),
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour',
    description: 'Magic light at day\'s edges.',
    photos: generatePhotos('golden', 15, new Date('2023-12-12')),
  },
  {
    id: 'macro',
    title: 'Macro',
    description: 'The universe in small things.',
    photos: generatePhotos('macro', 15, new Date('2023-04-25')),
  },
  {
    id: 'motion',
    title: 'Motion',
    description: 'Time captured in blur and freeze.',
    photos: generatePhotos('motion', 15, new Date('2024-03-15')),
  },
  {
    id: 'reflections',
    title: 'Reflections',
    description: 'Reality doubled and transformed.',
    photos: generatePhotos('reflect', 15, new Date('2023-08-30')),
  },
];

// Sort sections based on sort order
function getSortedSections() {
  return [...sectionsData].sort((sectionA, sectionB) => {
    const sectionADate = sectionA.photos[0]?.date || new Date(0);
    const sectionBDate = sectionB.photos[0]?.date || new Date(0);

    if (state.sortOrder === 'newest') {
      return sectionBDate - sectionADate;
    }
    return sectionADate - sectionBDate;
  });
}

// Create PhotoSection component (from base44)
function createPhotoSection(section, onPhotoClick) {
  const sectionEl = document.createElement('section');
  sectionEl.id = section.id;
  // Vertical spacing between collections:
  // This padding controls the gap below thumbnails (pb-*) and above the next title (pt-* of next section).
  // Keep mobile the same, reduce desktop to avoid overly large inter-collection gaps.
  sectionEl.className = 'pt-5 pb-5 md:pt-10 md:pb-10 scroll-mt-44';

  // Container for padding
  const container = document.createElement('div');
  container.className = 'px-8 md:px-16 lg:px-24 xl:px-32';

  // Section header with scroll animation
  const header = document.createElement('div');
  header.className = 'mb-5 md:mb-7 section-header';
  header.style.opacity = '0';
  header.style.transform = 'translateY(30px)';
  header.innerHTML = `
    <h2 class="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-black mb-5">${section.title}</h2>
    ${section.description ? `<p class="text-gray-500 font-light text-sm md:text-base w-full leading-relaxed">${section.description}</p>` : ''}
  `;

  // Animate header on scroll
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        headerObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-100px'
  });

  headerObserver.observe(header);
  container.appendChild(header);

  // Photo grid (base44 flex layout with fixed-height images)
  const grid = document.createElement('div');
  grid.className = 'flex flex-wrap gap-4 items-end';

  section.photos.forEach((photo, index) => {
    const photoCard = document.createElement('div');
    photoCard.className = 'cursor-pointer group photo-item';
    photoCard.style.opacity = '0';
    photoCard.style.transform = 'translateY(20px)';
    photoCard.onclick = () => onPhotoClick(index);

    // Container with fixed height
    const imageContainer = document.createElement('div');
    imageContainer.className = 'h-[100px] md:h-[140px] overflow-hidden';
    imageContainer.style.width = 'auto';

    const img = document.createElement('img');
    img.src = photo.thumb; // Use thumbnail (400px) for grid, not web version (2560px)
    img.alt = photo.title || `Photo ${index + 1}`;
    img.className = 'h-full w-auto object-cover transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-90';
    img.loading = 'lazy';

    imageContainer.appendChild(img);
    photoCard.appendChild(imageContainer);
    grid.appendChild(photoCard);

    // Staggered scroll animation using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 50); // 50ms delay per item for stagger effect
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '-50px'
    });

    observer.observe(photoCard);
  });

  container.appendChild(grid);
  sectionEl.appendChild(container);
  return sectionEl;
}

// Helper: Check if device is mobile or tablet
function isMobileOrTablet() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Get appropriate image URL based on device (mobile or desktop)
function getImageUrl(photo) {
  // Use mobile images (1280px, ~300KB) on phones/tablets for faster loading
  // Use web images (2560px, ~1.2MB) on desktop for quality
  return isMobileOrTablet() && photo.mobileUrl ? photo.mobileUrl : photo.url;
}

function buildLightboxSlideHTML(photo) {
  if (!photo) {
    return `<div class="lightbox-slide-empty" aria-hidden="true"></div>`;
  }

  // IMPORTANT:
  // Keep mobile/tablet behavior unchanged. Only apply desktop-only clipping safeguards.
  const imgStyle = isMobileOrTablet()
    ? 'max-width: var(--lb-max-w, calc(100vw - 46mm)) !important; max-height: var(--lb-max-h, calc(100vh - 66mm)) !important; width: auto; height: auto;'
    : 'max-width: min(100%, var(--lb-max-w, calc(100vw - 46mm))) !important; max-height: min(100vh, var(--lb-max-h, calc(100vh - 66mm))) !important; width: auto; height: auto;';

  return `
    <div class="lightbox-outer-frame relative bg-black flex items-center justify-center" style="padding: 0mm;">
      <div class="border border-white bg-black flex items-center justify-center" style="padding: 3mm;">
        <img
          src="${getImageUrl(photo)}"
          alt="${photo.title || 'Photo'}"
          class="block lightbox-image"
          style="${imgStyle}"
        />
      </div>
    </div>
  `;
}

// Lightbox image preloading (neighbors)
const lightboxPreloadCache = new Map(); // url -> HTMLImageElement

function applyLightboxSizing(lightbox) {
  if (!lightbox) return;

  const content = lightbox.querySelector('.lightbox-content');
  const isMobile = isMobileOrTablet();

  // IMPORTANT: padding affects carousel clientHeight/Width on desktop.
  // Apply it BEFORE measuring carousel so we don't compute an oversized max-height
  // (which causes the white frame to be clipped until the first resize event).
  if (content) {
    content.style.padding = isMobile ? '3mm' : '15mm';
  }

  // Spec:
  // - 3mm from screen edge to WHITE FRAME (outer border)
  // - 3mm inside the frame from border to image (the mat), implemented in HTML as padding: 3mm
  const EDGE_MM = 3;
  const INNER_MM = 3;
  const BORDER_PX = 1; // approx for Tailwind `border` (1px)
  const MM_TO_PX = 96 / 25.4;

  const vv = window.visualViewport;
  const viewportW = vv ? vv.width : window.innerWidth;
  const viewportH = vv ? vv.height : window.innerHeight;

  // On desktop, compute against the *actual* carousel viewport size so the image never overflows
  // vertically when the window gets very wide (width-driven scaling).
  // On phones/tablets keep the proven viewport-based logic unchanged.
  const desktopCarousel = !isMobile ? lightbox.querySelector('#lightbox-carousel') : null;
  const framePx = 2 * (INNER_MM * MM_TO_PX + BORDER_PX); // inner mat + border, both sides

  let maxW;
  let maxH;

  if (desktopCarousel && desktopCarousel.clientWidth > 0 && desktopCarousel.clientHeight > 0) {
    maxW = Math.max(0, Math.floor(desktopCarousel.clientWidth - framePx));
    maxH = Math.max(0, Math.floor(desktopCarousel.clientHeight - framePx));
  } else {
    const subtractPx = 2 * (EDGE_MM + INNER_MM) * MM_TO_PX + 2 * BORDER_PX;
    maxW = Math.max(0, Math.floor(viewportW - subtractPx));
    maxH = Math.max(0, Math.floor(viewportH - subtractPx));
  }

  // Put values on the lightbox so all slide images inherit them
  lightbox.style.setProperty('--lb-max-w', `${maxW}px`);
  lightbox.style.setProperty('--lb-max-h', `${maxH}px`);

  // If carousel is present, padding changes can change carousel width.
  // Re-center the film strip so we don't "start" on image+1.
  const carouselState = lightbox._carouselState;
  if (carouselState && !carouselState.dragging && !carouselState.animating) {
    resetLightboxCarouselPosition();
  }
}

function preloadImage(url) {
  if (!url) return;
  if (lightboxPreloadCache.has(url)) return;

  const img = new Image();
  img.decoding = 'async';
  img.loading = 'eager';
  img.src = url;
  lightboxPreloadCache.set(url, img);

  // Prevent unbounded growth if user scrolls a lot
  if (lightboxPreloadCache.size > 30) {
    const firstKey = lightboxPreloadCache.keys().next().value;
    if (firstKey) lightboxPreloadCache.delete(firstKey);
  }
}

function preloadLightboxNeighbors(photos, currentIndex) {
  if (!Array.isArray(photos) || photos.length === 0) return;

  const prev = photos[currentIndex - 1];
  const next = photos[currentIndex + 1];

  if (prev) preloadImage(getImageUrl(prev));
  if (next) preloadImage(getImageUrl(next));
}

function resetLightboxCarouselPosition() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const carousel = lightbox.querySelector('#lightbox-carousel');
  const track = lightbox.querySelector('#lightbox-track');
  if (!carousel || !track) return;

  const gap = getComputedStyle(track).gap || '0px';
  const gapPx = Number.isFinite(parseFloat(gap)) ? parseFloat(gap) : 0;
  const slideWidth = carousel.clientWidth;
  track.querySelectorAll('.lightbox-slide').forEach((slide) => {
    slide.style.width = `${slideWidth}px`;
  });
  const step = slideWidth + gapPx;

  track.style.transition = 'none';
  track.style.transform = `translate3d(${-step}px, 0, 0)`;
  void track.offsetHeight;
  track.style.transition = '';

  // Keep any live carousel state in sync
  if (lightbox._carouselState) {
    lightbox._carouselState.step = step;
    lightbox._carouselState.baseX = -step;
  }

  // Store for optional debugging/usage
  lightbox._carouselStep = step;
}

// Create Lightbox component (Enhanced from base44)
function createLightbox(photos, currentIndex, onClose, onNavigate) {
  const lightbox = document.createElement('div');
  lightbox.className = 'fixed inset-0 z-50 bg-black flex items-center justify-center lightbox-fade-in';
  lightbox.id = 'lightbox';
  

  const photo = photos[currentIndex];

  if (!photo) return null;

  // Create structure
  lightbox.innerHTML = `
    <style>
      .lightbox-fade-in {
        animation: lightboxFadeIn 0.3s ease-in-out;
      }
      .lightbox-scale-in {
        animation: lightboxScaleIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      }
      .lightbox-arrow {
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
      }
      .lightbox-arrow.visible {
        opacity: 1;
      }
      /* Icon buttons (close/fullscreen) should work on any image colors */
      #lightbox .lb-icon-btn {
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        color: rgba(255, 255, 255, 0.85);
        transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease;
      }
      #lightbox .lb-icon-btn:hover {
        background: rgba(0, 0, 0, 0.55);
        border-color: rgba(255, 255, 255, 0.4);
        color: rgba(255, 255, 255, 1);
      }
      #lightbox .lb-icon-btn:active {
        transform: scale(0.98);
      }
      #lightbox .lb-icon-btn svg {
        width: 20px;
        height: 20px;
        display: block;
      }
      .lightbox-content {
        box-sizing: border-box; /* prevents w-full/h-full + padding from overflowing & getting clipped */
      }
      @keyframes lightboxFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes lightboxScaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      /* Prevent pull-to-refresh and overscroll in lightbox */
      #lightbox {
        overscroll-behavior: contain;
        touch-action: pan-x pan-y;
      }
      /* Film-strip carousel (drag follows finger, with aesthetic gaps) */
      #lightbox .lightbox-carousel {
        width: 100%;
        overflow: hidden;
        touch-action: pan-y; /* allow vertical gestures, horizontal handled manually */
        flex: 1 1 auto;
        /* IMPORTANT: don't horizontally center the track (would shift by +1 with translate math).
           But DO vertically center the content (portrait). */
        display: flex;
        align-items: center;
        justify-content: flex-start;
        min-height: 0; /* allow shrinking in flex column */
        /* Clearance is handled by layout.js on phones via .lightbox-scale-in { padding: 3mm } */
        box-sizing: border-box;
        height: 100%;
      }
      #lightbox .lightbox-track {
        display: flex;
        align-items: center;
        gap: clamp(14px, 3vw, 28px);
        flex: none;         /* don't let track shrink inside carousel */
        width: max-content; /* track width matches slides; fixes initial centering shift */
        will-change: transform;
        transform: translate3d(0, 0, 0);
        height: 100%;
      }
      @media (orientation: landscape) {
        /* Reduce gap by ~1/3 in landscape */
        body.phone-landscape #lightbox .lightbox-track,
        body.tablet-landscape #lightbox .lightbox-track {
          gap: clamp(10px, 2vw, 18px);
        }
      }
      #lightbox .lightbox-slide {
        flex: 0 0 auto; /* width is set in JS to match carousel viewport */
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
      #lightbox .lightbox-slide-empty {
        width: 100%;
        height: 1px;
      }
      /* Meta/caption: fade out as swipe starts, fade in after commit */
      #lightbox-meta {
        transition: opacity 160ms ease;
        will-change: opacity;
        /* Prevent layout jitter when swapping between images that do/don't have meta:
           reserve a consistent caption block height computed at runtime on desktop. */
        min-height: var(--lb-meta-reserved-h, 0px);
      }
      #lightbox-meta.lb-meta-hidden {
        opacity: 0;
        pointer-events: none;
      }
      /* Mobile-specific sizing handled by device detection in layout.js */
    </style>

    <!-- Close button -->
    <button
      id="lightbox-close"
      class="lb-icon-btn absolute top-6 right-6 z-50"
      aria-label="Close lightbox"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Desktop-only fullscreen toggle -->
    ${!isMobileOrTablet() ? `
      <button
        id="lightbox-fullscreen"
        class="lb-icon-btn absolute top-6 right-[4.25rem] z-50"
        aria-label="Enter fullscreen"
        title="Fullscreen"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"></path>
        </svg>
      </button>
    ` : ''}

    <!-- Photo counter -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest font-light">
      ${currentIndex + 1} / ${photos.length}
    </div>

    <!-- Main content container -->
    <div class="lightbox-content relative flex flex-col items-center justify-center w-full h-full lightbox-scale-in">
      <!-- Film-strip carousel -->
      <div class="lightbox-carousel" id="lightbox-carousel">
        <div class="lightbox-track" id="lightbox-track">
          <div class="lightbox-slide" data-slot="prev">
            ${buildLightboxSlideHTML(photos[currentIndex - 1])}
          </div>
          <div class="lightbox-slide" data-slot="current">
            ${buildLightboxSlideHTML(photo)}
          </div>
          <div class="lightbox-slide" data-slot="next">
            ${buildLightboxSlideHTML(photos[currentIndex + 1])}
          </div>
        </div>
      </div>

      <!-- Metadata and description -->
      <div id="lightbox-meta" class="text-white/60 text-xs space-y-2 w-full text-center mt-6">
        ${buildMetadataHTML(photo)}
        ${photo.comment ? `<p class="text-white/50 italic font-light">${photo.comment}</p>` : ''}
      </div>
    </div>

    <!-- Left arrow (shown on mouse hover near edge; hidden entirely on first photo) -->
    <button
      id="lightbox-prev"
      class="lightbox-arrow absolute left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300"
      aria-label="Previous photo"
      style="display: ${currentIndex > 0 ? 'block' : 'none'};"
    >
      <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>

    <!-- Right arrow (shown on mouse hover near edge; hidden entirely on last photo) -->
    <button
      id="lightbox-next"
      class="lightbox-arrow absolute right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300"
      aria-label="Next photo"
      style="display: ${currentIndex < photos.length - 1 ? 'block' : 'none'};"
    >
      <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  `;

  // Mouse move handler - show arrows only when mouse is near edges
  const handleMouseMove = (e) => {
    const { clientX } = e;
    const windowWidth = window.innerWidth;
    const edgeZone = windowWidth * 0.15; // 15% of screen width

    // Get current index from state (not closure)
    const currentIdx = state.lightbox.photoIndex;

    const leftArrow = lightbox.querySelector('#lightbox-prev');
    const rightArrow = lightbox.querySelector('#lightbox-next');

    if (leftArrow) {
      if (clientX < edgeZone && currentIdx > 0) {
        leftArrow.classList.add('visible');
      } else {
        leftArrow.classList.remove('visible');
      }
    }

    if (rightArrow) {
      if (clientX > windowWidth - edgeZone && currentIdx < photos.length - 1) {
        rightArrow.classList.add('visible');
      } else {
        rightArrow.classList.remove('visible');
      }
    }
  };

  lightbox.addEventListener('mousemove', handleMouseMove);

  // Close button
  lightbox.querySelector('#lightbox-close').onclick = (e) => {
    e.stopPropagation();
    onClose();
  };

  // Desktop-only fullscreen toggle
  if (!isMobileOrTablet()) {
    const fsBtn = lightbox.querySelector('#lightbox-fullscreen');
    const setFsBtnState = () => {
      if (!fsBtn) return;
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      fsBtn.setAttribute('aria-label', isFs ? 'Exit fullscreen' : 'Enter fullscreen');
      fsBtn.title = isFs ? 'Exit fullscreen' : 'Fullscreen';
      fsBtn.innerHTML = isFs
        ? `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 9H5V5M15 9h4V5M9 15H5v4M15 15h4v4"></path>
          </svg>
        `
        : `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"></path>
          </svg>
        `;
    };

    if (fsBtn) {
      fsBtn.onclick = async (e) => {
        e.stopPropagation();
        try {
          const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
          if (!isFs) {
            if (lightbox.requestFullscreen) await lightbox.requestFullscreen();
            else if (lightbox.webkitRequestFullscreen) await lightbox.webkitRequestFullscreen();
            else if (lightbox.mozRequestFullScreen) await lightbox.mozRequestFullScreen();
            else if (lightbox.msRequestFullscreen) await lightbox.msRequestFullscreen();
          } else {
            if (document.exitFullscreen) await document.exitFullscreen();
            else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
            else if (document.mozCancelFullScreen) await document.mozCancelFullScreen();
            else if (document.msExitFullscreen) await document.msExitFullscreen();
          }
        } catch (_) {
          // Ignore: browser can deny fullscreen (policy/user settings)
        } finally {
          setFsBtnState();
        }
      };
    }

    const handleFullscreenChange = () => setFsBtnState();
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    lightbox._fullscreenChangeHandler = handleFullscreenChange;

    // Initialize button state
    setFsBtnState();
  }

  // Film-strip carousel state + helpers
  const carousel = lightbox.querySelector('#lightbox-carousel');
  const track = lightbox.querySelector('#lightbox-track');

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Desktop feels better with a slower, more cinematic easing; keep mobile snappy.
  const SLIDE_MS = prefersReducedMotion ? 0 : (isMobileOrTablet() ? 320 : 520);
  const SLIDE_EASE = isMobileOrTablet()
    ? 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    : 'cubic-bezier(0.4, 0.0, 0.2, 1)'; // ease-in-out (gentle start + gentle stop)

  const carouselState = {
    step: 0, // slide width + gap
    baseX: 0, // centered position (-step)
    dragging: false,
    axis: null, // 'x' | 'y' | null
    startX: 0,
    startY: 0,
    lastDX: 0,
    animating: false
  };
  // Expose so updateLightboxContent can keep step/baseX in sync after navigation
  lightbox._carouselState = carouselState;

  const getGapPx = () => {
    if (!track) return 0;
    const gap = getComputedStyle(track).gap || '0px';
    const n = parseFloat(gap);
    return Number.isFinite(n) ? n : 0;
  };

  const recalcCarouselStep = () => {
    if (!carousel || !track) return;
    const gapPx = getGapPx();
    const slideWidth = carousel.clientWidth;

    // Force each slide to match the carousel viewport width (prevents "only edge visible")
    track.querySelectorAll('.lightbox-slide').forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    });

    carouselState.step = slideWidth + gapPx;
    carouselState.baseX = -carouselState.step;
    track.style.transition = 'none';
    track.style.transform = `translate3d(${carouselState.baseX}px, 0, 0)`;
    // Force reflow then restore transitions for later
    void track.offsetHeight;
    track.style.transition = '';
  };

  const snapTo = (targetX, onDone) => {
    if (!track) return;
    carouselState.animating = true;
    track.style.transition = `transform ${SLIDE_MS}ms ${SLIDE_EASE}`;
    track.style.transform = `translate3d(${targetX}px, 0, 0)`;
    const done = () => {
      track.removeEventListener('transitionend', done);
      carouselState.animating = false;
      if (typeof onDone === 'function') onDone();
    };
    track.addEventListener('transitionend', done);
  };

  const setTrackCenteredInstant = () => {
    if (!track) return;
    track.style.transition = 'none';
    track.style.transform = `translate3d(${carouselState.baseX}px, 0, 0)`;
    // Force reflow so the next animated snap doesn't get merged.
    void track.offsetHeight;
    track.style.transition = '';
  };

  const relabelSlotsByOrder = () => {
    if (!track) return;
    const slides = Array.from(track.querySelectorAll('.lightbox-slide'));
    if (slides.length < 3) return;
    slides[0].setAttribute('data-slot', 'prev');
    slides[1].setAttribute('data-slot', 'current');
    slides[2].setAttribute('data-slot', 'next');
  };

  const updateMetaForIndex = (idx, { reveal } = { reveal: true }) => {
    const metaEl = lightbox.querySelector('#lightbox-meta');
    const p = photos[idx];
    if (!metaEl || !p) return;
    const html = `${buildMetadataHTML(p)}${p.comment ? `<p class="text-white/50 italic font-light">${p.comment}</p>` : ''}`;
    metaEl.innerHTML = html;
    if (html.trim()) {
      if (reveal) requestAnimationFrame(() => metaEl.classList.remove('lb-meta-hidden'));
      else metaEl.classList.add('lb-meta-hidden');
    } else {
      metaEl.classList.add('lb-meta-hidden');
    }
  };

  // Desktop-only: compute a stable reserved meta height for this section at current viewport width.
  // This prevents the carousel height (and thus image sizing/position) from changing when meta becomes empty.
  const computeAndSetReservedMetaHeight = () => {
    if (isMobileOrTablet()) return;
    const metaEl = lightbox.querySelector('#lightbox-meta');
    if (!metaEl) return;
    const width = metaEl.clientWidth;
    if (!width) return;

    let meas = lightbox._lbMetaMeasureEl;
    if (!meas) {
      meas = document.createElement('div');
      meas.style.position = 'fixed';
      meas.style.left = '-99999px';
      meas.style.top = '0';
      meas.style.visibility = 'hidden';
      meas.style.pointerEvents = 'none';
      meas.style.zIndex = '-1';
      meas.style.margin = '0';
      meas.style.padding = '0';
      document.body.appendChild(meas);
      lightbox._lbMetaMeasureEl = meas;
    }

    // Copy typography/layout classes; remove margin so we measure content height only.
    meas.className = metaEl.className.replace(/\bmt-\d+\b/g, '');
    meas.style.width = `${width}px`;

    let maxH = 0;
    for (const p of photos) {
      const html = `${buildMetadataHTML(p)}${p.comment ? `<p class="text-white/50 italic font-light">${p.comment}</p>` : ''}`;
      meas.innerHTML = html;
      const h = meas.getBoundingClientRect().height;
      if (h > maxH) maxH = h;
    }

    lightbox.style.setProperty('--lb-meta-reserved-h', `${Math.ceil(maxH)}px`);
  };

  // Commit navigation without recreating all DOM (prevents flicker at the end of the swipe).
  // We rotate the 3 slide elements and only rebuild the newly-exposed neighbor.
  const commitNavigate = (direction) => {
    if (!track) return;

    const currentIdx = state.lightbox.photoIndex;
    const newIndex = currentIdx + direction;
    if (newIndex < 0 || newIndex > photos.length - 1) {
      setTrackCenteredInstant();
      return;
    }

    // Rotate slide elements so the image that was just swiped into view becomes the centered "current".
    if (direction === 1) {
      // Move prev -> end. Middle becomes the old "next" (the new current).
      const first = track.firstElementChild;
      if (first) track.appendChild(first);
    } else if (direction === -1) {
      // Move next -> front. Middle becomes the old "prev" (the new current).
      const last = track.lastElementChild;
      if (last) track.insertBefore(last, track.firstElementChild);
    }

    relabelSlotsByOrder();

    // Update state + UI
    state.lightbox.photoIndex = newIndex;

    const counter = lightbox.querySelector('.absolute.bottom-6');
    if (counter) counter.textContent = `${newIndex + 1} / ${photos.length}`;

    const leftArrow = lightbox.querySelector('#lightbox-prev');
    const rightArrow = lightbox.querySelector('#lightbox-next');
    if (leftArrow) leftArrow.style.display = newIndex > 0 ? 'block' : 'none';
    if (rightArrow) rightArrow.style.display = newIndex < photos.length - 1 ? 'block' : 'none';

    // Update meta for the new image (fade in if present; stay hidden if empty)
    updateMetaForIndex(newIndex, { reveal: true });

    // Rebuild only the newly exposed neighbor slide
    const prevSlot = track.querySelector('.lightbox-slide[data-slot="prev"]');
    const nextSlot = track.querySelector('.lightbox-slide[data-slot="next"]');
    if (direction === 1) {
      // New next is newIndex + 1
      if (nextSlot) nextSlot.innerHTML = buildLightboxSlideHTML(photos[newIndex + 1]);
    } else if (direction === -1) {
      // New prev is newIndex - 1
      if (prevSlot) prevSlot.innerHTML = buildLightboxSlideHTML(photos[newIndex - 1]);
    }

    // Center track instantly (so there is no visible "reset" flash)
    setTrackCenteredInstant();
    preloadLightboxNeighbors(photos, newIndex);
  };

  const animateNavigate = (direction) => {
    if (!track || carouselState.animating) return;
    // Fade out meta immediately as navigation begins (so it doesn't "belong" to incoming image)
    const metaEl = lightbox.querySelector('#lightbox-meta');
    if (metaEl) metaEl.classList.add('lb-meta-hidden');
    const currentIdx = state.lightbox.photoIndex;
    const hasPrev = currentIdx > 0;
    const hasNext = currentIdx < photos.length - 1;

    if (direction === -1 && !hasPrev) {
      return snapTo(carouselState.baseX, () => updateMetaForIndex(currentIdx, { reveal: true }));
    }
    if (direction === 1 && !hasNext) {
      return snapTo(carouselState.baseX, () => updateMetaForIndex(currentIdx, { reveal: true }));
    }

    const targetX = direction === 1 ? -2 * carouselState.step : 0;
    snapTo(targetX, () => {
      commitNavigate(direction);
    });
  };

  // Navigation buttons should use the film-strip animation
  const prevBtn = lightbox.querySelector('#lightbox-prev');
  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      animateNavigate(-1);
    };
  }

  const nextBtn = lightbox.querySelector('#lightbox-next');
  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      animateNavigate(1);
    };
  }

  // Close on background click
  lightbox.onclick = (e) => {
    if (e.target === lightbox) onClose();
  };

  // Keyboard navigation
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') animateNavigate(-1);
    if (e.key === 'ArrowRight') animateNavigate(1);
  };
  document.addEventListener('keydown', handleKeyPress);
  lightbox.dataset.keyHandler = 'attached';

  // Touch drag on carousel (follow finger)
  if (carousel && track) {
    // IMPORTANT: don't call recalcCarouselStep() yet — createLightbox runs before the lightbox
    // is attached to the DOM, so carousel.clientWidth can be 0 and the strip starts offset.
    // We'll initialize sizing/position after append (renderLightbox -> updateLightboxContent).
    // (No hiding; the strip is positioned immediately after append.)

    const onTouchStart = (e) => {
      if (carouselState.animating) return;
      if (e.touches.length !== 1) return;
      if (e.target.closest('button')) return;
      carouselState.dragging = true;
      carouselState.axis = null;
      carouselState.startX = e.touches[0].clientX;
      carouselState.startY = e.touches[0].clientY;
      carouselState.lastDX = 0;
      track.style.transition = 'none';
    };

    const onTouchMove = (e) => {
      if (!carouselState.dragging) return;
      if (e.touches.length !== 1) return;

      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const dx = x - carouselState.startX;
      const dy = y - carouselState.startY;

      if (!carouselState.axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        carouselState.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        // As soon as we recognize a horizontal swipe, fade out meta so it doesn't
        // "belong" to the incoming image during the drag.
        if (carouselState.axis === 'x') {
          const metaEl = lightbox.querySelector('#lightbox-meta');
          if (metaEl) metaEl.classList.add('lb-meta-hidden');
        }
      }

      if (carouselState.axis !== 'x') return;

      // Horizontal drag: prevent browser navigation/scroll and other handlers
      e.preventDefault();
      e.stopPropagation();

      const currentIdx = state.lightbox.photoIndex;
      const hasPrev = currentIdx > 0;
      const hasNext = currentIdx < photos.length - 1;

      // Edge resistance
      let effDX = dx;
      if ((dx > 0 && !hasPrev) || (dx < 0 && !hasNext)) {
        effDX = dx * 0.35;
      }

      carouselState.lastDX = effDX;
      track.style.transform = `translate3d(${carouselState.baseX + effDX}px, 0, 0)`;
    };

    const onTouchEnd = () => {
      if (!carouselState.dragging) return;
      carouselState.dragging = false;

      if (carouselState.axis !== 'x') return;

      const dx = carouselState.lastDX;
      const threshold = Math.min(120, carouselState.step * 0.18);

      if (dx < -threshold) {
        animateNavigate(1);
      } else if (dx > threshold) {
        animateNavigate(-1);
      } else {
        // Cancel: snap back, then restore meta for the current image
        snapTo(carouselState.baseX, () => {
          updateMetaForIndex(state.lightbox.photoIndex, { reveal: true });
        });
      }
    };

    carousel.addEventListener('touchstart', onTouchStart, { passive: false });
    carousel.addEventListener('touchmove', onTouchMove, { passive: false });
    carousel.addEventListener('touchend', onTouchEnd, { passive: true });

    // Keep step in sync with viewport changes
    const handleResize = () => recalcCarouselStep();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    lightbox._carouselResizeHandler = handleResize;
  }

  // Apply precise sizing for the "3mm to white frame" spec (uses visualViewport when available)
  const handleSizing = () => {
    applyLightboxSizing(lightbox);
    computeAndSetReservedMetaHeight();
  };
  window.addEventListener('resize', handleSizing, { passive: true });
  window.addEventListener('orientationchange', handleSizing, { passive: true });
  lightbox._lbSizingHandler = handleSizing;
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleSizing, { passive: true });
    window.visualViewport.addEventListener('scroll', handleSizing, { passive: true });
    lightbox._lbVisualViewportHandler = handleSizing;
  }
  // Initial sizing (next frame to ensure layout is ready)
  requestAnimationFrame(handleSizing);

  // Mobile/Tablet: Swipe-down to close, swipe-up to hide address bar, and pinch-to-close
  let swipeDownStartY = 0;
  let initialPinchDistance = 0;
  
  const handleCloseGestures = (e) => {
    if (!isMobileOrTablet()) return;
    
    // Swipe detection (single touch)
    if (e.touches.length === 1) {
      swipeDownStartY = e.touches[0].clientY;
      initialPinchDistance = 0;
    }
    // Pinch detection (two touches)
    else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialPinchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      swipeDownStartY = 0;
    }
  };
  
  const handleCloseGesturesMove = (e) => {
    if (!isMobileOrTablet()) return;
    
    // Check for pinch-to-close (two fingers pinching in)
    if (e.touches.length === 2 && initialPinchDistance > 0) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // If pinched in by more than 30%, close
      const pinchRatio = currentDistance / initialPinchDistance;
      if (pinchRatio < 0.7) {
        onClose();
      }
    }
  };
  
  const handleCloseGesturesEnd = (e) => {
    if (!isMobileOrTablet()) return;
    
    // Check for vertical swipe
    if (swipeDownStartY > 0 && e.changedTouches.length === 1) {
      const swipeEndY = e.changedTouches[0].clientY;
      const deltaY = swipeEndY - swipeDownStartY;
      
      // Swipe DOWN (>100px) - close lightbox
      if (deltaY > 100) {
        onClose();
      }
      // Swipe UP (>50px) - hide address bar by scrolling to top
      else if (deltaY < -50) {
        // Scroll page to top (triggers address bar to hide)
        // This works because body is scrollable on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    
    // Reset
    swipeDownStartY = 0;
    initialPinchDistance = 0;
  };
  
  // Add close gesture listeners (works on both image and background)
  // Swipe DOWN: Close lightbox
  // Swipe UP: Hide address bar by scrolling to top
  // Pinch IN: Close lightbox
  lightbox.addEventListener('touchstart', handleCloseGestures, { passive: true });
  lightbox.addEventListener('touchmove', handleCloseGesturesMove, { passive: true });
  lightbox.addEventListener('touchend', handleCloseGesturesEnd, { passive: true });

  // Desktop trackpad gestures (two-finger swipe)
  let wheelDeltaAccumulator = 0;
  let hasNavigatedInGesture = false; // Has current gesture navigated?
  let gestureEndTimeout = null;

  // Listen for wheel events with horizontal scrolling (trackpad swipes)
  const handleWheel = (e) => {
    // Check if it's a horizontal scroll (trackpad two-finger swipe)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 5) {
      // ALWAYS prevent browser navigation
      e.preventDefault();
      e.stopPropagation();
      
      // If already navigated in this gesture, ignore everything
      if (hasNavigatedInGesture) {
        // Still need to reset gesture end timeout though
        if (gestureEndTimeout) {
          clearTimeout(gestureEndTimeout);
        }
        gestureEndTimeout = setTimeout(() => {
          hasNavigatedInGesture = false;
          wheelDeltaAccumulator = 0;
        }, 200); // Gesture ends 200ms after last wheel event
        return; // Don't accumulate or do anything else
      }
      
      // Clear previous gesture end timeout
      if (gestureEndTimeout) {
        clearTimeout(gestureEndTimeout);
      }
      
      // Set timeout to detect gesture end
      gestureEndTimeout = setTimeout(() => {
        hasNavigatedInGesture = false;
        wheelDeltaAccumulator = 0;
      }, 200); // 200ms of no wheel events = gesture ended
      
      // Get current index
      const currentIdx = state.lightbox.photoIndex;
      
      // Accumulate
      wheelDeltaAccumulator += e.deltaX;
      
      // Check threshold
      if (Math.abs(wheelDeltaAccumulator) > 50) {
        // Mark that we've navigated in this gesture
        hasNavigatedInGesture = true;
        
        // Save direction and reset
        const direction = wheelDeltaAccumulator > 0 ? 1 : -1;
        wheelDeltaAccumulator = 0;
        
        // Navigate
        if (direction > 0 && currentIdx < photos.length - 1) {
        animateNavigate(1);
        } else if (direction < 0 && currentIdx > 0) {
        animateNavigate(-1);
        }
        
        // Don't set a fixed timeout - let the wheel events timeout handle it
      }
    }
  };

  // Add wheel listener for trackpad gestures
  lightbox.addEventListener('wheel', handleWheel, { passive: false });

  // Handle body scroll based on device
  if (isMobileOrTablet()) {
    // On mobile: save scroll position and scroll to top
    // This prevents main page from showing behind lightbox
    lightbox.dataset.savedScrollY = window.scrollY.toString();
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Keep body scrollable but prevent scrolling down (only allow scroll to top for address bar)
    const preventScrollDown = () => {
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    
    // Attach scroll listener to prevent downward scrolling
    window.addEventListener('scroll', preventScrollDown, { passive: true });
    lightbox._scrollDownPreventer = preventScrollDown;
    
    document.body.style.overflow = 'auto';
  } else {
    // On desktop: prevent all scrolling
    document.body.style.overflow = 'hidden';
  }
  document.body.style.overscrollBehavior = 'none';
  document.documentElement.style.overscrollBehavior = 'none';
  
  // Mobile: Support back button to close lightbox
  if (isMobileOrTablet()) {
    // Push a history state so back button can close lightbox
    history.pushState({ lightboxOpen: true }, '');
    
    // Listen for back button
    const handlePopState = (e) => {
      if (state.lightbox.isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Store handler so we can remove it later
    lightbox.dataset.popStateHandler = 'attached';
    lightbox._popStateHandler = handlePopState;
  }

  return lightbox;
}

// Lightbox functions
function openLightbox(sectionId, photoIndexOrId) {
  state.lightbox = {
    isOpen: true,
    sectionId,
    photoIndex: Number(photoIndexOrId)
  };
  renderLightbox();
}

function closeLightbox() {
  // Remove keyboard listener and lightbox
  const existingLightbox = document.getElementById('lightbox');
  let savedScrollY = 0;
  
  if (existingLightbox) {
    // Get saved scroll position before removing
    savedScrollY = parseInt(existingLightbox.dataset.savedScrollY || '0', 10);
    
    // Clean up popstate listener if it exists
    if (existingLightbox._popStateHandler) {
      window.removeEventListener('popstate', existingLightbox._popStateHandler);
    }
    
    // Clean up scroll prevention listener on mobile
    if (existingLightbox._scrollDownPreventer) {
      window.removeEventListener('scroll', existingLightbox._scrollDownPreventer);
    }

    // Clean up carousel resize handlers
    if (existingLightbox._carouselResizeHandler) {
      window.removeEventListener('resize', existingLightbox._carouselResizeHandler);
      window.removeEventListener('orientationchange', existingLightbox._carouselResizeHandler);
    }

    // Clean up lightbox sizing handlers
    if (existingLightbox._lbSizingHandler) {
      window.removeEventListener('resize', existingLightbox._lbSizingHandler);
      window.removeEventListener('orientationchange', existingLightbox._lbSizingHandler);
    }
    if (existingLightbox._lbVisualViewportHandler && window.visualViewport) {
      window.visualViewport.removeEventListener('resize', existingLightbox._lbVisualViewportHandler);
      window.visualViewport.removeEventListener('scroll', existingLightbox._lbVisualViewportHandler);
    }

    // Clean up fullscreen change listener on mobile
    if (existingLightbox._fullscreenChangeHandler) {
      document.removeEventListener('fullscreenchange', existingLightbox._fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', existingLightbox._fullscreenChangeHandler);
      document.removeEventListener('mozfullscreenchange', existingLightbox._fullscreenChangeHandler);
      document.removeEventListener('MSFullscreenChange', existingLightbox._fullscreenChangeHandler);
    }

    // Clean up meta measurement element (desktop only)
    if (existingLightbox._lbMetaMeasureEl) {
      existingLightbox._lbMetaMeasureEl.remove();
      existingLightbox._lbMetaMeasureEl = null;
    }
    
    existingLightbox.remove();
  }
  
  // Restore body scroll and overscroll behavior
  if (!isMobileOrTablet()) {
    document.body.style.overflow = 'unset';
  }
  document.body.style.overscrollBehavior = 'auto';
  document.documentElement.style.overscrollBehavior = 'auto';
  
  // Exit fullscreen ONLY on actual mobile devices
  const isActualMobile = isMobileOrTablet() && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isActualMobile && (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen();
    }
  }
  
  // Restore scroll position on mobile
  const isActualMobileFinal = isMobileOrTablet() && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isActualMobileFinal && savedScrollY > 0) {
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
  }
  
  state.lightbox = {
    isOpen: false,
    sectionId: null,
    photoIndex: 0
  };
  
  // If we pushed a history state, go back to remove it (but only if lightbox was actually open)
  // This prevents the user from going "forward" to a closed lightbox
  if (history.state && history.state.lightboxOpen) {
    history.back();
  }
}

function navigateLightbox(newIndex) {
  const currentSection = state.sections.find(s => s.id === state.lightbox.sectionId);
  if (!currentSection || !currentSection.photos || currentSection.photos.length === 0) return;

  const photos = currentSection.photos;
  const n = Number(newIndex);
  const nextIndex = Number.isFinite(n) ? Math.trunc(n) : 0;
  const clampedIndex = Math.max(0, Math.min(nextIndex, photos.length - 1));
  state.lightbox.photoIndex = clampedIndex;

  const existingLightbox = document.getElementById('lightbox');
  if (existingLightbox) updateLightboxContent(clampedIndex);
  else renderLightbox();
}

// Update only the photo content without recreating the entire lightbox
function updateLightboxContent(currentIndex) {
  const currentSection = state.sections.find(s => s.id === state.lightbox.sectionId);
  if (!currentSection || !currentSection.photos) return;
  
  const photos = currentSection.photos;
  const photo = photos[currentIndex];
  if (!photo) return;

  // Update photo counter
  const counter = document.querySelector('#lightbox .absolute.bottom-6');
  if (counter) {
    counter.textContent = `${currentIndex + 1} / ${photos.length}`;
  }

  // Update arrow visibility
  const leftArrow = document.getElementById('lightbox-prev');
  const rightArrow = document.getElementById('lightbox-next');
  if (leftArrow) leftArrow.style.display = currentIndex > 0 ? 'block' : 'none';
  if (rightArrow) rightArrow.style.display = currentIndex < photos.length - 1 ? 'block' : 'none';

  // Update carousel slots (prev/current/next)
  const prevSlot = document.querySelector('#lightbox .lightbox-slide[data-slot="prev"]');
  const curSlot = document.querySelector('#lightbox .lightbox-slide[data-slot="current"]');
  const nextSlot = document.querySelector('#lightbox .lightbox-slide[data-slot="next"]');
  if (prevSlot) prevSlot.innerHTML = buildLightboxSlideHTML(photos[currentIndex - 1]);
  if (curSlot) curSlot.innerHTML = buildLightboxSlideHTML(photo);
  if (nextSlot) nextSlot.innerHTML = buildLightboxSlideHTML(photos[currentIndex + 1]);

  // Reset track and preload neighbors
  resetLightboxCarouselPosition();
  preloadLightboxNeighbors(photos, currentIndex);
}

function renderLightbox() {
  // Remove existing lightbox
  const existingLightbox = document.getElementById('lightbox');
  if (existingLightbox) {
    existingLightbox.remove();
  }

  if (!state.lightbox.isOpen) return;

  const currentSection = state.sections.find(s => s.id === state.lightbox.sectionId);
  if (!currentSection || !currentSection.photos || currentSection.photos.length === 0) return;

  const lightbox = createLightbox(
    currentSection.photos,
    state.lightbox.photoIndex,
    closeLightbox,
    navigateLightbox
  );

  document.body.appendChild(lightbox);

  // IMPORTANT: apply sizing first (it can change padding and carousel width)
  // then populate slots + position the film strip.
  applyLightboxSizing(lightbox);
  updateLightboxContent(state.lightbox.photoIndex);

  // Desktop safety net: run one more sizing pass after first paint.
  // This handles cases where fonts/images slightly change layout after append.
  if (!isMobileOrTablet()) {
    requestAnimationFrame(() => {
      const lb = document.getElementById('lightbox');
      if (!lb) return;
      applyLightboxSizing(lb);
      resetLightboxCarouselPosition();
    });
  }
  
  // Request fullscreen ONLY on actual mobile devices (not desktop, not simulators)
  const isActualMobile = isMobileOrTablet() && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isActualMobile) {
    // Listen for fullscreen changes (user manually exits fullscreen)
    const handleFullscreenChange = () => {
      const isInFullscreen = document.fullscreenElement || document.webkitFullscreenElement || 
                            document.mozFullScreenElement || document.msFullscreenElement;
      
      // If user exited fullscreen and lightbox is still open, close the lightbox
      if (!isInFullscreen && state.lightbox.isOpen) {
        closeLightbox();
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // Store reference for cleanup
    lightbox._fullscreenChangeHandler = handleFullscreenChange;
    
    // Small delay to ensure lightbox is fully rendered
    setTimeout(() => {
      const elem = document.documentElement; // Request fullscreen for entire page
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
          console.log('Fullscreen request failed:', err);
        });
      } else if (elem.webkitRequestFullscreen) { // Safari
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      }
    }, 50);
  }
}

// Main render function
async function renderHome() {
  const mainContainer = document.getElementById('main-content') || document.body;
  mainContainer.innerHTML = '';

  // Load editable copy from content.json (intro + about page text)
  if (!state.siteCopyLoaded) {
    const copy = await loadSiteCopy();
    state.siteCopy = copy;
    state.siteCopyLoaded = true;
  }

  // Load data from JSON or use demo data
  if (!state.dataLoaded) {
    const loadedSections = await loadPhotoData();
    if (loadedSections) {
      // Use loaded data
      sectionsData.length = 0; // Clear demo data
      sectionsData.push(...loadedSections);
    }
    // Otherwise keep using demo data (sectionsData)
  }

  // Get sorted sections
  state.sections = getSortedSections();

  // Notify layout of sections (if layout.js is loaded and has this function)
  if (typeof updateNavigation === 'function') {
    updateNavigation(state.sections.map(s => ({ id: s.id, label: s.title })));
  }

  const introText = state.siteCopy?.homeIntroText;
  let introEl = null;
  if (typeof introText === 'string' && introText.trim()) {
    introEl = createHomeIntro(introText.trim());
    mainContainer.appendChild(introEl);
  }

  // Render photo sections
  state.sections.forEach((section, idx) => {
    const sectionEl = createPhotoSection(section, (index) => openLightbox(section.id, index));
    // Use the existing top whitespace above the first series for the intro line,
    // so the first series doesn't get pushed further down.
    if (idx === 0 && typeof introText === 'string' && introText.trim()) {
      sectionEl.className = 'pt-0 pb-5 md:pt-0 md:pb-10 scroll-mt-44';
    }
    mainContainer.appendChild(sectionEl);
  });

  // After layout settles, lift the intro closer to the header/nav
  // WITHOUT changing the section positions.
  if (introEl) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => adjustIntroPositionWithoutMovingSections(introEl));
    });
  }
}

// Change sort order (can be called from UI)
function setSortOrder(order) {
  state.sortOrder = order;
  renderHome();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderHome();
});

// Export functions for global use
window.HomePage = {
  render: renderHome,
  setSortOrder: setSortOrder
};
