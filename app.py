#!/usr/bin/env python3
"""
Water Tank Automation Website Admin Panel
Python Flask-based admin system with proper template management
"""

import os
import json
import uuid
import re
import shutil
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_file, redirect, url_for, flash
from werkzeug.utils import secure_filename
import threading
import time

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'mvs-tech-water-tank-admin-2025'

# Configuration
UPLOAD_FOLDER = 'uploads'
TEMPLATES_FOLDER = 'templates'
GENERATED_FOLDER = 'generated'
DATA_FOLDER = 'data'
BACKUP_FOLDER = 'backups'
ALLOWED_EXTENSIONS = {'html'}

# Ensure required directories exist
for folder in [UPLOAD_FOLDER, TEMPLATES_FOLDER, GENERATED_FOLDER, DATA_FOLDER, BACKUP_FOLDER]:
    os.makedirs(folder, exist_ok=True)

# Template file paths
ORIGINAL_TEMPLATE = 'aqua_nex.html'
USER_TEMPLATE = os.path.join(TEMPLATES_FOLDER, 'user_template.html')
CONFIG_FILE = os.path.join(DATA_FOLDER, 'site_config.json')
TEMPLATE_INFO_FILE = os.path.join(DATA_FOLDER, 'template_info.json')

# Default configuration
DEFAULT_CONFIG = {
    "hero": {
        "title": "💧 Smart Water Tank Automation",
        "subtitle": "Intelligent water management solutions for homes and societies with automated monitoring, pump control, and overflow prevention systems.",
        "backgroundColor": "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
        "textColor": "#ffffff"
    },
    "contact": {
        "phone": "+918097412355",
        "email": "info@mvstech.com",
        "companyName": "MVS TECH"
    },
    "sections": {
        "productsTitle": "Water Tank Automation Products",
        "productsSubtitle": "Complete range of smart water management solutions",
        "featuresTitle": "Why Choose Our Water Tank Solutions?",
        "featuresSubtitle": "Advanced features that make water management effortless"
    },
    "products": [
        {
            "id": 1,
            "name": "Basic Water Level Monitor",
            "description": "Essential water level monitoring system with SMS alerts and mobile app connectivity for homes and small societies.",
            "image": "https://cdn-icons-png.flaticon.com/512/10983/10983547.png",
            "features": [
                "Real-time water level monitoring",
                "SMS and app notifications", 
                "Battery backup (24 hours)",
                "Easy installation",
                "WiFi connectivity"
            ],
            "videoId": "5lW5eZO1MhE"
        },
        {
            "id": 2,
            "name": "Smart Pump Controller",
            "description": "Advanced automated pump control system with intelligent scheduling, overflow prevention, and energy optimization features.",
            "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&crop=center",
            "features": [
                "Automatic pump start/stop",
                "Overflow prevention",
                "Dry Run Protection", 
                "Remote control via app",
                "Pump health monitoring"
            ],
            "videoId": "5lW5eZO1MhE"
        },
        {
            "id": 3,
            "name": "Multi-Tank Management System",
            "description": "Comprehensive solution for societies and commercial buildings with multiple tanks, centralized monitoring, and automated distribution.",
            "image": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop&crop=center",
            "features": [
                "Monitor up to 10 tanks",
                "Centralized dashboard",
                "Automated load balancing",
                "Usage analytics",
                "Society management integration"
            ],
            "videoId": "5lW5eZO1MhE"
        }
    ],
    "features": [
        {
            "id": 1,
            "icon": "📱",
            "title": "Mobile App Control",
            "description": "Monitor and control your water tanks from anywhere with our intuitive mobile application."
        },
        {
            "id": 2,
            "icon": "⚡",
            "title": "Energy Efficient",
            "description": "Smart algorithms optimize pump operation to reduce electricity consumption by up to 30%."
        },
        {
            "id": 3,
            "icon": "🔔",
            "title": "Smart Alerts",
            "description": "Receive instant notifications for low water levels, pump failures, and system maintenance."
        },
        {
            "id": 4,
            "icon": "🛡️",
            "title": "Overflow Protection",
            "description": "Advanced sensors prevent water wastage and potential damage from tank overflows."
        },
        {
            "id": 5,
            "icon": "📊",
            "title": "Usage Analytics",
            "description": "Detailed reports on water consumption patterns and system performance metrics."
        },
        {
            "id": 6,
            "icon": "🔧",
            "title": "Easy Installation",
            "description": "Professional installation with minimal disruption to existing plumbing systems."
        }
    ]
}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def backup_original_template():
    """Backup the original template on first run"""
    backup_path = os.path.join(BACKUP_FOLDER, 'original_aqua_nex.html')
    if os.path.exists(ORIGINAL_TEMPLATE) and not os.path.exists(backup_path):
        shutil.copy2(ORIGINAL_TEMPLATE, backup_path)
        print(f"✅ Original template backed up to {backup_path}")

