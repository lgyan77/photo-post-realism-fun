// ===========================
// UI COMPONENTS - Reusable Elements
// ===========================

// Button component
function createButton(text, onClick, options = {}) {
  const {
    variant = 'primary', // primary, secondary, outline
    size = 'medium', // small, medium, large
    disabled = false,
    className = ''
  } = options;
  
  const button = document.createElement('button');
  button.textContent = text;
  button.disabled = disabled;
  
  // Base styles
  let classes = 'transition-all duration-200 font-light tracking-wide ';
  
  // Variant styles
  if (variant === 'primary') {
    classes += 'bg-black text-white hover:bg-gray-800 ';
  } else if (variant === 'secondary') {
    classes += 'bg-gray-200 text-black hover:bg-gray-300 ';
  } else if (variant === 'outline') {
    classes += 'border border-black text-black hover:bg-black hover:text-white ';
  }
  
  // Size styles
  if (size === 'small') {
    classes += 'px-4 py-2 text-xs ';
  } else if (size === 'medium') {
    classes += 'px-6 py-3 text-sm ';
  } else if (size === 'large') {
    classes += 'px-8 py-4 text-base ';
  }
  
  // Disabled styles
  if (disabled) {
    classes += 'opacity-50 cursor-not-allowed ';
  }
  
  button.className = classes + className;
  
  if (onClick && !disabled) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

// Input component
function createInput(options = {}) {
  const {
    type = 'text',
    placeholder = '',
    value = '',
    name = '',
    required = false,
    className = ''
  } = options;
  
  const input = document.createElement('input');
  input.type = type;
  input.placeholder = placeholder;
  input.value = value;
  input.name = name;
  input.required = required;
  input.className = `w-full px-4 py-3 border border-gray-200 text-sm font-light focus:border-black transition-colors ${className}`;
  
  return input;
}

// Textarea component
function createTextarea(options = {}) {
  const {
    placeholder = '',
    value = '',
    name = '',
    required = false,
    rows = 4,
    className = ''
  } = options;
  
  const textarea = document.createElement('textarea');
  textarea.placeholder = placeholder;
  textarea.value = value;
  textarea.name = name;
  textarea.required = required;
  textarea.rows = rows;
  textarea.className = `w-full px-4 py-3 border border-gray-200 text-sm font-light focus:border-black transition-colors resize-none ${className}`;
  
  return textarea;
}

// Card component
function createCard(content, options = {}) {
  const {
    className = '',
    onClick = null
  } = options;
  
  const card = document.createElement('div');
  card.className = `bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300 ${className}`;
  
  if (typeof content === 'string') {
    card.innerHTML = content;
  } else {
    card.appendChild(content);
  }
  
  if (onClick) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', onClick);
  }
  
  return card;
}

// Loading spinner component
function createSpinner(size = 'medium') {
  const spinner = document.createElement('div');
  
  let sizeClass = 'w-5 h-5';
  if (size === 'small') sizeClass = 'w-4 h-4';
  if (size === 'large') sizeClass = 'w-8 h-8';
  
  spinner.className = `spinner ${sizeClass}`;
  
  return spinner;
}

// Modal component
function createModal(title, content, onClose) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
  modal.id = 'modal';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'bg-white max-w-lg w-full mx-4 rounded-lg overflow-hidden';
  
  modalContent.innerHTML = `
    <div class="flex justify-between items-center p-6 border-b border-gray-100">
      <h2 class="text-xl font-light">${title}</h2>
      <button id="modal-close" class="text-2xl hover:text-gray-600">×</button>
    </div>
    <div class="p-6">
      ${typeof content === 'string' ? content : ''}
    </div>
  `;
  
  if (typeof content !== 'string') {
    modalContent.querySelector('.p-6').appendChild(content);
  }
  
  modal.appendChild(modalContent);
  
  // Close handlers
  modal.querySelector('#modal-close').onclick = onClose;
  modal.onclick = (e) => {
    if (e.target === modal) onClose();
  };
  
  return modal;
}

// Show modal
function showModal(title, content, onClose) {
  const existingModal = document.getElementById('modal');
  if (existingModal) existingModal.remove();
  
  const modal = createModal(title, content, () => {
    modal.remove();
    if (onClose) onClose();
  });
  
  document.body.appendChild(modal);
}

// Toast notification
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  
  let bgColor = 'bg-gray-800';
  if (type === 'success') bgColor = 'bg-green-600';
  if (type === 'error') bgColor = 'bg-red-600';
  if (type === 'warning') bgColor = 'bg-yellow-600';
  
  toast.className = `fixed bottom-8 right-8 ${bgColor} text-white px-6 py-4 rounded shadow-lg z-50 text-sm`;
  toast.textContent = message;
  toast.style.animation = 'slideIn 0.3s ease-out';
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Export UI functions
window.UI = {
  createButton,
  createInput,
  createTextarea,
  createCard,
  createSpinner,
  showModal,
  showToast
};
