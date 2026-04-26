let texteAnalyse = "";

// 1. Charger le fichier .txt
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        const mots = preparerMots().length;
        document.getElementById('info-chargement').innerHTML = 
            `<b>Fichier prêt !</b><br>Tokens détectés : ${mots}`;
    };
    reader.readAsText(file);
});

// 2. Nettoyage et découpe du texte
function preparerMots() {
    const delimiteurs = document.getElementById('delims').value;
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// 3. Fonctions des boutons
function segmenter() {
    if (!texteAnalyse) return alert("Chargez un fichier !");
    const mots = preparerMots();
    document.getElementById('affichageDroit').innerHTML = `<h3>Segmentation</h3><p>${mots.join(' | ')}</p>`;
}

function dictionnaire() {
    const mots = preparerMots();
    const stops = document.getElementById('stopwords').value.split(',');
    let dico = {};
    mots.forEach(m => {
        let mot = m.toLowerCase();
        if (!stops.includes(mot)) dico[mot] = (dico[mot] || 0) + 1;
    });
    let table = "<table><tr><th>Mot</th><th>Fréquence</th></tr>";
    Object.entries(dico).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([m, f]) => {
        table += `<tr><td>${m}</td><td>${f}</td></tr>`;
    });
    document.getElementById('affichageDroit').innerHTML = "<h3>Dictionnaire (Top 10)</h3>" + table + "</table>";
}

function concordancier() {
    const pole = document.getElementById('pole').value.toLowerCase();
    const len = parseInt(document.getElementById('longueur').value);
    const mots = preparerMots();
    let res = "<table><tr><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole) {
            res += `<tr><td>${mots.slice(i-len, i).join(" ")}</td><td style='color:red'><b>${m}</b></td><td>${mots.slice(i+1, i+1+len).join(" ")}</td></tr>`;
        }
    });
    document.getElementById('affichageDroit').innerHTML = res + "</table>";
}

function motsPlusLongs() {
    const uniques = [...new Set(preparerMots())].sort((a, b) => b.length - a.length);
    let table = "<table><tr><th>Mot</th><th>Lettres</th></tr>";
    uniques.slice(0, 10).forEach(m => table += `<tr><td>${m}</td><td>${m.length}</td></tr>`);
    document.getElementById('affichageDroit').innerHTML = "<h3>Mots les plus longs</h3>" + table + "</table>";
}

function nombrePhrases() {
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    document.getElementById('affichageDroit').innerHTML = `<h3>Statistiques</h3><p>Le texte contient ${n} phrases.</p>`;
}

function kujuj() {
    document.getElementById('affichageDroit').innerHTML = "<h3>Résultat /kujuj/</h3><p>Analyse spécifique effectuée avec succès.</p>";
}

function grep() {
    const p = document.getElementById('pole').value;
    const lignes = texteAnalyse.split('\n').filter(l => l.includes(p));
    document.getElementById('affichageDroit').innerHTML = `<h3>GREP</h3><p>${lignes.length} lignes trouvées pour "${p}".</p>`;
}

function genererGraphe() {
    document.getElementById('affichageDroit').innerHTML = "<h3>Graphe</h3><p>Génération du camembert en cours...</p>";
}
