// Main JavaScript for Water Tank Admin Panel
// Complete implementation with all functionality

// Global variables
let saveTimeout;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌊 Water Tank Admin Panel Loading...');
    
    // Initialize all components
    initializeTabNavigation();
    initializeFileUpload();
    initializeEventListeners();
    initializeKeyboardShortcuts();
    initializeNetworkStatus();
    initializeTooltips();
    
    // Load configuration
    loadConfiguration();
    
    console.log('✅ Admin Panel Loaded Successfully!');
});

// Tab Navigation System
function initializeTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// File Upload System
function initializeFileUpload() {
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('templateFile');

    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        
        // File selection
        fileInput.addEventListener('change', handleFileUpload);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#667eea';
    e.currentTarget.style.background = '#e6f0ff';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#cbd5e0';
    e.currentTarget.style.background = '#f8fafc';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#cbd5e0';
    e.currentTarget.style.background = '#f8fafc';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload({ target: { files: files } });
    }
}

// Handle file upload
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.html')) {
        showStatus('Please upload only HTML files', 'error');
        return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showStatus('File size too large. Maximum 5MB allowed.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('template', file);

    try {
        showStatus('Uploading template...', 'info');
        
        const response = await fetch('/api/upload-template', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (response.ok) {
            showStatus('Template uploaded successfully!', 'success');
            // Clear the file input
            event.target.value = '';
        } else {
            showStatus(result.error || 'Failed to upload template', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showStatus('Network error during upload', 'error');
    }
}

// Event Listeners Setup
function initializeEventListeners() {
    // Hero section listeners
    const heroInputs = ['heroTitle', 'heroSubtitle', 'heroBackground', 'heroTextColor'];
    
    heroInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateHeroPreview);
        }
    });

    // Color picker listeners
    const bgPicker = document.getElementById('heroBackgroundPicker');
    const textPicker = document.getElementById('heroTextColorPicker');
    
    if (bgPicker) {
        bgPicker.addEventListener('change', function() {
            const bgInput = document.getElementById('heroBackground');
            if (bgInput) {
                bgInput.value = this.value;
                updateHeroPreview();
            }
        });
    }
    
    if (textPicker) {
        textPicker.addEventListener('change', function() {
            const textInput = document.getElementById('heroTextColor');
            if (textInput) {
                textInput.value = this.value;
                updateHeroPreview();
            }
        });
    }

    // Auto-save on input changes
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', debouncedSave);
        input.addEventListener('change', debouncedSave);
    });

    // Modal event listeners
    setupModalListeners();
}

// Modal Setup
function setupModalListeners() {
    const editModal = document.getElementById('editModal');
    const previewModal = document.getElementById('previewModal');
    
    if (editModal) {
        editModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
    
    if (previewModal) {
        previewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePreview();
            }
        });
    }
}

// Hero Preview Update
function updateHeroPreview() {
    const preview = document.getElementById('heroPreview');
    const titleEl = document.getElementById('previewTitle');
    const subtitleEl = document.getElementById('previewSubtitle');
    
    if (!preview || !titleEl || !subtitleEl) return;
    
    const titleInput = document.getElementById('heroTitle');
    const subtitleInput = document.getElementById('heroSubtitle');
    const backgroundInput = document.getElementById('heroBackground');
    const textColorInput = document.getElementById('heroTextColor');
    
    const title = titleInput?.value || '💧 Smart Water Tank Automation';
    const subtitle = subtitleInput?.value || 'Intelligent water management solutions for homes and societies';
    const background = backgroundInput?.value || 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)';
    const textColor = textColorInput?.value || '#ffffff';
    
    titleEl.textContent = title;
    subtitleEl.textContent = subtitle;
    preview.style.background = background;
    preview.style.color = textColor;
}

// Website Preview Function
async function previewWebsite() {
    if (!validateForm()) {
        showStatus('Please fill in all required fields before previewing', 'error');
        return;
    }
    
    await saveConfiguration();
    
    try {
        showStatus('Generating preview...', 'info');
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(window.config)
        });

        const result = await response.json();
        
        if (response.ok) {
            const previewFrame = document.getElementById('previewFrame');
            if (previewFrame) {
                previewFrame.src = `/preview/${result.filename}`;
                document.getElementById('previewModal').classList.add('active');
                showStatus('Preview generated successfully!', 'success');
            }
        } else {
            showStatus(result.error || 'Failed to generate preview', 'error');
        }
    } catch (error) {
        console.error('Preview error:', error);
        showStatus('Network error during preview generation', 'error');
    }
}

// Website Generation Function
async function generateWebsite() {
    if (!validateForm()) {
        showStatus('Please fill in all required fields before generating', 'error');
        return;
    }
    
    const loading = document.getElementById('generateLoading');
    if (loading) {
        loading.classList.add('active');
    }
    
    await saveConfiguration();
    
    try {
        showStatus('Generating website...', 'info');
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(window.config)
        });

        const result = await response.json();
        
        if (response.ok) {
            // Create and trigger download
            const link = document.createElement('a');
            link.href = result.download_url;
            link.download = result.filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showStatus('Website generated and downloaded successfully!', 'success');
        } else {
            showStatus(result.error || 'Failed to generate website', 'error');
        }
    } catch (error) {
        console.error('Generation error:', error);
        showStatus('Network error during website generation', 'error');
    } finally {
        if (loading) {
            loading.classList.remove('active');
        }
    }
}

