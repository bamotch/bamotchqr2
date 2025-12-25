// BAMOTCH QR - Version Finale Corrigée
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // INITIALISATION
    // ============================================
    
    // Mettre à jour l'année
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Configuration
    const config = {
        style: 'square',
        color: '#000000',
        bgColor: '#ffffff',
        size: 400,
        errorLevel: 'M',
        logo: null
    };
    
    // Éléments du DOM
    const contentTabs = document.querySelectorAll('.content-tab');
    const contentForms = document.querySelectorAll('.content-form');
    const textContent = document.getElementById('text-content');
    const textCounter = document.getElementById('text-counter');
    const urlContent = document.getElementById('url-content');
    const wifiSsid = document.getElementById('wifi-ssid');
    const wifiPassword = document.getElementById('wifi-password');
    const wifiSecurity = document.getElementById('wifi-security');
    const contactName = document.getElementById('contact-name');
    const contactPhone = document.getElementById('contact-phone');
    const contactEmail = document.getElementById('contact-email');
    const styleOptions = document.querySelectorAll('.style-option');
    const colorPresets = document.querySelectorAll('.color-preset');
    const qrColorInput = document.getElementById('qr-color');
    const qrBgInput = document.getElementById('qr-bg');
    const qrSizeSlider = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const qrErrorSelect = document.getElementById('qr-error');
    const logoDropzone = document.getElementById('logo-dropzone');
    const logoFileInput = document.getElementById('logo-file');
    const selectLogoBtn = document.getElementById('select-logo');
    const logoPreview = document.getElementById('logo-preview');
    const logoImage = document.getElementById('logo-image');
    const logoName = document.getElementById('logo-name');
    const logoSize = document.getElementById('logo-size');
    const removeLogoBtn = document.getElementById('remove-logo');
    const generateBtn = document.getElementById('generate-btn');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const qrInfo = document.getElementById('qr-info');
    const infoSize = document.getElementById('info-size');
    const infoStyle = document.getElementById('info-style');
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const downloadJpgBtn = document.getElementById('download-jpg');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const filenameInput = document.getElementById('filename-input');
    const themeToggle = document.getElementById('theme-toggle');
    const helpBtn = document.getElementById('help-btn');
    const refreshPreviewBtn = document.getElementById('refresh-preview');
    
    let currentQR = null;
    let downloadSize = 400;
    let generatedCanvas = null;
    
    // ============================================
    // GESTION DU THÈME
    // ============================================
    
    const savedTheme = localStorage.getItem('bamotch-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('bamotch-theme', 'dark');
            this.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('bamotch-theme', 'light');
            this.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // ============================================
    // GESTION DES ONGLETS
    // ============================================
    
    contentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            contentTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            contentForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${type}-form`) form.classList.add('active');
            });
        });
    });
    
    // ============================================
    // COMPTEUR DE CARACTÈRES
    // ============================================
    
    textContent.addEventListener('input', function() {
        const count = this.value.length;
        textCounter.textContent = `${count}/500`;
        textCounter.style.color = count > 450 ? '#e74c3c' : count > 350 ? '#f39c12' : '#95a5a6';
    });
    
    // ============================================
    // GESTION DES STYLES
    // ============================================
    
    styleOptions.forEach(option => {
        option.addEventListener('click', function() {
            styleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            config.style = this.getAttribute('data-style');
            infoStyle.textContent = this.querySelector('span').textContent;
        });
    });
    
    // ============================================
    // GESTION DES COULEURS
    // ============================================
    
    colorPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            colorPresets.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            config.color = this.getAttribute('data-color');
            config.bgColor = this.getAttribute('data-bg');
            qrColorInput.value = config.color;
            qrBgInput.value = config.bgColor;
        });
    });
    
    qrColorInput.addEventListener('input', function() {
        config.color = this.value;
        colorPresets.forEach(p => p.classList.remove('active'));
    });
    
    qrBgInput.addEventListener('input', function() {
        config.bgColor = this.value;
        colorPresets.forEach(p => p.classList.remove('active'));
    });
    
    // ============================================
    // GESTION DES OPTIONS
    // ============================================
    
    qrSizeSlider.addEventListener('input', function() {
        config.size = parseInt(this.value);
        sizeValue.textContent = `${config.size}px`;
    });
    
    qrErrorSelect.addEventListener('change', function() {
        config.errorLevel = this.value;
    });
    
    // Taille de téléchargement
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            downloadSize = parseInt(this.getAttribute('data-size'));
        });
    });
    
    // ============================================
    // GESTION DU LOGO
    // ============================================
    
    selectLogoBtn.addEventListener('click', () => logoFileInput.click());
    logoDropzone.addEventListener('click', () => logoFileInput.click());
    
    logoFileInput.addEventListener('change', function(e) {
        if (!this.files[0]) return;
        
        const file = this.files[0];
        if (file.size > 1024 * 1024) {
            toastr.error('Le logo est trop volumineux (max 1MB)');
            this.value = '';
            return;
        }
        
        if (!file.type.match('image.*')) {
            toastr.error('Veuillez choisir une image valide');
            this.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            config.logo = e.target.result;
            logoImage.src = config.logo;
            logoName.textContent = file.name;
            logoSize.textContent = formatFileSize(file.size);
            logoPreview.style.display = 'flex';
            toastr.success('Logo ajouté');
        };
        reader.readAsDataURL(file);
    });
    
    removeLogoBtn.addEventListener('click', function() {
        config.logo = null;
        logoPreview.style.display = 'none';
        logoFileInput.value = '';
        toastr.info('Logo supprimé');
    });
    
    // ============================================
    // GÉNÉRATION DU QR CODE (CORRIGÉ)
    // ============================================
    
    generateBtn.addEventListener('click', generateQRCode);
    refreshPreviewBtn.addEventListener('click', generateQRCode);
    
    function generateQRCode() {
        // Récupérer le contenu
        let content = '';
        const activeTab = document.querySelector('.content-tab.active');
        const type = activeTab ? activeTab.getAttribute('data-type') : 'text';
        
        switch(type) {
            case 'text':
                content = textContent.value.trim();
                if (!content) {
                    toastr.error('Veuillez entrer du texte');
                    return;
                }
                break;
            case 'url':
                let url = urlContent.value.trim();
                if (!url) {
                    toastr.error('Veuillez entrer une URL');
                    return;
                }
                if (!url.startsWith('http')) url = 'https://' + url;
                content = url;
                break;
            case 'wifi':
                const ssid = wifiSsid.value.trim();
                const password = wifiPassword.value.trim();
                const security = wifiSecurity.value;
                if (!ssid) {
                    toastr.error('Veuillez entrer le nom du réseau');
                    return;
                }
                content = security === 'nopass' 
                    ? `WIFI:S:${ssid};T:nopass;;`
                    : `WIFI:S:${ssid};T:${security};P:${password};;`;
                break;
            case 'contact':
                const name = contactName.value.trim();
                const phone = contactPhone.value.trim();
                const email = contactEmail.value.trim();
                if (!name && !phone && !email) {
                    toastr.error('Veuillez entrer au moins une information');
                    return;
                }
                let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
                if (name) vcard += `FN:${name}\n`;
                if (phone) vcard += `TEL:${phone}\n`;
                if (email) vcard += `EMAIL:${email}\n`;
                vcard += 'END:VCARD';
                content = vcard;
                break;
        }
        
        // Générer le QR code
        generateQR(content);
    }
    
    function generateQR(content) {
        // Effacer l'ancien
        qrcodeDiv.innerHTML = '';
        qrPlaceholder.style.display = 'none';
        qrInfo.style.display = 'block';
        infoSize.textContent = `${config.size}px`;
        
        try {
            // Créer le QR code avec QRCode.js
            currentQR = new QRCode(qrcodeDiv, {
                text: content,
                width: config.size,
                height: config.size,
                colorDark: config.color,
                colorLight: config.bgColor,
                correctLevel: QRCode.CorrectLevel[config.errorLevel]
            });
            
            // Attendre la génération
            setTimeout(() => {
                const canvas = qrcodeDiv.querySelector('canvas');
                if (!canvas) {
                    toastr.error('Erreur de génération');
                    return;
                }
                
                generatedCanvas = canvas;
                
                // Appliquer le style
                applyStyle(canvas);
                
                // Ajouter le logo
                if (config.logo) {
                    addLogo(canvas);
                }
                
                // Activer le téléchargement
                downloadPngBtn.disabled = false;
                downloadSvgBtn.disabled = false;
                downloadJpgBtn.disabled = false;
                
                toastr.success('QR code généré avec succès!');
                
            }, 100);
            
        } catch (error) {
            console.error('Erreur:', error);
            toastr.error('Erreur lors de la génération');
            qrPlaceholder.style.display = 'block';
        }
    }
    
    function applyStyle(canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        // Créer un nouveau canvas pour le style
        const styleCanvas = document.createElement('canvas');
        styleCanvas.width = size;
        styleCanvas.height = size;
        const styleCtx = styleCanvas.getContext('2d');
        
        // Fond
        styleCtx.fillStyle = config.bgColor;
        styleCtx.fillRect(0, 0, size, size);
        
        const moduleSize = Math.max(1, Math.floor(size / 25));
        styleCtx.fillStyle = config.color;
        
        // Parcourir les pixels
        for (let y = 0; y < size; y += moduleSize) {
            for (let x = 0; x < size; x += moduleSize) {
                const pixelIndex = ((y + moduleSize/2) * size + (x + moduleSize/2)) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                
                // Si c'est un module noir
                if (r < 128 && g < 128 && b < 128) {
                    drawModule(styleCtx, x, y, moduleSize);
                }
            }
        }
        
        // Redessiner les yeux (garder carrés pour la scanabilité)
        drawEye(styleCtx, moduleSize * 2, moduleSize * 2, moduleSize * 7);
        drawEye(styleCtx, size - moduleSize * 9, moduleSize * 2, moduleSize * 7);
        drawEye(styleCtx, moduleSize * 2, size - moduleSize * 9, moduleSize * 7);
        
        // Remplacer le canvas original
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(styleCanvas, 0, 0);
    }
    
    function drawModule(ctx, x, y, size) {
        const centerX = x + size/2;
        const centerY = y + size/2;
        const radius = size/2;
        
        switch(config.style) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rounded':
                ctx.beginPath();
                ctx.roundRect(x, y, size, size, size/4);
                ctx.fill();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(centerX, y);
                ctx.lineTo(x + size, centerY);
                ctx.lineTo(centerX, y + size);
                ctx.lineTo(x, centerY);
                ctx.closePath();
                ctx.fill();
                break;
            case 'line':
                ctx.fillRect(x, y + size/3, size, size/3);
                break;
            case 'dot':
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius/2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'heart':
                drawHeart(ctx, centerX, centerY, radius);
                break;
            case 'star':
                drawStar(ctx, centerX, centerY, 5, radius, radius/2);
                break;
            case 'flower':
                drawFlower(ctx, centerX, centerY, radius, 6);
                break;
            case 'hexagon':
                drawHexagon(ctx, centerX, centerY, radius);
                break;
            default: // square
                ctx.fillRect(x, y, size, size);
        }
    }
    
    function drawEye(ctx, x, y, size) {
        // Carré extérieur
        ctx.fillRect(x, y, size, size);
        
        // Carré intérieur (fond)
        ctx.fillStyle = config.bgColor;
        const innerSize = size * 0.6;
        const innerX = x + (size - innerSize) / 2;
        const innerY = y + (size - innerSize) / 2;
        ctx.fillRect(innerX, innerY, innerSize, innerSize);
        
        // Retour à la couleur du QR
        ctx.fillStyle = config.color;
    }
    
    function drawHeart(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(0, 0, -size, 0, -size, topCurveHeight);
        ctx.bezierCurveTo(-size, size, 0, size, 0, topCurveHeight);
        ctx.bezierCurveTo(0, size, size, size, size, topCurveHeight);
        ctx.bezierCurveTo(size, 0, 0, 0, 0, topCurveHeight);
        
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
    
    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            const x = cx + Math.cos(rot) * outerRadius;
            const y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            
            const ix = cx + Math.cos(rot) * innerRadius;
            const iy = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(ix, iy);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
    
    function drawFlower(ctx, cx, cy, radius, petals) {
        ctx.save();
        ctx.translate(cx, cy);
        
        for (let i = 0; i < petals; i++) {
            ctx.rotate((Math.PI * 2) / petals);
            ctx.beginPath();
            ctx.ellipse(radius/2, 0, radius/2, radius/4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    function drawHexagon(ctx, cx, cy, radius) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }
    
    function addLogo(canvas) {
        if (!config.logo) return;
        
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        
        const logoImg = new Image();
        logoImg.onload = function() {
            const logoSize = size / 5;
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;
            
            // Fond pour le logo
            ctx.save();
            ctx.fillStyle = config.bgColor;
            ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
            
            // Logo
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
            ctx.restore();
        };
        logoImg.src = config.logo;
    }
    
    // ============================================
    // TÉLÉCHARGEMENT (CORRIGÉ)
    // ============================================
    
    downloadPngBtn.addEventListener('click', () => downloadQR('png'));
    downloadSvgBtn.addEventListener('click', () => downloadQR('svg'));
    downloadJpgBtn.addEventListener('click', () => downloadQR('jpg'));
    
    function downloadQR(format) {
        if (!generatedCanvas) {
            toastr.error('Veuillez d\'abord générer un QR code');
            return;
        }
        
        const filename = filenameInput.value.trim() || 'bamotch-qr';
        
        switch(format) {
            case 'png':
                downloadImage(generatedCanvas, `${filename}.png`, 'image/png');
                break;
            case 'svg':
                createAndDownloadSVG(filename);
                break;
            case 'jpg':
                const jpgCanvas = createJPGCanvas(generatedCanvas);
                downloadImage(jpgCanvas, `${filename}.jpg`, 'image/jpeg', 0.92);
                break;
        }
        
        toastr.success(`QR code téléchargé en ${format.toUpperCase()}`);
    }
    
    function downloadImage(canvas, filename, mimeType, quality = 1) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL(mimeType, quality);
        link.click();
    }
    
    function createJPGCanvas(originalCanvas) {
        const jpgCanvas = document.createElement('canvas');
        jpgCanvas.width = downloadSize;
        jpgCanvas.height = downloadSize;
        const ctx = jpgCanvas.getContext('2d');
        
        // Fond blanc pour JPG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, downloadSize, downloadSize);
        
        // Redimensionner
        ctx.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height,
                      0, 0, downloadSize, downloadSize);
        
        return jpgCanvas;
    }
    
    function createAndDownloadSVG(filename) {
        const svgContent = generateSVG();
        const blob = new Blob([svgContent], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = `${filename}.svg`;
        link.href = url;
        link.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    
    function generateSVG() {
        const size = downloadSize;
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${config.bgColor}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="${config.color}" text-anchor="middle">
        QR Code SVG - BAMOTCH QR
    </text>
</svg>`;
    }
    
    // ============================================
    // FONCTIONS UTILITAIRES
    // ============================================
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    // ============================================
    // AIDE
    // ============================================
    
    helpBtn.addEventListener('click', function() {
        toastr.info(
            'Pour un QR code scannable:<br>' +
            '• Utilisez un bon contraste<br>' +
            '• Choisissez la correction "M"<br>' +
            '• Testez avec votre téléphone',
            'Conseils',
            {timeOut: 5000}
        );
    });
    
    // ============================================
    // INITIALISATION
    // ============================================
    
    // Exemples par défaut
    setTimeout(() => {
        if (!textContent.value) {
            textContent.value = 'Bienvenue sur BAMOTCH QR ! Ce QR code est 100% scannable.';
            textContent.dispatchEvent(new Event('input'));
        }
        if (!urlContent.value) urlContent.value = 'tahirou-studio.com';
        if (!wifiSsid.value) wifiSsid.value = 'WiFi-Maison';
        if (!contactName.value) contactName.value = 'TAHIROU DESIGN';
        
        // Initialiser le nom du fichier
        filenameInput.value = 'mon-qr-code-bamotch';
    }, 500);
    
    console.log('BAMOTCH QR - Version Finale Chargée');
});
