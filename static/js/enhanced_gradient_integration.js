// Enhanced Gradient Builder Integration for Admin Panel
// Add this to your main.js file or create a new gradient-builder.js file

// Gradient Builder State
let gradientBuilderState = {
    direction: '135deg',
    colorStops: [
        { color: '#0ea5e9', position: 0 },
        { color: '#0284c7', position: 50 },
        { color: '#0369a1', position: 100 }
    ]
};

// Gradient Builder Modal HTML
const gradientBuilderHTML = `
<div class="gradient-builder-modal" id="gradientBuilderModal" style="display: none;">
    <div class="modal-overlay" onclick="closeGradientBuilder()"></div>
    <div class="gradient-modal-content">
        <div class="gradient-modal-header">
            <h3>🎨 Advanced Gradient Builder</h3>
            <button class="close-btn" onclick="closeGradientBuilder()">&times;</button>
        </div>
        <div class="gradient-modal-body">
            <!-- Presets Section -->
            <div class="gradient-presets">
                <h4>🌟 Popular Presets</h4>
                <div class="preset-grid">
                    <div class="preset-item" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)" onclick="applyGradientPreset('linear-gradient(135deg, #667eea 0%, #764ba2 100%)')">
                        <span>Purple Blue</span>
                    </div>
                    <div class="preset-item" style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)" onclick="applyGradientPreset('linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)')">
                        <span>Ocean Blue</span>
                    </div>
                    <div class="preset-item" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" onclick="applyGradientPreset('linear-gradient(135deg, #f093fb 0%, #f5576c 100%)')">
                        <span>Pink Sunset</span>
                    </div>
                    <div class="preset-item" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" onclick="applyGradientPreset('linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)')">
                        <span>Sky Blue</span>
                    </div>
                    <div class="preset-item" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" onclick="applyGradientPreset('linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)')">
                        <span>Fresh Green</span>
                    </div>
                    <div class="preset-item" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)" onclick="applyGradientPreset('linear-gradient(135deg, #fa709a 0%, #fee140 100%)')">
                        <span>Warm Sunset</span>
                    </div>
                </div>
            </div>

            <!-- Controls Section -->
            <div class="gradient-controls-section">
                <div class="gradient-controls-left">
                    <!-- Direction Controls -->
                    <div class="control-group">
                        <label>Direction</label>
                        <div class="direction-buttons">
                            <button class="direction-btn" onclick="setGradientDirection('to top')">↑ Top</button>
                            <button class="direction-btn" onclick="setGradientDirection('to top right')">↗ Top Right</button>
                            <button class="direction-btn" onclick="setGradientDirection('to right')">→ Right</button>
                            <button class="direction-btn" onclick="setGradientDirection('to bottom right')">↘ Bottom Right</button>
                            <button class="direction-btn" onclick="setGradientDirection('to bottom')">↓ Bottom</button>
                            <button class="direction-btn" onclick="setGradientDirection('to bottom left')">↙ Bottom Left</button>
                            <button class="direction-btn" onclick="setGradientDirection('to left')">← Left</button>
                            <button class="direction-btn" onclick="setGradientDirection('to top left')">↖ Top Left</button>
                            <button class="direction-btn active" onclick="setGradientDirection('135deg')">⟲ 135°</button>
                        </div>
                    </div>

                    <!-- Custom Angle -->
                    <div class="control-group">
                        <label>Custom Angle</label>
                        <div class="angle-control">
                            <input type="range" class="angle-slider" id="gradientAngleSlider" min="0" max="360" value="135" oninput="setGradientCustomAngle(this.value)">
                            <div class="angle-display" id="gradientAngleDisplay">135°</div>
                        </div>
                    </div>

                    <!-- Color Stops -->
                    <div class="control-group">
                        <label>Color Stops</label>
                        <div class="color-stops" id="gradientColorStops">
                            <!-- Color stops will be dynamically generated -->
                        </div>
                        <button class="add-stop-btn" onclick="addGradientColorStop()">➕ Add Color Stop</button>
                    </div>
                </div>

                <div class="gradient-controls-right">
                    <!-- Live Preview -->
                    <div class="gradient-preview-section">
                        <label>Live Preview</label>
                        <div class="gradient-preview-area" id="gradientLivePreview">
                            <div class="gradient-preview-overlay">
                                <h3>💧 Water Tank</h3>
                                <p>Smart Automation</p>
                            </div>
                        </div>
                        
                        <!-- CSS Output -->
                        <div class="gradient-css-output">
                            <label>Generated CSS</label>
                            <div class="css-code-block" id="gradientCssOutput">
                                <code id="gradientCssCode">background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%);</code>
                                <button class="copy-css-btn" onclick="copyGradientCSS()">📋</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="gradient-actions">
                <button class="btn btn-primary" onclick="applyGradientToHero()">🚀 Apply to Hero</button>
                <button class="btn btn-secondary" onclick="resetGradientBuilder()">🔄 Reset</button>
                <button class="btn btn-success" onclick="saveCurrentGradient()">💾 Save</button>
            </div>
        </div>
    </div>
</div>
`;