def get_template_info():
    """Get information about current template"""
    if os.path.exists(TEMPLATE_INFO_FILE):
        try:
            with open(TEMPLATE_INFO_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    
    return {
        "current_template": "original",
        "original_name": "aqua_nex.html",
        "user_template_name": None,
        "upload_date": None
    }

def save_template_info(info):
    """Save template information"""
    try:
        with open(TEMPLATE_INFO_FILE, 'w', encoding='utf-8') as f:
            json.dump(info, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving template info: {e}")
        return False

def get_active_template_path():
    """Get the path to the currently active template"""
    template_info = get_template_info()
    
    if template_info["current_template"] == "user" and os.path.exists(USER_TEMPLATE):
        return USER_TEMPLATE
    elif os.path.exists(ORIGINAL_TEMPLATE):
        return ORIGINAL_TEMPLATE
    else:
        # Restore from backup if original is missing
        backup_path = os.path.join(BACKUP_FOLDER, 'original_aqua_nex.html')
        if os.path.exists(backup_path):
            shutil.copy2(backup_path, ORIGINAL_TEMPLATE)
            return ORIGINAL_TEMPLATE
        else:
            return None

def load_config():
    """Load configuration from JSON file"""
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error loading config: {e}")
    
    # Return default config and save it
    save_config(DEFAULT_CONFIG)
    return DEFAULT_CONFIG.copy()

def save_config(config):
    """Save configuration to JSON file"""
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        return True
    except IOError as e:
        print(f"Error saving config: {e}")
        return False

def generate_html(config):
    """Generate HTML file from configuration"""
    try:
        # Get the active template
        template_path = get_active_template_path()
        
        if not template_path:
            template_content = create_basic_template()
        else:
            with open(template_path, 'r', encoding='utf-8') as f:
                template_content = f.read()
        
        # Replace placeholders in template
        html_content = replace_template_content(template_content, config)
        
        # Generate unique filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        template_info = get_template_info()
        template_type = template_info["current_template"]
        filename = f'water_tank_website_{template_type}_{timestamp}.html'
        filepath = os.path.join(GENERATED_FOLDER, filename)
        
        # Save generated file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        return filename, filepath
    except Exception as e:
        print(f"Error generating HTML: {e}")
        return None, None

def replace_template_content(template, config):
    """Replace template content with configuration values"""
    html = template
    
    # Replace hero section
    html = html.replace('💧 Smart Water Tank Automation', config['hero']['title'])
    html = html.replace('Intelligent water management solutions for homes and societies with automated monitoring, pump control, and overflow prevention systems.', config['hero']['subtitle'])
    
    # Replace contact info globally
    html = html.replace('+918097412355', config['contact']['phone'])
    html = html.replace('MVS TECH', config['contact']['companyName'])
    if 'email' in config['contact']:
        html = html.replace('info@mvstech.com', config['contact']['email'])
    
    # Replace section titles
    html = html.replace('Water Tank Automation Products', config['sections']['productsTitle'])
    html = html.replace('Complete range of smart water management solutions', config['sections']['productsSubtitle'])
    html = html.replace('Why Choose Our Water Tank Solutions?', config['sections']['featuresTitle'])
    html = html.replace('Advanced features that make water management effortless', config['sections']['featuresSubtitle'])
    
    # Generate products HTML
    products_html = generate_products_html(config['products'], config['contact']['phone'])
    
    # Replace products section
    products_pattern = r'(<div class="products-grid">)(.*?)(</div>\s*</div>\s*</section>)'
    products_replacement = f'\\1\n                {products_html}\n            </div>\n        </div>\n    </section>'
    html = re.sub(products_pattern, products_replacement, html, flags=re.DOTALL)
    
    # Generate features HTML
    features_html = generate_features_html(config['features'])
    
    # Replace features section
    features_pattern = r'(<div class="features-grid">)(.*?)(</div>\s*</div>\s*</section>)'
    features_replacement = f'\\1\n                {features_html}\n            </div>\n        </div>\n    </section>'
    html = re.sub(features_pattern, features_replacement, html, flags=re.DOTALL)
    
    # Apply hero colors
    if config['hero']['backgroundColor'] != "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)":
        html = html.replace(
            'background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%);',
            f'background: {config["hero"]["backgroundColor"]};'
        )
    
    if config['hero']['textColor'] != "#ffffff":
        # Replace hero text color
        hero_section_pattern = r'(\.hero[^{]*{[^}]*color:\s*)[^;]+(;[^}]*})'
        html = re.sub(hero_section_pattern, f'\\1{config["hero"]["textColor"]}\\2', html)
    
    return html

def generate_products_html(products, phone):
    """Generate HTML for products section"""
    products_html = []
    for product in products:
        features_list = '\n                            '.join([f'<li>✅ {feature}</li>' for feature in product['features']])
        product_html = f'''<div class="product-card">
                    <img src="{product['image']}" alt="{product['name']}" class="product-image">
                    <h3>{product['name']}</h3>
                    <p>{product['description']}</p>
                    
                    <div class="product-features">
                        <h4>🌟 Key Features:</h4>
                        <ul>
                            {features_list}
                        </ul>
                    </div>
                    
                    <div class="video-container">
                        <iframe src="https://www.youtube.com/embed/{product['videoId']}?list=PLripF-PnlNhnlkL-WRz-dWnLQ2a9hK_Nt" allowfullscreen></iframe>
                    </div>
                    
                    <div class="product-actions">
                        <a href="index.html#contact" class="btn btn-primary">Get Quote</a>
                        <a href="tel:{phone}" class="btn btn-outline">Call Now</a>
                    </div>
                </div>'''
        products_html.append(product_html)
    
    return '\n\n                '.join(products_html)

def generate_features_html(features):
    """Generate HTML for features section"""
    features_html = []
    for feature in features:
        feature_html = f'''<div class="feature-card">
                    <div class="feature-icon">{feature['icon']}</div>
                    <h3>{feature['title']}</h3>
                    <p>{feature['description']}</p>
                </div>'''
        features_html.append(feature_html)
    
    return '\n                '.join(features_html)

def create_basic_template():
    """Create a basic template if no template is found"""
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Water Tank Automation - MVS TECH</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; line-height: 1.6; }
        .hero { background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%); color: white; padding: 80px 20px; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 20px; }
        .hero p { font-size: 1.2rem; max-width: 600px; margin: 0 auto; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .products, .features { padding: 60px 0; }
        .products { background: #f8fafc; }
        .section-title { font-size: 2.5rem; text-align: center; margin-bottom: 20px; color: #1e293b; }
        .section-subtitle { text-align: center; color: #64748b; margin-bottom: 50px; }
        .products-grid, .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; }
        .product-card, .feature-card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .product-image { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 20px; }
        .feature-icon { font-size: 3rem; text-align: center; margin-bottom: 20px; }
        .btn { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 10px 5px; }
        .btn-outline { background: transparent; border: 2px solid #2563eb; color: #2563eb; }
        .footer { background: #1e293b; color: white; padding: 40px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="hero">
        <div class="container">
            <h1>💧 Smart Water Tank Automation</h1>
            <p>Intelligent water management solutions for homes and societies with automated monitoring, pump control, and overflow prevention systems.</p>
        </div>
    </div>
    
    <section class="products">
        <div class="container">
            <h2 class="section-title">Water Tank Automation Products</h2>
            <p class="section-subtitle">Complete range of smart water management solutions</p>
            <div class="products-grid"></div>
        </div>
    </section>
    
    <section class="features">
        <div class="container">
            <h2 class="section-title">Why Choose Our Water Tank Solutions?</h2>
            <p class="section-subtitle">Advanced features that make water management effortless</p>
            <div class="features-grid"></div>
        </div>
    </section>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 MVS TECH - Smart Water Tank Automation Solutions</p>
        </div>
    </footer>
</body>
</html>'''

def cleanup_old_files():
    """Clean up old generated files"""
    try:
        now = time.time()
        for filename in os.listdir(GENERATED_FOLDER):
            filepath = os.path.join(GENERATED_FOLDER, filename)
            if os.path.isfile(filepath):
                # Remove files older than 1 hour
                if now - os.path.getctime(filepath) > 3600:
                    os.remove(filepath)
                    print(f"Cleaned up old file: {filename}")
    except Exception as e:
        print(f"Error during cleanup: {e}")

# Flask Routes

@app.route('/')
def index():
    """Main admin page"""
    template_info = get_template_info()
    return render_template('admin.html', template_info=template_info)

@app.route('/api/config')
def get_config():
    """Get current configuration"""
    config = load_config()
    return jsonify(config)

@app.route('/api/template-info')
def get_template_info_api():
    """Get template information"""
    template_info = get_template_info()
    # Add template existence check
    template_info['original_exists'] = os.path.exists(ORIGINAL_TEMPLATE)
    template_info['user_template_exists'] = os.path.exists(USER_TEMPLATE)
    template_info['backup_exists'] = os.path.exists(os.path.join(BACKUP_FOLDER, 'original_aqua_nex.html'))
    return jsonify(template_info)

@app.route('/api/switch-template', methods=['POST'])
def switch_template():
    """Switch between original and user template"""
    try:
        data = request.get_json()
        template_type = data.get('template_type', 'original')
        
        template_info = get_template_info()
        
        if template_type == 'original':
            if not os.path.exists(ORIGINAL_TEMPLATE):
                # Restore from backup
                backup_path = os.path.join(BACKUP_FOLDER, 'original_aqua_nex.html')
                if os.path.exists(backup_path):
                    shutil.copy2(backup_path, ORIGINAL_TEMPLATE)
                else:
                    return jsonify({'error': 'Original template not found and no backup available'}), 404
            
            template_info['current_template'] = 'original'
            
        elif template_type == 'user':
            if not os.path.exists(USER_TEMPLATE):
                return jsonify({'error': 'User template not found. Please upload a template first.'}), 404
            
            template_info['current_template'] = 'user'
        
        if save_template_info(template_info):
            flash(f'Switched to {template_type} template successfully!', 'success')
            return jsonify({'success': True, 'current_template': template_type})
        else:
            return jsonify({'error': 'Failed to save template information'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/config', methods=['POST'])
def save_config_route():
    """Save configuration"""
    try:
        config = request.get_json()
        if save_config(config):
            flash('Configuration saved successfully!', 'success')
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Failed to save configuration'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload-template', methods=['POST'])
def upload_template():
    """Upload new template"""
    if 'template' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['template']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        try:
            filename = secure_filename(file.filename)
            
            # Save the uploaded template
            file.save(USER_TEMPLATE)
            
            # Update template info
            template_info = get_template_info()
            template_info.update({
                'current_template': 'user',
                'user_template_name': filename,
                'upload_date': datetime.now().isoformat()
            })
            save_template_info(template_info)
            
            flash('Template uploaded and activated successfully!', 'success')
            return jsonify({
                'success': True, 
                'message': 'Template uploaded and activated successfully',
                'template_name': filename
            })
        except Exception as e:
            return jsonify({'error': f'Failed to upload template: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Invalid file type. Only HTML files are allowed.'}), 400

@app.route('/api/generate', methods=['POST'])
def generate_website():
    """Generate website HTML"""
    try:
        config = request.get_json()
        
        # Save current config
        save_config(config)
        
        # Generate HTML
        filename, filepath = generate_html(config)
        
        if filename:
            return jsonify({
                'success': True,
                'filename': filename,
                'download_url': f'/download/{filename}'
            })
        else:
            return jsonify({'error': 'Failed to generate website'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<filename>')
def download_file(filename):
    """Download generated file"""
    try:
        filepath = os.path.join(GENERATED_FOLDER, filename)
        if os.path.exists(filepath):
            def remove_file():
                """Remove file after download"""
                time.sleep(30)  # Wait 30 seconds
                try:
                    if os.path.exists(filepath):
                        os.remove(filepath)
                        print(f"Cleaned up downloaded file: {filename}")
                except Exception as e:
                    print(f"Error removing file {filename}: {e}")
            
            # Schedule file removal
            timer = threading.Timer(0, remove_file)
            timer.start()
            
            return send_file(filepath, as_attachment=True, download_name=filename)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reset', methods=['POST'])
def reset_config():
    """Reset configuration to defaults"""
    try:
        if save_config(DEFAULT_CONFIG):
            flash('Configuration reset to defaults!', 'success')
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Failed to reset configuration'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/preview/<filename>')
def preview_file(filename):
    """Preview generated file"""
    try:
        filepath = os.path.join(GENERATED_FOLDER, filename)
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            return content
        else:
            return "Preview not available", 404
    except Exception as e:
        return f"Error loading preview: {str(e)}", 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Page not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🌊 Water Tank Automation Admin Panel")
    print("=" * 50)
    print("🐍 Python Flask Server Starting...")
    print("📱 Open your browser and go to: http://localhost:5000")
    print("📝 Use the admin panel to customize your website")
    print("💾 Generate and download your customized HTML")
    print("🔧 Template management enabled!")
    print("=" * 50)
    
    # Backup original template on first run
    backup_original_template()
    
    # Clean up old files on startup
    cleanup_old_files()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)