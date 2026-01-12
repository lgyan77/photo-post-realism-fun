// ===========================
// ERROR COMPONENTS
// ===========================

// User not registered error
function showUserNotRegisteredError(onRetry, onClose) {
  const errorContent = document.createElement('div');
  errorContent.className = 'text-center';
  
  errorContent.innerHTML = `
    <div class="mb-4">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
      <h3 class="text-xl font-light mb-2">User Not Registered</h3>
      <p class="text-gray-600 text-sm mb-6">
        We couldn't find an account associated with this information. 
        Please check your details and try again.
      </p>
    </div>
  `;
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex gap-3 justify-center';
  
  const retryButton = window.UI.createButton('Try Again', () => {
    onRetry();
    onClose();
  }, { variant: 'primary' });
  
  const closeButton = window.UI.createButton('Close', onClose, { variant: 'outline' });
  
  buttonContainer.appendChild(retryButton);
  buttonContainer.appendChild(closeButton);
  errorContent.appendChild(buttonContainer);
  
  window.UI.showModal('Registration Error', errorContent, onClose);
}

// Generic error message
function showError(message, onClose) {
  const errorContent = document.createElement('div');
  errorContent.className = 'text-center';
  
  errorContent.innerHTML = `
    <div class="mb-4">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      <p class="text-gray-700 text-sm">${message}</p>
    </div>
  `;
  
  const closeButton = window.UI.createButton('Close', onClose, { variant: 'primary' });
  errorContent.appendChild(closeButton);
  
  window.UI.showModal('Error', errorContent, onClose);
}

// Inline error message (for forms)
function createInlineError(message) {
  const error = document.createElement('div');
  error.className = 'error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm mt-2';
  error.textContent = message;
  return error;
}

// Show inline error next to an element
function showInlineError(element, message) {
  // Remove existing error if any
  hideInlineError(element);
  
  const error = createInlineError(message);
  error.dataset.errorFor = element.name || element.id;
  
  // Insert after the element
  element.parentNode.insertBefore(error, element.nextSibling);
  
  // Add error styling to input
  element.classList.add('border-red-500');
}

// Hide inline error
function hideInlineError(element) {
  const errorFor = element.name || element.id;
  const existingError = document.querySelector(`[data-error-for="${errorFor}"]`);
  
  if (existingError) {
    existingError.remove();
  }
  
  element.classList.remove('border-red-500');
}

// Export error functions
window.Errors = {
  showUserNotRegisteredError,
  showError,
  showInlineError,
  hideInlineError
};
