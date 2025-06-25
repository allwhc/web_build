// Products Management
function renderProducts() {
    const container = document.getElementById('productsList');
    if (!container) return;
    
    container.innerHTML = '';

    if (!window.config.products || window.config.products.length === 0) {
        container.innerHTML = '<p class="empty-message">No products added yet. Click "Add New Product" to get started.</p>';
        return;
    }

    window.config.products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.innerHTML = `
            <div class="product-preview">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA0MEw2MCAzMEw2MCA1MEw0MCA0MFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+'">
                <div class="product-info">
                    <h5>${product.name}</h5>
                    <p>${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
                    <ul class="features-list">
                        ${product.features.slice(0, 3).map(feature => `<li>${feature}</li>`).join('')}
                        ${product.features.length > 3 ? `<li>+${product.features.length - 3} more features</li>` : ''}
                    </ul>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="editProduct(${index})">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${index})">🗑️ Delete</button>
                </div>
            </div>
        `;
        container.appendChild(productDiv);
    });
}

function addProduct() {
    const newProduct = {
        id: Date.now(),
        name: "New Product",
        description: "Product description here...",
        image: "https://via.placeholder.com/300x200?text=Product+Image",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        videoId: "5lW5eZO1MhE"
    };
    
    if (!window.config.products) {
        window.config.products = [];
    }
    
    window.config.products.push(newProduct);
    renderProducts();
    saveConfiguration();
    editProduct(window.config.products.length - 1);
}

function editProduct(index) {
    const product = window.config.products[index];
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    
    modalTitle.textContent = 'Edit Product';
    
    modalBody.innerHTML = `
        <div class="form-group">
            <label>Product Name</label>
            <input type="text" id="editProductName" value="${escapeHtml(product.name)}">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="editProductDescription">${escapeHtml(product.description)}</textarea>
        </div>
        <div class="form-group">
            <label>Image URL</label>
            <input type="url" id="editProductImage" value="${escapeHtml(product.image)}">
        </div>
        <div class="form-group">
            <label>YouTube Video ID</label>
            <input type="text" id="editProductVideo" value="${escapeHtml(product.videoId)}" placeholder="e.g., 5lW5eZO1MhE">
        </div>
        <div class="form-group">
            <label>Features (one per line)</label>
            <textarea id="editProductFeatures" rows="6">${product.features.join('\n')}</textarea>
        </div>
        <div class="btn-group">
            <button class="btn btn-success" onclick="saveProduct(${index})">💾 Save Product</button>
            <button class="btn btn-secondary" onclick="closeModal()">❌ Cancel</button>
        </div>
    `;
    
    document.getElementById('editModal').classList.add('active');
}

function saveProduct(index) {
    const product = window.config.products[index];
    
    const nameField = document.getElementById('editProductName');
    const descField = document.getElementById('editProductDescription');
    const imageField = document.getElementById('editProductImage');
    const videoField = document.getElementById('editProductVideo');
    const featuresField = document.getElementById('editProductFeatures');
    
    if (!nameField || !descField || !imageField || !videoField || !featuresField) {
        showStatus('Error: Missing form fields', 'error');
        return;
    }
    
    product.name = nameField.value;
    product.description = descField.value;
    product.image = imageField.value;
    product.videoId = videoField.value;
    product.features = featuresField.value
        .split('\n')
        .filter(feature => feature.trim())
        .map(feature => feature.trim());
    
    renderProducts();
    saveConfiguration();
    closeModal();
    showStatus('Product saved successfully!', 'success');
}

function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        window.config.products.splice(index, 1);
        renderProducts();
        saveConfiguration();
        showStatus('Product deleted successfully!', 'success');
    }
}

// HTML escape utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}