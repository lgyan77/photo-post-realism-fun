// ===========================
// CONTACT FORM - Enhanced Version from base44
// ===========================

let formState = {
  formData: {
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '' // honeypot field for spam prevention
  },
  errors: {},
  isSubmitting: false,
  isSuccess: false,
  submitError: ''
};

// Email validation
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Field validation
function validateField(fieldName, value) {
  let error = '';
  const trimmedValue = value.trim();

  switch (fieldName) {
    case 'name':
      if (!trimmedValue) {
        error = 'Name is required';
      } else if (trimmedValue.length < 2) {
        error = 'Name must be at least 2 characters';
      } else if (trimmedValue.length > 100) {
        error = 'Name must not exceed 100 characters';
      }
      break;
    case 'email':
      if (!trimmedValue) {
        error = 'Email is required';
      } else if (!validateEmail(trimmedValue)) {
        error = 'Please enter a valid email address';
      } else if (trimmedValue.length > 255) {
        error = 'Email must not exceed 255 characters';
      }
      break;
    case 'subject':
      if (!trimmedValue) {
        error = 'Subject is required';
      } else if (trimmedValue.length > 150) {
        error = 'Subject must not exceed 150 characters';
      }
      break;
    case 'message':
      if (!trimmedValue) {
        error = 'Message is required';
      } else if (trimmedValue.length < 10) {
        error = 'Message must be at least 10 characters';
      } else if (trimmedValue.length > 256) {
        error = 'Message must not exceed 256 characters';
      }
      break;
  }

  formState.errors[fieldName] = error;
  return error === '';
}

// Validate entire form
function validateForm() {
  const name = formState.formData.name.trim();
  const email = formState.formData.email.trim();
  const subject = formState.formData.subject.trim();
  const message = formState.formData.message.trim();

  const nameValid = validateField('name', name);
  const emailValid = validateField('email', email);
  const subjectValid = validateField('subject', subject);
  const messageValid = validateField('message', message);

  return nameValid && emailValid && subjectValid && messageValid;
}

// Check if form is valid
function isFormValid() {
  return formState.formData.name.trim() && 
         formState.formData.email.trim() && 
         validateEmail(formState.formData.email.trim()) &&
         formState.formData.subject.trim() && 
         formState.formData.message.trim() && 
         formState.formData.message.trim().length >= 10 &&
         formState.formData.message.trim().length <= 256 &&
         !formState.errors.name && 
         !formState.errors.email && 
         !formState.errors.subject && 
         !formState.errors.message;
}

// Show error message for a field
function showFieldError(fieldName, error) {
  const input = document.getElementById(`contact-${fieldName}`);
  if (!input) return;

  // Add error styling
  input.classList.add('border-red-500');
  input.setAttribute('aria-invalid', 'true');

  // Create or update error message
  let errorEl = document.getElementById(`${fieldName}-error`);
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.id = `${fieldName}-error`;
    errorEl.className = 'text-sm text-red-600 mt-1';
    errorEl.setAttribute('role', 'alert');
    input.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = error;
  input.setAttribute('aria-describedby', `${fieldName}-error`);
}

// Clear error message for a field
function clearFieldError(fieldName) {
  const input = document.getElementById(`contact-${fieldName}`);
  if (!input) return;

  input.classList.remove('border-red-500');
  input.setAttribute('aria-invalid', 'false');

  const errorEl = document.getElementById(`${fieldName}-error`);
  if (errorEl) {
    errorEl.remove();
  }
  input.removeAttribute('aria-describedby');
}

// Update character counter
function updateCharacterCounter() {
  const counter = document.getElementById('message-counter');
  if (counter) {
    const length = formState.formData.message.length;
    counter.textContent = `(${length}/256)`;
  }
}

