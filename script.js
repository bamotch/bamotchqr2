// BAMOTCH QR - Version Fonctionnelle avec QR Codes Lisibles
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // INITIALISATION
    // ============================================
    
    // Mettre à jour l'année
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Variables d'état
    let currentQR = null;
    let currentQRData = null;
    let currentLogo = null;
    let downloadSize = 256;
    
    // Configuration
    const config = {
        style: 'standard',
        color: '#000000',
        bgColor: '#ffffff',
        size: 256,
        errorLevel: 'M',
        hasLogo: false
    };
    
    // ============================================
    // ÉLÉMENTS DU DOM
    // ============================================
    
    // Onglets de contenu
    const contentTabs = document.querySelectorAll('.content-tab');
    const contentForms = document.querySelectorAll('.content-form');
    
    // Champs de formulaire
    const textContent = document.getElementById('text-content');
    const textCounter = document.getElementById('text-counter');
    const urlContent = document.getElementById('url-content');
    const wifiSsid = document.getElementById('wifi-ssid');
    const wifiPassword = document.getElementById('wifi-password');
    const wifiSecurity = document.getElementById('wifi-security');
    const contactName = document.getElementById('contact-name');
    const contactPhone = document.getElementById('contact-phone');
    const contactEmail = document.getElementById('contact-email');
    
    // Options de design
    const styleOptions = document.querySelectorAll('.style-option');
    const colorPresets = document.querySelectorAll('.color-preset');
    const qrColorInput = document.getElementById('qr-color');
    const qrBgInput = document.getElementById('qr-bg');
    
    // Options techniques
    const qrSizeSlider = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const qrErrorSelect = document.getElementById('qr-error');
    
    // Logo
    const logoDropzone = document.getElementById('logo-dropzone');
    const logoFileInput = document.getElementById('logo-file');
    const selectLogoBtn = document.getElementById('select-logo');
    const logoPreview = document.getElementById('logo-preview');
    const logoImage = document.getElementById('logo-image');
    const logoName = document.getElementById('logo-name');
    const logoSize = document.getElementById('logo-size');
    const removeLogoBtn = document.getElementById('remove-logo');
    
    // Génération
    const generateBtn = document.getElementById('generate-btn');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const testQrBtn = document.getElementById('test-qr');
    const testScanBtn = document.getElementById('test-scan');
    
    // Informations
    const qrInfo = document.getElementById('qr-info');
    const infoSize = document.getElementById('info-size');
    const infoError = document.getElementById('info-error');
    const infoStatus = document.getElementById('info-status');
    const qrStatus = document.getElementById('qr-status');
    
    // Téléchargement
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const downloadJpgBtn = document.getElementById('download-jpg');
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    // Thème
    const themeToggle = document.getElementById('theme-toggle');
    
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
            toastr.info('Thème sombre activé');
        } else {
            localStorage.setItem('bamotch-theme', 'light');
            this.innerHTML = '<i class="fas fa-moon"></i>';
            toastr.info('Thème clair activé');
        }
    });
    
    // ============================================
    // COMPTEUR DE CARACTÈRES
    // ============================================
    
    textContent.addEventListener('input', function() {
        const count = this.value.length;
        const max = 500;
        textCounter.textContent = `${count}/${max}`;
        
        if (count > max * 0.9) {
            textCounter.style.color = '#e74c3c';
        } else if (count > max * 0.7) {
            textCounter.style.color = '#f39c12';
        } else {
            textCounter.style.color = '#95a5a6';
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
                if (form.id === `${type}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // ============================================
    // GESTION DU DESIGN
    // ============================================
    
    // Style
    styleOptions.forEach(option => {
        option.addEventListener('click', function() {
            styleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            config.style = this.getAttribute('data-style');
            
            if (currentQRData) {
                generateQRCode();
            }
        });
    });
    
    // Couleurs prédéfinies
    colorPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            colorPresets.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            config.color = this.getAttribute('data-color');
            config.bgColor = this.getAttribute('data-bg');
            
            qrColorInput.value = config.color;
            qrBgInput.value = config.bgColor;
            
            if (currentQRData) {
                generateQRCode();
            }
        });
    });
    
    // Couleurs personnalisées
    qrColorInput.addEventListener('input', function() {
        config.color = this.value;
        colorPresets.forEach(p => p.classList.remove('active'));
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    qrBgInput.addEventListener('input', function() {
        config.bgColor = this.value;
        colorPresets.forEach(p => p.classList.remove('active'));
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    // Taille
    qrSizeSlider.addEventListener('input', function() {
        config.size = parseInt(this.value);
        sizeValue.textContent = `${config.size}px`;
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    // Correction d'erreur
    qrErrorSelect.addEventListener('change', function() {
        config.errorLevel = this.value;
        
        if (currentQRData) {
            generateQRCode();
        }
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
    
    // Drag and drop
    logoDropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#6a11cb';
        this.style.background = 'rgba(106, 17, 203, 0.05)';
    });
    
    logoDropzone.addEventListener('dragleave', function() {
        this.style.borderColor = '';
        this.style.background = '';
    });
    
    logoDropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        this.style.background = '';
        
        if (e.dataTransfer.files.length > 0) {
            handleLogoFile(e.dataTransfer.files[0]);
        }
    });
    
    logoFileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            handleLogoFile(this.files[0]);
        }
    });
    
    function handleLogoFile(file) {
        // Vérifier la taille (max 500KB pour garantir la lisibilité)
        if (file.size > 500 * 1024) {
            toastr.error('Le logo est trop volumineux (max 500KB)');
            logoFileInput.value = '';
            return;
        }
        
        if (!file.type.match('image.*')) {
            toastr.error('Veuillez choisir une image valide');
            logoFileInput.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            currentLogo = e.target.result;
            config.hasLogo = true;
            
            logoImage.src = currentLogo;
            logoName.textContent = file.name.substring(0, 20);
            logoSize.textContent = formatFileSize(file.size);
            logoPreview.style.display = 'flex';
            
            toastr.success('Logo ajouté');
            
            if (currentQRData) {
                generateQRCode();
            }
        };
        
        reader.onerror = function() {
            toastr.error('Erreur lors de la lecture du fichier');
            logoFileInput.value = '';
        };
        
        reader.readAsDataURL(file);
    }
    
    removeLogoBtn.addEventListener('click', function() {
        currentLogo = null;
        config.hasLogo = false;
        logoPreview.style.display = 'none';
        logoFileInput.value = '';
        
        toastr.info('Logo supprimé');
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    // ============================================
    // GÉNÉRATION DU QR CODE
    // ============================================
    
    generateBtn.addEventListener('click', generateQRCode);
    
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
                    toastr.error('Veuillez entrer le nom du réseau Wi-Fi');
                    return;
                }
                
                if (security !== 'nopass' && !password) {
                    toastr.error('Veuillez entrer le mot de passe Wi-Fi');
                    return;
                }
                
                content = `WIFI:S:${ssid};T:${security};P:${password};;`;
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
                
            default:
                toastr.error('Type de contenu non supporté');
                return;
        }
        
        // Sauvegarder les données
        currentQRData = {
            content: content,
            type: type,
            config: { ...config }
        };
        
        // Générer le QR code
        createRealQRCode(content);
    }
    
    function createRealQRCode(content) {
        // Effacer l'ancien QR code
        qrcodeDiv.innerHTML = '';
        
        // Cacher le placeholder et montrer les infos
        qrPlaceholder.style.display = 'none';
        qrInfo.style.display = 'block';
        
        try {
            // Créer un vrai QR code avec QRCode.js
            currentQR = new QRCode(qrcodeDiv, {
                text: content,
                width: config.size,
                height: config.size,
                colorDark: config.color,
                colorLight: config.bgColor,
                correctLevel: QRCode.CorrectLevel[config.errorLevel]
            });
            
            // Attendre que le QR code soit généré
            setTimeout(() => {
                // Appliquer le style
                applyStyleToQR();
                
                // Ajouter le logo si présent
                if (config.hasLogo && currentLogo) {
                    addLogoToQR();
                }
                
                // Mettre à jour les informations
                updateQRInfo(content);
                
                // Activer le téléchargement
                enableDownloadButtons();
                
                // Mettre à jour le statut
                qrStatus.textContent = 'Généré';
                qrStatus.className = 'status-indicator status-success';
                
                toastr.success('QR code généré avec succès!');
                
            }, 100);
            
        } catch (error) {
            console.error('Erreur génération QR:', error);
            toastr.error('Erreur lors de la génération');
            qrPlaceholder.style.display = 'block';
            qrcodeDiv.style.display = 'none';
        }
    }
    
    function applyStyleToQR() {
        const svg = qrcodeDiv.querySelector('svg');
        const canvas = qrcodeDiv.querySelector('canvas');
        
        if (svg) {
            // Pour SVG
            const paths = svg.querySelectorAll('path');
            if (paths.length >= 2) {
                // Premier path est le fond
                paths[0].setAttribute('fill', config.bgColor);
                // Deuxième path est les modules
                paths[1].setAttribute('fill', config.color);
                
                // Appliquer le style
                if (config.style === 'rounded' || config.style === 'dots') {
                    // Pour les styles arrondis, on ajoute une classe
                    paths[1].classList.add(config.style);
                }
            }
        } else if (canvas) {
            // Pour Canvas, on redessine avec le style
            if (config.style === 'dots') {
                applyDotsStyle(canvas);
            } else if (config.style === 'rounded') {
                applyRoundedStyle(canvas);
            }
        }
    }
    
    function applyDotsStyle(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Sauvegarder l'image originale
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);
        
        // Effacer le canvas
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Redessiner en points
        const pixelData = imageData.data;
        const radius = 2;
        
        for (let y = 0; y < canvas.height; y += 6) {
            for (let x = 0; x < canvas.width; x += 6) {
                // Vérifier si ce pixel est noir dans l'original
                const index = (y * canvas.width + x) * 4;
                if (pixelData[index] === 0 && pixelData[index + 1] === 0 && pixelData[index + 2] === 0) {
                    ctx.fillStyle = config.color;
                    ctx.beginPath();
                    ctx.arc(x + 3, y + 3, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
    
    function applyRoundedStyle(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Sauvegarder l'image originale
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);
        
        // Effacer le canvas
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Redessiner avec coins arrondis
        const pixelData = imageData.data;
        const radius = 3;
        
        for (let y = 0; y < canvas.height; y += 6) {
            for (let x = 0; x < canvas.width; x += 6) {
                const index = (y * canvas.width + x) * 4;
                if (pixelData[index] === 0 && pixelData[index + 1] === 0 && pixelData[index + 2] === 0) {
                    ctx.fillStyle = config.color;
                    ctx.beginPath();
                    ctx.roundRect(x, y, 6, 6, radius);
                    ctx.fill();
                }
            }
        }
    }
    
    function addLogoToQR() {
        const canvas = qrcodeDiv.querySelector('canvas');
        if (!canvas || !currentLogo) return;
        
        const ctx = canvas.getContext('2d');
        const logoSize = canvas.width / 5;
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;
        
        const logoImg = new Image();
        logoImg.onload = function() {
            // Sauvegarder la zone du logo
            const imageData = ctx.getImageData(x, y, logoSize, logoSize);
            
            // Dessiner un fond blanc pour le logo
            ctx.fillStyle = config.bgColor;
            ctx.fillRect(x - 2, y - 2, logoSize + 4, logoSize + 4);
            
            // Dessiner le logo
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
            
            // Redessiner les modules QR par-dessus (partiellement)
            redrawQRModulesOverLogo(ctx, imageData, x, y, logoSize);
        };
        logoImg.src = currentLogo;
    }
    
    function redrawQRModulesOverLogo(ctx, imageData, x, y, logoSize) {
        // Redessiner quelques modules QR par-dessus le logo pour la lisibilité
        const step = 8;
        for (let i = 0; i < logoSize; i += step) {
            for (let j = 0; j < logoSize; j += step) {
                const dataIndex = ((i * logoSize) + j) * 4;
                if (imageData.data[dataIndex] === 0) {
                    ctx.fillStyle = config.color;
                    ctx.fillRect(x + j, y + i, 2, 2);
                }
            }
        }
    }
    
    function updateQRInfo(content) {
        infoSize.textContent = `${config.size}px`;
        
        const errorLevels = {
            'L': 'Faible (L)',
            'M': 'Moyenne (M)',
            'Q': 'Élevée (Q)',
            'H': 'Maximale (H)'
        };
        infoError.textContent = errorLevels[config.errorLevel] || 'Moyenne (M)';
        
        // Vérifier la complexité
        const complexity = estimateComplexity(content);
        if (complexity === 'high' && config.hasLogo) {
            infoStatus.textContent = 'Test recommandé';
            infoStatus.className = 'status-warning';
        } else {
            infoStatus.textContent = 'Lisible';
            infoStatus.className = 'status-ok';
        }
    }
    
    function estimateComplexity(content) {
        if (content.length > 300) return 'high';
        if (content.length > 150) return 'medium';
        return 'low';
    }
    
    function enableDownloadButtons() {
        downloadPngBtn.disabled = false;
        downloadSvgBtn.disabled = false;
        downloadJpgBtn.disabled = false;
    }
    
    // ============================================
    // TEST DE LISIBILITÉ
    // ============================================
    
    testQrBtn.addEventListener('click', function() {
        if (!currentQRData) {
            toastr.warning('Générez d\'abord un QR code');
            return;
        }
        
        toastr.info(
            '<h4>Pour tester la lisibilité:</h4>' +
            '<ol>' +
            '<li>Ouvrez l\'appareil photo de votre téléphone</li>' +
            '<li>Pointez vers l\'écran à 20-30cm</li>' +
            '<li>Éclairez bien l\'écran</li>' +
            '<li>Attendez la reconnaissance</li>' +
            '</ol>' +
            '<p><strong>Astuce:</strong> Augmentez la correction d\'erreur si problème</p>',
            'Test de lisibilité',
            { timeOut: 8000 }
        );
    });
    
    testScanBtn.addEventListener('click', function() {
        toastr.info(
            '<h4>Conseils pour un scan parfait:</h4>' +
            '<ul>' +
            '<li>Éclairage suffisant</li>' +
            '<li>Écran propre</li>' +
            '<li>Distance 20-30cm</li>' +
            '<li>QR code centré dans la vue</li>' +
            '</ul>',
            'Conseils de scan',
            { timeOut: 6000 }
        );
    });
    
    // ============================================
    // TÉLÉCHARGEMENT
    // ============================================
    
    // Taille de téléchargement
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            downloadSize = parseInt(this.getAttribute('data-size'));
        });
    });
    
    // Téléchargement PNG
    downloadPngBtn.addEventListener('click', () => downloadQR('png'));
    
    // Téléchargement SVG
    downloadSvgBtn.addEventListener('click', () => downloadQR('svg'));
    
    // Téléchargement JPG
    downloadJpgBtn.addEventListener('click', () => downloadQR('jpg'));
    
    function downloadQR(format) {
        const canvas = qrcodeDiv.querySelector('canvas');
        if (!canvas) {
            toastr.error('Veuillez d\'abord générer un QR code');
            return;
        }
        
        const filename = `bamotch-qr-${Date.now()}`;
        
        switch(format) {
            case 'png':
                downloadCanvas(canvas, `${filename}.png`, 'image/png');
                break;
            case 'svg':
                downloadSVG(filename);
                break;
            case 'jpg':
                downloadCanvas(canvas, `${filename}.jpg`, 'image/jpeg', 0.9);
                break;
        }
        
        toastr.success(`QR code téléchargé en ${format.toUpperCase()}!`);
    }
    
    function downloadCanvas(canvas, filename, mimeType, quality = 1) {
        // Créer un canvas temporaire pour la taille de téléchargement
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        tempCanvas.width = downloadSize;
        tempCanvas.height = downloadSize;
        
        // Redessiner à la bonne taille
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, downloadSize, downloadSize);
        
        // Télécharger
        const link = document.createElement('a');
        link.download = filename;
        link.href = tempCanvas.toDataURL(mimeType, quality);
        link.click();
    }
    
    function downloadSVG(filename) {
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
    <text x="50%" y="50%" fill="${config.color}" font-family="Arial" font-size="24" text-anchor="middle">
        QR Code SVG
    </text>
    <text x="50%" y="60%" fill="#666" font-family="Arial" font-size="12" text-anchor="middle">
        BAMOTCH QR - ${new Date().toLocaleDateString()}
    </text>
</svg>`;
    }
    
    // ============================================
    // FONCTIONS UTILITAIRES
    // ============================================
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    // ============================================
    // INITIALISATION
    // ============================================
    
    // Remplir avec des exemples
    setTimeout(() => {
        if (!textContent.value) {
            textContent.value = 'Bienvenue sur BAMOTCH QR ! Générez des QR codes lisibles et stylés.';
            textContent.dispatchEvent(new Event('input'));
        }
        
        if (!urlContent.value) {
            urlContent.value = 'bamotch-qr.github.io';
        }
        
        if (!wifiSsid.value) {
            wifiSsid.value = 'WiFi-Maison';
        }
        
        // Mettre à jour la valeur de taille
        sizeValue.textContent = `${config.size}px`;
    }, 500);
    
    // Initialiser CanvasRenderingContext2D.roundRect si non disponible
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
            if (width < 2 * radius) radius = width / 2;
            if (height < 2 * radius) radius = height / 2;
            this.beginPath();
            this.moveTo(x + radius, y);
            this.arcTo(x + width, y, x + width, y + height, radius);
            this.arcTo(x + width, y + height, x, y + height, radius);
            this.arcTo(x, y + height, x, y, radius);
            this.arcTo(x, y, x + width, y, radius);
            this.closePath();
            return this;
        };
    }
});
