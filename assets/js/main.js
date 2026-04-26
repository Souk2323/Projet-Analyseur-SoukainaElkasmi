/* PROJET : Analyseur de Texte - Soukaina 
   Ce script permet de charger un fichier et de découper le texte.
*/

let texteBrut = ""; 

// 1. Charger le fichier .txt
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteBrut = event.target.result;
        document.getElementById('affichageGauche').innerText = texteBrut;
    };
    reader.readAsText(file);
});

// 2. Segmentation (Découpage du texte)
document.getElementById('btnSegmentation').addEventListener('click', function() {
    const d = document.getElementById('delims').value;
    if (texteBrut === "") {
        alert("Attention : Chargez d'abord un fichier .txt !");
        return;
    }
    // Création de la règle de découpage (RegExp)
    const escapeRegex = d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp("[" + escapeRegex + "]", "g");
    
    // On remplace les délimiteurs par des espaces et on coupe
    const tokens = texteBrut.replace(re, " ").split(/\s+/).filter(m => m.length > 0);
    
    document.getElementById('affichageDroit').innerText = tokens.join(" | ");
    document.getElementById('stats').innerText = "Nombre de formes : " + tokens.length;
});

// 3. Bouton Bonjour
document.getElementById('btnBonjour').addEventListener('click', function() {
    alert("Bonjour Soukaina ! Bienvenue sur ton analyseur.");
});

// 4. Bouton Aide
document.getElementById('btnAide').addEventListener('click', function() {
    const aide = document.getElementById('aide');
    aide.style.display = (aide.style.display === "none") ? "block" : "none";
});