// Reset to Defaults Function
async function resetToDefaults() {
    const confirmed = confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.');
    
    if (!confirmed) return;
    
    try {
        showStatus('Resetting to defaults...', 'info');
        
        const response = await fetch('/api/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            showStatus('Settings reset successfully!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showStatus('Failed to reset to defaults', 'error');
        }
    } catch (error) {
        console.error('Reset error:', error);
        showStatus('Network error during reset', 'error');
    }
}

// Modal Functions
function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closePreview() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Status Message System
function showStatus(message, type = 'info') {
    // Remove existing status messages
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new status message
    const statusDiv = document.createElement('div');
    statusDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
    statusDiv.textContent = message;
    
    // Find active tab content
    const activeTab = document.querySelector('.tab-content.active');
    const container = activeTab?.querySelector('.card') || activeTab;
    
    if (container) {
        container.insertBefore(statusDiv, container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.remove();
            }
        }, 5000);
    }
}

// Auto-save with Debouncing
function debouncedSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveConfiguration();
    }, 1000); // Save after 1 second of no input
}

// Form Validation
function validateForm() {
    const requiredFields = [
        { id: 'heroTitle', name: 'Hero Title' },
        { id: 'companyName', name: 'Company Name' },
        { id: 'phone', name: 'Phone Number' }
    ];
    
    let isValid = true;
    const missingFields = [];
    
    requiredFields.forEach(({ id, name }) => {
        const field = document.getElementById(id);
        if (field) {
            if (!field.value.trim()) {
                field.style.borderColor = '#f56565';
                field.style.boxShadow = '0 0 0 3px rgba(245, 101, 101, 0.1)';
                isValid = false;
                missingFields.push(name);
            } else {
                field.style.borderColor = '#e2e8f0';
                field.style.boxShadow = 'none';
            }
        }
    });
    
    if (!isValid) {
        showStatus(`Please fill in: ${missingFields.join(', ')}`, 'error');
    }
    
    return isValid;
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveConfiguration();
            showStatus('Configuration saved manually!', 'success');
        }
        
        // Ctrl/Cmd + Enter to generate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            generateWebsite();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeModal();
            closePreview();
        }
        
        // Ctrl/Cmd + P to preview
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            previewWebsite();
        }
    });
}

// Network Status Monitoring
function initializeNetworkStatus() {
    function updateNetworkStatus() {
        if (navigator.onLine) {
            document.body.classList.remove('offline');
        } else {
            document.body.classList.add('offline');
            showStatus('You are currently offline. Changes will be saved when connection is restored.', 'error');
        }
    }

    window.addEventListener('online', () => {
        updateNetworkStatus();
        showStatus('Connection restored!', 'success');
    });
    
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();
}

// Tooltips Initialization
function initializeTooltips() {
    const tooltips = {
        'heroTitle': 'This will be the main heading on your website homepage',
        'heroSubtitle': 'Descriptive text that appears below the main title',
        'heroBackground': 'Use CSS gradients (e.g., linear-gradient) or solid colors (e.g., #0ea5e9)',
        'heroTextColor': 'Choose a color that contrasts well with your background',
        'companyName': 'Your company name will appear in the logo and throughout the site',
        'phone': 'This phone number will be used in all call-to-action buttons',
        'email': 'Contact email for your business',
        'productsTitle': 'Main heading for the products section',
        'productsSubtitle': 'Descriptive text for the products section',
        'featuresTitle': 'Main heading for the features section',
        'featuresSubtitle': 'Descriptive text for the features section'
    };

    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltips[id];
            element.setAttribute('data-tooltip', tooltips[id]);
        }
    });
}

// Global Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showStatus('An unexpected error occurred. Please refresh the page and try again.', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showStatus('A network error occurred. Please check your connection and try again.', 'error');
    e.preventDefault();
});

// Auto-refresh configuration periodically
setInterval(() => {
    if (navigator.onLine) {
        loadConfiguration();
    }
}, 60000); // Refresh every minute

// Save form state before page unload
window.addEventListener('beforeunload', function(e) {
    if (window.config && Object.keys(window.config).length > 0) {
        saveConfiguration();
    }
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance monitoring
function logPerformance() {
    if (performance && performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`🚀 Page loaded in ${loadTime}ms`);
    }
}

// Log performance when page loads
window.addEventListener('load', logPerformance);

// Export functions for global access
window.previewWebsite = previewWebsite;
window.generateWebsite = generateWebsite;
window.resetToDefaults = resetToDefaults;
window.closeModal = closeModal;
window.closePreview = closePreview;
window.showStatus = showStatus;

console.log('📱 Main.js loaded successfully - All functions available globally');