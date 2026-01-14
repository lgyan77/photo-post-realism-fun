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
  dataLoaded: false
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
  sectionEl.className = 'py-5 md:py-16 scroll-mt-44';

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
    ${section.description ? `<p class="text-gray-500 font-light text-sm md:text-base max-w-2xl leading-relaxed">${section.description}</p>` : ''}
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
      /* Mobile-specific sizing handled by device detection in layout.js */
    </style>

    <!-- Close button -->
    <button
      id="lightbox-close"
      class="absolute top-6 right-6 z-50 text-white/60 hover:text-white transition-colors duration-300"
      aria-label="Close lightbox"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Photo counter -->
    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest font-light">
      ${currentIndex + 1} / ${photos.length}
    </div>

    <!-- Main content container -->
    <div class="relative flex flex-col items-center justify-center w-full h-full lightbox-scale-in" style="padding: 15mm;">
      <!-- Image with white frame (matted photo effect) -->
      <div class="lightbox-outer-frame relative bg-black flex items-center justify-center" style="padding: 5mm;">
        <div class="border border-white bg-black flex items-center justify-center" style="padding: 3mm;">
          <img
            src="${getImageUrl(photo)}"
            alt="${photo.title || 'Photo'}"
            class="block lightbox-image"
            style="max-width: calc(100vw - 46mm); max-height: calc(100vh - 66mm); width: auto; height: auto;"
          />
        </div>
      </div>

      <!-- Metadata and description -->
      <div class="text-white/60 text-xs space-y-2 max-w-2xl text-center mt-6">
        ${buildMetadataHTML(photo)}
        ${photo.comment ? `<p class="text-white/50 italic font-light">${photo.comment}</p>` : ''}
      </div>
    </div>

    <!-- Left arrow (hidden by default, shown on mouse hover near edge) -->
    ${currentIndex > 0 ? `
      <button
        id="lightbox-prev"
        class="lightbox-arrow absolute left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300"
        aria-label="Previous photo"
      >
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
    ` : ''}

    <!-- Right arrow (hidden by default, shown on mouse hover near edge) -->
    ${currentIndex < photos.length - 1 ? `
      <button
        id="lightbox-next"
        class="lightbox-arrow absolute right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300"
        aria-label="Next photo"
      >
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    ` : ''}
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

  // Navigation buttons (no throttling for clicks)
  const prevBtn = lightbox.querySelector('#lightbox-prev');
  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      const currentIdx = state.lightbox.photoIndex;
      if (currentIdx > 0) {
        onNavigate(currentIdx - 1);
      }
    };
  }

  const nextBtn = lightbox.querySelector('#lightbox-next');
  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      const currentIdx = state.lightbox.photoIndex;
      if (currentIdx < photos.length - 1) {
        onNavigate(currentIdx + 1);
      }
    };
  }

  // Close on background click
  lightbox.onclick = (e) => {
    if (e.target === lightbox) onClose();
  };

  // Keyboard navigation
  const handleKeyPress = (e) => {
    // Get current index from state (not closure)
    const currentIdx = state.lightbox.photoIndex;
    
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIdx > 0) onNavigate(currentIdx - 1);
    if (e.key === 'ArrowRight' && currentIdx < photos.length - 1) onNavigate(currentIdx + 1);
  };
  document.addEventListener('keydown', handleKeyPress);
  lightbox.dataset.keyHandler = 'attached';

  // Touch/Swipe navigation (mobile: 1 finger, desktop: 2 fingers)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isSwiping = false;
  let lastSwipeTime = 0; // Only for swipe throttling

  const navigateViaSwipe = (newIndex) => {
    const now = Date.now();
    if (now - lastSwipeTime < 400) return; // 400ms cooldown for swipes only
    
    lastSwipeTime = now;
    onNavigate(newIndex);
  };

  const handleTouchStart = (e) => {
    // Reset swipe tracking
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchEndX = touchStartX;
    touchEndY = touchStartY;
    isSwiping = true;
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    
    // Update end position during move
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
    
    // Calculate delta to check if it's horizontal
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // If horizontal swipe is detected, prevent browser back/forward navigation
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleTouchEnd = (e) => {
    if (!isSwiping) return;
    isSwiping = false;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Minimum swipe distance (80px - increased for better control)
    const minSwipeDistance = 80;
    
    // Check if horizontal swipe (not vertical scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      // ALWAYS prevent browser navigation AND propagation on horizontal swipes
      e.preventDefault();
      e.stopPropagation();
      
      // Get current index from state (not closure)
      const currentIdx = state.lightbox.photoIndex;
      
      // FIX: Swipe LEFT (negative deltaX) = go RIGHT (next photo)
      //      Swipe RIGHT (positive deltaX) = go LEFT (previous photo)
      if (deltaX < 0) {
        // Swipe left - go to next (only if not last image)
        if (currentIdx < photos.length - 1) {
          navigateViaSwipe(currentIdx + 1);
        }
      } else {
        // Swipe right - go to previous (only if not first image)
        if (currentIdx > 0) {
          navigateViaSwipe(currentIdx - 1);
        }
      }
    }
    
    // Reset tracking
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
  };

  // Add touch event listeners (NOT passive so we can preventDefault)
  lightbox.addEventListener('touchstart', handleTouchStart, { passive: false });
  lightbox.addEventListener('touchmove', handleTouchMove, { passive: false });
  lightbox.addEventListener('touchend', handleTouchEnd, { passive: false });

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
          onNavigate(currentIdx + 1);
        } else if (direction < 0 && currentIdx > 0) {
          onNavigate(currentIdx - 1);
        }
        
        // Don't set a fixed timeout - let the wheel events timeout handle it
      }
    }
  };

  // Add wheel listener for trackpad gestures
  lightbox.addEventListener('wheel', handleWheel, { passive: false });

  // Prevent body scroll when lightbox is open
  document.body.style.overflow = 'hidden';
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
function openLightbox(sectionId, photoIndex) {
  state.lightbox = {
    isOpen: true,
    sectionId,
    photoIndex
  };
  renderLightbox();
}

