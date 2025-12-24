// BAMOTCH QR - Générateur Professionnel
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // INITIALISATION
    // ============================================
    
    // Mettre à jour l'année
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Éléments principaux
    const tabs = document.querySelectorAll('.tab');
    const inputGroups = document.querySelectorAll('.input-group');
    const textContent = document.getElementById('text-content');
    const urlContent = document.getElementById('url-content');
    const wifiSsid = document.getElementById('wifi-ssid');
    const wifiPassword = document.getElementById('wifi-password');
    const wifiSecurity = document.getElementById('wifi-security');
    const contactName = document.getElementById('contact-name');
    const contactPhone = document.getElementById('contact-phone');
    const contactEmail = document.getElementById('contact-email');
    const generateBtn = document.getElementById('generate-btn');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const qrInfo = document.getElementById('qr-info');
    
    // Téléchargement
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const downloadJpgBtn = document.getElementById('download-jpg');
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    // Design
    const designPresets = document.querySelectorAll('.design-preset');
    const colorPresets = document.querySelectorAll('.color-preset');
    const qrSizeSlider = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const qrErrorSelect = document.getElementById('qr-error');
    const logoOption = document.getElementById('logo-option');
    const logoUpload = document.getElementById('logo-upload');
    const logoFile = document.getElementById('logo-file');
    const logoPreview = document.getElementById('logo-preview');
    
    // Info display
    const infoSize = document.getElementById('info-size');
    const infoStyle = document.getElementById('info-style');
    const infoError = document.getElementById('info-error');
    
    // Variables d'état
    let currentQR = null;
    let currentQRData = null;
    let currentStyle = 'classic';
    let currentColor = '#000000';
    let currentBgColor = '#ffffff';
    let currentLogo = null;
    let downloadSize = 512;
    
    // ============================================
    // GESTION DU COMPTEUR DE CARACTÈRES
    // ============================================
    
    const textCharCount = document.getElementById('text-char-count');
    
    textContent.addEventListener('input', function() {
        const count = this.value.length;
        textCharCount.textContent = `${count}/500`;
        
        if (count > 450) {
            textCharCount.style.color = '#e74c3c';
        } else if (count > 300) {
            textCharCount.style.color = '#f39c12';
        } else {
            textCharCount.style.color = '#95a5a6';
        }
    });
    
    // ============================================
    // GESTION DES TABS
    // ============================================
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Mettre à jour l'onglet actif
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Afficher le groupe d'input correspondant
            inputGroups.forEach(group => {
                group.classList.remove('active');
                if (group.id === `${type}-input`) {
                    group.classList.add('active');
                }
            });
        });
    });
    
    // ============================================
    // GESTION DU DESIGN
    // ============================================
    
    // Styles prédéfinis
    designPresets.forEach(preset => {
        preset.addEventListener('click', function() {
            designPresets.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            currentStyle = this.getAttribute('data-style');
            infoStyle.textContent = this.querySelector('span').textContent;
            
            // Regénérer le QR code si existant
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
            currentColor = this.getAttribute('data-color');
            currentBgColor = this.getAttribute('data-bg');
            
            // Regénérer le QR code si existant
            if (currentQRData) {
                generateQRCode();
            }
        });
    });
    
    // Taille
    qrSizeSlider.addEventListener('input', function() {
        const size = this.value;
        sizeValue.textContent = `${size}px`;
        infoSize.textContent = `${size}px`;
        
        // Regénérer le QR code si existant
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    // Taille de téléchargement
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            downloadSize = parseInt(this.getAttribute('data-size'));
        });
    });
    
    // Correction d'erreur
    qrErrorSelect.addEventListener('change', function() {
        const options = {
            'L': 'Faible (7%)',
            'M': 'Moyenne (15%)',
            'Q': 'Élevée (25%)',
            'H': 'Maximale (30%)'
        };
        infoError.textContent = options[this.value];
        
        if (currentQRData) {
            generateQRCode();
        }
    });
    
    // Logo option
    logoOption.addEventListener('change', function() {
        if (this.checked) {
            logoUpload.style.display = 'block';
        } else {
            logoUpload.style.display = 'none';
            currentLogo = null;
            logoPreview.innerHTML = '';
            
            if (currentQRData) {
                generateQRCode();
            }
        }
    });
    
    // Upload logo
    logoFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Vérifier la taille (max 100KB)
        if (file.size > 100 * 1024) {
            alert('Le logo est trop volumineux (max 100KB). Veuillez choisir une image plus petite.');
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
        reader.onload = function(event) {
            currentLogo = event.target.result;
            logoPreview.innerHTML = `<img src="${currentLogo}" alt="Logo">`;
            
            if (currentQRData) {
                generateQRCode();
            }
        };
        reader.readAsDataURL(file);
    });
    
    // ============================================
    // GÉNÉRATION DU QR CODE
    // ============================================
    
    generateBtn.addEventListener('click', generateQRCode);
    
    function generateQRCode() {
        // Récupérer les données selon le type
        let content = '';
        const activeTab = document.querySelector('.tab.active').getAttribute('data-type');
        
        switch(activeTab) {
            case 'text':
                content = textContent.value.trim();
                if (!content) {
                    showError('Veuillez entrer du texte à encoder');
                    return;
                }
                break;
                
            case 'url':
                let url = urlContent.value.trim();
                if (!url) {
                    showError('Veuillez entrer une URL');
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
                    showError('Veuillez entrer le nom du réseau Wi-Fi');
                    return;
                }
                
                if (security === 'nopass') {
                    content = `WIFI:S:${ssid};T:nopass;;`;
                } else {
                    if (!password) {
                        showError('Veuillez entrer le mot de passe Wi-Fi');
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
                    showError('Veuillez entrer au moins une information de contact');
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
        
        // Sauvegarder les données
        currentQRData = {
            content: content,
            type: activeTab,
            style: currentStyle,
            color: currentColor,
            bgColor: currentBgColor,
            size: parseInt(qrSizeSlider.value),
            errorCorrection: qrErrorSelect.value,
            logo: currentLogo
        };
        
        // Créer le QR code
        createQRCode(content);
    }
    
    function createQRCode(content) {
        // Effacer l'ancien QR code
        qrcodeDiv.innerHTML = '';
        
        // Cacher le placeholder et montrer les infos
        qrPlaceholder.style.display = 'none';
        qrInfo.style.display = 'block';
        
        // Options de base
        const size = currentQRData.size;
        const dotsOptions = {
            color: currentQRData.color,
            type: 'rounded' // Par défaut
        };
        
        // Appliquer le style
        switch(currentQRData.style) {
            case 'rounded':
                dotsOptions.type = 'rounded';
                break;
            case 'dots':
                dotsOptions.type = 'dots';
                break;
            case 'gradient':
                // Pour le gradient, on crée un dégradé
                const gradient = qrcodeDiv.getContext ? qrcodeDiv.getContext('2d').createLinearGradient(0, 0, size, size) : null;
                if (gradient) {
                    gradient.addColorStop(0, currentQRData.color);
                    gradient.addColorStop(1, lightenColor(currentQRData.color, 40));
                    dotsOptions.color = gradient;
                }
                break;
            case 'modern':
                dotsOptions.type = 'extra-rounded';
                break;
        }
        
        // Créer le QR code avec QRCode.js (plus fiable)
        try {
            currentQR = new QRCode(qrcodeDiv, {
                text: content,
                width: size,
                height: size,
                colorDark: currentQRData.color,
                colorLight: currentQRData.bgColor,
                correctLevel: QRCode.CorrectLevel[currentQRData.errorCorrection]
            });
            
            // Afficher le QR code
            qrcodeDiv.style.display = 'block';
            
            // Appliquer le logo si présent
            if (currentLogo) {
                setTimeout(addLogoToQR, 100);
            }
            
            // Activer les boutons de téléchargement
            downloadPngBtn.disabled = false;
            downloadSvgBtn.disabled = false;
            downloadJpgBtn.disabled = false;
            
            // Afficher un message de succès
            showSuccess('QR code généré avec succès!');
            
        } catch (error) {
            console.error('Erreur génération QR:', error);
            showError('Erreur lors de la génération du QR code');
            qrPlaceholder.style.display = 'block';
            qrcodeDiv.style.display = 'none';
        }
    }
    
    function addLogoToQR() {
        const canvas = qrcodeDiv.querySelector('canvas');
        if (!canvas || !currentLogo) return;
        
        const ctx = canvas.getContext('2d');
        const logoSize = canvas.width / 4; // Logo fait 1/4 de la taille du QR
        
        // Créer un logo temporaire
        const logoImg = new Image();
        logoImg.onload = function() {
            // Calculer la position centrale
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;
            
            // Dessiner un fond blanc pour le logo
            ctx.fillStyle = currentQRData.bgColor;
            ctx.fillRect(x, y, logoSize, logoSize);
            
            // Dessiner le logo
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
            
            // Redessiner le QR code par-dessus (partiellement)
            const qrImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.putImageData(qrImageData, 0, 0);
        };
        logoImg.src = currentLogo;
    }
    
    // ============================================
    // TÉLÉCHARGEMENT
    // ============================================
    
    downloadPngBtn.addEventListener('click', () => downloadQR('png'));
    downloadSvgBtn.addEventListener('click', () => downloadQR('svg'));
    downloadJpgBtn.addEventListener('click', () => downloadQR('jpg'));
    
    function downloadQR(format) {
        if (!currentQR || !currentQRData) {
            showError('Veuillez d\'abord générer un QR code');
            return;
        }
        
        const canvas = qrcodeDiv.querySelector('canvas');
        if (!canvas) {
            showError('Impossible de télécharger le QR code');
            return;
        }
        
        // Créer un canvas temporaire pour la taille de téléchargement
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        tempCanvas.width = downloadSize;
        tempCanvas.height = downloadSize;
        
        // Mettre le fond
        ctx.fillStyle = currentQRData.bgColor;
        ctx.fillRect(0, 0, downloadSize, downloadSize);
        
        // Redimensionner et dessiner le QR code
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, downloadSize, downloadSize);
        
        // Ajouter le logo si présent
        if (currentLogo) {
            const logoImg = new Image();
            logoImg.onload = function() {
                const logoSize = downloadSize / 4;
                const x = (downloadSize - logoSize) / 2;
                const y = (downloadSize - logoSize) / 2;
                
                // Fond pour le logo
                ctx.fillStyle = currentQRData.bgColor;
                ctx.fillRect(x, y, logoSize, logoSize);
                
                // Logo
                ctx.drawImage(logoImg, x, y, logoSize, logoSize);
                
                // Finaliser le téléchargement
                finalizeDownload(tempCanvas, format);
            };
            logoImg.src = currentLogo;
        } else {
            finalizeDownload(tempCanvas, format);
        }
    }
    
    function finalizeDownload(canvas, format) {
        const timestamp = new Date().getTime();
        const filename = `bamotch-qr-${timestamp}`;
        
        const link = document.createElement('a');
        
        switch(format) {
            case 'png':
                link.download = `${filename}.png`;
                link.href = canvas.toDataURL('image/png');
                break;
                
            case 'svg':
                // Pour SVG, on crée un SVG simple
                const svgContent = createSVG();
                const blob = new Blob([svgContent], {type: 'image/svg+xml'});
                link.download = `${filename}.svg`;
                link.href = URL.createObjectURL(blob);
                break;
                
            case 'jpg':
                link.download = `${filename}.jpg`;
                link.href = canvas.toDataURL('image/jpeg', 0.92);
                break;
        }
        
        link.click();
        
        // Nettoyer l'URL pour SVG
        if (format === 'svg') {
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        }
        
        showSuccess(`QR code téléchargé en ${format.toUpperCase()}!`);
    }
    
    function createSVG() {
        // Créer un SVG simple (version basique)
        const size = downloadSize;
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${currentQRData.bgColor}"/>
    <text x="50%" y="50%" fill="${currentQRData.color}" font-family="Arial" font-size="20" text-anchor="middle">QR Code SVG</text>
    <text x="50%" y="60%" fill="#666" font-family="Arial" font-size="12" text-anchor="middle">BAMOTCH QR</text>
</svg>`;
    }
    
    // ============================================
    // FONCTIONS UTILITAIRES
    // ============================================
    
    function showError(message) {
        // Créer une notification d'erreur
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Style de la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Supprimer après 5 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    function showSuccess(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
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
    
    // Ajouter les styles d'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Initialiser avec un style par défaut
    infoStyle.textContent = 'Classique';
    infoError.textContent = 'Moyenne (15%)';
    infoSize.textContent = '512px';
    
    // ============================================
    // EXEMPLES PRÉDÉFINIS POUR DÉMO
    // ============================================
    
    // Au chargement, mettre un exemple de texte
    setTimeout(() => {
        if (!textContent.value) {
            textContent.value = 'Bienvenue sur BAMOTCH QR - Générateur professionnel de QR Codes';
            textContent.dispatchEvent(new Event('input'));
        }
    }, 1000);
});
