# BAMOTCH QR

Générateur de QR codes gratuit pour convertir du texte, des liens, des informations Wi-Fi, des contacts et des images en QR codes.

## Fonctionnalités

- **Génération de QR codes à partir de:**
  - 📝 Texte libre
  - 🔗 Liens URL
  - 📶 Informations Wi-Fi (SSID, mot de passe, type de sécurité)
  - 👤 Cartes de contact (vCard)
  - 🖼️ Images (encodées dans le QR code)

- **Personnalisation avancée:**
  - 🎨 8 combinaisons de couleurs prédéfinies qui s'accordent
  - 🎯 Taille ajustable (100px à 400px)
  - 🛡️ Niveaux de correction d'erreur (7% à 30%)
  - 🎨 Couleurs personnalisables (avant-plan et arrière-plan)

- **Export multiple:**
  - 📥 PNG (format standard)
  - 📥 SVG (vectoriel, échelle infinie)
  - 📥 JPG (pour le web)

- **Historique:**
  - 💾 Sauvegarde locale (navigateur)
  - ☁️ Sauvegarde cloud avec Firebase (optionnel)
  - 🔄 Chargement rapide depuis l'historique

## Comment utiliser

1. **Choisissez le type de contenu** en cliquant sur l'onglet correspondant
2. **Entrez vos données** dans le formulaire
3. **Sélectionnez une couleur prédéfinie** ou personnalisez les couleurs
4. **Ajustez la taille** et la correction d'erreur
5. **Cliquez sur "Générer le QR Code"**
6. **Téléchargez** dans le format de votre choix

## Pour les images

Pour générer un QR code à partir d'une image:
1. Cliquez sur l'onglet "Image"
2. Sélectionnez une image depuis votre appareil (max 5MB)
3. L'image sera convertie en format spécial et encodée dans le QR code
4. Pour décoder: scannez le QR code avec BAMOTCH QR

## Déploiement

### Hébergement gratuit sur GitHub Pages
1. Tous les fichiers sont prêts pour GitHub Pages
2. Le site est entièrement statique (HTML/CSS/JS)
3. Aucun serveur backend nécessaire

### Configuration Firebase (optionnel)
Pour activer l'historique cloud:
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet gratuit
3. Activez Firestore Database
4. Créez une application web
5. Copiez la configuration dans `firebase-config.js`

## Fichiers du projet

- `index.html` - Page principale
- `style.css` - Styles CSS
- `script.js` - Logique JavaScript principale
- `firebase-config.js` - Configuration Firebase
- `README.md` - Documentation

## Technologies utilisées

- HTML5, CSS3, JavaScript vanilla
- [QRCode.js](https://davidshimjs.github.io/qrcodejs/) - Génération de QR codes
- Firebase Firestore - Stockage cloud (optionnel)
- GitHub Pages - Hébergement gratuit
- Font Awesome - Icônes

## Sécurité et confidentialité

- Tous les QR codes sont générés localement dans votre navigateur
- Aucune donnée n'est envoyée à des serveurs externes (sauf si Firebase est configuré)
- Les images sont converties en Data URLs et restent dans votre navigateur
- Le code source est entièrement ouvert et transparent

## Auteur

**Développé par TAHIROU DESIGN STUDIO**  
© 2024 BAMOTCH QR - Tous droits réservés

## Licence

Ce projet est open-source et disponible gratuitement pour un usage personnel et commercial.
