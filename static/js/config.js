// Configuration Management
window.config = {
    hero: { title: "", subtitle: "", backgroundColor: "", textColor: "" },
    contact: { phone: "", email: "", companyName: "" },
    sections: { productsTitle: "", productsSubtitle: "", featuresTitle: "", featuresSubtitle: "" },
    products: [],
    features: []
};

// Load configuration from server
async function loadConfiguration() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            window.config = await response.json();
            populateForm();
            renderProducts();
            renderFeatures();
            updateHeroPreview();
        }
    } catch (error) {
        console.error('Failed to load configuration:', error);
        showStatus('Failed to load configuration', 'error');
    }
}

// Populate form with loaded configuration
function populateForm() {
    const fields = [
        'heroTitle', 'heroSubtitle', 'heroBackground', 'heroTextColor',
        'companyName', 'phone', 'email',
        'productsTitle', 'productsSubtitle', 'featuresTitle', 'featuresSubtitle'
    ];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element && window.config) {
            const value = getNestedValue(window.config, fieldId);
            element.value = value || '';
        }
    });
}

// Save configuration to server
async function saveConfiguration() {
    updateConfigFromForm();
    
    try {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(window.config)
        });

        if (response.ok) {
            console.log('Configuration saved successfully');
        }
    } catch (error) {
        console.error('Failed to save configuration:', error);
    }
}

// Update config object from form values
function updateConfigFromForm() {
    const fieldMappings = {
        'heroTitle': 'hero.title',
        'heroSubtitle': 'hero.subtitle',
        'heroBackground': 'hero.backgroundColor',
        'heroTextColor': 'hero.textColor',
        'companyName': 'contact.companyName',
        'phone': 'contact.phone',
        'email': 'contact.email',
        'productsTitle': 'sections.productsTitle',
        'productsSubtitle': 'sections.productsSubtitle',
        'featuresTitle': 'sections.featuresTitle',
        'featuresSubtitle': 'sections.featuresSubtitle'
    };
    
    Object.keys(fieldMappings).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            setNestedValue(window.config, fieldMappings[fieldId], element.value);
        }
    });
}

// Helper functions for nested object access
function getNestedValue(obj, path) {
    const pathMap = {
        'heroTitle': obj.hero?.title,
        'heroSubtitle': obj.hero?.subtitle,
        'heroBackground': obj.hero?.backgroundColor,
        'heroTextColor': obj.hero?.textColor,
        'companyName': obj.contact?.companyName,
        'phone': obj.contact?.phone,
        'email': obj.contact?.email,
        'productsTitle': obj.sections?.productsTitle,
        'productsSubtitle': obj.sections?.productsSubtitle,
        'featuresTitle': obj.sections?.featuresTitle,
        'featuresSubtitle': obj.sections?.featuresSubtitle
    };
    
    return pathMap[path];
}

function setNestedValue(obj, path, value) {
    const paths = path.split('.');
    let current = obj;
    
    for (let i = 0; i < paths.length - 1; i++) {
        if (!current[paths[i]]) {
            current[paths[i]] = {};
        }
        current = current[paths[i]];
    }
    
    current[paths[paths.length - 1]] = value;
}