// Gradient Builder CSS
const gradientBuilderCSS = `
/* Gradient Builder Modal Styles */
.gradient-builder-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.gradient-modal-content {
    background: white;
    border-radius: 20px;
    width: 95%;
    max-width: 1200px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.gradient-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    border-bottom: 1px solid #e2e8f0;
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 20px 20px 0 0;
}

.gradient-modal-header h3 {
    margin: 0;
    color: #2d3748;
    font-size: 1.5rem;
}

.gradient-modal-body {
    padding: 30px;
}

.gradient-presets {
    margin-bottom: 30px;
}

.gradient-presets h4 {
    margin-bottom: 15px;
    color: #2d3748;
}

.preset-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.preset-item {
    height: 60px;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
}

.preset-item span {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
}

.preset-item:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.gradient-controls-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
}

.gradient-controls-left,
.gradient-controls-right {
    background: #f8fafc;
    border-radius: 15px;
    padding: 25px;
    border: 1px solid #e2e8f0;
}

.control-group {
    margin-bottom: 25px;
}

.control-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    color: #374151;
}

.direction-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 15px;
}

.direction-btn {
    padding: 8px 6px;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 11px;
    text-align: center;
    transition: all 0.3s;
    white-space: nowrap;
}

.direction-btn.active {
    border-color: #667eea;
    background: #f0f4ff;
    color: #667eea;
}

.direction-btn:hover {
    border-color: #667eea;
}

.angle-control {
    display: flex;
    align-items: center;
    gap: 15px;
}

.angle-slider {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: #e2e8f0;
    outline: none;
    -webkit-appearance: none;
}

.angle-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.angle-display {
    min-width: 50px;
    padding: 6px 12px;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
}

.color-stops {
    margin-bottom: 15px;
}

.gradient-color-stop {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding: 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.gradient-color-picker {
    width: 40px;
    height: 35px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid #e2e8f0;
}

.gradient-position-slider {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: #e2e8f0;
    outline: none;
    -webkit-appearance: none;
}

.gradient-position-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #48bb78;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.gradient-position-display {
    min-width: 40px;
    padding: 4px 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
}

.gradient-remove-stop {
    background: #fed7d7;
    color: #c53030;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
}

.add-stop-btn {
    width: 100%;
    padding: 10px;
    background: #48bb78;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
}

.add-stop-btn:hover {
    background: #38a169;
    transform: translateY(-1px);
}

.gradient-preview-section label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    color: #374151;
}

.gradient-preview-area {
    height: 150px;
    border-radius: 12px;
    margin-bottom: 20px;
    border: 3px solid #e2e8f0;
    position: relative;
    overflow: hidden;
}

.gradient-preview-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.9);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    backdrop-filter: blur(10px);
}

.gradient-preview-overlay h3 {
    color: #2d3748;
    margin-bottom: 5px;
    font-size: 1.1rem;
}

.gradient-preview-overlay p {
    color: #4a5568;
    margin: 0;
    font-size: 0.9rem;
}

.gradient-css-output label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #374151;
}

.css-code-block {
    background: #1a202c;
    color: #e2e8f0;
    padding: 15px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    position: relative;
    border: 1px solid #4a5568;
    word-break: break-all;
}

.copy-css-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: #4299e1;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.3s;
}

.copy-css-btn:hover {
    background: #3182ce;
}

.gradient-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .gradient-controls-section {
        grid-template-columns: 1fr;
    }
    
    .direction-buttons {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .gradient-modal-content {
        width: 98%;
        margin: 10px;
    }
    
    .gradient-modal-body {
        padding: 20px;
    }
    
    .preset-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .gradient-actions {
        flex-direction: column;
    }
}
`;

