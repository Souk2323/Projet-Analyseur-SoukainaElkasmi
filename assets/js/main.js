let texteAnalyse = "";

// 1. Gestionnaire pour charger le fichier
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        alert("Fichier chargé avec succès !");
    };
    reader.readAsText(file);
});

// 2. Fonction de découpage du texte (mots)
function preparerMots() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord sélectionner un fichier .txt");
        return [];
    }
    const delimiteurs = document.getElementById('delims').value || " ";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// 3. Fonctions des boutons
function segmenter() {
    const mots = preparerMots();
    if (mots.length > 0) {
        document.getElementById('affichageDroit').innerHTML = `<h3>Segmentation</h3><p>${mots.join(' | ')}</p>`;
    }
}

function dictionnaire() {
    const mots = preparerMots();
    const stops = document.getElementById('stopwords').value.split(',').map(s => s.trim().toLowerCase());
    let dico = {};
    
    mots.forEach(m => {
        let mot = m.toLowerCase();
        if (!stops.includes(mot)) {
            dico[mot] = (dico[mot] || 0) + 1;
        }
    });

    let table = "<table border='1'><tr><th>Mot</th><th>Fréq.</th></tr>";
    Object.entries(dico).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([m, f]) => {
        table += `<tr><td>${m}</td><td>${f}</td></tr>`;
    });
    document.getElementById('affichageDroit').innerHTML = "<h3>Dictionnaire (Top 10)</h3>" + table + "</table>";
}

function concordancier() {
    const pole = document.getElementById('pole').value.toLowerCase();
    const len = parseInt(document.getElementById('longueur').value) || 5;
    const mots = preparerMots();
    
    if (!pole) return alert("Entrez un mot pôle !");

    let res = "<table border='1'><tr><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole) {
            let gauche = mots.slice(Math.max(0, i - len), i).join(" ");
            let droite = mots.slice(i + 1, i + 1 + len).join(" ");
            res += `<tr><td>${gauche}</td><td style='color:red'><b>${m}</b></td><td>${droite}</td></tr>`;
        }
    });
    document.getElementById('affichageDroit').innerHTML = "<h3>Concordancier</h3>" + res + "</table>";
}

function grep() {
    const p = document.getElementById('pole').value;
    if (!p) return alert("Entrez un motif dans Pôle");
    const lignes = texteAnalyse.split('\n').filter(l => l.includes(p));
    document.getElementById('affichageDroit').innerHTML = `<h3>GREP</h3><p>${lignes.length} lignes trouvées.</p>`;
}

function kujuj() {
    document.getElementById('affichageDroit').innerHTML = "<h3>Mode /kujuj/</h3><p>Analyse spécifique activée.</p>";
}

function nombrePhrases() {
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    document.getElementById('affichageDroit').innerHTML = `<h3>Stats</h3><p>Nombre de phrases : ${n}</p>`;
}

function motsPlusLongs() {
    const mots = [...new Set(preparerMots())].sort((a, b) => b.length - a.length);
    let liste = "<ul>";
    mots.slice(0, 5).forEach(m => liste += `<li>${m} (${m.length} p.)</li>`);
    document.getElementById('affichageDroit').innerHTML = "<h3>Mots les plus longs</h3>" + liste + "</ul>";
}

function genererGraphe() {
    document.getElementById('affichageDroit').innerHTML = "<h3>Graphe</h3><p>Génération du visuel...</p>";
}
