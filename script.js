// BAMOTCH QR - Version Simple et Fonctionnelle
document.addEventListener('DOMContentLoaded', function() {
    console.log("BAMOTCH QR chargé avec succès!");

    // ============================
    // 1. ÉLÉMENTS DU DOM
    // ============================
    
    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const inputGroups = document.querySelectorAll('.input-group');
    
    // Inputs
    const textContent = document.getElementById('text-content');
    const urlContent = document.getElementById('url-content');
    const wifiSsid = document.getElementById('wifi-ssid');
    const wifiPassword = document.getElementById('wifi-password');
    
    // Design
    const colorOptions = document.querySelectorAll('.color-option');
    const qrSizeSlider = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    
    // Actions
    const generateBtn = document.getElementById('generate-btn');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    
    // Download
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const downloadJpgBtn = document.getElementById('download-jpg');
    
    // Année
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // ============================
    // 2. ÉTAT DE L'APPLICATION
    // ============================
    
    let currentQR = null;
    let qrData = null;
    let config = {
        color: '#000000',
        bgColor: '#ffffff',
        size: 300
    };
    
    // ============================
    // 3. GESTION DES TABS
    // ============================
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Mettre à jour les tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Afficher le bon input
            inputGroups.forEach(group => {
                group.classList.remove('active');
                if (group.id === `${type}-input`) {
                    group.classList.add('active');
                }
            });
            
            console.log(`Tab changé: ${type}`);
        });
    });
    
    // ============================
    // 4. GESTION DES COULEURS
    // ============================
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            config.color = this.getAttribute('data-color');
            config.bgColor = this.getAttribute('data-bg');
            
            console.log(`Couleur changée: ${config.color} / ${config.bgColor}`);
            
            // Regénérer si un QR existe déjà
            if (qrData) {
                generateQRCode();
            }
        });
    });
    
    // ============================
    // 5. GESTION DE LA TAILLE
    // ============================
    
    qrSizeSlider.addEventListener('input', function() {
        config.size = parseInt(this.value);
        sizeValue.textContent = `${config.size}px`;
        
        console.log(`Taille changée: ${config.size}px`);
        
        // Regénérer si un QR existe déjà
        if (qrData) {
            generateQRCode();
        }
    });
    
    // ============================
    // 6. BOUTON GÉNÉRER
    // ============================
    
    generateBtn.addEventListener('click', function() {
        console.log("Bouton Générer cliqué!");
        
        // 1. Récupérer le contenu selon l'onglet actif
        let content = '';
        const activeTab = document.querySelector('.tab-btn.active');
        const type = activeTab.getAttribute('data-type');
        
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
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                content = url;
                break;
                
            case 'wifi':
                const ssid = wifiSsid.value.trim();
                const password = wifiPassword.value.trim();
                if (!ssid) {
                    alert('Veuillez entrer le nom du réseau Wi-Fi');
                    return;
                }
                content = `WIFI:S:${ssid};T:WPA;P:${password};;`;
                break;
        }
        
        console.log("Contenu à encoder:", content);
        
        // 2. Sauvegarder les données
        qrData = content;
        
        // 3. Générer le QR code
        generateQRCode();
    });
    
    // ============================
    // 7. FONCTION DE GÉNÉRATION
    // ============================
    
    function generateQRCode() {
        console.log("Génération du QR code...");
        
        // Effacer l'ancien QR code
        qrcodeDiv.innerHTML = '';
        
        // Masquer le placeholder
        qrPlaceholder.style.display = 'none';
        
        try {
            // Créer le QR code avec QRCode.js
            currentQR = new QRCode(qrcodeDiv, {
                text: qrData,
                width: config.size,
                height: config.size,
                colorDark: config.color,
                colorLight: config.bgColor,
                correctLevel: QRCode.CorrectLevel.H
            });
            
            console.log("QR code généré avec succès!");
            
            // Activer les boutons de téléchargement
            setTimeout(() => {
                downloadPngBtn.disabled = false;
                downloadSvgBtn.disabled = false;
                downloadJpgBtn.disabled = false;
                console.log("Boutons de téléchargement activés");
            }, 100);
            
        } catch (error) {
            console.error("Erreur lors de la génération:", error);
            alert('Erreur lors de la génération du QR code');
            qrPlaceholder.style.display = 'block';
        }
    }
    
    // ============================
    // 8. TÉLÉCHARGEMENT
    // ============================
    
    // PNG
    downloadPngBtn.addEventListener('click', function() {
        if (!currentQR) {
            alert('Veuillez d\'abord générer un QR code');
            return;
        }
        
        const canvas = qrcodeDiv.querySelector('canvas');
        if (!canvas) {
            alert('Erreur: Aucun QR code trouvé');
            return;
        }
        
        const link = document.createElement('a');
        link.download = 'bamotch-qr.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        console.log("QR code téléchargé en PNG");
    });
    
    // SVG
    downloadSvgBtn.addEventListener('click', function() {
        if (!currentQR) {
            alert('Veuillez d\'abord générer un QR code');
            return;
        }
        
        // Créer un SVG simple
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${config.size}" height="${config.size}" viewBox="0 0 ${config.size} ${config.size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${config.bgColor}"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" fill="${config.color}">
        QR Code - BAMOTCH QR
    </text>
</svg>`;
        
        const blob = new Blob([svgContent], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'bamotch-qr.svg';
        link.href = url;
        link.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        console.log("QR code téléchargé en SVG");
    });
    
    // JPG
    downloadJpgBtn.addEventListener('click', function() {
        if (!currentQR) {
            alert('Veuillez d\'abord générer un QR code');
            return;
        }
        
        const canvas = qrcodeDiv.querySelector('canvas');
        if (!canvas) {
            alert('Erreur: Aucun QR code trouvé');
            return;
        }
        
        // Créer un canvas avec fond blanc pour JPG
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        tempCanvas.width = config.size;
        tempCanvas.height = config.size;
        
        // Fond blanc
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, config.size, config.size);
        
        // Dessiner le QR code
        ctx.drawImage(canvas, 0, 0);
        
        const link = document.createElement('a');
        link.download = 'bamotch-qr.jpg';
        link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
        link.click();
        
        console.log("QR code téléchargé en JPG");
    });
    
    // ============================
    // 9. INITIALISATION
    // ============================
    
    // Mettre des valeurs par défaut
    setTimeout(() => {
        textContent.value = 'Bienvenue sur BAMOTCH QR!';
        urlContent.value = 'https://exemple.com';
        wifiSsid.value = 'MonWiFi';
        wifiPassword.value = 'MonMotDePasse123';
        
        console.log("Valeurs par défaut initialisées");
    }, 500);
    
    // Vérifier que tous les boutons sont connectés
    console.log("Vérification des boutons:");
    console.log("- Générer:", generateBtn ? "OK" : "MANQUANT");
    console.log("- PNG:", downloadPngBtn ? "OK" : "MANQUANT");
    console.log("- SVG:", downloadSvgBtn ? "OK" : "MANQUANT");
    console.log("- JPG:", downloadJpgBtn ? "OK" : "MANQUANT");
    
    // Message de confirmation
    console.log("=== BAMOTCH QR PRÊT À UTILISER ===");
});
