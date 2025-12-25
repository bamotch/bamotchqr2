// BAMOTCH QR - Version Ultra Simplifiée et Fonctionnelle
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // INITIALISATION
    // ============================================
    
    // Mettre à jour l'année
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Variables globales
    let currentQR = null;
    let generatedCanvas = null;
    
    // Configuration par défaut
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
    
    let downloadSize = 400;
    
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
            
            // Mettre à jour l'onglet actif
            contentTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Afficher le formulaire correspondant
            contentForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${type}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // ============================================
    // COMPTEUR DE CARACTÈRES
    // ============================================
    
    textContent.addEventListener('input', function() {
        const count = this.value.length;
        textCounter.textContent = `${count}/500`;
        
        if (count > 450) {
            textCounter.style.color = '#e74c3c';
        } else if (count > 350) {
            textCounter.style.color = '#f39c12';
        } else {
            textCounter.style.color = '#95a5a6';
        }
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
    
    selectLogoBtn.addEventListener('click', function() {
        logoFileInput.click();
    });
    
    logoDropzone.addEventListener('click', function() {
        logoFileInput.click();
    });
    
    logoFileInput.addEventListener('change', function(e) {
        if (!this.files[0]) return;
        
        const file = this.files[0];
        
        // Vérifier la taille (max 1MB)
        if (file.size > 1024 * 1024) {
            alert('Le logo est trop volumineux. Maximum 1MB.');
            this.value = '';
            return;
        }
        
        // Vérifier le type
        if (!file.type.match('image.*')) {
            alert('Veuillez choisir une image valide (PNG, JPG, etc.)');
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
        };
        
        reader.readAsDataURL(file);
    });
    
    removeLogoBtn.addEventListener('click', function() {
        config.logo = null;
        logoPreview.style.display = 'none';
        logoFileInput.value = '';
    });
    
    // ============================================
    // GÉNÉRATION DU QR CODE - VERSION SIMPLIFIÉE
    // ============================================
    
    generateBtn.addEventListener('click', generateQRCode);
    refreshPreviewBtn.addEventListener('click', generateQRCode);
    
    function generateQRCode() {
        // Récupérer le contenu selon l'onglet actif
        let content = '';
        const activeTab = document.querySelector('.content-tab.active');
        const type = activeTab ? activeTab.getAttribute('data-type') : 'text';
        
        switch(type) {
            case 'text':
                content = textContent.value.trim();
                if (!content) {
                    alert('Veuillez entrer du texte');
                    return;
                }
                break;
                
            case 'url':
                let url = urlContent.value.trim();
                if (!url) {
                    alert('Veuillez entrer une URL');
                    return;
                }
                // Ajouter https:// si manquant
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                content = url;
                break;
                
            case 'wifi':
                const ssid = wifiSsid.value.trim();
                const password = wifiPassword.value.trim();
                const security = wifiSecurity.value;
                
                if (!ssid) {
                    alert('Veuillez entrer le nom du réseau Wi-Fi');
                    return;
                }
                
                if (security === 'nopass') {
                    content = `WIFI:S:${ssid};T:nopass;;`;
                } else {
                    if (!password) {
                        alert('Veuillez entrer le mot de passe Wi-Fi');
                        return;
                    }
                    content = `WIFI:S:${ssid};T:${security};P:${password};;`;
                }
                break;
                
            case 'contact':
                const name = contactName.value.trim();
                const phone = contactPhone.value.trim();
                const email = contactEmail.value.trim();
                
                if (!name && !phone && !email) {
                    alert('Veuillez entrer au moins une information de contact');
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
        
        // Effacer l'ancien QR code
        qrcodeDiv.innerHTML = '';
        
        // Cacher le placeholder et montrer les infos
        qrPlaceholder.style.display = 'none';
        qrInfo.style.display = 'block';
        infoSize.textContent = `${config.size}px`;
        
        try {
            // Convertir le niveau de correction
            const errorCorrectionLevels = {
                'L': QRCode.CorrectLevel.L,
                'M': QRCode.CorrectLevel.M,
                'Q': QRCode.CorrectLevel.Q,
                'H': QRCode.CorrectLevel.H
            };
            
            const errorLevel = errorCorrectionLevels[config.errorLevel] || QRCode.CorrectLevel.M;
            
            // Créer le QR code avec QRCode.js
            currentQR = new QRCode(qrcodeDiv, {
                text: content,
                width: config.size,
                height: config.size,
                colorDark: config.color,
                colorLight: config.bgColor,
                correctLevel: errorLevel
            });
            
            // Attendre que le QR code soit généré
            setTimeout(() => {
                const canvas = qrcodeDiv.querySelector('canvas');
                if (!canvas) {
                    alert('Erreur lors de la génération du QR code');
                    return;
                }
                
                generatedCanvas = canvas;
                
                // Appliquer les formes personnalisées
                applyCustomShapes(canvas);
                
                // Ajouter le logo si présent
                if (config.logo) {
                    addLogoToQR(canvas);
                }
                
                // Activer les boutons de téléchargement
                downloadPngBtn.disabled = false;
                downloadSvgBtn.disabled = false;
                downloadJpgBtn.disabled = false;
                
                alert('QR code généré avec succès! Il est maintenant scannable.');
                
            }, 100);
            
        } catch (error) {
            console.error('Erreur génération QR:', error);
            alert('Erreur lors de la génération du QR code. Veuillez réessayer.');
            qrPlaceholder.style.display = 'block';
            qrcodeDiv.style.display = 'none';
        }
    }
    
    function applyCustomShapes(canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        
        // Obtenir les données d'image
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        // Créer un nouveau canvas pour le dessin
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copier l'image originale
        tempCtx.putImageData(imageData, 0, 0);
        
        // Effacer le canvas original et mettre le fond
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, size, size);
        
        // Taille des modules (approximative)
        const moduleSize = Math.floor(size / 25);
        
        // Redessiner avec les formes personnalisées
        for (let y = 0; y < size; y += moduleSize) {
            for (let x = 0; x < size; x += moduleSize) {
                // Vérifier si ce pixel fait partie du QR code
                const pixelIndex = ((y + moduleSize/2) * size + (x + moduleSize/2)) * 4;
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];
                
                // Si c'est un module noir (ou presque noir)
                if (r < 100 && g < 100 && b < 100) {
                    ctx.fillStyle = config.color;
                    
                    // Dessiner selon la forme sélectionnée
                    switch(config.style) {
                        case 'circle':
                            ctx.beginPath();
                            ctx.arc(x + moduleSize/2, y + moduleSize/2, moduleSize/2, 0, Math.PI * 2);
                            ctx.fill();
                            break;
                            
                        case 'rounded':
                            ctx.beginPath();
                            ctx.roundRect(x, y, moduleSize, moduleSize, moduleSize/4);
                            ctx.fill();
                            break;
                            
                        case 'diamond':
                            ctx.beginPath();
                            ctx.moveTo(x + moduleSize/2, y);
                            ctx.lineTo(x + moduleSize, y + moduleSize/2);
                            ctx.lineTo(x + moduleSize/2, y + moduleSize);
                            ctx.lineTo(x, y + moduleSize/2);
                            ctx.closePath();
                            ctx.fill();
                            break;
                            
                        case 'line':
                            ctx.fillRect(x, y + moduleSize/3, moduleSize, moduleSize/3);
                            break;
                            
                        case 'dot':
                            ctx.beginPath();
                            ctx.arc(x + moduleSize/2, y + moduleSize/2, moduleSize/3, 0, Math.PI * 2);
                            ctx.fill();
                            break;
                            
                        case 'heart':
                            drawHeart(ctx, x + moduleSize/2, y + moduleSize/2, moduleSize/2);
                            break;
                            
                        case 'star':
                            drawStar(ctx, x + moduleSize/2, y + moduleSize/2, 5, moduleSize/2, moduleSize/4);
                            break;
                            
                        case 'flower':
                            drawFlower(ctx, x + moduleSize/2, y + moduleSize/2, moduleSize/2, 6);
                            break;
                            
                        case 'hexagon':
                            drawHexagon(ctx, x + moduleSize/2, y + moduleSize/2, moduleSize/2);
                            break;
                            
                        default: // square
                            ctx.fillRect(x, y, moduleSize, moduleSize);
                    }
                }
            }
        }
        
        // Redessiner les yeux en carrés (pour la scanabilité)
        drawEye(ctx, moduleSize * 2, moduleSize * 2, moduleSize * 7);
        drawEye(ctx, size - moduleSize * 9, moduleSize * 2, moduleSize * 7);
        drawEye(ctx, moduleSize * 2, size - moduleSize * 9, moduleSize * 7);
    }
    
    function drawEye(ctx, x, y, size) {
        // Carré extérieur
        ctx.fillStyle = config.color;
        ctx.fillRect(x, y, size, size);
        
        // Carré intérieur (fond)
        ctx.fillStyle = config.bgColor;
        const innerSize = size * 0.6;
        const innerX = x + (size - innerSize) / 2;
        const innerY = y + (size - innerSize) / 2;
        ctx.fillRect(innerX, innerY, innerSize, innerSize);
        
        // Petit carré au centre
        ctx.fillStyle = config.color;
        const smallSize = size * 0.2;
        const smallX = x + (size - smallSize) / 2;
        const smallY = y + (size - smallSize) / 2;
        ctx.fillRect(smallX, smallY, smallSize, smallSize);
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
    
    function addLogoToQR(canvas) {
        if (!config.logo) return;
        
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        
        const logoImg = new Image();
        logoImg.onload = function() {
            const logoSize = size / 5;
            const x = (size - logoSize) / 2;
            const y = (size - logoSize) / 2;
            
            // Fond pour le logo
            ctx.fillStyle = config.bgColor;
            ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
            
            // Dessiner le logo
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
        };
        logoImg.src = config.logo;
    }
    
    // ============================================
    // TÉLÉCHARGEMENT
    // ============================================
    
    downloadPngBtn.addEventListener('click', function() {
        downloadQR('png');
    });
    
    downloadSvgBtn.addEventListener('click', function() {
        downloadQR('svg');
    });
    
    downloadJpgBtn.addEventListener('click', function() {
        downloadQR('jpg');
    });
    
    function downloadQR(format) {
        if (!generatedCanvas) {
            alert('Veuillez d\'abord générer un QR code');
            return;
        }
        
        const filename = filenameInput.value.trim() || 'bamotch-qr';
        
        switch(format) {
            case 'png':
                downloadImage(generatedCanvas, `${filename}.png`, 'image/png');
                break;
                
            case 'svg':
                // Pour SVG, créer une version simple
                createAndDownloadSVG(filename);
                break;
                
            case 'jpg':
                // Pour JPG, créer un canvas avec fond blanc
                const jpgCanvas = createJPGCanvas(generatedCanvas);
                downloadImage(jpgCanvas, `${filename}.jpg`, 'image/jpeg', 0.9);
                break;
        }
        
        alert(`QR code téléchargé en ${format.toUpperCase()}!`);
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
        
        // Redimensionner et dessiner le QR code
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
        QR Code BAMOTCH
    </text>
    <text x="50%" y="60%" font-family="Arial" font-size="12" fill="#666" text-anchor="middle">
        Version SVG
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
        alert(
            'Pour des QR codes scannables:\n\n' +
            '1. Utilisez un bon contraste (noir sur blanc)\n' +
            '2. Choisissez la correction d\'erreur "Moyenne"\n' +
            '3. Ne mettez pas le logo trop grand\n' +
            '4. Testez toujours avec votre téléphone\n\n' +
            'Astuce: Les yeux restent carrés pour assurer la scanabilité.'
        );
    });
    
    // ============================================
    // INITIALISATION
    // ============================================
    
    // Remplir avec des exemples par défaut
    setTimeout(() => {
        if (!textContent.value) {
            textContent.value = 'Bienvenue sur BAMOTCH QR ! Testez ce QR code avec votre téléphone.';
            textContent.dispatchEvent(new Event('input'));
        }
        
        if (!urlContent.value) {
            urlContent.value = 'tahirou-design.com';
        }
        
        if (!wifiSsid.value) {
            wifiSsid.value = 'WiFiBamotch';
        }
        
        if (!contactName.value) {
            contactName.value = 'TAHIROU STUDIO';
        }
        
        // Initialiser le nom du fichier
        filenameInput.value = 'mon-qr-code';
        
        // Sélectionner le premier style par défaut
        if (styleOptions.length > 0) {
            styleOptions[0].click();
        }
        
        // Sélectionner la première couleur par défaut
        if (colorPresets.length > 0) {
            colorPresets[0].click();
        }
        
    }, 500);
    
    console.log('BAMOTCH QR - Version Simplifiée Chargée avec Succès');
});
