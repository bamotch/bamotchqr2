// ===== CONFIGURATION =====
const CONFIG = {
    currentTab: 'url',
    currentDesign: 'square',
    currentShape: 'square',
    currentColor: '#2c3e50',
    qrSize: 400,
    logo: null,
    qrCode: null,
    qrData: 'https://bamotch.github.io/bamotchqr2'
};

// ===== COLOR PALETTE =====
const COLOR_PALETTE = [
    { name: 'Noir', value: '#000000' },
    { name: 'Bleu foncé', value: '#2c3e50' },
    { name: 'Bleu', value: '#3498db' },
    { name: 'Vert', value: '#27ae60' },
    { name: 'Rouge', value: '#e74c3c' },
    { name: 'Orange', value: '#e67e22' },
    { name: 'Violet', value: '#9b59b6' },
    { name: 'Rose', value: '#e84393' },
    { name: 'Jaune', value: '#f1c40f' },
    { name: 'Gris', value: '#95a5a6' },
    { name: 'Gradient 1', value: 'linear-gradient(135deg, #6a11cb, #2575fc)' },
    { name: 'Gradient 2', value: 'linear-gradient(135deg, #ff9a9e, #fad0c4)' }
];

// ===== DOM ELEMENTS =====
const DOM = {
    // Tabs
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Inputs
    urlInput: document.getElementById('url-input'),
    textInput: document.getElementById('text-input'),
    wifiSsid: document.getElementById('wifi-ssid'),
    wifiPassword: document.getElementById('wifi-password'),
    wifiSecurity: document.getElementById('wifi-security'),
    wifiHidden: document.getElementById('wifi-hidden'),
    contactFirstname: document.getElementById('contact-firstname'),
    contactLastname: document.getElementById('contact-lastname'),
    contactPhone: document.getElementById('contact-phone'),
    contactEmail: document.getElementById('contact-email'),
    
    // Controls
    sizeSlider: document.getElementById('size-slider'),
    sizeValue: document.getElementById('size-value'),
    colorGrid: document.getElementById('color-grid'),
    
    // Design & Shape
    designOptions: document.querySelectorAll('.design-option'),
    shapeOptions: document.querySelectorAll('.shape-option'),
    
    // Logo
    logoUpload: document.getElementById('logo-upload'),
    logoInput: document.getElementById('logo-input'),
    logoPreview: document.getElementById('logo-preview'),
    
    // Buttons
    generateBtn: document.getElementById('generate-btn'),
    downloadPng: document.getElementById('download-png'),
    downloadSvg: document.getElementById('download-svg'),
    downloadJpg: document.getElementById('download-jpg'),
    downloadPdf: document.getElementById('download-pdf'),
    
    // Preview
    qrcodeContainer: document.getElementById('qrcode'),
    qrPlaceholder: document.getElementById('qr-placeholder'),
    loader: document.getElementById('loader'),
    
    // Info
    infoType: document.getElementById('info-type'),
    infoSize: document.getElementById('info-size'),
    infoDesign: document.getElementById('info-design'),
    infoShape: document.getElementById('info-shape'),
    infoColor: document.getElementById('info-color'),
    infoLogo: document.getElementById('info-logo')
};

// ===== INITIALIZATION =====
function init() {
    initializeColorOptions();
    setupEventListeners();
    generateQRCode(); // Auto-generate on load
    
    // Add notification system
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };
}