// Initialize Gradient Builder
function initializeGradientBuilder() {
    // Add CSS to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = gradientBuilderCSS;
    document.head.appendChild(styleSheet);
    
    // Add HTML to document
    document.body.insertAdjacentHTML('beforeend', gradientBuilderHTML);
    
    // Initialize gradient builder state
    renderGradientColorStops();
    updateGradientPreview();
}

// Open Gradient Builder
function openGradientBuilder() {
    const modal = document.getElementById('gradientBuilderModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Load current background if exists
        const currentBg = document.getElementById('heroBackground')?.value;
        if (currentBg && currentBg.includes('linear-gradient')) {
            parseGradientFromCSS(currentBg);
        }
        
        renderGradientColorStops();
        updateGradientPreview();
    }
}

// Close Gradient Builder
function closeGradientBuilder() {
    const modal = document.getElementById('gradientBuilderModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Parse existing gradient from CSS
function parseGradientFromCSS(cssGradient) {
    // Simple parser for linear-gradient
    const match = cssGradient.match(/linear-gradient\(([^,]+),\s*(.+)\)/);
    if (match) {
        const direction = match[1].trim();
        const stopsString = match[2];
        
        gradientBuilderState.direction = direction;
        
        // Parse color stops
        const stops = [];
        const stopMatches = stopsString.match(/(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|\w+)\s+(\d+)%/g);
        
        if (stopMatches) {
            stopMatches.forEach(match => {
                const parts = match.trim().split(/\s+/);
                stops.push({
                    color: parts[0],
                    position: parseInt(parts[1])
                });
            });
            gradientBuilderState.colorStops = stops;
        }
        
        // Update UI
        if (direction.includes('deg')) {
            const angle = parseInt(direction);
            const slider = document.getElementById('gradientAngleSlider');
            const display = document.getElementById('gradientAngleDisplay');
            if (slider && display) {
                slider.value = angle;
                display.textContent = angle + '°';
            }
        }
    }
}

// Set gradient direction
function setGradientDirection(direction) {
    gradientBuilderState.direction = direction;
    
    // Update active button
    document.querySelectorAll('.direction-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update angle slider if it's a degree value
    if (direction.includes('deg')) {
        const angle = parseInt(direction);
        const slider = document.getElementById('gradientAngleSlider');
        const display = document.getElementById('gradientAngleDisplay');
        if (slider && display) {
            slider.value = angle;
            display.textContent = angle + '°';
        }
    } else {
        const display = document.getElementById('gradientAngleDisplay');
        if (display) {
            display.textContent = '—';
        }
    }
    
    updateGradientPreview();
}

// Set custom angle
function setGradientCustomAngle(angle) {
    gradientBuilderState.direction = angle + 'deg';
    const display = document.getElementById('gradientAngleDisplay');
    if (display) {
        display.textContent = angle + '°';
    }
    
    // Remove active class from direction buttons
    document.querySelectorAll('.direction-btn').forEach(btn => btn.classList.remove('active'));
    
    updateGradientPreview();
}

// Render color stops
function renderGradientColorStops() {
    const container = document.getElementById('gradientColorStops');
    if (!container) return;
    
    container.innerHTML = '';

    gradientBuilderState.colorStops.forEach((stop, index) => {
        const stopElement = document.createElement('div');
        stopElement.className = 'gradient-color-stop';
        stopElement.innerHTML = `
            <input type="color" class="gradient-color-picker" value="${stop.color}" onchange="updateGradientColorStop(${index}, 'color', this.value)">
            <input type="range" class="gradient-position-slider" min="0" max="100" value="${stop.position}" oninput="updateGradientColorStop(${index}, 'position', this.value)">
            <div class="gradient-position-display">${stop.position}%</div>
            ${gradientBuilderState.colorStops.length > 2 ? `<button class="gradient-remove-stop" onclick="removeGradientColorStop(${index})">×</button>` : ''}
        `;
        container.appendChild(stopElement);
    });
}

// Update color stop
function updateGradientColorStop(index, property, value) {
    if (property === 'position') {
        value = parseInt(value);
    }
    gradientBuilderState.colorStops[index][property] = value;
    
    if (property === 'position') {
        // Update the display
        const positionDisplay = event.target.nextElementSibling;
        if (positionDisplay) {
            positionDisplay.textContent = value + '%';
        }
    }
    
    updateGradientPreview();
}

// Add color stop
function addGradientColorStop() {
    // Find a good position for the new stop
    const positions = gradientBuilderState.colorStops.map(stop => stop.position).sort((a, b) => a - b);
    let bestPosition = 50;
    let largestGap = 0;
    
    for (let i = 0; i < positions.length - 1; i++) {
        const gap = positions[i + 1] - positions[i];
        if (gap > largestGap) {
            largestGap = gap;
            bestPosition = positions[i] + gap / 2;
        }
    }
    
    const newStop = {
        color: '#667eea',
        position: Math.round(bestPosition)
    };
    
    gradientBuilderState.colorStops.push(newStop);
    gradientBuilderState.colorStops.sort((a, b) => a.position - b.position);
    
    renderGradientColorStops();
    updateGradientPreview();
}

// Remove color stop
function removeGradientColorStop(index) {
    if (gradientBuilderState.colorStops.length > 2) {
        gradientBuilderState.colorStops.splice(index, 1);
        renderGradientColorStops();
        updateGradientPreview();
    }
}

// Update preview
function updateGradientPreview() {
    const gradient = generateGradientCSS();
    const preview = document.getElementById('gradientLivePreview');
    const cssOutput = document.getElementById('gradientCssCode');
    
    if (preview) {
        preview.style.background = gradient;
    }
    
    if (cssOutput) {
        cssOutput.textContent = `background: ${gradient};`;
    }
}

// Generate gradient CSS
function generateGradientCSS() {
    const stops = gradientBuilderState.colorStops
        .sort((a, b) => a.position - b.position)
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ');
    
    return `linear-gradient(${gradientBuilderState.direction}, ${stops})`;
}

// Apply preset
function applyGradientPreset(gradient) {
    parseGradientFromCSS(gradient);
    renderGradientColorStops();
    updateGradientPreview();
}

// Copy CSS
function copyGradientCSS() {
    const cssText = document.getElementById('gradientCssCode')?.textContent;
    if (cssText) {
        navigator.clipboard.writeText(cssText).then(() => {
            const btn = document.querySelector('.copy-css-btn');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '✅';
                btn.style.background = '#48bb78';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '#4299e1';
                }, 2000);
            }
        });
    }
}

