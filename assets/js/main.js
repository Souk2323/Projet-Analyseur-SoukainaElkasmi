let texteBrut = "";

// Chargement du fichier
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        texteBrut = event.target.result;
        document.getElementById('resultats').innerHTML = "<h3>Fichier chargé avec succès !</h3>";
    };
    reader.readAsText(file);
});

// Aide à la découpe (nettoyage)
function obtenirMots() {
    const delims = document.getElementById('delims').value;
    const regex = new RegExp("[" + delims.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteBrut.split(regex).filter(m => m.length > 0);
}

// 1. Segmentation / Tokens
function segmenter() {
    if (!texteBrut) return alert("Veuillez charger un fichier.");
    const mots = obtenirMots();
    document.getElementById('resultats').innerHTML = `<h3>Tokens détectés : ${mots.length}</h3><p>${mots.slice(0, 50).join(' | ')}...</p>`;
}

// 2. Dictionnaire de fréquences
function genererDictionnaire() {
    const mots = obtenirMots();
    const stopwords = document.getElementById('stopwords').value.split(',');
    let dico = {};
    
    mots.forEach(m => {
        let mot = m.toLowerCase();
        if (!stopwords.includes(mot)) {
            dico[mot] = (dico[mot] || 0) + 1;
        }
    });

    let html = "<table><tr><th>Token</th><th>Fréquence</th></tr>";
    Object.keys(dico).sort((a,b) => dico[b] - dico[a]).slice(0, 10).forEach(mot => {
        html += `<tr><td>${mot}</td><td>${dico[mot]}</td></tr>`;
    });
    html += "</table>";
    document.getElementById('resultats').innerHTML = "<h3>Top 10 des mots fréquents</h3>" + html;
}

// 3. Concordancier
function concordancier() {
    const pole = document.getElementById('pole').value.toLowerCase();
    const taille = parseInt(document.getElementById('longueur').value);
    if (!pole) return alert("Entrez un mot pôle.");
    
    const mots = obtenirMots();
    let html = "<table><tr><th>Contexte Gauche</th><th>Pôle</th><th>Contexte Droit</th></tr>";
    
    mots.forEach((mot, i) => {
        if (mot.toLowerCase() === pole) {
            let gauche = mots.slice(Math.max(0, i - taille), i).join(" ");
            let droit = mots.slice(i + 1, i + 1 + taille).join(" ");
            html += `<tr><td>${gauche}</td><td style="font-weight:bold">${mot}</td><td>${droit}</td></tr>`;
        }
    });
    html += "</table>";
    document.getElementById('resultats').innerHTML = html;
}

// 4. Mots les plus longs
function motsPlusLongs() {
    const mots = [...new Set(obtenirMots())]; // Uniques
    mots.sort((a, b) => b.length - a.length);
    let html = "<table><tr><th>Mot</th><th>Longueur</th></tr>";
    mots.slice(0, 10).forEach(m => {
        html += `<tr><td>${m}</td><td>${m.length}</td></tr>`;
    });
    html += "</table>";
    document.getElementById('resultats').innerHTML = "<h3>Mots les plus longs</h3>" + html;
}

// 5. Nombre de phrases
function compterPhrases() {
    const phrases = texteBrut.split(/[.!?]+/).filter(p => p.trim().length > 0);
    document.getElementById('resultats').innerHTML = `<h3>Il y a ${phrases.length} phrases dans ce texte.</h3>`;
}
