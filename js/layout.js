// ===========================
// LAYOUT - Enhanced Navigation & Header from base44
// ===========================

let layoutState = {
  scrolled: false,
  sortOrder: 'newest',
  sections: [],
  dropdownOpen: false,
  mobileSectionsOpen: false,
  lastScrollY: 0,
  footerTimeout: null
};

// Create main header
function createHeader() {
  const header = document.createElement('header');
  header.id = 'main-header';
  header.className = 'sticky top-0 left-0 right-0 z-40 transition-all duration-500 bg-white/95 backdrop-blur-sm';

  header.innerHTML = `
    <style>
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
        height: 26px;
        background: white;
        cursor: pointer;
        user-select: none;
        touch-action: none;
        border-top: 1px solid #f0f0f0;
        overflow: visible;
        z-index: 11;
        will-change: transform;
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.3s ease;
      }
      
      .mobile-sections-bar.sliding-down {
        transform: translateY(0);
      }
      
      .mobile-sections-bar.hidden {
        opacity: 0;
        pointer-events: none;
      }
      
      .mobile-sections-arrow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
        pointer-events: none;
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
        font-size: 8px;
        line-height: 1;
        letter-spacing: 0.2em;
        color: #999;
        font-weight: 300;
        text-transform: uppercase;
        pointer-events: none;
        background: transparent;
        padding: 0 3px;
        opacity: 1;
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
        z-index: 10;
        transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .mobile-sections-content.open {
        height: auto;
      }
      
      .mobile-section-links {
        padding: 16px 20px 40px 20px; /* Extra bottom padding for line clearance */
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
    </style>

    <!-- Top bar with title and controls -->
    <div class="px-6 md:px-12 lg:px-16 py-5 md:py-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <!-- Logo/Title -->
        <button
          id="scroll-to-top-logo"
          class="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-wide text-black hover:opacity-60 transition-opacity duration-300"
          style="font-family: Georgia, serif"
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
      <svg class="mobile-sections-arrow" viewBox="0 0 100 26" preserveAspectRatio="none">
        <!-- Black line: y=10 on sides, drops at x=43-57 deeper below text, then narrow 60° V -->
        <path class="mobile-sections-arrow-path" id="mobile-arrow-path" 
              d="M 0,10 L 43,10 L 43,16 L 47.7,16 L 50,24 L 52.3,16 L 57,16 L 57,10 L 100,10" />
        <!-- Red accent: same dimensions as black, just 1 unit lower -->
        <path class="mobile-sections-arrow-accent" id="mobile-arrow-accent" 
              d="M 47.7,17 L 50,25 L 52.3,17" />
      </svg>
      <span class="mobile-sections-text">Sections</span>
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
  
  // Only apply auto-hide on mobile (width < 768px, which is md breakpoint)
  const isMobile = window.innerWidth < 768;
  
  if (!isMobile) {
    // On desktop, always show footer
    footer.style.opacity = '1';
    if (layoutState.footerTimeout) {
      clearTimeout(layoutState.footerTimeout);
    }
    return;
  }
  
  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > layoutState.lastScrollY;
  const isScrollingUp = currentScrollY < layoutState.lastScrollY;
  
  // Clear any existing timeout
  if (layoutState.footerTimeout) {
    clearTimeout(layoutState.footerTimeout);
  }
  
  if (isScrollingDown || isScrollingUp) {
    // Hide footer immediately when scrolling
    footer.style.opacity = '0';
    
    // Set timeout to show footer after 10 seconds of inactivity
    layoutState.footerTimeout = setTimeout(() => {
      footer.style.opacity = '1';
    }, 10000);
  }
  
  layoutState.lastScrollY = currentScrollY;
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
  
  // After sliding down, flip arrow smoothly (no hiding)
  setTimeout(() => {
    if (arrowPath && arrowAccent) {
      // Change to straight line with upward V
      arrowPath.setAttribute('d', 'M 0,16 L 47.7,16 L 50,8 L 52.3,16 L 100,16');
      arrowAccent.setAttribute('d', 'M 47.7,15 L 50,7 L 52.3,15');
    }
  }, 600);
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
  
  // Slide bar up
  requestAnimationFrame(() => {
    if (topBar) {
      topBar.style.transform = 'translateY(0)';
    }
  });
  
  // Show text
  if (sectionsText) {
    sectionsText.style.opacity = '1';
  }
  
  // After animation completes, flip arrow back to down position
  setTimeout(() => {
    if (arrowPath && arrowAccent) {
      arrowPath.setAttribute('d', 'M 0,10 L 43,10 L 43,16 L 47.7,16 L 50,24 L 52.3,16 L 57,16 L 57,10 L 100,10');
      arrowAccent.setAttribute('d', 'M 47.7,17 L 50,25 L 52.3,17');
    }
  }, 600); // Match content collapse duration
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
  // Don't add layout to contact page
  if (window.location.pathname.includes('contact.html')) {
    return;
  }

  const body = document.body;

  // Create and insert header at the beginning
  const header = createHeader();
  body.insertBefore(header, body.firstChild);

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

  // Setup scroll buttons
  document.getElementById('scroll-to-top-logo').addEventListener('click', () => {
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