// ===== COLOR OPTIONS INIT =====
function initializeColorOptions() {
    DOM.colorGrid.innerHTML = '';
    
    COLOR_PALETTE.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = `color-option ${index === 1 ? 'active' : ''}`;
        colorOption.dataset.color = color.value;
        colorOption.dataset.name = color.name;
        
        colorOption.innerHTML = `
            <div class="color-preview" style="background: ${color.value}"></div>
            <span>${color.name}</span>
        `;
        
        DOM.colorGrid.appendChild(colorOption);
    });
    
    CONFIG.currentColor = COLOR_PALETTE[1].value;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Tab switching
    DOM.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            switchTab(tab);
        });
    });

    // Design options
    DOM.designOptions.forEach(option => {
        option.addEventListener('click', () => {
            DOM.designOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            CONFIG.currentDesign = option.dataset.design;
            
            if (CONFIG.qrCode) {
                applyDesignToQRCode();
                updateQRInfo();
            }
        });
    });

    // Shape options
    DOM.shapeOptions.forEach(option => {
        option.addEventListener('click', () => {
            DOM.shapeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            CONFIG.currentShape = option.dataset.shape;
            
            if (CONFIG.qrCode) {
                applyDesignToQRCode();
                updateQRInfo();
            }
        });
    });

    // Color options
    DOM.colorGrid.addEventListener('click', (e) => {
        const colorOption = e.target.closest('.color-option');
        if (!colorOption) return;
        
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
        colorOption.classList.add('active');
        CONFIG.currentColor = colorOption.dataset.color;
        
        if (CONFIG.qrCode) {
            applyDesignToQRCode();
            updateQRInfo();
        }
    });

    // Logo upload
    DOM.logoUpload.addEventListener('click', () => DOM.logoInput.click());
    DOM.logoInput.addEventListener('change', handleLogoUpload);

    // Size slider
    DOM.sizeSlider.addEventListener('input', (e) => {
        CONFIG.qrSize = parseInt(e.target.value);
        DOM.sizeValue.textContent = `${CONFIG.qrSize}px`;
        
        if (CONFIG.qrCode) {
            generateQRCode(); // Regenerate with new size
        }
    });

    // Generate button
    DOM.generateBtn.addEventListener('click', generateQRCode);

    // Download buttons
    DOM.downloadPng.addEventListener('click', () => downloadQRCode('png'));
    DOM.downloadSvg.addEventListener('click', () => downloadQRCode('svg'));
    DOM.downloadJpg.addEventListener('click', () => downloadQRCode('jpg'));
    DOM.downloadPdf.addEventListener('click', () => downloadQRCode('pdf'));

    // Input changes
    DOM.urlInput.addEventListener('input', () => {
        if (CONFIG.currentTab === 'url') {
            CONFIG.qrData = DOM.urlInput.value;
        }
    });
}

