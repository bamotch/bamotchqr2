// Configuration Firebase pour BAMOTCH QR
// REMPLACEZ ces valeurs par VOTRE configuration Firebase

const firebaseConfig = {
  apiKey: "AIzaSyClTQ0NuPL1C_e8pGIuWvfV1hcAju71KIM",
  authDomain: "tpmail2-c1323.firebaseapp.com",
  projectId: "tpmail2-c1323",
  storageBucket: "tpmail2-c1323.firebasestorage.app",
  messagingSenderId: "975398690260",
  appId: "1:975398690260:web:057de0847f559b246e0a41"
};

// Initialiser Firebase
try {
    // Initialiser Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Initialiser Firestore
    const db = firebase.firestore();
    
    console.log("✅ Firebase initialisé avec succès!");
    console.log("✅ Base de données Firestore prête!");
    
    // Exposer db globalement
    window.db = db;
    
    // Test de connexion (optionnel)
    setTimeout(() => {
        db.collection("connection_test").add({
            test: "Connexion Firebase établie",
            timestamp: new Date().toISOString(),
            app: "BAMOTCH QR"
        }).then(() => {
            console.log("✅ Test de connexion Firestore réussi!");
        }).catch(error => {
            console.warn("⚠️ Test Firestore échoué (peut être normal si pas de règles):", error);
        });
    }, 2000);
    
} catch (error) {
    console.error("❌ Erreur d'initialisation Firebase:", error);
    console.log("ℹ️ L'application fonctionnera en mode local sans Firebase");
    
    // Créer un objet db factice pour éviter les erreurs
    window.db = {
        collection: () => ({
            add: () => Promise.reject("Firebase non configuré"),
            get: () => Promise.reject("Firebase non configuré"),
            orderBy: () => ({
                limit: () => ({
                    get: () => Promise.reject("Firebase non configuré")
                })
            })
        })
    };
}

// Note: Pour obtenir votre propre configuration Firebase:
// 1. Allez sur https://firebase.google.com/
// 2. Créez un compte gratuit
// 3. Créez un nouveau projet "BAMOTCH-QR"
// 4. Dans "Paramètres du projet" > "Vos applications" > "Application Web"
// 5. Copiez la configuration et remplacez les valeurs ci-dessus
// 6. Activez Firestore Database dans le menu "Build" > "Firestore Database"
