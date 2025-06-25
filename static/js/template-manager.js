// Template Management System
let templateInfo = {};

// Initialize template management
document.addEventListener('DOMContentLoaded', function() {
    loadTemplateInfo();
    setupTemplateUpload();
});

// Load template information
async function loadTemplateInfo() {
    try {
        const response = await fetch('/api/template-info');
        if (response.ok) {
            templateInfo = await response.json();
            updateTemplateStatus();
            updateTemplateSwitcher();
        }
    } catch (error) {
        console.error('Failed to load template info:', error);
        showStatus('Failed to load template information', 'error');
    }
}

// Update template status display
function updateTemplateStatus() {
    const statusElement = document.getElementById('currentTemplateStatus');
    const statusInfoElement = document.getElementById('templateStatusInfo');
    const activeTemplateDisplay = document.getElementById('activeTemplateDisplay');
    
    if (!templateInfo) return;
    
    let statusText = '';
    let statusClass = '';
    let detailedInfo = '';
    
    if (templateInfo.current_template === 'original') {
        statusText = '📄 Original Template';
        statusClass = 'template-original';
        detailedInfo = `
            <div class="template-info-item">
                <strong>Type:</strong> Original Template (aqua_nex.html)
                <span class="status-badge status-active">Active</span>
            </div>
            <div class="template-info-item">
                <strong>Status:</strong> ${templateInfo.original_exists ? '✅ Available' : '❌ Missing (will be restored from backup)'}
            </div>
            <div class="template-info-item">
                <strong>Backup:</strong> ${templateInfo.backup_exists ? '✅ Available' : '❌ Missing'}
            </div>
        `;
    } else if (templateInfo.current_template === 'user') {
        statusText = '📁 User Template';
        statusClass = 'template-user';
        detailedInfo = `
            <div class="template-info-item">
                <strong>Type:</strong> User Uploaded Template
                <span class="status-badge status-active">Active</span>
            </div>
            <div class="template-info-item">
                <strong>File:</strong> ${templateInfo.user_template_name || 'user_template.html'}
            </div>
            <div class="template-info-item">
                <strong>Uploaded:</strong> ${templateInfo.upload_date ? new Date(templateInfo.upload_date).toLocaleDateString() : 'Unknown'}
            </div>
            <div class="template-info-item">
                <strong>Status:</strong> ${templateInfo.user_template_exists ? '✅ Available' : '❌ Missing'}
            </div>
        `;
    }
    
    if (statusElement) {
        statusElement.textContent = `Current Template: ${statusText}`;
        statusElement.className = `template-status ${statusClass}`;
    }
    
    if (statusInfoElement) {
        statusInfoElement.innerHTML = detailedInfo;
    }
    
    if (activeTemplateDisplay) {
        activeTemplateDisplay.textContent = statusText;
        activeTemplateDisplay.className = statusClass;
    }
}

// Update template switcher buttons
function updateTemplateSwitcher() {
    const useOriginalBtn = document.getElementById('useOriginalBtn');
    const useUserBtn = document.getElementById('useUserBtn');
    
    if (!templateInfo) return;
    
    // Update original template button
    if (useOriginalBtn) {
        useOriginalBtn.disabled = !templateInfo.original_exists && !templateInfo.backup_exists;
        useOriginalBtn.className = templateInfo.current_template === 'original' ? 
            'btn btn-primary' : 'btn btn-secondary';
        
        if (templateInfo.current_template === 'original') {
            useOriginalBtn.innerHTML = '📄 Original Template (Active)';
        } else {
            useOriginalBtn.innerHTML = '📄 Use Original Template';
        }
    }
    
    // Update user template button
    if (useUserBtn) {
        useUserBtn.disabled = !templateInfo.user_template_exists;
        useUserBtn.className = templateInfo.current_template === 'user' ? 
            'btn btn-primary' : 'btn btn-secondary';
        
        if (templateInfo.current_template === 'user') {
            useUserBtn.innerHTML = '📁 User Template (Active)';
        } else if (templateInfo.user_template_exists) {
            useUserBtn.innerHTML = '📁 Use Uploaded Template';
        } else {
            useUserBtn.innerHTML = '📁 No User Template';
        }
    }
}

// Switch template
async function switchTemplate(templateType) {
    try {
        showStatus('Switching template...', 'info');
        
        const response = await fetch('/api/switch-template', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template_type: templateType
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showStatus(`Successfully switched to ${templateType} template!`, 'success');
            await loadTemplateInfo(); // Reload template info
        } else {
            showStatus(result.error || `Failed to switch to ${templateType} template`, 'error');
        }
    } catch (error) {
        console.error('Template switch error:', error);
        showStatus('Network error during template switch', 'error');
    }
}

