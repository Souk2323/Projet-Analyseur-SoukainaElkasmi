let texteAnalyse = "";

// 1. Charger le fichier .txt
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        document.getElementById('affichageDroit').innerHTML = "Fichier chargé avec succès !";
    };
    reader.readAsText(file);
});

// 2. Fonction pour découper le texte en mots (Tokens)
function preparerMots() {
    const delimiteurs = document.getElementById('delims').value;
    // Crée une règle de découpe basée sur tes délimiteurs
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// 3. Bouton Segmentation
function segmenter() {
    if (!texteAnalyse) return alert("Veuillez d'abord charger un fichier !");
    const mots = preparerMots();
    document.getElementById('affichageDroit').innerHTML = `Nombre de tokens : ${mots.length}`;
    document.getElementById('stats').innerHTML = `Tokens : ${mots.length}`;
}

// 4. Bouton Dictionnaire (Mots fréquents)
function dictionnaire() {
    const mots = preparerMots();
    const stops = document.getElementById('stopwords').value.split(',');
    let dico = {};
    
    mots.forEach(m => {
        let mot = m.toLowerCase();
        if (!stops.includes(mot)) {
            dico[mot] = (dico[mot] || 0) + 1;
        }
    });

    let table = "<table><tr><th>Token</th><th>Fréquence</th></tr>";
    Object.entries(dico).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([m, f]) => {
        table += `<tr><td>${m}</td><td>${f}</td></tr>`;
    });
    document.getElementById('affichageDroit').innerHTML = "<h3>Top 10 des fréquences</h3>" + table + "</table>";
}

// 5. Bouton Mots les plus longs
function motsPlusLongs() {
    const motsUniques = [...new Set(preparerMots())];
    motsUniques.sort((a, b) => b.length - a.length);
    
    let table = "<table><tr><th>Mot</th><th>Longueur</th></tr>";
    motsUniques.slice(0, 10).forEach(m => {
        table += `<tr><td>${m}</td><td>${m.length}</td></tr>`;
    });
    document.getElementById('affichageDroit').innerHTML = "<h3>Mots les plus longs</h3>" + table + "</table>";
}

// 6. Bouton Nombre de phrases
function nombrePhrases() {
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0);
    document.getElementById('affichageDroit').innerHTML = `Il y a ${phrases.length} phrases dans ce texte.`;
}

// 7. Bouton Concordancier
function concordancier() {
    const motPole = document.getElementById('pole').value.toLowerCase();
    const contexte = parseInt(document.getElementById('longueur').value);
    if (!motPole) return alert("Entrez un mot pôle !");
    
    const mots = preparerMots();
    let table = "<table><tr><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";
    
    mots.forEach((m, i) => {
        if (m.toLowerCase() === motPole) {
            let gauche = mots.slice(Math.max(0, i - contexte), i).join(" ");
            let droite = mots.slice(i + 1, i + 1 + contexte).join(" ");
            table += `<tr><td>${gauche}</td><td style='color:red'>${m}</td><td>${droite}</td></tr>`;
        }
    });
    document.getElementById('affichageDroit').innerHTML = table + "</table>";
}
