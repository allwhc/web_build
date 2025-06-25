// Features Management
function renderFeatures() {
    const container = document.getElementById('featuresList');
    if (!container) return;
    
    container.innerHTML = '';

    if (!window.config.features || window.config.features.length === 0) {
        container.innerHTML = '<p class="empty-message">No features added yet. Click "Add New Feature" to get started.</p>';
        return;
    }

    window.config.features.forEach((feature, index) => {
        const featureDiv = document.createElement('div');
        featureDiv.className = 'feature-item';
        featureDiv.innerHTML = `
            <div class="feature-preview">
                <div class="feature-icon">${feature.icon}</div>
                <div style="flex: 1;">
                    <h5 style="color: #2d3748; margin-bottom: 5px; font-size: 16px;">${feature.title}</h5>
                    <p style="color: #718096; font-size: 14px;">${feature.description}</p>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="editFeature(${index})">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="deleteFeature(${index})">🗑️ Delete</button>
                </div>
            </div>
        `;
        container.appendChild(featureDiv);
    });
}

function addFeature() {
    const newFeature = {
        id: Date.now(),
        icon: "⭐",
        title: "New Feature",
        description: "Feature description here..."
    };
    
    if (!window.config.features) {
        window.config.features = [];
    }
    
    window.config.features.push(newFeature);
    renderFeatures();
    saveConfiguration();
    editFeature(window.config.features.length - 1);
}

function editFeature(index) {
    const feature = window.config.features[index];
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Edit Feature';
    
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Feature Icon (Emoji)</label>
            <input type="text" id="editFeatureIcon" value="${escapeHtml(feature.icon)}" maxlength="2" placeholder="e.g., 📱">
        </div>
        <div class="form-group">
            <label>Feature Title</label>
            <input type="text" id="editFeatureTitle" value="${escapeHtml(feature.title)}">
        </div>
        <div class="form-group">
            <label>Feature Description</label>
            <textarea id="editFeatureDescription">${escapeHtml(feature.description)}</textarea>
        </div>
        <div class="btn-group">
            <button class="btn btn-success" onclick="saveFeature(${index})">💾 Save Feature</button>
            <button class="btn btn-secondary" onclick="closeModal()">❌ Cancel</button>
        </div>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

function saveFeature(index) {
    const feature = window.config.features[index];
    
    const iconField = document.getElementById('editFeatureIcon');
    const titleField = document.getElementById('editFeatureTitle');
    const descField = document.getElementById('editFeatureDescription');
    
    if (!iconField || !titleField || !descField) {
        showStatus('Error: Missing form fields', 'error');
        return;
    }
    
    feature.icon = iconField.value;
    feature.title = titleField.value;
    feature.description = descField.value;
    
    renderFeatures();
    saveConfiguration();
    closeModal();
    showStatus('Feature saved successfully!', 'success');
}

function deleteFeature(index) {
    if (confirm('Are you sure you want to delete this feature?')) {
        window.config.features.splice(index, 1);
        renderFeatures();
        saveConfiguration();
        showStatus('Feature deleted successfully!', 'success');
    }
}

// HTML escape utility (shared with products.js)
if (typeof escapeHtml === 'undefined') {
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}