/**
 * Script d'analyse de texte pour le TP de segmentation
 * Auteur : [Ton Prénom / Ton Nom]
 */

let texteAnalyse = "";

// 1. Gestion du chargement du fichier
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        
        // Mise à jour de l'interface
        const cadre = document.querySelector('.cadre-bonjour');
        if(cadre) cadre.innerText = "Fichier chargé avec succès !";
        
        document.getElementById('affichageDroit').innerHTML = 
            `<p style="color: green;">Prêt pour l'analyse de : <strong>${file.name}</strong></p>`;
    };
    reader.readAsText(file);
});

// 2. Logique de découpage (Segmentation)
function preparerMots() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord charger un fichier .txt");
        return [];
    }
    
    // Récupération des délimiteurs personnalisés ou par défaut
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput && delimInput.value ? delimInput.value : " ,;.'!?-";
    
    // Création de la regex (on échappe les caractères spéciaux)
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// 3. Fonction de segmentation visuelle
function segmenter() { 
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');

    if (mots.length === 0) return;

    let html = `<h3>Résultat de la segmentation</h3>`;
    html += `<p>Nombre total de tokens détectés : <strong>${mots.length}</strong></p>`;
    html += "<div style='display:flex; flex-wrap:wrap; gap:5px; border:1px solid #ccc; padding:10px;'>";

    // Affichage de chaque mot dans un petit bloc
    mots.forEach(mot => {
        html += `<span style='background:#eee; border:1px solid #ddd; padding:2px 5px; font-size:0.9em;'>${mot}</span>`;
    });

    html += "</div>";
    zone.innerHTML = html;
}

// 4. Fonction personnalisée : Mode Kujuj
function kujuj() {
    const mots = preparerMots();
    if (mots.length === 0) return;

    // Transformation : Majuscules et séparateur spécial
    const resultatKujuj = mots.map(m => m.toUpperCase()).join(" + ");
    
    document.getElementById('affichageDroit').innerHTML = `
        <div style="background:#222; color:#7cfc00; padding:15px; border-radius:5px; font-family:monospace;">
            <h3>[ MODE KUJUJ ACTIVÉ ]</h3>
            <p>${resultatKujuj}</p>
        </div>
    `;
    console.log("Exécution du mode personnalisé Kujuj terminée.");
}

// --- Autres fonctions d'analyse ---

function nombrePhrases() {
    if (!texteAnalyse) return;
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0);
    document.getElementById('affichageDroit').innerHTML = 
        `<p>Le texte contient <strong>${phrases.length}</strong> phrases.</p>`;
}

function dictionnaire() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    
    let freq = {};
    mots.forEach(m => {
        let mot = m.toLowerCase();
        freq[mot] = (freq[mot] || 0) + 1;
    });

    let html = "<h3>Top 8 des fréquences</h3><table border='1' style='width:100%; text-align:left;'>";
    html += "<tr><th>Mot</th><th>Occurrences</th></tr>";
    
    Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 8).forEach(([m, f]) => {
        html += `<tr><td>${m}</td><td>${f}</td></tr>`;
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}
