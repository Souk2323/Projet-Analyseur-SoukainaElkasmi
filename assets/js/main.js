let texteAnalyse = "";

// 1. Charger le fichier .txt
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        alert("Fichier chargé !");
    };
    reader.readAsText(file);
});

// 2. Découper le texte en mots
function preparerMots() {
    if (!texteAnalyse) {
        alert("Choisis d'abord un fichier !");
        return [];
    }
    const delimiteurs = document.getElementById('delims') ? document.getElementById('delims').value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// 3. Fonctions des boutons jaunes
function segmenter() {
    const mots = preparerMots();
    if (mots.length > 0) {
        document.getElementById('affichageDroit').innerHTML = `<h3>Segmentation</h3><p>${mots.join(' | ')}</p>`;
    }
}

function dictionnaire() {
    const mots = preparerMots();
    let dico = {};
    mots.forEach(m => {
        let mot = m.toLowerCase();
        dico[mot] = (dico[mot] || 0) + 1;
    });
    let table = "<table border='1'><tr><th>Mot</th><th>Fréq.</th></tr>";
    Object.entries(dico).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([m, f]) => {
        table += `<tr><td>${m}</td><td>${f}</td></tr>`;
    });
    document.getElementById('affichageDroit').innerHTML = table + "</table>";
}

function concordancier() {
    const pole = document.getElementById('pole').value.toLowerCase();
    const len = parseInt(document.getElementById('longueur').value) || 10; // Utilise ta case LONGUEUR
    const mots = preparerMots();
    if (!pole) return alert("Entrez un mot pôle");

    let res = "<table border='1'><tr><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole) {
            let gauche = mots.slice(Math.max(0, i - len), i).join(" ");
            let droite = mots.slice(i + 1, i + 1 + len).join(" ");
            res += `<tr><td>${gauche}</td><td style='color:red'><b>${m}</b></td><td>${droite}</td></tr>`;
        }
    });
    document.getElementById('affichageDroit').innerHTML = res + "</table>";
}

function grep() {
    const p = document.getElementById('pole').value;
    if (!p) return alert("Entrez un mot dans Pôle");
    const lignes = texteAnalyse.split('\n').filter(l => l.includes(p));
    document.getElementById('affichageDroit').innerHTML = `<h3>GREP</h3><p>${lignes.length} lignes trouvées.</p>`;
}
