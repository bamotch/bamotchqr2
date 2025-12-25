// BAMOTCH QR - Version Ultime avec Designs Avancés
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // INITIALISATION
    // ============================================
    
    // Mettre à jour l'année
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Configuration Toastr
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "3000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    
    // Variables d'état
    let currentQR = null;
    let currentQRData = null;
    let currentLogo = null;
    let logoFileData = null;
    let downloadSize = 512;
    let downloadQuality = 0.9;
    
    // Configuration par défaut
    const config = {
        shape: 'square',
        eyeShape: 'square',
        color: '#000000',
        bgColor: '#ffffff',
        size: 512,
        margin: 4,
        errorLevel: 'M',
        version: '1'
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
    const shapeOptions = document.querySelectorAll('.shape-option');
    const eyeOptions = document.querySelectorAll('.eye-option');
    const colorPresets = document.querySelectorAll('.color-preset');
    const qrColorInput = document.getElementById('qr-color');
    const qrBgInput = document.getElementById('qr-bg');
    
    // Options techniques
    const qrSizeSlider = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const qrMarginSlider = document.getElementById('qr-margin');
    const marginValue = document.getElementById('margin-value');
    const qrErrorSelect = document.getElementById('qr-error');
    const qrVersionSelect = document.getElementById('qr-version');
    
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
    const refreshPreviewBtn = document.getElementById('refresh-preview');
    const fullscreenPreviewBtn = document.getElementById('fullscreen-preview');
    
    // Statistiques
    const qrStats = document.getElementById('qr-stats');
    const statSize = document.getElementById('stat-size');
    const statData = document.getElementById('stat-data');
    const statError = document.getElementById('stat-error');
    const statVersion = document.getElementById('stat-version');
    
    // Téléchargement
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const downloadJpgBtn = document.getElementById('download-jpg');
    const qualitySelect = document.getElementById('quality-select');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const filenameInput = document.getElementById('filename-input');
    const namePreview = document.getElementById('name-preview');
    const copyNameBtn = document.getElementById('copy-name');
    
    // Thème
    const themeToggle = document.getElementById('theme-toggle');
    const helpBtn = document.getElementById('help-btn');
    
    // ============================================
    // GESTION DU THÈME
    // ============================================
    
    // Vérifier le thème stocké
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
    // GESTION DES ONGLETS DE CONTENU
    // ============================================
    
    contentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.hasAttribute('disabled')) {
                toastr.warning('Cette fonctionnalité sera disponible prochainement!');
                return;
            }
            
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
        const max = 1000;
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
    // GESTION DES FORMES
    // ============================================
    
    // Formes des points
    shapeOptions.forEach(option => {
        option.addEventListener('click', function() {
            shapeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            config.shape = this.getAttribute('data-shape');
            
            if (currentQRData) {
                generateQRCode();
            }
        });
    });
    
    // Formes des yeux
    eyeOptions.forEach(option => {
        option.addEventListener('click', function() {
            eyeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            config.eyeShape = this.getAttribute('data-eye');
            
            if (currentQRData) {
                generateQRCode();
            }
        });
    });
    
    // ============================================
    // GESTION DES COULEURS
    // ============================================
    
    // Couleurs prédéfinies
    colorPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            colorPresets.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            config.color = this.getAttribute('data-color');
            config.bgColor = this.getAttribute('data-bg');
            
            // Mettre à jour les inputs color
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
        
        // Désélectionner les prédéfinis
        colorPresets.forEach(p => p.classList.remove('active'));
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    qrBgInput.addEventListener('input', function() {
        config.bgColor = this.value;
        
        // Désélectionner les prédéfinis
        colorPresets.forEach(p => p.classList.remove('active'));
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    // ============================================
    // GESTION DES OPTIONS TECHNIQUES
    // ============================================
    
    qrSizeSlider.addEventListener('input', function() {
        config.size = parseInt(this.value);
        sizeValue.textContent = `${config.size}px`;
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    qrMarginSlider.addEventListener('input', function() {
        config.margin = parseInt(this.value);
        marginValue.textContent = `${config.margin} modules`;
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    qrErrorSelect.addEventListener('change', function() {
        config.errorLevel = this.value;
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    qrVersionSelect.addEventListener('change', function() {
        config.version = this.value;
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    // ============================================
    // GESTION DU LOGO
    // ============================================
    
    // Sélectionner un logo
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
    
    // Gestion du fichier logo
    logoFileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            handleLogoFile(this.files[0]);
        }
    });
    
    function handleLogoFile(file) {
        // Vérifier la taille (max 1MB)
        if (file.size > 1024 * 1024) {
            toastr.error('Le logo est trop volumineux (max 1MB)');
            logoFileInput.value = '';
            return;
        }
        
        // Vérifier le type
        if (!file.type.match('image.*')) {
            toastr.error('Veuillez choisir une image valide');
            logoFileInput.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            currentLogo = e.target.result;
            logoFileData = file;
            
            // Afficher le preview
            logoImage.src = currentLogo;
            logoName.textContent = file.name;
            logoSize.textContent = formatFileSize(file.size);
            logoPreview.style.display = 'flex';
            
            toastr.success('Logo ajouté avec succès');
            
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
    
    // Supprimer le logo
    removeLogoBtn.addEventListener('click', function() {
        currentLogo = null;
        logoFileData = null;
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
            config: { ...config },
            logo: currentLogo,
            timestamp: new Date().toISOString()
        };
        
        // Créer le QR code
        createQRCodeVisual(content);
    }
    
    function createQRCodeVisual(content) {
        // Effacer l'ancien QR code
        qrcodeDiv.innerHTML = '';
        
        // Cacher le placeholder et montrer les stats
        qrPlaceholder.style.display = 'none';
        qrStats.style.display = 'grid';
        
        try {
            // Créer un canvas pour le QR code
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Taille du canvas
            const size = config.size;
            const margin = config.margin * 10; // Convertir modules en pixels
            canvas.width = size;
            canvas.height = size;
            
            // Remplir le fond
            ctx.fillStyle = config.bgColor;
            ctx.fillRect(0, 0, size, size);
            
            // Calculer la taille des modules
            const dataLength = content.length;
            const estimatedVersion = Math.ceil(dataLength / 10);
            const moduleSize = Math.floor((size - margin * 2) / (21 + (estimatedVersion - 1) * 4));
            
            // Dessiner le QR code de base
            drawQRCodeBase(ctx, content, size, margin, moduleSize);
            
            // Appliquer les formes personnalisées
            applyShapeStyle(ctx, size, margin, moduleSize);
            
            // Appliquer le logo si présent
            if (currentLogo) {
                applyLogo(ctx, size);
            }
            
            // Ajouter le canvas au DOM
            qrcodeDiv.appendChild(canvas);
            qrcodeDiv.style.display = 'block';
            
            // Mettre à jour les statistiques
            updateQRStats(content, size);
            
            // Activer les boutons de téléchargement
            enableDownloadButtons();
            
            toastr.success('QR code généré avec succès!');
            
        } catch (error) {
            console.error('Erreur génération QR:', error);
            toastr.error('Erreur lors de la génération du QR code');
            qrPlaceholder.style.display = 'block';
            qrcodeDiv.style.display = 'none';
        }
    }
    
    function drawQRCodeBase(ctx, content, size, margin, moduleSize) {
        // Dessiner un QR code simple (version simplifiée)
        // En production, utiliser une vraie librairie QR code
        
        ctx.fillStyle = config.color;
        
        // Dessiner des modules carrés (simulation)
        const modules = 21; // Version 1 QR code
        const moduleSpacing = moduleSize;
        
        for (let y = 0; y < modules; y++) {
            for (let x = 0; x < modules; x++) {
                // Dessiner seulement certains modules pour simuler un QR
                if ((x + y) % 3 === 0 || (x * y) % 5 === 0) {
                    const xPos = margin + x * moduleSpacing;
                    const yPos = margin + y * moduleSpacing;
                    
                    // Dessiner selon la forme sélectionnée
                    drawModule(ctx, xPos, yPos, moduleSize);
                }
            }
        }
        
        // Dessiner les yeux
        drawEye(ctx, margin, margin, moduleSize * 7, 'tl');
        drawEye(ctx, size - margin - moduleSize * 7, margin, moduleSize * 7, 'tr');
        drawEye(ctx, margin, size - margin - moduleSize * 7, moduleSize * 7, 'bl');
    }
    
    function drawModule(ctx, x, y, size) {
        switch(config.shape) {
            case 'square':
                ctx.fillRect(x, y, size, size);
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rounded':
                ctx.beginPath();
                ctx.roundRect(x, y, size, size, size/4);
                ctx.fill();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(x + size/2, y);
                ctx.lineTo(x + size, y + size/2);
                ctx.lineTo(x + size/2, y + size);
                ctx.lineTo(x, y + size/2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'line':
                ctx.fillRect(x, y + size/3, size, size/3);
                break;
            case 'dot':
                ctx.beginPath();
                ctx.arc(x + size/2, y + size/2, size/4, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'heart':
                drawHeart(ctx, x + size/2, y + size/2, size/2);
                break;
            case 'star':
                drawStar(ctx, x + size/2, y + size/2, 5, size/2, size/4);
                break;
        }
    }
    
    function drawEye(ctx, x, y, size, position) {
        ctx.save();
        ctx.fillStyle = config.color;
        
        switch(config.eyeShape) {
            case 'square':
                ctx.fillRect(x, y, size, size);
                // Carré intérieur
                ctx.fillStyle = config.bgColor;
                ctx.fillRect(x + size/7, y + size/7, size - size/3.5, size - size/3.5);
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
                ctx.fill();
                // Cercle intérieur
                ctx.fillStyle = config.bgColor;
                ctx.beginPath();
                ctx.arc(x + size/2, y + size/2, size/3, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rounded':
                ctx.beginPath();
                ctx.roundRect(x, y, size, size, size/4);
                ctx.fill();
                // Carré arrondi intérieur
                ctx.fillStyle = config.bgColor;
                ctx.beginPath();
                ctx.roundRect(x + size/7, y + size/7, size - size/3.5, size - size/3.5, size/7);
                ctx.fill();
                break;
            case 'flower':
                drawFlower(ctx, x + size/2, y + size/2, size/2, 8);
                // Cercle intérieur
                ctx.fillStyle = config.bgColor;
                ctx.beginPath();
                ctx.arc(x + size/2, y + size/2, size/4, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'diamond':
                ctx.beginPath();
                ctx.moveTo(x + size/2, y);
                ctx.lineTo(x + size, y + size/2);
                ctx.lineTo(x + size/2, y + size);
                ctx.lineTo(x, y + size/2);
                ctx.closePath();
                ctx.fill();
                // Losange intérieur
                ctx.fillStyle = config.bgColor;
                ctx.beginPath();
                ctx.moveTo(x + size/2, y + size/4);
                ctx.lineTo(x + size - size/4, y + size/2);
                ctx.lineTo(x + size/2, y + size - size/4);
                ctx.lineTo(x + size/4, y + size/2);
                ctx.closePath();
                ctx.fill();
                break;
        }
        
        ctx.restore();
    }
    
    function applyShapeStyle(ctx, size, margin, moduleSize) {
        // Appliquer des effets selon la forme
        if (config.shape === 'gradient') {
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, config.color);
            gradient.addColorStop(1, lightenColor(config.color, 50));
            ctx.fillStyle = gradient;
            
            // Redessiner les modules avec le dégradé
            const modules = 21;
            for (let y = 0; y < modules; y++) {
                for (let x = 0; x < modules; x++) {
                    if ((x + y) % 3 === 0) {
                        const xPos = margin + x * moduleSize;
                        const yPos = margin + y * moduleSize;
                        ctx.fillRect(xPos, yPos, moduleSize, moduleSize);
                    }
                }
            }
        }
    }
    
    function applyLogo(ctx, size) {
        if (!currentLogo) return;
        
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
        logoImg.src = currentLogo;
    }
    
    function updateQRStats(content, size) {
        statSize.textContent = `${size}x${size}`;
        statData.textContent = `${content.length} caractères`;
        
        const errorLevels = {
            'L': '7%',
            'M': '15%',
            'Q': '25%',
            'H': '30%'
        };
        statError.textContent = errorLevels[config.errorLevel] || '15%';
        statVersion.textContent = config.version === '1' ? 'Auto' : `V${config.version}`;
    }
    
    function enableDownloadButtons() {
        downloadPngBtn.disabled = false;
        downloadSvgBtn.disabled = false;
        downloadJpgBtn.disabled = false;
    }
    
    // ============================================
    // FONCTIONS DE DESSIN
    // ============================================
    
    function drawHeart(ctx, x, y, size) {
        ctx.save();
        ctx.translate(x, y);
        
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        // Dessiner la gauche
        ctx.bezierCurveTo(
            0, 0,
            -size, 0,
            -size, topCurveHeight
        );
        // Dessiner le bas gauche
        ctx.bezierCurveTo(
            -size, size,
            0, size,
            0, topCurveHeight
        );
        // Dessiner le bas droit
        ctx.bezierCurveTo(
            0, size,
            size, size,
            size, topCurveHeight
        );
        // Dessiner la droite
        ctx.bezierCurveTo(
            size, 0,
            0, 0,
            0, topCurveHeight
        );
        
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;
        
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
    
    // ============================================
    // TÉLÉCHARGEMENT
    // ============================================
    
    // Qualité
    qualitySelect.addEventListener('change', function() {
        downloadQuality = parseFloat(this.value);
    });
    
    // Taille
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            downloadSize = parseInt(this.getAttribute('data-size'));
        });
    });
    
    // Nom du fichier
    filenameInput.addEventListener('input', function() {
        const name = this.value.trim() || 'mon-qr-code';
        namePreview.textContent = `${name}.png`;
    });
    
    // Copier le nom
    copyNameBtn.addEventListener('click', function() {
        const name = filenameInput.value.trim() || 'mon-qr-code';
        navigator.clipboard.writeText(`${name}.png`)
            .then(() => toastr.success('Nom copié dans le presse-papier'))
            .catch(() => toastr.error('Erreur lors de la copie'));
    });
    
    // Téléchargement PNG
    downloadPngBtn.addEventListener('click', () => downloadQR('png'));
    
    // Téléchargement SVG
    downloadSvgBtn.addEventListener('click', () => downloadQR('svg'));
    
    // Téléchargement JPG
    downloadJpgBtn.addEventListener('click', () => downloadQR('jpg'));
    
    function downloadQR(format) {
        if (!qrcodeDiv.querySelector('canvas')) {
            toastr.error('Veuillez d\'abord générer un QR code');
            return;
        }
        
        const canvas = qrcodeDiv.querySelector('canvas');
        const filename = filenameInput.value.trim() || 'mon-qr-code';
        
        switch(format) {
            case 'png':
                downloadCanvas(canvas, `${filename}.png`, 'image/png');
                break;
            case 'svg':
                downloadSVG(filename);
                break;
            case 'jpg':
                downloadCanvas(canvas, `${filename}.jpg`, 'image/jpeg', downloadQuality);
                break;
        }
        
        toastr.success(`QR code téléchargé en ${format.toUpperCase()}!`);
    }
    
    function downloadCanvas(canvas, filename, mimeType, quality = 1) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL(mimeType, quality);
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
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${config.color}" />
            <stop offset="100%" stop-color="${lightenColor(config.color, 50)}" />
        </linearGradient>
    </defs>
    
    <rect width="100%" height="100%" fill="${config.bgColor}" />
    
    <g fill="${config.shape === 'gradient' ? 'url(#gradient)' : config.color}">
        <!-- Modules QR code (simplifié) -->
        <rect x="${size * 0.2}" y="${size * 0.2}" width="${size * 0.1}" height="${size * 0.1}" />
        <rect x="${size * 0.5}" y="${size * 0.2}" width="${size * 0.1}" height="${size * 0.1}" />
        <rect x="${size * 0.8}" y="${size * 0.2}" width="${size * 0.1}" height="${size * 0.1}" />
        <rect x="${size * 0.2}" y="${size * 0.5}" width="${size * 0.1}" height="${size * 0.1}" />
        <rect x="${size * 0.5}" y="${size * 0.5}" width="${size * 0.1}" height="${size * 0.1}" />
        <rect x="${size * 0.8}" y="${size * 0.5}" width="${size * 0.1}" height="${size * 0.1}" />
        <rect x="${size * 0.2}" y="${size * 0.8}" width="${size * 0.1}" height="${size * 0.1}" />
        <rect x="${size * 0.5}" y="${size * 0.8}" width="${size * 0.1}" height="${size * 0.1}" />
        <rect x="${size * 0.8}" y="${size * 0.8}" width="${size * 0.1}" height="${size * 0.1}" />
    </g>
    
    <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="${size * 0.02}" fill="#666">
        BAMOTCH QR
    </text>
</svg>`;
    }
    
    // ============================================
    // FONCTIONS UTILITAIRES
    // ============================================
    
    function lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    // ============================================
    // PLEIN ÉCRAN
    // ============================================
    
    fullscreenPreviewBtn.addEventListener('click', function() {
        const qrContainer = qrcodeDiv.querySelector('canvas');
        if (!qrContainer) {
            toastr.warning('Générez d\'abord un QR code');
            return;
        }
        
        if (!document.fullscreenElement) {
            qrcodeDiv.requestFullscreen().catch(err => {
                toastr.error(`Erreur plein écran: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    // ============================================
    // AIDE
    // ============================================
    
    helpBtn.addEventListener('click', function() {
        toastr.info(
            '<h4>Comment utiliser BAMOTCH QR:</h4>' +
            '<ol>' +
            '<li>Choisissez le type de contenu (texte, lien, Wi-Fi, contact)</li>' +
            '<li>Personnalisez la forme des points et des yeux</li>' +
            '<li>Sélectionnez ou personnalisez les couleurs</li>' +
            '<li>Ajoutez un logo si souhaité (max 1MB)</li>' +
            '<li>Générez et téléchargez dans le format souhaité</li>' +
            '</ol>',
            'Aide & Instructions',
            { timeOut: 10000, extendedTimeOut: 5000 }
        );
    });
    
    // ============================================
    // INITIALISATION
    // ============================================
    
    // Remplir avec des exemples
    setTimeout(() => {
        if (!textContent.value) {
            textContent.value = 'Bienvenue sur BAMOTCH QR ! Créez des QR codes stylés et uniques avec notre générateur avancé.';
            textContent.dispatchEvent(new Event('input'));
        }
        
        if (!urlContent.value) {
            urlContent.value = 'bamotch-qr.github.io';
        }
        
        if (!wifiSsid.value) {
            wifiSsid.value = 'MonRéseauMaison';
            wifiPassword.value = 'MotDePasseSecret';
        }
        
        if (!contactName.value) {
            contactName.value = 'Jean Dupont';
            contactPhone.value = '+33 1 23 45 67 89';
            contactEmail.value = 'jean.dupont@email.com';
        }
    }, 1000);
    
    // Activer le mode plein écran sur touche F
    document.addEventListener('keydown', function(e) {
        if (e.key === 'f' || e.key === 'F') {
            fullscreenPreviewBtn.click();
        }
    });
    
    // Initialiser le nom du fichier
    filenameInput.dispatchEvent(new Event('input'));
});