// Apply to hero
function applyGradientToHero() {
    const gradient = generateGradientCSS();
    const heroBackgroundInput = document.getElementById('heroBackground');
    
    if (heroBackgroundInput) {
        heroBackgroundInput.value = gradient;
        updateHeroPreview();
        saveConfiguration();
    }
    
    closeGradientBuilder();
    showStatus('Gradient applied to hero section!', 'success');
}

// Reset gradient builder
function resetGradientBuilder() {
    gradientBuilderState = {
        direction: '135deg',
        colorStops: [
            { color: '#0ea5e9', position: 0 },
            { color: '#0284c7', position: 50 },
            { color: '#0369a1', position: 100 }
        ]
    };
    
    const slider = document.getElementById('gradientAngleSlider');
    const display = document.getElementById('gradientAngleDisplay');
    
    if (slider) slider.value = 135;
    if (display) display.textContent = '135°';
    
    // Reset active direction button
    document.querySelectorAll('.direction-btn').forEach(btn => btn.classList.remove('active'));
    const defaultBtn = document.querySelector('.direction-btn[onclick*="135deg"]');
    if (defaultBtn) defaultBtn.classList.add('active');
    
    renderGradientColorStops();
    updateGradientPreview();
}

// Save gradient
function saveCurrentGradient() {
    const gradient = generateGradientCSS();
    const name = prompt('Enter a name for this gradient:', 'My Custom Gradient');
    
    if (name) {
        try {
            const savedGradients = JSON.parse(localStorage.getItem('savedGradients') || '[]');
            savedGradients.push({
                name: name,
                css: gradient,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('savedGradients', JSON.stringify(savedGradients));
            showStatus(`Gradient "${name}" saved successfully!`, 'success');
        } catch (error) {
            showStatus('Failed to save gradient', 'error');
        }
    }
}

// Enhanced Hero Background Input
function enhanceHeroBackgroundInput() {
    const heroBackgroundGroup = document.querySelector('#heroBackground').closest('.form-group');
    if (heroBackgroundGroup) {
        // Add gradient builder button
        const gradientBuilderBtn = document.createElement('button');
        gradientBuilderBtn.type = 'button';
        gradientBuilderBtn.className = 'btn btn-secondary';
        gradientBuilderBtn.style.marginTop = '10px';
        gradientBuilderBtn.innerHTML = '🎨 Open Gradient Builder';
        gradientBuilderBtn.onclick = openGradientBuilder;
        
        heroBackgroundGroup.appendChild(gradientBuilderBtn);
        
        // Add helpful examples
        const examples = document.createElement('div');
        examples.style.marginTop = '10px';
        examples.innerHTML = `
            <small style="color: #718096; display: block; margin-bottom: 5px;">
                <strong>Examples:</strong>
            </small>
            <small style="color: #718096; display: block;">
                • Solid color: <code>#0ea5e9</code><br>
                • Simple gradient: <code>linear-gradient(135deg, #0ea5e9, #0284c7)</code><br>
                • Complex gradient: <code>linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)</code>
            </small>
        `;
        
        heroBackgroundGroup.appendChild(examples);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gradient builder after a short delay to ensure other components are loaded
    setTimeout(() => {
        initializeGradientBuilder();
        enhanceHeroBackgroundInput();
    }, 500);
});

// Export functions for global access
window.openGradientBuilder = openGradientBuilder;
window.closeGradientBuilder = closeGradientBuilder;
window.setGradientDirection = setGradientDirection;
window.setGradientCustomAngle = setGradientCustomAngle;
window.updateGradientColorStop = updateGradientColorStop;
window.addGradientColorStop = addGradientColorStop;
window.removeGradientColorStop = removeGradientColorStop;
window.applyGradientPreset = applyGradientPreset;
window.copyGradientCSS = copyGradientCSS;
window.applyGradientToHero = applyGradientToHero;
window.resetGradientBuilder = resetGradientBuilder;
window.saveCurrentGradient = saveCurrentGradient;

// Keyboard shortcuts for gradient builder
document.addEventListener('keydown', function(e) {
    const gradientModal = document.getElementById('gradientBuilderModal');
    if (gradientModal && gradientModal.style.display === 'flex') {
        if (e.key === 'Escape') {
            closeGradientBuilder();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            applyGradientToHero();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            resetGradientBuilder();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentGradient();
        }
    }
});

console.log('🎨 Enhanced Gradient Builder loaded successfully!');