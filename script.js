// Gestion des tabs
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des éléments
    const tabs = document.querySelectorAll('.tab');
    const inputGroups = document.querySelectorAll('.input-group');
    const qrSize = document.getElementById('qr-size');
    const sizeValue = document.getElementById('size-value');
    const generateBtn = document.getElementById('generate-btn');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const downloadPngBtn = document.getElementById('download-png');
    const downloadSvgBtn = document.getElementById('download-svg');
    const downloadJpgBtn = document.getElementById('download-jpg');
    const saveHistoryBtn = document.getElementById('save-history');
    const loadHistoryBtn = document.getElementById('load-history');
    const historyList = document.getElementById('history-list');
    const imageFileInput = document.getElementById('image-file');
    const imagePreview = document.getElementById('image-preview');

    let currentQrCode = null;
    let currentQrContent = '';
    let currentQrType = 'text';
    
    // Mettre à jour l'année automatiquement
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Afficher la valeur de la taille
    qrSize.addEventListener('input', function() {
        sizeValue.textContent = this.value + 'px';
    });
    
    // Gestion des couleurs prédéfinies
    const presetButtons = document.querySelectorAll('.preset-btn');
    const qrColorInput = document.getElementById('qr-color');
    const qrBgInput = document.getElementById('qr-bg');
    
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            const bg = this.getAttribute('data-bg');
            
            // Mettre à jour les inputs couleur
            qrColorInput.value = color;
            qrBgInput.value = bg;
            
            // Mettre en surbrillance le bouton sélectionné
            presetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Si un QR code est déjà généré, le regénérer avec les nouvelles couleurs
            if (currentQrCode) {
                setTimeout(() => {
                    generateBtn.click();
                }, 300);
            }
        });
    });
    
    // Gestion des tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Mettre à jour l'onglet actif
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mettre à jour le type de contenu
            currentQrType = type;
            
            // Afficher le groupe d'input correspondant
            inputGroups.forEach(group => {
                group.classList.remove('active');
                if (group.id === `${type}-input`) {
                    group.classList.add('active');
                }
            });
        });
    });
    
    // Prévisualisation d'image
    imageFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Vérifier la taille du fichier (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('L\'image est trop volumineuse. Maximum 5MB.');
                this.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Aperçu de l'image" style="max-width: 200px; border-radius: 5px;">`;
            };
            reader.onerror = function() {
                alert('Erreur lors du chargement de l\'image');
                imageFileInput.value = '';
                imagePreview.innerHTML = '';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });
    
    // Génération du QR code
    generateBtn.addEventListener('click', generateQRCode);
    
    // Téléchargement en PNG
    downloadPngBtn.addEventListener('click', function() {
        if (currentQrCode) {
            const canvas = document.querySelector('#qrcode canvas');
            if (canvas) {
                const link = document.createElement('a');
                const timestamp = new Date().getTime();
                link.download = `bamotch-qr-${timestamp}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                // Message de confirmation
                showNotification('QR code téléchargé en PNG!');
            }
        }
    });
    
    // Téléchargement en SVG
    downloadSvgBtn.addEventListener('click', function() {
        if (currentQrCode) {
            const svg = document.querySelector('#qrcode svg');
            if (svg) {
                const serializer = new XMLSerializer();
                const source = serializer.serializeToString(svg);
                
                // Appliquer les couleurs actuelles au SVG avant téléchargement
                const color = qrColorInput.value;
                const bgColor = qrBgInput.value;
                const styledSource = source.replace(/fill="#[0-9a-fA-F]{6}"/g, function(match) {
                    if (match.includes('fill="#ffffff"')) {
                        return `fill="${bgColor}"`;
                    } else {
                        return `fill="${color}"`;
                    }
                });
                
                const blob = new Blob([styledSource], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const timestamp = new Date().getTime();
                link.download = `bamotch-qr-${timestamp}.svg`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                
                showNotification('QR code téléchargé en SVG!');
            }
        }
    });
    
    // Téléchargement en JPG
    downloadJpgBtn.addEventListener('click', function() {
        if (currentQrCode) {
            const canvas = document.querySelector('#qrcode canvas');
            if (canvas) {
                // Créer un canvas avec fond blanc pour JPG
                const tempCanvas = document.createElement('canvas');
                const ctx = tempCanvas.getContext('2d');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                
                // Remplir avec la couleur de fond
                ctx.fillStyle = qrBgInput.value;
                ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                
                // Dessiner le QR code
                ctx.drawImage(canvas, 0, 0);
                
                const link = document.createElement('a');
                const timestamp = new Date().getTime();
                link.download = `bamotch-qr-${timestamp}.jpg`;
                link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
                link.click();
                
                showNotification('QR code téléchargé en JPG!');
            }
        }
    });
    
    // Fonction pour afficher une notification
    function showNotification(message) {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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
    
    // Sauvegarde dans l'historique
    saveHistoryBtn.addEventListener('click', saveToHistory);
    
    // Chargement de l'historique
    loadHistoryBtn.addEventListener('click', loadHistory);
    
    // Fonction pour générer le QR code
    function generateQRCode() {
        // Récupérer les données en fonction du type
        let content = '';
        
        switch(currentQrType) {
            case 'text':
                content = document.getElementById('text-content').value.trim();
                if (!content) {
                    alert('Veuillez entrer du texte à encoder');
                    return;
                }
                break;
                
            case 'url':
                let url = document.getElementById('url-content').value.trim();
                if (!url) {
                    alert('Veuillez entrer une URL');
                    return;
                }
                if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                content = url;
                break;
                
            case 'wifi':
                const ssid = document.getElementById('wifi-ssid').value.trim();
                const password = document.getElementById('wifi-password').value.trim();
                const security = document.getElementById('wifi-security').value;
                
                if (!ssid) {
                    alert('Veuillez entrer le nom du réseau Wi-Fi');
                    return;
                }
                
                if (security === 'nopass') {
                    content = `WIFI:S:${ssid};T:nopass;;`;
                } else {
                    content = `WIFI:S:${ssid};T:${security};P:${password};;`;
                }
                break;
                
            case 'contact':
                const name = document.getElementById('contact-name').value.trim();
                const phone = document.getElementById('contact-phone').value.trim();
                const email = document.getElementById('contact-email').value.trim();
                
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
                
            case 'image':
                const file = imageFileInput.files[0];
                if (!file) {
                    alert('Veuillez sélectionner une image');
                    return;
                }
                
                // Pour les images, nous créons un format spécial JSON
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Créer un objet avec les métadonnées de l'image
                    const imageData = {
                        type: 'image',
                        filename: file.name,
                        size: file.size,
                        mimeType: file.type,
                        dataUrl: event.target.result,
                        timestamp: new Date().toISOString(),
                        note: 'Image encodée par BAMOTCH QR'
                    };
                    
                    // Convertir en JSON pour le QR code
                    content = JSON.stringify(imageData);
                    
                    // Ajouter un préfixe pour identifier
                    content = 'BAMOTCH_IMAGE:' + content;
                    
                    generateQRCodeWithContent(content, 'image');
                };
                
                reader.onerror = function() {
                    alert('Erreur lors de la lecture de l\'image');
                };
                
                reader.readAsDataURL(file);
                return; // Retourner ici car la génération est asynchrone
        }
        
        if (!content) {
            alert('Veuillez entrer du contenu à encoder');
            return;
        }
        
        generateQRCodeWithContent(content, currentQrType);
    }
    
    function generateQRCodeWithContent(content, type) {
        // Enregistrer le contenu actuel
        currentQrContent = content;
        currentQrType = type;
        
        // Effacer l'ancien QR code
        qrcodeDiv.innerHTML = '';
        
        // Récupérer les options
        const size = parseInt(document.getElementById('qr-size').value);
        const color = document.getElementById('qr-color').value;
        const bgColor = document.getElementById('qr-bg').value;
        const errorCorrection = document.getElementById('qr-error').value;
        
        try {
            // Générer le nouveau QR code
            currentQrCode = new QRCode(qrcodeDiv, {
                text: content,
                width: size,
                height: size,
                colorDark: color,
                colorLight: bgColor,
                correctLevel: QRCode.CorrectLevel[errorCorrection]
            });
            
            // Masquer le placeholder et afficher le QR code
            qrPlaceholder.style.display = 'none';
            qrcodeDiv.style.display = 'flex';
            
            // Activer les boutons de téléchargement
            downloadPngBtn.disabled = false;
            downloadSvgBtn.disabled = false;
            downloadJpgBtn.disabled = false;
            
            // Appliquer les couleurs au SVG après un délai
            setTimeout(() => {
                const svg = qrcodeDiv.querySelector('svg');
                if (svg) {
                    const paths = svg.querySelectorAll('path');
                    if (paths.length >= 2) {
                        paths[0].style.fill = bgColor; // Fond
                        paths[1].style.fill = color;   // Modules
                    }
                }
                
                // Afficher un message de succès
                showNotification('QR code généré avec succès!');
            }, 100);
            
        } catch (error) {
            console.error('Erreur lors de la génération du QR code:', error);
            alert('Erreur lors de la génération du QR code. Veuillez réessayer avec moins de données.');
        }
    }
    
    // Fonction pour sauvegarder dans l'historique
    function saveToHistory() {
        if (!currentQrContent) {
            alert('Veuillez d\'abord générer un QR code');
            return;
        }
        
        // Créer l'élément d'historique
        const historyItem = {
            type: currentQrType,
            content: '',
            fullContent: currentQrContent,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        // Créer un aperçu du contenu
        if (currentQrType === 'image' && currentQrContent.startsWith('BAMOTCH_IMAGE:')) {
            historyItem.content = '📷 Image: ' + currentQrContent.substring(14, 50) + '...';
        } else if (currentQrType === 'text') {
            historyItem.content = '📝 ' + (currentQrContent.length > 40 
                ? currentQrContent.substring(0, 40) + '...' 
                : currentQrContent);
        } else if (currentQrType === 'url') {
            historyItem.content = '🔗 ' + (currentQrContent.length > 40 
                ? currentQrContent.substring(0, 40) + '...' 
                : currentQrContent);
        } else if (currentQrType === 'wifi') {
            historyItem.content = '📶 QR Code Wi-Fi';
        } else if (currentQrType === 'contact') {
            historyItem.content = '👤 Carte de contact';
        } else {
            historyItem.content = currentQrContent.length > 50 
                ? currentQrContent.substring(0, 50) + '...' 
                : currentQrContent;
        }
        
        // Si Firebase est configuré
        if (typeof db !== 'undefined' && db.collection) {
            db.collection("history").add(historyItem)
                .then((docRef) => {
                    console.log("Document écrit avec ID: ", docRef.id);
                    showNotification('QR code sauvegardé dans l\'historique cloud!');
                    loadHistory();
                })
                .catch((error) => {
                    console.error("Erreur lors de l'ajout du document: ", error);
                    // Fallback: utiliser le stockage local
                    saveToLocalHistory(historyItem);
                });
        } else {
            // Utiliser le stockage local comme fallback
            saveToLocalHistory(historyItem);
        }
    }
    
    // Fonction pour sauvegarder dans le stockage local
    function saveToLocalHistory(item) {
        let history = JSON.parse(localStorage.getItem('bamotch-qr-history')) || [];
        history.unshift(item);
        
        // Garder seulement les 20 derniers éléments
        if (history.length > 20) {
            history = history.slice(0, 20);
        }
        
        localStorage.setItem('bamotch-qr-history', JSON.stringify(history));
        showNotification('QR code sauvegardé dans l\'historique local!');
        loadHistory();
    }
    
    // Fonction pour charger l'historique
    function loadHistory() {
        historyList.innerHTML = '';
        
        // Si Firebase est configuré
        if (typeof db !== 'undefined' && db.collection) {
            db.collection("history")
                .orderBy("timestamp", "desc")
                .limit(20)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        historyList.innerHTML = '<p class="empty-history">Aucun historique trouvé</p>';
                        return;
                    }
                    
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        addHistoryItemToDOM(data, doc.id);
                    });
                })
                .catch((error) => {
                    console.error("Erreur lors du chargement de l'historique: ", error);
                    // Fallback: utiliser le stockage local
                    loadLocalHistory();
                });
        } else {
            // Utiliser le stockage local comme fallback
            loadLocalHistory();
        }
    }
    
    // Fonction pour charger l'historique local
    function loadLocalHistory() {
        const history = JSON.parse(localStorage.getItem('bamotch-qr-history')) || [];
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="empty-history">Aucun historique trouvé</p>';
            return;
        }
        
        history.forEach((item, index) => {
            addHistoryItemToDOM(item, 'local-' + index);
        });
    }
    
    // Fonction pour ajouter un élément d'historique au DOM
    function addHistoryItemToDOM(item, id) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.id = 'history-' + id;
        
        // Icône selon le type
        let icon = 'fa-font';
        switch(item.type) {
            case 'url': icon = 'fa-link'; break;
            case 'wifi': icon = 'fa-wifi'; break;
            case 'contact': icon = 'fa-user'; break;
            case 'image': icon = 'fa-image'; break;
            default: icon = 'fa-font';
        }
        
        historyItem.innerHTML = `
            <div style="display: flex; align-items: center;">
                <i class="fas ${icon}" style="color: #2575fc; font-size: 14px;"></i>
                <span class="history-content">${item.content}</span>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="history-date">${item.date}</span>
                <button class="history-action" onclick="loadFromHistory('${item.type}', '${encodeURIComponent(item.fullContent)}')" title="Charger ce QR code">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    }
    
    // Initialisation: charger l'historique au démarrage
    setTimeout(loadHistory, 1000);
});

// Fonction pour charger à partir de l'historique
window.loadFromHistory = function(type, encodedContent) {
    const content = decodeURIComponent(encodedContent);
    
    // Mettre à jour l'onglet actif
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-type') === type) {
            tab.classList.add('active');
        }
    });
    
    // Afficher le bon groupe d'input
    document.querySelectorAll('.input-group').forEach(group => {
        group.classList.remove('active');
        if (group.id === `${type}-input`) {
            group.classList.add('active');
        }
    });
    
    // Remplir les champs selon le type
    switch(type) {
        case 'text':
            document.getElementById('text-content').value = content;
            break;
        case 'url':
            document.getElementById('url-content').value = content;
            break;
        case 'wifi':
            // Essayer d'extraire les données Wi-Fi du format QR
            if (content.startsWith('WIFI:')) {
                const parts = content.split(';');
                let ssid = '', password = '', security = 'WPA';
                
                parts.forEach(part => {
                    if (part.startsWith('S:')) ssid = part.substring(2);
                    if (part.startsWith('P:')) password = part.substring(2);
                    if (part.startsWith('T:')) security = part.substring(2);
                });
                
                document.getElementById('wifi-ssid').value = ssid;
                document.getElementById('wifi-password').value = password;
                document.getElementById('wifi-security').value = security || 'WPA';
            }
            break;
        case 'contact':
            // Essayer d'extraire les données de contact du format vCard
            if (content.includes('VCARD')) {
                const lines = content.split('\n');
                let name = '', phone = '', email = '';
                
                lines.forEach(line => {
                    if (line.startsWith('FN:')) name = line.substring(3);
                    if (line.startsWith('TEL:')) phone = line.substring(4);
                    if (line.startsWith('EMAIL:')) email = line.substring(6);
                });
                
                document.getElementById('contact-name').value = name;
                document.getElementById('contact-phone').value = phone;
                document.getElementById('contact-email').value = email;
            }
            break;
        case 'image':
            // Pour les images encodées dans notre format spécial
            if (content.startsWith('BAMOTCH_IMAGE:')) {
                try {
                    const jsonStr = content.substring('BAMOTCH_IMAGE:'.length);
                    const imageData = JSON.parse(jsonStr);
                    
                    // Afficher l'image dans l'aperçu
                    const imagePreview = document.getElementById('image-preview');
                    imagePreview.innerHTML = `<img src="${imageData.dataUrl}" alt="Image chargée" style="max-width: 200px; border-radius: 5px;">`;
                    
                    // Mettre à jour le fichier input (complexe, on laisse juste l'aperçu)
                    // Note: On ne peut pas définir la valeur d'un input file par sécurité
                    
                    // Afficher un message informatif
                    alert('Image chargée depuis l\'historique. Cliquez sur "Générer" pour recréer le QR code.');
                } catch (error) {
                    console.error('Erreur lors du chargement de l\'image:', error);
                    alert('Format d\'image non reconnu');
                }
            } else if (content.startsWith('data:image')) {
                // Pour les anciennes images en data URL
                document.getElementById('image-preview').innerHTML = 
                    `<img src="${content}" alt="Image chargée" style="max-width: 200px; border-radius: 5px;">`;
            }
            break;
    }
    
    // Générer automatiquement le QR code après un court délai
    setTimeout(() => {
        document.getElementById('generate-btn').click();
    }, 500);
};