// ===== TAB MANAGEMENT =====
function switchTab(tabName) {
    CONFIG.currentTab = tabName;
    
    // Update active tab button
    DOM.tabButtons.forEach(button => {
        if (button.dataset.tab === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update active tab content
    DOM.tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Update QR data based on tab
    updateQRDataFromTab();
}

function updateQRDataFromTab() {
    switch (CONFIG.currentTab) {
        case 'url':
            CONFIG.qrData = DOM.urlInput.value || 'https://bamotch.github.io/bamotchqr2';
            break;
        case 'text':
            CONFIG.qrData = DOM.textInput.value || 'BAMOTCH QR - Générateur professionnel';
            break;
        case 'wifi':
            const ssid = DOM.wifiSsid.value || 'MonWiFi';
            const password = DOM.wifiPassword.value || '';
            const security = DOM.wifiSecurity.value;
            const hidden = DOM.wifiHidden.value === 'true';
            
            let wifiString = `WIFI:`;
            wifiString += `S:${escapeWiFiString(ssid)};`;
            wifiString += `T:${security};`;
            if (security !== 'nopass') {
                wifiString += `P:${escapeWiFiString(password)};`;
            }
            if (hidden) {
                wifiString += `H:true;`;
            }
            wifiString += `;`;
            CONFIG.qrData = wifiString;
            break;
        case 'contact':
            const firstName = DOM.contactFirstname.value || 'Jean';
            const lastName = DOM.contactLastname.value || 'Dupont';
            const phone = DOM.contactPhone.value || '';
            const email = DOM.contactEmail.value || '';
            
            let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
            vCard += `N:${lastName};${firstName};;;\n`;
            vCard += `FN:${firstName} ${lastName}\n`;
            if (phone) vCard += `TEL:${phone}\n`;
            if (email) vCard += `EMAIL:${email}\n`;
            vCard += 'END:VCARD';
            CONFIG.qrData = vCard;
            break;
    }
}

function escapeWiFiString(str) {
    return str.replace(/[\\;,"]/g, '\\$&');
}

// ===== LOGO UPLOAD =====
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('Fichier trop volumineux (max 2MB)', 'error');
        return;
    }

    // Check file type
    if (!file.type.match('image/(png|jpeg|jpg)')) {
        showNotification('Format non supporté (PNG, JPG, JPEG uniquement)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        CONFIG.logo = e.target.result;
        showLogoPreview();
        showNotification('Logo ajouté avec succès', 'success');
        
        if (CONFIG.qrCode) {
            applyDesignToQRCode();
            updateQRInfo();
        }
    };
    
    reader.onerror = function() {
        showNotification('Erreur lors du chargement du logo', 'error');
    };
    
    reader.readAsDataURL(file);
}

function showLogoPreview() {
    DOM.logoPreview.innerHTML = `
        <img src="${CONFIG.logo}" alt="Logo">
        <button class="remove-logo" onclick="removeLogo()">
            <i class="fas fa-times"></i> Supprimer
        </button>
    `;
}

window.removeLogo = function() {
    CONFIG.logo = null;
    DOM.logoPreview.innerHTML = '';
    DOM.logoInput.value = '';
    
    if (CONFIG.qrCode) {
        applyDesignToQRCode();
        updateQRInfo();
    }
    
    showNotification('Logo supprimé', 'info');
};

// ===== QR CODE GENERATION =====
function generateQRCode() {
    updateQRDataFromTab();
    
    if (!CONFIG.qrData || CONFIG.qrData.trim() === '') {
        showNotification('Veuillez entrer des données', 'error');
        return;
    }

    // Show loader
    DOM.loader.style.display = 'block';
    DOM.generateBtn.disabled = true;
    DOM.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération...';

    // Clear previous QR code
    DOM.qrcodeContainer.innerHTML = '';
    
    // Create new QR code
    CONFIG.qrCode = new QRCode(DOM.qrcodeContainer, {
        text: CONFIG.qrData,
        width: CONFIG.qrSize,
        height: CONFIG.qrSize,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    // Wait for QR code to render
    setTimeout(() => {
        applyDesignToQRCode();
        
        // Hide loader and show QR code
        DOM.loader.style.display = 'none';
        DOM.generateBtn.disabled = false;
        DOM.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Générer le QR Code';
        
        DOM.qrcodeContainer.style.display = 'block';
        DOM.qrPlaceholder.style.display = 'none';
        
        // Enable download buttons
        DOM.downloadPng.disabled = false;
        DOM.downloadSvg.disabled = false;
        DOM.downloadJpg.disabled = false;
        DOM.downloadPdf.disabled = false;
        
        // Update info panel
        updateQRInfo();
        
        showNotification('QR code généré avec succès', 'success');
    }, 300);
}

// ===== DESIGN APPLICATION =====
function applyDesignToQRCode() {
    if (!CONFIG.qrCode) return;

    const canvas = DOM.qrcodeContainer.querySelector('canvas');
    if (!canvas) return;

    // Apply color
    applyColorToCanvas(canvas);
    
    // Apply shape
    applyShapeToCanvas(canvas);
    
    // Add logo if exists
    if (CONFIG.logo) {
        addLogoToCanvas(canvas);
    }
}

function applyColorToCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Check if color is gradient
    const isGradient = CONFIG.currentColor.includes('gradient');
    
    if (isGradient) {
        // For gradients, create a gradient canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        // Create gradient
        const gradient = tempCtx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        if (CONFIG.currentColor.includes('#6a11cb')) {
            gradient.addColorStop(0, '#6a11cb');
            gradient.addColorStop(1, '#2575fc');
        } else if (CONFIG.currentColor.includes('#ff9a9e')) {
            gradient.addColorStop(0, '#ff9a9e');
            gradient.addColorStop(1, '#fad0c4');
        }
        
        // Draw gradient background
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Use original QR code as mask
        tempCtx.globalCompositeOperation = 'destination-in';
        tempCtx.drawImage(canvas, 0, 0);
        
        // Copy back to original canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
        
    } else {
        // For solid colors
        const color = hexToRgb(CONFIG.currentColor);
        
        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0) {
                // Black pixel - change to selected color
                data[i] = color.r;
                data[i + 1] = color.g;
                data[i + 2] = color.b;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
}

function applyShapeToCanvas(canvas) {
    if (CONFIG.currentShape === 'square') return;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    tempCtx.save();
    tempCtx.beginPath();
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2;
    
    switch(CONFIG.currentShape) {
        case 'circle':
            tempCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            break;
            
        case 'heart':
            // Heart shape path
            const size = radius * 0.8;
            tempCtx.moveTo(centerX, centerY + size/3);
            tempCtx.bezierCurveTo(
                centerX, centerY + size,
                centerX - size, centerY + size/2,
                centerX - size, centerY - size/3
            );
            tempCtx.bezierCurveTo(
                centerX - size, centerY - size,
                centerX, centerY - size,
                centerX, centerY - size/3
            );
            tempCtx.bezierCurveTo(
                centerX, centerY - size,
                centerX + size, centerY - size,
                centerX + size, centerY - size/3
            );
            tempCtx.bezierCurveTo(
                centerX + size, centerY + size/2,
                centerX, centerY + size,
                centerX, centerY + size/3
            );
            break;
            
        case 'star':
            // Star shape (5 points)
            drawStar(tempCtx, centerX, centerY, 5, radius, radius * 0.5);
            break;
            
        case 'plus':
            // Plus shape
            const plusSize = radius * 0.7;
            tempCtx.moveTo(centerX, centerY - plusSize);
            tempCtx.lineTo(centerX, centerY + plusSize);
            tempCtx.moveTo(centerX - plusSize, centerY);
            tempCtx.lineTo(centerX + plusSize, centerY);
            break;
    }
    
    tempCtx.clip();
    tempCtx.drawImage(canvas, 0, 0);
    tempCtx.restore();
    
    // Copy back to original canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
}

function addLogoToCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const logoSize = canvas.width * 0.2;
    const logoX = (canvas.width - logoSize) / 2;
    const logoY = (canvas.height - logoSize) / 2;
    
    const logoImg = new Image();
    logoImg.onload = function() {
        // Draw white background for logo
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
        
        // Draw logo
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    };
    logoImg.src = CONFIG.logo;
}

// ===== DOWNLOAD FUNCTIONS =====
function downloadQRCode(format) {
    if (!CONFIG.qrCode) return;

    const canvas = DOM.qrcodeContainer.querySelector('canvas');
    if (!canvas) return;

    switch(format) {
        case 'png':
            downloadCanvas(canvas, 'bamotch-qr-code.png', 'image/png');
            break;
            
        case 'jpg':
            downloadCanvas(canvas, 'bamotch-qr-code.jpg', 'image/jpeg', 0.9);
            break;
            
        case 'svg':
            downloadAsSVG(canvas);
            break;
            
        case 'pdf':
            downloadAsPDF(canvas);
            break;
    }
}

function downloadCanvas(canvas, filename, mimeType, quality = 1) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL(mimeType, quality);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`QR code téléchargé (${filename})`, 'success');
}

function downloadAsSVG(canvas) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", canvas.width);
    svg.setAttribute("height", canvas.height);
    svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);
    
    const dataUrl = canvas.toDataURL('image/png');
    const image = document.createElementNS(svgNS, "image");
    image.setAttribute("href", dataUrl);
    image.setAttribute("width", "100%");
    image.setAttribute("height", "100%");
    
    svg.appendChild(image);
    
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "bamotch-qr-code.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('QR code téléchargé (SVG)', 'success');
}

function downloadAsPDF(canvas) {
    // Simple PDF generation using html2canvas
    html2canvas(canvas).then(pdfCanvas => {
        const link = document.createElement('a');
        link.download = 'bamotch-qr-code.pdf';
        link.href = pdfCanvas.toDataURL('image/jpeg');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('QR code téléchargé (PDF)', 'success');
    });
}

// ===== UTILITY FUNCTIONS =====
function updateQRInfo() {
    // Update type
    const typeMap = {
        'url': 'Lien URL',
        'text': 'Texte',
        'wifi': 'WiFi',
        'contact': 'Contact vCard'
    };
    DOM.infoType.textContent = typeMap[CONFIG.currentTab] || 'URL';
    
    // Update size
    DOM.infoSize.textContent = `${CONFIG.qrSize} × ${CONFIG.qrSize}px`;
    
    // Update design
    const activeDesign = document.querySelector('.design-option.active span');
    DOM.infoDesign.textContent = activeDesign ? activeDesign.textContent : 'Carré';
    
    // Update shape
    const activeShape = document.querySelector('.shape-option.active span');
    DOM.infoShape.textContent = activeShape ? activeShape.textContent : 'Carré';
    
    // Update color
    const activeColor = document.querySelector('.color-option.active span');
    DOM.infoColor.textContent = activeColor ? activeColor.textContent : 'Bleu foncé';
    
    // Update logo
    DOM.infoLogo.textContent = CONFIG.logo ? 'Oui' : 'Non';
}

function hexToRgb(hex) {
    if (hex.includes('gradient')) {
        return { r: 0, g: 0, b: 0 };
    }
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', init);

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .notification.success {
        background: #27ae60;
    }
    
    .notification.error {
        background: #e74c3c;
    }
    
    .notification.info {
        background: #3498db;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .remove-logo {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 10px;
        font-weight: 600;
        transition: all 0.3s;
    }
    
    .remove-logo:hover {
        background: #c0392b;
    }
`;
document.head.appendChild(style);