// Update submit button state
function updateSubmitButton() {
  const submitBtn = document.getElementById('submit-button');
  if (!submitBtn) return;

  const isValid = isFormValid();
  submitBtn.disabled = formState.isSubmitting || !isValid;
  
  if (formState.isSubmitting || !isValid) {
    submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

// Show success message
function showSuccessMessage() {
  const container = document.getElementById('contact-form-container');
  if (!container) return;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16 animate-fade-in" role="status" aria-live="polite">
      <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <p class="text-xl text-gray-600">Message sent successfully!</p>
    </div>
  `;

  // Reset form after delay
  setTimeout(() => {
    formState.isSuccess = false;
    formState.formData = {
      name: '',
      email: '',
      subject: '',
      message: '',
      company: ''
    };
    formState.errors = {};
    renderContactForm();
  }, 3000);
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  formState.submitError = '';

  // Honeypot check - if filled, it's likely spam
  if (formState.formData.company.trim() !== '') {
    // Pretend it worked (don't let spammers know)
    formState.isSuccess = true;
    showSuccessMessage();
    return;
  }

  // Validate form
  if (!validateForm()) {
    // Show all errors
    Object.keys(formState.errors).forEach(fieldName => {
      if (formState.errors[fieldName]) {
        showFieldError(fieldName, formState.errors[fieldName]);
      }
    });
    return;
  }

  formState.isSubmitting = true;
  updateSubmitButton();

  const submitBtn = document.getElementById('submit-button');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = 'Sending...';

  try {
    // Make API call
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formState.formData.name.trim(),
        email: formState.formData.email.trim(),
        subject: formState.formData.subject.trim(),
        message: formState.formData.message.trim()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send');
    }

    // Success!
    formState.isSuccess = true;
    showSuccessMessage();

  } catch (err) {
    formState.submitError = 'Something went wrong while sending your message. Please try again later.';
    
    // Show error message
    const errorEl = document.getElementById('submit-error');
    if (errorEl) {
      errorEl.textContent = formState.submitError;
      errorEl.classList.remove('hidden');
    }
    
    console.error('Form submission error:', err);
  } finally {
    formState.isSubmitting = false;
    submitBtn.innerHTML = originalHTML;
    updateSubmitButton();
  }
}

// Handle input change
function handleInputChange(fieldName, value) {
  formState.formData[fieldName] = value;
  
  // Clear error when user starts typing
  if (formState.errors[fieldName]) {
    clearFieldError(fieldName);
    formState.errors[fieldName] = '';
  }

  // Update character counter for message
  if (fieldName === 'message') {
    updateCharacterCounter();
  }

  updateSubmitButton();
}

// Handle input blur (validate on blur)
function handleInputBlur(fieldName, value) {
  if (value.trim()) {
    const isValid = validateField(fieldName, value);
    if (!isValid) {
      showFieldError(fieldName, formState.errors[fieldName]);
    } else {
      clearFieldError(fieldName);
    }
  }
}

// Create contact form
function createContactForm() {
  return `
    <style>
      .honeypot-field {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        opacity: 0;
      }
      .animate-fade-in {
        animation: fadeIn 0.6s ease-in-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>

    <div class="max-w-2xl mx-auto animate-fade-in">
      <h1 class="text-3xl md:text-4xl font-light mb-8">Get in touch</h1>

      <form id="contact-form" class="space-y-6" novalidate>
        <!-- Honeypot field (hidden from users, catches bots) -->
        <div class="honeypot-field" aria-hidden="true">
          <label for="company-field">Company</label>
          <input
            type="text"
            id="company-field"
            name="company"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        <!-- Name field -->
        <div>
          <label for="contact-name" class="block text-sm text-gray-600 mb-2">
            Name *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            minlength="2"
            maxlength="100"
            class="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:border-black transition-colors"
          />
        </div>

        <!-- Email field -->
        <div>
          <label for="contact-email" class="block text-sm text-gray-600 mb-2">
            Email *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            maxlength="255"
            class="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:border-black transition-colors"
          />
        </div>

        <!-- Subject field -->
        <div>
          <label for="contact-subject" class="block text-sm text-gray-600 mb-2">
            Subject *
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="What is this about?"
            required
            maxlength="150"
            class="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:border-black transition-colors"
          />
        </div>

        <!-- Message field -->
        <div>
          <label for="contact-message" class="block text-sm text-gray-600 mb-2">
            Message * <span id="message-counter">(0/256)</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Your message (do not include passwords or sensitive information)"
            required
            minlength="10"
            maxlength="256"
            rows="6"
            class="w-full px-4 py-3 border border-gray-200 text-sm font-light focus:border-black transition-colors resize-none"
          ></textarea>
        </div>

        <!-- Privacy notice -->
        <p class="text-xs text-gray-500 leading-relaxed">
          By submitting this form, you agree that we may store and process your data to respond to your enquiry. 
          Do not include sensitive information such as passwords.
        </p>

        <!-- Submit error -->
        <p id="submit-error" class="text-sm text-red-600 hidden" role="alert"></p>

        <!-- Submit button -->
        <button
          type="submit"
          id="submit-button"
          class="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 text-sm tracking-wide font-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          Send Message
        </button>
      </form>
    </div>
  `;
}

// Render contact form
function renderContactForm() {
  const container = document.getElementById('contact-form-container');
  if (!container) return;

  container.innerHTML = createContactForm();

  // Get form elements
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const companyInput = document.getElementById('company-field');

  // Set initial values
  nameInput.value = formState.formData.name;
  emailInput.value = formState.formData.email;
  subjectInput.value = formState.formData.subject;
  messageInput.value = formState.formData.message;
  companyInput.value = formState.formData.company;

  // Add event listeners
  form.addEventListener('submit', handleFormSubmit);

  nameInput.addEventListener('input', (e) => handleInputChange('name', e.target.value));
  nameInput.addEventListener('blur', (e) => handleInputBlur('name', e.target.value));

  emailInput.addEventListener('input', (e) => handleInputChange('email', e.target.value));
  emailInput.addEventListener('blur', (e) => handleInputBlur('email', e.target.value));

  subjectInput.addEventListener('input', (e) => handleInputChange('subject', e.target.value));
  subjectInput.addEventListener('blur', (e) => handleInputBlur('subject', e.target.value));

  messageInput.addEventListener('input', (e) => handleInputChange('message', e.target.value));
  messageInput.addEventListener('blur', (e) => handleInputBlur('message', e.target.value));

  companyInput.addEventListener('input', (e) => handleInputChange('company', e.target.value));

  // Initialize character counter
  updateCharacterCounter();
  updateSubmitButton();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderContactForm();
});
