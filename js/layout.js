// ===========================
// LAYOUT - Enhanced Navigation & Header from base44
// ===========================

// Single source of truth for device detection
function detectDevice() {
  const hasTouch = (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const PHONE_THRESHOLD = 700;
  
  // Check if it's a phone (either dimension < 700px)
  const isPhone = hasTouch && (width < PHONE_THRESHOLD || height < PHONE_THRESHOLD);
  
  if (!hasTouch) {
    // Fallback for simulators: check both dimensions to catch landscape phones
    const isMobileSize = width < PHONE_THRESHOLD || height < PHONE_THRESHOLD;
    return {
      type: isMobileSize ? 'desktop-small' : 'desktop',
      useMobileLayout: isMobileSize,
      isPortrait: height > width
    };
  }
  
  if (isPhone) {
    const isPortrait = height > width;
    return {
      type: isPortrait ? 'phone-portrait' : 'phone-landscape',
      useMobileLayout: true, // Phones always use mobile layout (both orientations)
      isPortrait: isPortrait
    };
  }
  
  // Tablet
  return {
    type: width < 1024 ? 'tablet-portrait' : 'tablet-landscape',
    useMobileLayout: false, // Tablets use desktop layout
    isPortrait: height > width
  };
}

// Apply device classes to body for CSS targeting
function applyDeviceClasses() {
  const device = detectDevice();
  const body = document.body;
  
  // Remove all device classes
  body.classList.remove('phone-portrait', 'phone-landscape', 'tablet-portrait', 'tablet-landscape', 'desktop', 'desktop-small');
  
  // Add current device class
  body.classList.add(device.type);
  
  return device;
}

let layoutState = {
  scrolled: false,
  sortOrder: 'newest',
  sections: [],
  dropdownOpen: false,
  mobileSectionsOpen: false,
  lastScrollY: 0,
  footerTimeout: null,
  device: null, // Will be set on init
  isMobile: false // Will be set on init
};

// Apply device-specific CSS overrides (single source of truth)
function applyDeviceStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Hide mobile sections on desktop/tablet */
    body.desktop .mobile-sections-bar,
    body.desktop .mobile-sections-content,
    body.tablet-portrait .mobile-sections-bar,
    body.tablet-portrait .mobile-sections-content,
    body.tablet-landscape .mobile-sections-bar,
    body.tablet-landscape .mobile-sections-content {
      display: none !important;
    }
    
    /* Show desktop navigation on tablets (override Tailwind's md:hidden at 768px) */
    body.tablet-portrait header .hidden.md\\:block,
    body.tablet-landscape header .hidden.md\\:block {
      display: block !important;
    }
    
    /* Both phone orientations: Mobile dropdown menu with line/arrow */
    body.phone-portrait .md\\:hidden.mobile-sections-bar,
    body.phone-portrait .md\\:hidden.mobile-sections-content,
    body.phone-landscape .md\\:hidden.mobile-sections-bar,
    body.phone-landscape .md\\:hidden.mobile-sections-content {
      display: block !important;
    }
    
    /* Desktop horizontal tags section is removed from DOM on phones (see createHeader) */
    
    /* Both phone orientations: Hide header control buttons */
    body.phone-portrait .hidden.md\\:flex.header-controls,
    body.phone-landscape .hidden.md\\:flex.header-controls {
      display: none !important;
    }
    
    /* Both phone orientations: Force mobile spacing */
    body.phone-portrait header .px-6.md\\:px-12,
    body.phone-landscape header .px-6.md\\:px-12 {
      padding-left: 1.5rem !important;
      padding-right: 1.5rem !important;
    }
    
    body.phone-portrait header .py-5.md\\:py-6,
    body.phone-landscape header .py-5.md\\:py-6 {
      padding-top: 1.25rem !important;
      padding-bottom: 0.25rem !important;
    }
    
    /* No negative margin - let bar sit naturally */
    
    body.phone-portrait header .text-3xl.md\\:text-4xl,
    body.phone-landscape header .text-3xl.md\\:text-4xl {
      font-size: 1.875rem !important;
      line-height: 2.25rem !important;
    }
    
    body.phone-portrait footer.px-6.md\\:px-12,
    body.phone-landscape footer.px-6.md\\:px-12 {
      padding-left: 1.5rem !important;
      padding-right: 1.5rem !important;
    }
    
    body.phone-portrait section.py-5.md\\:py-16,
    body.phone-landscape section.py-5.md\\:py-16 {
      padding-top: 1.25rem !important;
      padding-bottom: 1.25rem !important;
    }
    
    body.phone-portrait .px-8.md\\:px-16,
    body.phone-landscape .px-8.md\\:px-16 {
      padding-left: 2rem !important;
      padding-right: 2rem !important;
    }
    
    body.phone-portrait .text-2xl.md\\:text-3xl,
    body.phone-landscape .text-2xl.md\\:text-3xl {
      font-size: 1.5rem !important;
      line-height: 2rem !important;
    }
    
    body.phone-portrait .text-sm.md\\:text-base,
    body.phone-landscape .text-sm.md\\:text-base {
      font-size: 0.875rem !important;
      line-height: 1.25rem !important;
    }
    
    body.phone-portrait main.pt-2.md\\:pt-6,
    body.phone-landscape main.pt-2.md\\:pt-6 {
      padding-top: 0.5rem !important;
    }
    
    body.phone-portrait .h-\\[100px\\].md\\:h-\\[140px\\],
    body.phone-landscape .h-\\[100px\\].md\\:h-\\[140px\\] {
      height: 100px !important;
    }
    
    /* Both phone orientations: Lightbox with 3mm clearance outside white frame */
    body.phone-portrait #lightbox .lightbox-scale-in,
    body.phone-landscape #lightbox .lightbox-scale-in {
      padding: 3mm !important;
    }
    
    body.phone-portrait #lightbox .lightbox-outer-frame,
    body.phone-landscape #lightbox .lightbox-outer-frame {
      padding: 0mm !important;
    }
    
    body.phone-portrait #lightbox .lightbox-image,
    body.phone-landscape #lightbox .lightbox-image {
      max-width: calc(100vw - 12mm) !important;
      max-height: calc(100vh - 12mm) !important;
    }
    
    /* Hide metadata on phones to keep image centered */
    body.phone-portrait #lightbox .text-white\\/60.text-xs.space-y-2,
    body.phone-landscape #lightbox .text-white\\/60.text-xs.space-y-2 {
      display: none !important;
    }
    
  `;
  document.head.appendChild(style);
}

// Apply header-specific styles to document head
function applyHeaderStyles() {
  const style = document.createElement('style');
  style.textContent = `
    html {
      scroll-behavior: smooth;
    }
    
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Smooth transitions for main content when mobile menu expands */
    #main-content {
      transition: none;
    }
    
    .dropdown-content {
      display: none;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .dropdown-content.open {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Mobile sections menu styles */
    .mobile-sections-bar {
      position: relative;
      height: 40px;
      background: white;
      cursor: pointer;
      user-select: none;
      overflow: visible;
      z-index: 30;
      will-change: transform;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                  opacity 0.3s ease;
      pointer-events: none;
    }
    
    /* Only the center area is clickable */
    .mobile-sections-bar > * {
      pointer-events: auto;
    }
    
    .mobile-sections-bar.sliding-down {
      transform: translateY(0);
    }
    
    .mobile-sections-bar.hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    /* Side lines - move down with animation */
    .mobile-sections-bar::before,
    .mobile-sections-bar::after {
      content: '';
      position: absolute;
      top: 16px;
      height: 0;
      border-top: 1px solid black;
      transition: top 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .mobile-sections-bar::before {
      left: 0;
      right: calc(50% + 75px);
    }
    
    .mobile-sections-bar::after {
      left: calc(50% + 75px);
      right: 0;
    }
    
    /* When open, side lines move to bottom position */
    .mobile-sections-bar.open::before,
    .mobile-sections-bar.open::after {
      top: 28px;
    }
    
    .mobile-sections-arrow {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      width: 150px;
      height: 40px;
    }
    
    .mobile-sections-arrow-path {
      stroke: black;
      stroke-width: 1;
      fill: none;
      vector-effect: non-scaling-stroke;
      transition: d 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .mobile-sections-arrow-accent {
      stroke: #ef4444;
      stroke-width: 1;
      fill: none;
      stroke-linejoin: miter;
      vector-effect: non-scaling-stroke;
      transition: d 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .mobile-sections-text {
      position: absolute;
      top: 38.46%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      font-size: 16px;
      line-height: 1;
      letter-spacing: 0.2em;
      color: #999;
      font-weight: 300;
      text-transform: uppercase;
      background: white;
      padding: 0 8px;
      opacity: 1;
      white-space: nowrap;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .mobile-sections-content {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      height: 0;
      overflow: hidden;
      background: white;
      z-index: 29;
      transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    }
    
    .mobile-sections-content.open {
      height: auto;
      pointer-events: auto;
    }
    
    .mobile-section-links {
      padding: 0px 20px 40px 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 16px 24px;
      justify-content: center;
    }
    
    .mobile-section-link {
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #666;
      font-weight: 300;
      transition: color 0.2s ease;
    }
    
    .mobile-section-link:active {
      color: black;
    }
    
    /* Vertical button layout on mobile */
    @media (max-width: 640px) {
      .header-controls {
        flex-direction: column;
        gap: 12px;
        align-items: center;
      }
    }
  `;
  document.head.appendChild(style);
}

// Create main header
function createHeader() {
  const header = document.createElement('header');
  header.id = 'main-header';
  header.className = 'sticky top-0 left-0 right-0 z-40 transition-all duration-500 bg-white/95 backdrop-blur-sm';

  header.innerHTML = `
    <!-- Top bar with title and controls -->
    <div class="px-6 md:px-12 lg:px-16 py-5 md:py-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <!-- Logo/Title -->
        <button
          id="scroll-to-top-logo"
          class="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-black hover:opacity-60 transition-opacity duration-300"
          title="Scroll to top"
        >
          Photo Post-Realism Is Fun
        </button>

        <div class="hidden md:flex items-center gap-4 header-controls">
          <!-- Scroll to top button -->
          <button
            id="scroll-up-btn"
            class="text-gray-400 hover:text-black transition-colors duration-300"
            title="Scroll to top"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Scroll to bottom button -->
          <button
            id="scroll-down-btn"
            class="text-gray-400 hover:text-black transition-colors duration-300"
            title="Scroll to bottom"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4V12M8 12L12 8M8 12L4 8" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Sort dropdown -->
          <div class="relative" id="sort-dropdown">
            <button
              id="sort-trigger"
              class="flex items-center gap-2 text-xs tracking-wider text-gray-500 hover:text-black transition-colors duration-300 font-light outline-none"
            >
              <span class="hidden sm:inline" id="sort-label">RECENT</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div
              id="sort-dropdown-content"
              class="dropdown-content absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-xl min-w-[180px] z-50"
            >
              <button
                class="sort-option w-full text-left text-xs tracking-wider font-light cursor-pointer py-3 px-4 hover:bg-gray-50 transition-colors"
                data-value="newest"
              >
                Most recent on top
              </button>
              <button
                class="sort-option w-full text-left text-xs tracking-wider font-light cursor-pointer py-3 px-4 hover:bg-gray-50 transition-colors"
                data-value="oldest"
              >
                Oldest on top
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop section navigation -->
    <div class="hidden md:block px-6 md:px-12 lg:px-16 py-3 bg-white">
      <nav id="section-nav" class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <!-- Section links will be inserted here -->
      </nav>
    </div>
    
    <!-- Mobile sections menu bar -->
    <div class="md:hidden mobile-sections-bar" id="mobile-sections-bar">
      <svg class="mobile-sections-arrow" viewBox="0 0 150 40" preserveAspectRatio="none">
        <!-- Black line: dropped area with V (fixed 150px width total) -->
        <path class="mobile-sections-arrow-path" id="mobile-arrow-path" 
              d="M 0,16 L 0,16 L 0,28 L 65,28 L 75,38 L 85,28 L 150,28 L 150,16 L 150,16" />
        <!-- Red accent: doubles the V -->
        <path class="mobile-sections-arrow-accent" id="mobile-arrow-accent" 
              d="M 65,29 L 75,39 L 85,29" />
      </svg>
      <span class="mobile-sections-text" id="mobile-sections-text">Sections</span>
    </div>
    
    <!-- Mobile sections expandable content -->
    <div class="md:hidden mobile-sections-content" id="mobile-sections-content">
      <div class="mobile-section-links" id="mobile-section-nav">
        <!-- Mobile section links will be inserted here -->
      </div>
    </div>
  `;

  return header;
}

// Create footer
function createFooter() {
  const footer = document.createElement('footer');
  footer.id = 'main-footer';
  footer.className = 'sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 py-4 px-6 md:px-12 lg:px-16 transition-opacity duration-1000';
  
  footer.innerHTML = `
    <div class="flex items-center justify-between text-xs text-gray-400">
      <span>© ${new Date().getFullYear()} Leonid Yanovich. All rights reserved.</span>
      <a 
        href="contact.html"
        class="hover:text-black transition-colors duration-300"
      >
        Get in touch
      </a>
    </div>
  `;

  return footer;
}

// Update scroll shadow effect
function updateHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const isScrolled = window.scrollY > 50;
  
  if (isScrolled && !layoutState.scrolled) {
    header.classList.add('shadow-[0_1px_0_0_rgba(0,0,0,0.05)]');
    layoutState.scrolled = true;
  } else if (!isScrolled && layoutState.scrolled) {
    header.classList.remove('shadow-[0_1px_0_0_rgba(0,0,0,0.05)]');
    layoutState.scrolled = false;
  }
}

// Footer auto-hide on scroll with delayed reappear (mobile only)
function updateFooterVisibility() {
  const footer = document.getElementById('main-footer');
  if (!footer) return;
  
  // Use cached device detection (properly set by detectDevice())
  // Only apply auto-hide on phones (not tablets or desktop)
  if (!layoutState.isMobile) {
    // On desktop/tablet, always show footer
    footer.style.opacity = '1';
    if (layoutState.footerTimeout) {
      clearTimeout(layoutState.footerTimeout);
    }
    return;
  }
  
  // On mobile: hide footer and set timeout to show after 10 seconds
  const currentScrollY = window.scrollY;
  
  // Clear any existing timeout
  if (layoutState.footerTimeout) {
    clearTimeout(layoutState.footerTimeout);
  }
  
  // Hide footer on mobile (both when scrolling and when just becoming mobile)
  footer.style.opacity = '0';
  
  // Set timeout to show footer after 10 seconds of inactivity
  layoutState.footerTimeout = setTimeout(() => {
    footer.style.opacity = '1';
  }, 10000);
  
  layoutState.lastScrollY = currentScrollY;
}

// Set fixed SVG path for mobile sections bar (150px fixed width)
function updateMobileSectionsPath() {
  const arrowPath = document.getElementById('mobile-arrow-path');
  const arrowAccent = document.getElementById('mobile-arrow-accent');
  
  if (!arrowPath || !arrowAccent) return;
  
  // Collapsed: Top line (y=16), drops to y=28 around text, downward V to y=38
  const collapsedPath = 'M 0,16 L 0,16 L 0,28 L 65,28 L 75,38 L 85,28 L 150,28 L 150,16 L 150,16';
  const collapsedAccent = 'M 65,29 L 75,39 L 85,29';
  
  // Expanded: Everything at y=28, upward V to y=18 (drop disappears, V flips)
  const expandedPath = 'M 0,28 L 0,28 L 0,28 L 65,28 L 75,18 L 85,28 L 150,28 L 150,28 L 150,28';
  const expandedAccent = 'M 65,27 L 75,17 L 85,27';
  
  // Store paths
  const bar = document.getElementById('mobile-sections-bar');
  if (bar) {
    bar.dataset.collapsedPath = collapsedPath;
    bar.dataset.collapsedAccent = collapsedAccent;
    bar.dataset.expandedPath = expandedPath;
    bar.dataset.expandedAccent = expandedAccent;
  }
  
  // Apply collapsed path if not open
  if (!layoutState.mobileSectionsOpen) {
    arrowPath.setAttribute('d', collapsedPath);
    arrowAccent.setAttribute('d', collapsedAccent);
  }
}

// Mobile sections menu functions
function openMobileSectionsMenu() {
  layoutState.mobileSectionsOpen = true;
  const content = document.getElementById('mobile-sections-content');
  const topBar = document.getElementById('mobile-sections-bar');
  const arrowPath = document.getElementById('mobile-arrow-path');
  const arrowAccent = document.getElementById('mobile-arrow-accent');
  const sectionsText = document.querySelector('.mobile-sections-text');
  
  // Hide "sections" text immediately
  if (sectionsText) {
    sectionsText.style.opacity = '0';
  }
  
  // Flatten the line IMMEDIATELY (no vertical bars during slide)
  if (arrowPath && arrowAccent && topBar) {
    arrowPath.setAttribute('d', topBar.dataset.expandedPath);
    arrowAccent.setAttribute('d', topBar.dataset.expandedAccent);
    topBar.classList.add('open'); // Side lines move down too
  }
  
  // Measure height after a frame to ensure accurate measurement
  if (content) {
    content.style.height = 'auto';
    content.style.transition = 'none';
    
    // Wait for next frame to get accurate measurement
    requestAnimationFrame(() => {
      const tagsHeight = content.offsetHeight;
      content.style.height = '0px';
      
      // Force reflow
      content.offsetHeight;
      
      // Re-enable transition and animate
      content.style.transition = '';
      
      // Wait one more frame before animating
      requestAnimationFrame(() => {
        content.style.height = tagsHeight + 'px';
        content.classList.add('open');
        
        // Slide bar down the same distance
        if (topBar) {
          topBar.style.transform = `translateY(${tagsHeight}px)`;
        }
      });
    });
  }
}

function closeMobileSectionsMenu() {
  layoutState.mobileSectionsOpen = false;
  const content = document.getElementById('mobile-sections-content');
  const topBar = document.getElementById('mobile-sections-bar');
  const arrowPath = document.getElementById('mobile-arrow-path');
  const arrowAccent = document.getElementById('mobile-arrow-accent');
  const sectionsText = document.querySelector('.mobile-sections-text');
  
  // Get current height before collapsing
  const tagsHeight = content ? content.offsetHeight : 0;
  
  // Collapse content to 0
  if (content) {
    content.style.height = '0px';
    content.classList.remove('open');
  }
  
  // Slide bar up (stays flat with upward V all the way)
  requestAnimationFrame(() => {
    if (topBar) {
      topBar.style.transform = 'translateY(0)';
      // Keep 'open' class during slide up so line stays flat
    }
  });
  
  // After bar reaches top (600ms), THEN morph: flip V + show drop + show text
  setTimeout(() => {
    // Remove 'open' class to bring side lines back to top position
    if (topBar) {
      topBar.classList.remove('open');
    }
    
    // Flip arrow to downward V and create dropped area
    if (arrowPath && arrowAccent && topBar) {
      arrowPath.setAttribute('d', topBar.dataset.collapsedPath);
      arrowAccent.setAttribute('d', topBar.dataset.collapsedAccent);
    }
    
    // Show "Sections" text after morph starts
    setTimeout(() => {
      if (sectionsText) {
        sectionsText.style.opacity = '1';
      }
    }, 100);
  }, 600); // Wait for bar to reach top
}

function toggleMobileSectionsMenu() {
  if (layoutState.mobileSectionsOpen) {
    closeMobileSectionsMenu();
  } else {
    openMobileSectionsMenu();
  }
}

// Scroll to section smoothly
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    // Calculate header height
    const header = document.getElementById('main-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const extraPadding = 8; // Minimal padding for tight spacing
    
    // Get element position
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - extraPadding;
    
    // Smooth scroll to calculated position
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Update URL hash without jumping
    window.history.pushState(null, '', `#${id}`);
  }
}

// Update section navigation
function updateSectionNavigation(sections) {
  layoutState.sections = sections;
  
  // Update desktop navigation
  const nav = document.getElementById('section-nav');
  if (nav) {
    nav.innerHTML = sections.map(section => `
      <button
        class="section-link text-xs tracking-widest text-gray-500 hover:text-black transition-colors duration-300 font-light uppercase"
        data-section-id="${section.id}"
      >
        ${section.label}
      </button>
    `).join('');

    // Add click listeners
    nav.querySelectorAll('.section-link').forEach(button => {
      button.addEventListener('click', () => {
        const sectionId = button.dataset.sectionId;
        scrollToSection(sectionId);
      });
    });
  }
  
  // Update mobile navigation
  const mobileNav = document.getElementById('mobile-section-nav');
  if (mobileNav) {
    mobileNav.innerHTML = sections.map(section => `
      <button
        class="mobile-section-link"
        data-section-id="${section.id}"
      >
        ${section.label}
      </button>
    `).join('');

    // Add click listeners
    mobileNav.querySelectorAll('.mobile-section-link').forEach(button => {
      button.addEventListener('click', () => {
        const sectionId = button.dataset.sectionId;
        closeMobileSectionsMenu();
        // Delay scroll until after collapse animation starts
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 200);
      });
    });
  }
}

// Update sort order
function updateSortOrder(order) {
  layoutState.sortOrder = order;
  
  // Update label
  const label = document.getElementById('sort-label');
  if (label) {
    label.textContent = order === 'newest' ? 'RECENT' : 'OLDEST';
  }

  // Update option styles
  document.querySelectorAll('.sort-option').forEach(option => {
    const value = option.dataset.value;
    if (value === order) {
      option.classList.add('text-gray-400');
      option.classList.remove('text-black');
    } else {
      option.classList.add('text-black');
      option.classList.remove('text-gray-400');
    }
  });

  // Notify home page if it has setSortOrder function
  if (window.HomePage && window.HomePage.setSortOrder) {
    window.HomePage.setSortOrder(order);
  }

  // Close dropdown
  toggleDropdown(false);
}

// Toggle dropdown
function toggleDropdown(open) {
  const dropdown = document.getElementById('sort-dropdown-content');
  if (!dropdown) return;

  if (open === undefined) {
    open = !layoutState.dropdownOpen;
  }

  layoutState.dropdownOpen = open;

  if (open) {
    dropdown.classList.add('open');
  } else {
    dropdown.classList.remove('open');
  }
}

// Initialize layout
function initLayout() {
  // Apply device-specific styles once
  applyDeviceStyles();
  
  // Apply header styles to document head
  applyHeaderStyles();
  
  // Detect device and apply classes
  const device = applyDeviceClasses();
  layoutState.device = device;
  layoutState.isMobile = device.useMobileLayout;
  
  // Don't add layout to contact page
  if (window.location.pathname.includes('contact.html')) {
    return;
  }

  const body = document.body;

  // Create and insert header at the beginning
  const header = createHeader();
  body.insertBefore(header, body.firstChild);
  
  // Remove desktop navigation from DOM on phones (cleaner than hiding)
  if (layoutState.isMobile) {
    const desktopNav = header.querySelector('.hidden.md\\:block');
    if (desktopNav) {
      desktopNav.remove();
    }
  }

  // Create main wrapper if doesn't exist
  let main = document.getElementById('main-content');
  if (!main) {
    main = document.createElement('main');
    main.id = 'main-content';
    main.className = 'flex-1 pt-2 md:pt-6';
    
    // Move existing body content into main
    while (body.children.length > 1) {
      if (body.children[1] !== main) {
        main.appendChild(body.children[1]);
      } else {
        break;
      }
    }
    body.appendChild(main);
  }

  // Add footer
  const footer = createFooter();
  body.appendChild(footer);

  // Setup scroll listener for header shadow and footer visibility
  window.addEventListener('scroll', () => {
    updateHeaderScroll();
    updateFooterVisibility();
  });
  
  // Update device detection on resize/orientation change
  window.addEventListener('resize', () => {
    const device = applyDeviceClasses();
    layoutState.device = device;
    layoutState.isMobile = device.useMobileLayout;
    
    // Update footer visibility immediately after device change
    updateFooterVisibility();
  });

  // Setup scroll buttons
  document.getElementById('scroll-to-top-logo').addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear hash from URL (e.g., example.com/#section → example.com/)
    if (window.location.hash) {
      // Build clean URL without hash (GitHub Pages compatible)
      const url = new URL(window.location.href);
      url.hash = '';
      history.replaceState(null, document.title, url.toString());
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const scrollUpBtn = document.getElementById('scroll-up-btn');
  if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const scrollDownBtn = document.getElementById('scroll-down-btn');
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener('click', () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });
  }

  // Setup sort dropdown
  const sortTrigger = document.getElementById('sort-trigger');
  const sortDropdown = document.getElementById('sort-dropdown');

  if (sortTrigger && sortDropdown) {
    sortTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!sortDropdown.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    // Setup sort options
    document.querySelectorAll('.sort-option').forEach(option => {
      option.addEventListener('click', () => {
        updateSortOrder(option.dataset.value);
      });
    });
  }
  
  // Setup mobile sections menu
  const mobileSectionsBar = document.getElementById('mobile-sections-bar');
  const mobileSectionsBarBottom = document.getElementById('mobile-sections-bar-bottom');
  const mobileSectionsContent = document.getElementById('mobile-sections-content');
  
  // Store animation paths
  if (mobileSectionsBar) {
    updateMobileSectionsPath();
  }
  
  if (mobileSectionsBar) {
    // Click/tap to toggle
    mobileSectionsBar.addEventListener('click', toggleMobileSectionsMenu);
    
    // Drag gesture support for opening
    let dragStartY = 0;
    let isDragging = false;
    
    mobileSectionsBar.addEventListener('touchstart', (e) => {
      dragStartY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });
    
    mobileSectionsBar.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - dragStartY;
      
      // If dragging down more than 30px, open menu
      if (deltaY > 30 && !layoutState.mobileSectionsOpen) {
        openMobileSectionsMenu();
        isDragging = false;
      }
    }, { passive: true });
    
    mobileSectionsBar.addEventListener('touchend', () => {
      isDragging = false;
    }, { passive: true });
  }
  
  // Close mobile sections menu when user scrolls the page
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    // Only close if menu is open AND scroll position changed
    if (layoutState.mobileSectionsOpen && Math.abs(window.scrollY - lastScrollY) > 5) {
      closeMobileSectionsMenu();
    }
    lastScrollY = window.scrollY;
  }, { passive: true });
  
  // Setup bottom collapse bar
  if (mobileSectionsBarBottom) {
    // Click/tap to close
    mobileSectionsBarBottom.addEventListener('click', closeMobileSectionsMenu);
    
    // Drag gesture support for closing
    let dragStartY = 0;
    let isDragging = false;
    
    mobileSectionsBarBottom.addEventListener('touchstart', (e) => {
      dragStartY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });
    
    mobileSectionsBarBottom.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - dragStartY;
      
      // If dragging up more than 30px, close menu
      if (deltaY < -30 && layoutState.mobileSectionsOpen) {
        closeMobileSectionsMenu();
        isDragging = false;
      }
    }, { passive: true });
    
    mobileSectionsBarBottom.addEventListener('touchend', () => {
      isDragging = false;
    }, { passive: true });
  }

  // Scroll to hash on page load
  const hash = window.location.hash.slice(1);
  if (hash) {
    setTimeout(() => {
      scrollToSection(hash);
    }, 100);
  }

  // Initial scroll state
  updateHeaderScroll();
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLayout);
} else {
  initLayout();
}

// Export functions for use by other scripts
window.updateNavigation = updateSectionNavigation;
