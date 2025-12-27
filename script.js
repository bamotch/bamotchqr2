// BAMOTCH QR - Version SIMPLE et FONCTIONNELLE
document.addEventListener('DOMContentLoaded', function() {
    // ========== ÉLÉMENTS DU DOM ==========
    const elements = {
        tabs: document.querySelectorAll('.tab'),
        inputGroups: document.querySelectorAll('.input-group'),
        textInput: document.getElementById('text-content'),
        urlInput: document.getElementById('url-content'),
        wifiSsid: document.getElementById('wifi-ssid'),
        wifiPassword: document.getElementById('wifi-password'),
        wifiSecurity: document.getElementById('wifi-security'),
        contactName: document.getElementById('contact-name'),
        contactPhone: document.getElementById('contact-phone'),
        contactEmail: document.getElementById('contact-email'),
        colorOptions: document.querySelectorAll('.color-option'),
        qrSize: document.getElementById('qr-size'),
        sizeValue: document.getElementById('size-value'),
        qrError: document.getElementById('qr-error'),
        generateBtn: document.getElementById('generate-btn'),
        qrcodeDiv: document.getElementById('qrcode'),
        qrPlaceholder: document.getElementById('qr-placeholder'),
        qrInfo: document.getElementById('qr-info'),
        downloadPng: document.getElementById('download-png'),
        downloadSvg: document.getElementById('download-svg'),
        downloadJpg: document.getElementById('download-jpg'),
        filenameInput: document.getElementById('filename')
    };

    // ========== CONFIGURATION ==========
    let config = {
        color: '#000000',
        bgColor: '#ffffff',
        size: 300,
        errorLevel: 'M'
    };

    let currentQR = null;
    let currentContent = '';

    // ========== INITIALISATION ==========
    init();

    function init() {
        // Mettre à jour l'année
        document.getElementById('current-year').textContent = new Date().getFullYear();
        
        // Initialiser la taille
        updateSizeValue();
        
        // Remplir avec des exemples
        setupExamples();
        
        // Ajouter les événements
        setupEventListeners();
    }

    // ========== GESTION DES ÉVÉNEMENTS ==========
    function setupEventListeners() {
        // Tabs
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const type = this.dataset.type;
                
                // Mettre à jour les tabs
                elements.tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Afficher le bon input group
                elements.inputGroups.forEach(group => {
                    group.classList.remove('active');
                    if (group.id === `${type}-input`) {
                        group.classList.add('active');
                    }
                });
            });
        });

        // Compteur de caractères
        elements.textInput.addEventListener('input', function() {
            const count = this.value.length;
            document.getElementById('text-counter').textContent = count;
        });

        // Couleurs
        elements.colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                elements.colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                config.color = this.dataset.color;
                config.bgColor = this.dataset.bg;
                
                // Régénérer si un QR existe
                if (currentQR) {
                    generateQRCode();
                }
            });
        });

        // Taille
        elements.qrSize.addEventListener("input", function() {
            config.size = parseInt(this.value);
            updateSizeValue();
            
            // Régénérer si un QR existe
            if (currentQR) {
                generateQRCode();
            }
        });

        // Correction d'erreur
        elements.qrError.addEventListener("change", function() {
            config.errorLevel = this.value;
            
            // Régénérer si un QR existe
            if (currentQR) {
                generateQRCode();
            }
        });

        // Bouton Générer
        elements.generateBtn.addEventListener("click", generateQRCode);

        // Téléchargement
        elements.downloadPng.addEventListener("click", () => downloadQR("png"));
        elements.downloadSvg.addEventListener("click", () => downloadQR("svg"));
        elements.downloadJpg.addEventListener("click", () => downloadQR("jpg"));
    }

    // ========== FONCTIONS UTILITAIRES ==========
    function updateSizeValue() {
        elements.sizeValue.textContent = `${config.size}px`;
    }

    function setupExamples() {
        if (!elements.textInput.value) {
            elements.textInput.value = "Bienvenue sur BAMOTCH QR - Votre QR code fonctionne parfaitement !";
            elements.textInput.dispatchEvent(new Event("input"));
        }
        
        if (!elements.urlInput.value) {
            elements.urlInput.value = "https://bamotch.github.io/bamotchqr2";
        }
        
        if (!elements.wifiSsid.value) {
            elements.wifiSsid.value = "MonWiFiMaison";
            elements.wifiPassword.value = "MotDePasse123";
        }
        
        if (!elements.contactName.value) {
            elements.contactName.value = "TAHIROU DESIGN";
            elements.contactPhone.value = "+221 77 123 45 67";
            elements.contactEmail.value = "contact@tahirou.com";
        }
    }

    // ========== GÉNÉRATION DU QR CODE ==========
    function generateQRCode() {
        // Récupérer le contenu selon le tab actif
        const activeTab = document.querySelector(".tab.active");
        const type = activeTab ? activeTab.dataset.type : "text";
        
        let content = "";
        
        switch(type) {
            case "text":
                content = elements.textInput.value.trim();
                if (!content) {
                    alert("Veuillez entrer du texte");
                    return;
                }
                break;
                
            case "url":
                let url = elements.urlInput.value.trim();
                if (!url) {
                    alert("Veuillez entrer une URL");
                    return;
                }
                if (!url.startsWith("http://") && !url.startsWith("https://")) {
                    url = "https://" + url;
                }
                content = url;
                break;
                
            case "wifi":
                const ssid = elements.wifiSsid.value.trim();
                const password = elements.wifiPassword.value.trim();
                const security = elements.wifiSecurity.value;
                
                if (!ssid) {
                    alert('Veuillez entrer le nom du réseau Wi-Fi');
                    return;
                }
                
                if (security === "nopass") {
                    content = `WIFI:S:${ssid};T:nopass;;`;
                } else {
                    if (!password) {
                        alert("Veuillez entrer le mot de passe Wi-Fi");
                        return;
                    }
                    content = `WIFI:S:${ssid};T:${security};P:${password};;`;
                }
                break;
                
            case "contact":
                const name = elements.contactName.value.trim();
                const phone = elements.contactPhone.value.trim();
                const email = elements.contactEmail.value.trim();
                
                if (!name && !phone && !email) {
                    alert('Veuillez entrer au moins une information de contact');
                    return;
                }
                
                let vcard = "BEGIN:VCARD\nVERSION:3.0\n";
                if (name) vcard += `FN:${name}\n`;
                if (phone) vcard += `TEL:${phone}\n`;
                if (email) vcard += `EMAIL:${email}\n`;
                vcard += "END:VCARD";
                
                content = vcard;
                break;
        }
        
        currentContent = content;
        
        // Effacer l'ancien QR code
        elements.qrcodeDiv.innerHTML = "";
        
        // Cacher le placeholder et montrer les infos
        elements.qrPlaceholder.style.display = "none";
        elements.qrInfo.style.display = "block";
        
        // Générer le QR code avec QRCode.js
        try {
            const errorCorrection = {
                'L': QRCode.CorrectLevel.L,
                'M': QRCode.CorrectLevel.M,
                'Q': QRCode.CorrectLevel.Q,
                'H': QRCode.CorrectLevel.H
            };
            
            currentQR = new QRCode(elements.qrcodeDiv, {
                text: content,
                width: config.size,
                height: config.size,
                colorDark: config.color,
                colorLight: config.bgColor,
                correctLevel: errorCorrection[config.errorLevel] || QRCode
