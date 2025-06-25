// UI Components and Utilities

// Add styles for empty messages
const style = document.createElement('style');
style.textContent = `
    .empty-message {
        text-align: center;
        color: #718096;
        padding: 40px;
        font-style: italic;
    }
    
    .offline {
        filter: grayscale(50%);
    }
    
    .offline::before {
        content: "🔌 OFFLINE";
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fed7d7;
        color: #742a2a;
        padding: 10px 15px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1001;
    }
`;
document.head.appendChild(style);

// Smooth scrolling utility
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Form validation visual feedback
function highlightField(fieldId, isValid = true) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = isValid ? '#e2e8f0' : '#f56565';
        field.style.boxShadow = isValid ? 'none' : '0 0 0 3px rgba(245, 101, 101, 0.1)';
    }
}

// Loading indicator
function showLoadingIndicator(message = 'Loading...') {
    const existingLoader = document.getElementById('globalLoader');
    if (existingLoader) {
        existingLoader.remove();
    }
    
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            ">
                <div class="spinner"></div>
                <p style="margin-top: 15px; color: #4a5568;">${message}</p>
            </div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoadingIndicator() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.remove();
    }
}

// Toast notifications
function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const colors = {
        success: { bg: '#c6f6d5', color: '#22543d', border: '#9ae6b4' },
        error: { bg: '#fed7d7', color: '#742a2a', border: '#feb2b2' },
        info: { bg: '#bee3f8', color: '#2c5282', border: '#90cdf4' },
        warning: { bg: '#fefcbf', color: '#744210', border: '#f6e05e' }
    };
    
    const colorScheme = colors[type] || colors.info;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colorScheme.bg};
        color: ${colorScheme.color};
        border: 1px solid ${colorScheme.border};
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        font-weight: 500;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add slide-in animation
    const keyframes = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = keyframes;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto-remove
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    });
}

// Confirmation dialog
function showConfirmDialog(message, onConfirm, onCancel = null) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    `;
    
    dialog.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #1a202c;">Confirm Action</h3>
        <p style="margin-bottom: 30px; color: #4a5568; line-height: 1.5;">${message}</p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="confirmBtn" class="btn btn-danger">Yes, Confirm</button>
            <button id="cancelBtn" class="btn btn-secondary">Cancel</button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    document.getElementById('confirmBtn').addEventListener('click', () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    });
    
    document.getElementById('cancelBtn').addEventListener('click', () => {
        overlay.remove();
        if (onCancel) onCancel();
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    });
}

// Progress bar
function showProgressBar(progress = 0) {
    let progressBar = document.getElementById('globalProgressBar');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'globalProgressBar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            z-index: 9999;
        `;
        
        const bar = document.createElement('div');
        bar.id = 'progressBarFill';
        bar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
            width: 0%;
        `;
        
        progressBar.appendChild(bar);
        document.body.appendChild(progressBar);
    }
    
    const fill = document.getElementById('progressBarFill');
    fill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    
    if (progress >= 100) {
        setTimeout(() => {
            if (progressBar) {
                progressBar.remove();
            }
        }, 500);
    }
}

// Enhanced form field helpers
function addFieldHelper(fieldId, helpText) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const helpElement = document.createElement('small');
    helpElement.style.cssText = `
        display: block;
        margin-top: 5px;
        color: #718096;
        font-size: 12px;
        line-height: 1.4;
    `;
    helpElement.textContent = helpText;
    
    field.parentNode.appendChild(helpElement);
}

// Auto-resize textareas
function initializeAutoResize() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
}

// Character counter for inputs
function addCharacterCounter(fieldId, maxLength) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const counter = document.createElement('div');
    counter.style.cssText = `
        text-align: right;
        font-size: 12px;
        color: #718096;
        margin-top: 5px;
    `;
    
    const updateCounter = () => {
        const current = field.value.length;
        counter.textContent = `${current}/${maxLength}`;
        counter.style.color = current > maxLength ? '#e53e3e' : '#718096';
    };
    
    field.addEventListener('input', updateCounter);
    field.parentNode.appendChild(counter);
    updateCounter();
}

// Copy to clipboard utility
function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMessage, 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text, successMessage);
        });
    } else {
        fallbackCopyToClipboard(text, successMessage);
    }
}

function fallbackCopyToClipboard(text, successMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast(successMessage, 'success');
    } catch (err) {
        showToast('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Image lazy loading
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Save form state to localStorage
function saveFormState() {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (input.id) {
            formData[input.id] = input.value;
        }
    });
    
    try {
        localStorage.setItem('adminFormState', JSON.stringify(formData));
    } catch (e) {
        console.warn('Could not save form state to localStorage');
    }
}

// Restore form state from localStorage
function restoreFormState() {
    try {
        const savedState = localStorage.getItem('adminFormState');
        if (savedState) {
            const formData = JSON.parse(savedState);
            
            Object.keys(formData).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && formData[fieldId]) {
                    field.value = formData[fieldId];
                }
            });
        }
    } catch (e) {
        console.warn('Could not restore form state from localStorage');
    }
}

// Clear saved form state
function clearFormState() {
    try {
        localStorage.removeItem('adminFormState');
    } catch (e) {
        console.warn('Could not clear form state from localStorage');
    }
}

// Initialize UI enhancements on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoResize();
    initializeLazyLoading();
    
    // Add helpful tooltips
    const helpTexts = {
        'heroTitle': 'This will be the main heading on your website homepage',
        'heroSubtitle': 'Descriptive text that appears below the main title',
        'heroBackground': 'Use CSS gradients or solid colors (e.g., #0ea5e9)',
        'heroTextColor': 'Choose a color that contrasts well with your background',
        'companyName': 'Your company name will appear throughout the site',
        'phone': 'This phone number will be used in all call-to-action buttons',
        'email': 'Contact email for your business'
    };
    
    Object.keys(helpTexts).forEach(fieldId => {
        addFieldHelper(fieldId, helpTexts[fieldId]);
    });
    
    // Add character counters for text fields
    addCharacterCounter('heroTitle', 60);
    addCharacterCounter('heroSubtitle', 200);
    addCharacterCounter('companyName', 50);
    
    // Auto-save form state periodically
    setInterval(saveFormState, 30000); // Save every 30 seconds
    
    // Restore form state on page load
    restoreFormState();
    
    // Clear form state on successful save
    const originalSaveConfig = window.saveConfiguration;
    window.saveConfiguration = async function() {
        const result = await originalSaveConfig();
        if (result !== false) {
            clearFormState();
        }
        return result;
    };
});

// Accessibility improvements
function initializeAccessibility() {
    // Add ARIA labels to buttons without text
    document.querySelectorAll('button').forEach(button => {
        if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
            const icon = button.textContent || button.innerHTML;
            if (icon.includes('✏️')) button.setAttribute('aria-label', 'Edit');
            if (icon.includes('🗑️')) button.setAttribute('aria-label', 'Delete');
            if (icon.includes('➕')) button.setAttribute('aria-label', 'Add');
            if (icon.includes('×')) button.setAttribute('aria-label', 'Close');
        }
    });
    
    // Ensure proper focus management for modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('shown', () => {
            const firstInput = modal.querySelector('input, textarea, button');
            if (firstInput) firstInput.focus();
        });
    });
    
    // Add keyboard navigation for tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab, index) => {
        tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
        tab.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const direction = e.key === 'ArrowRight' ? 1 : -1;
                const newIndex = (index + direction + tabs.length) % tabs.length;
                tabs[newIndex].focus();
                tabs[newIndex].click();
            }
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);