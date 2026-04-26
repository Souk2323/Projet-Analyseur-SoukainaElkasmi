// Variable pour stocker le contenu du fichier texte
let texteBrut = "";

// 1. Fonction pour lire le fichier (Page 7 du cours)
document.getElementById('fileInput').addEventListener('change', function(e) {
    const fichier = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
        texteBrut = event.target.result;
        // On affiche le texte dans la zone de gauche
        document.getElementById('affichageGauche').value = texteBrut;
    };
    
    reader.readAsText(fichier);
});

// 2. Bouton Bonjour
document.getElementById('btnBonjour').onclick = () => {
    alert("Bonjour Soukaina ! Bienvenue sur mon analyseur.");
};

// 3. Bouton Aide (Page 9 du cours)
document.getElementById('btnAide').onclick = () => {
    alert("Instructions :\n1. Choisissez un fichier .txt\n2. Vérifiez les délimiteurs\n3. Cliquez sur Segmenter");
};

// 4. Fonction de Segmentation (Pages 12, 13 et 14 du cours)
document.getElementById('btnSegmentation').onclick = () => {
    // On récupère les délimiteurs écrits dans la petite case
    const delimSaisis = document.getElementById('delims').value;
    
    // On crée l'Expression Régulière (comme à la page 13)
    const re = new RegExp(delimSaisis, "g");
    
    // On découpe le texte (split) et on enlève les cases vides (filter)
    const tableauMots = texteBrut.split(re).filter(mot => mot.length > 0);
    
    // Affichage du résultat à droite (Page 9)
    // On rejoint les mots avec un trait vertical |
    document.getElementById('affichageDroit').innerText = tableauMots.join(" | ");
    
    // Mise à jour du nombre de formes
    document.getElementById('stats').innerText = "Nombre de formes : " + tableauMots.length;
};

// 5. Optionnel : Bouton Dictionnaire (si tu as mis le bouton)
if (document.getElementById('btnDictionnaire')) {
    document.getElementById('btnDictionnaire').onclick = () => {
        const delimSaisis = document.getElementById('delims').value;
        const re = new RegExp(delimSaisis, "g");
        const tableauMots = texteBrut.toLowerCase().split(re).filter(m => m.length > 0);
        
        let dico = {};
        tableauMots.forEach(mot => {
            dico[mot] = (dico[mot] || 0) + 1;
        });
        
        let resultat = "Fréquences :\n";
        for (let mot in dico) {
            resultat += mot + " : " + dico[mot] + "\n";
        }
        document.getElementById('affichageDroit').innerText = resultat;
    };
}