function closeLightbox() {
  // Remove keyboard listener and lightbox
  const existingLightbox = document.getElementById('lightbox');
  if (existingLightbox) {
    // Clean up popstate listener if it exists
    if (existingLightbox._popStateHandler) {
      window.removeEventListener('popstate', existingLightbox._popStateHandler);
    }
    existingLightbox.remove();
  }
  
  // Restore body scroll and overscroll behavior
  document.body.style.overflow = 'unset';
  document.body.style.overscrollBehavior = 'auto';
  document.documentElement.style.overscrollBehavior = 'auto';
  
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
  state.lightbox.photoIndex = newIndex;
  
  // Instead of recreating entire lightbox, just update the content
  const existingLightbox = document.getElementById('lightbox');
  if (existingLightbox) {
    updateLightboxContent(newIndex);
  } else {
    // Fallback: recreate if lightbox doesn't exist
    renderLightbox();
  }
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

  // Cross-fade image transition
  const imageContainer = document.querySelector('#lightbox .border.border-white');
  const currentImg = document.querySelector('#lightbox img');
  
  if (imageContainer && currentImg) {
    // Remove any leftover images from previous transitions
    const allImages = imageContainer.querySelectorAll('img');
    allImages.forEach((img, index) => {
      if (index > 0) img.remove(); // Keep only the first (current) image
    });
    
    // Get current image dimensions to maintain container size
    const currentWidth = currentImg.offsetWidth;
    const currentHeight = currentImg.offsetHeight;
    
    // Set container to fixed dimensions to keep border visible during transition
    imageContainer.style.width = currentWidth + 'px';
    imageContainer.style.height = currentHeight + 'px';
    imageContainer.style.position = 'relative';
    imageContainer.style.display = 'flex';
    imageContainer.style.alignItems = 'center';
    imageContainer.style.justifyContent = 'center';
    
    // Create new image (use mobile or desktop version based on device)
    const newImg = document.createElement('img');
    newImg.src = getImageUrl(photo);
    newImg.alt = photo.title || 'Photo';
    newImg.className = 'block lightbox-image';
    newImg.style.cssText = 'max-width: calc(100vw - 46mm); max-height: calc(100vh - 66mm); width: auto; height: auto; opacity: 0; position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto;';
    
    // Fade out current image
    currentImg.style.transition = 'opacity 0.4s ease-in-out';
    currentImg.style.opacity = '0';
    
    // Add new image on top
    imageContainer.appendChild(newImg);
    
    // When new image loads, adjust container and fade in
    newImg.onload = () => {
      // Adjust container size to new image with transition
      const newWidth = newImg.offsetWidth;
      const newHeight = newImg.offsetHeight;
      
      imageContainer.style.transition = 'width 0.4s ease-in-out, height 0.4s ease-in-out';
      imageContainer.style.width = newWidth + 'px';
      imageContainer.style.height = newHeight + 'px';
      
      // Force reflow to ensure opacity: 0 is applied first
      void newImg.offsetHeight;
      
      // Now add transition and fade in
      newImg.style.transition = 'opacity 0.4s ease-in-out';
      
      // Use requestAnimationFrame to ensure transition is applied
      requestAnimationFrame(() => {
        newImg.style.opacity = '1';
      });
      
      // Remove old image after fade completes and reset container
      setTimeout(() => {
        if (currentImg && currentImg.parentNode) {
          currentImg.remove();
        }
        // Reset container to auto sizing
        imageContainer.style.width = 'auto';
        imageContainer.style.height = 'auto';
        imageContainer.style.transition = 'none';
        // Make new image the main image (remove absolute positioning)
        newImg.style.position = 'static';
        newImg.style.top = 'auto';
        newImg.style.left = 'auto';
        newImg.style.right = 'auto';
        newImg.style.bottom = 'auto';
        newImg.style.margin = '0';
      }, 400); // Match transition duration
    };
    
    // If image loads from cache (instant), handle it the same way
    if (newImg.complete) {
      const newWidth = newImg.naturalWidth;
      const newHeight = newImg.naturalHeight;
      
      // Calculate display dimensions respecting max constraints
      const maxWidth = window.innerWidth - (46 * 3.7795275591); // 46mm to pixels
      const maxHeight = window.innerHeight - (66 * 3.7795275591); // 66mm to pixels
      
      let displayWidth = newWidth;
      let displayHeight = newHeight;
      
      if (displayWidth > maxWidth) {
        displayHeight = (maxWidth / displayWidth) * displayHeight;
        displayWidth = maxWidth;
      }
      if (displayHeight > maxHeight) {
        displayWidth = (maxHeight / displayHeight) * displayWidth;
        displayHeight = maxHeight;
      }
      
      imageContainer.style.transition = 'width 0.4s ease-in-out, height 0.4s ease-in-out';
      imageContainer.style.width = Math.round(displayWidth) + 'px';
      imageContainer.style.height = Math.round(displayHeight) + 'px';
      
      void newImg.offsetHeight;
      newImg.style.transition = 'opacity 0.4s ease-in-out';
      requestAnimationFrame(() => {
        newImg.style.opacity = '1';
      });
      setTimeout(() => {
        if (currentImg && currentImg.parentNode) {
          currentImg.remove();
        }
        imageContainer.style.width = 'auto';
        imageContainer.style.height = 'auto';
        imageContainer.style.transition = 'none';
        newImg.style.position = 'static';
        newImg.style.top = 'auto';
        newImg.style.left = 'auto';
        newImg.style.right = 'auto';
        newImg.style.bottom = 'auto';
        newImg.style.margin = '0';
      }, 400);
    }
  }

  // Update metadata with fade
  const metadataContainer = document.querySelector('#lightbox .lightbox-scale-in .text-xs.space-y-2');
  if (metadataContainer) {
    // Fade out
    metadataContainer.style.transition = 'opacity 0.2s ease-out';
    metadataContainer.style.opacity = '0';
    
    // Update content after fade
    setTimeout(() => {
      metadataContainer.innerHTML = `
        ${buildMetadataHTML(photo)}
        ${photo.comment ? `<p class="text-white/50 italic font-light">${photo.comment}</p>` : ''}
      `;
      
      // Fade in
      metadataContainer.style.opacity = '1';
    }, 200);
  }

  // Update arrow visibility based on position
  const leftArrow = document.getElementById('lightbox-prev');
  const rightArrow = document.getElementById('lightbox-next');
  
  if (leftArrow) {
    if (currentIndex === 0) {
      leftArrow.style.display = 'none';
    } else {
      leftArrow.style.display = 'block';
    }
  }
  
  if (rightArrow) {
    if (currentIndex === photos.length - 1) {
      rightArrow.style.display = 'none';
    } else {
      rightArrow.style.display = 'block';
    }
  }
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
}

// Main render function
async function renderHome() {
  const mainContainer = document.getElementById('main-content') || document.body;
  mainContainer.innerHTML = '';

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

  // Render photo sections
  state.sections.forEach(section => {
    const sectionEl = createPhotoSection(section, (index) => openLightbox(section.id, index));
    mainContainer.appendChild(sectionEl);
  });
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
