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
    
    // Afficher la valeur de la taille
    qrSize.addEventListener('input', function() {
        sizeValue.textContent = this.value + 'px';
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
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.innerHTML = `<img src="${event.target.result}" alt="Aperçu de l'image">`;
            };
            reader.readAsDataURL(file);
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
                link.download = `bamotch-qr-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
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
                const blob = new Blob([source], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `bamotch-qr-${Date.now()}.svg`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            }
        }
    });
    
    // Téléchargement en JPG
    downloadJpgBtn.addEventListener('click', function() {
        if (currentQrCode) {
            const canvas = document.querySelector('#qrcode canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = `bamotch-qr-${Date.now()}.jpg`;
                link.href = canvas.toDataURL('image/jpeg', 0.9);
                link.click();
            }
        }
    });
    
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
                break;
                
            case 'url':
                let url = document.getElementById('url-content').value.trim();
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
                
                // Pour les images, on utilise l'URL de données
                const reader = new FileReader();
                reader.onload = function(event) {
                    content = event.target.result;
                    generateQRCodeWithContent(content, 'image');
                };
                reader.readAsDataURL(file);
                return;
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
        qrcodeDiv.style.display = 'block';
        
        // Activer les boutons de téléchargement
        downloadPngBtn.disabled = false;
        downloadSvgBtn.disabled = false;
        downloadJpgBtn.disabled = false;
        
        // Pour les SVG, nous devons appliquer les couleurs
        setTimeout(() => {
            const svg = qrcodeDiv.querySelector('svg');
            if (svg) {
                const paths = svg.querySelectorAll('path');
                paths[0].style.fill = bgColor;
                paths[1].style.fill = color;
            }
        }, 100);
    }
    
    // Fonction pour sauvegarder dans l'historique
    function saveToHistory() {
        if (!currentQrContent) {
            alert('Veuillez d\'abord générer un QR code');
            return;
        }
        
        // Si Firebase est configuré
        if (typeof db !== 'undefined') {
            const historyItem = {
                type: currentQrType,
                content: currentQrContent.length > 100 ? currentQrContent.substring(0, 100) + '...' : currentQrContent,
                fullContent: currentQrContent,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleString('fr-FR')
            };
            
            // Ajouter à Firestore
            db.collection("history").add(historyItem)
                .then((docRef) => {
                    console.log("Document écrit avec ID: ", docRef.id);
                    alert('QR code sauvegardé dans l\'historique!');
                })
                .catch((error) => {
                    console.error("Erreur lors de l'ajout du document: ", error);
                    // Fallback: utiliser le stockage local
                    saveToLocalHistory(historyItem);
                });
        } else {
            // Utiliser le stockage local comme fallback
            const historyItem = {
                type: currentQrType,
                content: currentQrContent.length > 100 ? currentQrContent.substring(0, 100) + '...' : currentQrContent,
                fullContent: currentQrContent,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleString('fr-FR')
            };
            
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
        alert('QR code sauvegardé dans l\'historique local!');
        loadHistory();
    }
    
    // Fonction pour charger l'historique
    function loadHistory() {
        historyList.innerHTML = '';
        
        // Si Firebase est configuré
        if (typeof db !== 'undefined') {
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
                        addHistoryItemToDOM(data);
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
        
        history.forEach(item => {
            addHistoryItemToDOM(item);
        });
    }
    
    // Fonction pour ajouter un élément d'historique au DOM
    function addHistoryItemToDOM(item) {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        // Icône selon le type
        let icon = 'fa-font';
        switch(item.type) {
            case 'url': icon = 'fa-link'; break;
            case 'wifi': icon = 'fa-wifi'; break;
            case 'contact': icon = 'fa-user'; break;
            case 'image': icon = 'fa-image'; break;
        }
        
        historyItem.innerHTML = `
            <div>
                <i class="fas ${icon}"></i>
                <span class="history-content">${item.content}</span>
            </div>
            <div>
                <span class="history-date">${item.date}</span>
                <button class="history-action" onclick="loadFromHistory('${item.type}', '${encodeURIComponent(item.fullContent)}')">
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    }
    
    // Initialisation: charger l'historique au démarrage
    loadHistory();
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
            // Pour les images, le contenu est une URL de données
            document.getElementById('image-preview').innerHTML = `<img src="${content}" alt="Image chargée">`;
            break;
    }
    
    // Générer automatiquement le QR code
    document.getElementById('generate-btn').click();
};
