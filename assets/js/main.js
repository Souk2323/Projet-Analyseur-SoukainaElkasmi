let texteAnalyse = "";
let lignesTexte = [];
const DELIMS = "`/*~|&#@=~:?%*$(){}[];+-*/`";
const STOPWORDS = ["de","le","la","les","à","et","des","un","une","du","que","en","l","que","qu","d","s","se","ne","n","ce","me","sa"];

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        document.querySelector('.cadre-bonjour').innerHTML = "<p style='color:green;'>Fichier chargé avec succès<br>Nombre de tokens : " + preparerMotsBruts().length + "<br>Nombre de lignes : " + lignesTexte.length + "</p>";
    };
    reader.readAsText(file);
});

function estPret() {
    if (!texteAnalyse) { alert("Veuillez d'abord sélectionner un fichier .txt !"); return false; }
    return true;
}

function preparerMotsBruts() {
    const delimEchappes = DELIMS.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp("[" + delimEchappes + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

function preparerMots() {
    return preparerMotsBruts().filter(m => !STOPWORDS.includes(m.toLowerCase()));
}

function afficher(html) {
    document.querySelector('.cadre-bonjour').innerHTML = html;
}

function segmenter() {
    if (!estPret()) return;
    afficher("<h3>Segmentation</h3><p>" + preparerMots().join(" | ") + "</p>");
}

function nombrePhrases() {
    if (!estPret()) return;
    const nb = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    afficher("<h3>Nombre de phrases</h3><p><strong>" + nb + "</strong></p>");
}

function dictionnaire() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { freq[m] = (freq[m] || 0) + 1; });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]);
    let html = "<h3>Mots les plus fréquents</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    tri.forEach(([m, f]) => { html += "<tr><td>" + m + "</td><td>" + f + "</td></tr>"; });
    html += "</table>";
    afficher(html);
}

function motsPlusLongs() {
    if (!estPret()) return;
    const motsUniques = [...new Set(preparerMots())];
    const tri = motsUniques.sort((a, b) => b.length - a.length).slice(0, 10);
    let html = "<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => { html += "<tr><td>" + m + "</td><td>" + m.length + "</td></tr>"; });
    html += "</table>";
    afficher(html);
}

function grep() {
    if (!estPret()) return;
    const pole = document.getElementById('pole').value.trim();
    if (!pole) { alert("Veuillez entrer un mot dans le champ PÔLE."); return; }
    const regex = new RegExp(pole, "gi");
    const resultats = lignesTexte.filter(ligne => { const test = regex.test(ligne); regex.lastIndex = 0; return test; });
    let html = "<h3>GREP</h3><p><strong>" + resultats.length + " ligne(s)</strong></p>";
    resultats.forEach(l => { regex.lastIndex = 0; html += l.replace(regex, m => "<span style='color:red;'>" + m + "</span>") + "<hr>"; });
    afficher(html);
}

function concordancier() {
    if (!estPret()) return;
    const pole = document.getElementById('pole').value.trim();
    if (!pole) { alert("Veuillez entrer un mot dans le champ PÔLE."); return; }
    const mots = preparerMotsBruts();
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse; font-size:10px;'>";
    html += "<tr><th>Contexte gauche</th><th style='color:red;'>Pôle</th><th>Contexte droit</th></tr>";
    let trouve = false;
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole.toLowerCase()) {
            trouve = true;
            html += "<tr><td style='text-align:right;'>" + mots.slice(Math.max(0, i-3), i).join(" ") + "</td><td style='color:red; text-align:center;'><b>" + m + "</b></td><td>" + mots.slice(i+1, i+4).join(" ") + "</td></tr>";
        }
    });
    html += "</table>";
    afficher(trouve ? html : "<h3>Concordancier</h3><p>Mot '" + pole + "' non trouvé.</p>");
}

function kujuj() {
    if (!estPret()) return;
    afficher("<h3>/kujuj/</h3><p>" + preparerMotsBruts().map(m => m + "juj").join(" ") + "</p>");
}

function genererGraphe() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 7);
    afficher("<h3>graphecamembert-Pie chart</h3><div id='chart' class='ct-chart' style='height:250px; width:250px; margin:auto;'></div>");
    setTimeout(function() {
        new Chartist.Pie('#chart', { labels: top.map(x => x[0]), series: top.map(x => x[1]) }, { donut: false, showLabel: true });
    }, 100);
}