// Setup template upload functionality
function setupTemplateUpload() {
    const uploadArea = document.querySelector('#template .upload-area');
    const fileInput = document.getElementById('templateFile');
    
    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                fileInput.click();
            }
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', handleTemplateDragOver);
        uploadArea.addEventListener('dragleave', handleTemplateDragLeave);
        uploadArea.addEventListener('drop', handleTemplateDrop);
        
        // File selection
        fileInput.addEventListener('change', handleTemplateUpload);
    }
}

function handleTemplateDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#667eea';
    e.currentTarget.style.background = '#e6f0ff';
    e.currentTarget.classList.add('drag-over');
}

function handleTemplateDragLeave(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#cbd5e0';
    e.currentTarget.style.background = '#f8fafc';
    e.currentTarget.classList.remove('drag-over');
}

function handleTemplateDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#cbd5e0';
    e.currentTarget.style.background = '#f8fafc';
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleTemplateUpload({ target: { files: files } });
    }
}

// Handle template upload
async function handleTemplateUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!validateTemplateFile(file)) return;

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
            showStatus('Template uploaded and activated successfully!', 'success');
            
            // Clear the file input
            event.target.value = '';
            
            // Reload template info
            await loadTemplateInfo();
            
            // Show success message with details
            const uploadStatus = document.getElementById('uploadStatus');
            if (uploadStatus) {
                uploadStatus.innerHTML = `
                    <div class="upload-success">
                        <h5>✅ Upload Successful!</h5>
                        <p><strong>File:</strong> ${result.template_name}</p>
                        <p><strong>Status:</strong> Active (currently being used)</p>
                        <p>You can now generate your website using this template.</p>
                    </div>
                `;
            }
        } else {
            showStatus(result.error || 'Failed to upload template', 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showStatus('Network error during upload', 'error');
    }
}

// Validate template file
function validateTemplateFile(file) {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.html')) {
        showStatus('Please upload only HTML files', 'error');
        return false;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showStatus('File size too large. Maximum 5MB allowed.', 'error');
        return false;
    }

    // Basic HTML content validation
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            
            // Check if it looks like HTML
            if (!content.toLowerCase().includes('<html') || !content.toLowerCase().includes('</html>')) {
                showStatus('File does not appear to be a valid HTML document', 'error');
                resolve(false);
                return;
            }
            
            // Check for basic required elements
            const hasHead = content.toLowerCase().includes('<head');
            const hasBody = content.toLowerCase().includes('<body');
            
            if (!hasHead || !hasBody) {
                showStatus('HTML file should contain <head> and <body> sections', 'error');
                resolve(false);
                return;
            }
            
            resolve(true);
        };
        
        reader.onerror = function() {
            showStatus('Error reading file', 'error');
            resolve(false);
        };
        
        reader.readAsText(file);
    });
}

// Template preview function
async function previewTemplate(templateType) {
    try {
        showStatus('Generating template preview...', 'info');
        
        // Switch to the template temporarily for preview
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...window.config,
                preview_template: templateType
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Open preview in new window
            window.open(`/preview/${result.filename}`, '_blank');
            showStatus('Preview opened in new window', 'success');
        } else {
            showStatus(result.error || 'Failed to generate preview', 'error');
        }
    } catch (error) {
        console.error('Preview error:', error);
        showStatus('Network error during preview', 'error');
    }
}

// Export functions for global access
window.switchTemplate = switchTemplate;
window.previewTemplate = previewTemplate;
window.loadTemplateInfo = loadTemplateInfo;

// Add CSS for template management
const templateCSS = `
.template-status {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    margin-top: 10px;
}

.template-original {
    background: #e6fffa;
    color: #234e52;
    border: 1px solid #81e6d9;
}

.template-user {
    background: #f0f4ff;
    color: #3c366b;
    border: 1px solid #9f7aea;
}

.template-status-card,
.template-switcher,
.upload-section,
.backup-info {
    margin-bottom: 30px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.template-info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
}

.template-info-item:last-child {
    border-bottom: none;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.status-active {
    background: #c6f6d5;
    color: #22543d;
}

.upload-success {
    background: #c6f6d5;
    color: #22543d;
    padding: 20px;
    border-radius: 10px;
    margin-top: 15px;
}

.upload-success h5 {
    margin-bottom: 10px;
    color: #22543d;
}

.upload-area.drag-over {
    border-color: #667eea !important;
    background: #e6f0ff !important;
    transform: scale(1.02);
}

.current-template-info {
    background: #f0f4ff;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.backup-info ul {
    list-style: none;
    padding: 0;
}

.backup-info li {
    padding: 8px 0;
    padding-left: 20px;
    position: relative;
}

.backup-info li:before {
    content: "💡";
    position: absolute;
    left: 0;
}
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = templateCSS;
document.head.appendChild(styleSheet);

console.log('📄 Template Manager loaded successfully');