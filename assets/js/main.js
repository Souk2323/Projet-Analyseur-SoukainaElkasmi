let texteBrut = "";

// 1. Lecture du fichier (Page 7 et 9)
document.getElementById('fileInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        texteBrut = event.target.result;
        document.getElementById('affichageGauche').value = texteBrut;
    };
    reader.readAsText(e.target.files[0]);
});

// 2. Bouton Bonjour personnalisé (Page 7)
document.getElementById('btnBonjour').onclick = () => {
    alert("Bienvenue sur l'analyseur de Soukaina !");
};

// 3. Aide (Affichage/Masquage - Page 9)
document.getElementById('btnAide').onclick = () => {
    const aide = "Chargez un fichier texte, réglez les délimiteurs et cliquez sur Segmentation.";
    alert(aide);
};

// 4. Segmentation avec Expressions Régulières (Pages 12-14)
document.getElementById('btnSegmentation').onclick = () => {
    const d = document.getElementById('delims').value;
    
    // On crée la RegExp comme à la page 13 du cours
    const re = new RegExp(d, "g"); 
    
    // Découpage (split) comme indiqué à la page 14
    const tokens = texteBrut.split(re).filter(mot => mot.length > 0);
    
    // Affichage dans la zone de droite (Page 9)
    document.getElementById('affichageDroit').innerText = tokens.join(" | ");
    document.getElementById('stats').innerText = "Nombre de formes : " + tokens.length;
};
