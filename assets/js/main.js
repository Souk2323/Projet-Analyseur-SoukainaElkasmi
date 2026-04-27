// Variables globales demandées (Séance 9)
let texteAnalyse = "";
let lignesTexte = [];

// --- CHARGEMENT DU FICHIER ---
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        // On stocke les lignes pour la fonction grep (Séance 9)
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        document.getElementById('affichageGauche').innerText = texteAnalyse;
        alert("Fichier chargé ! " + lignesTexte.length + " lignes détectées.");
    };
    reader.readAsText(file);
});

// --- SÉCURITÉ : GESTION DES ERREURS (Séance 9) ---
function estPret() {
    if (!texteAnalyse) {
        alert("Action impossible : Aucun fichier n'est chargé !");
        return false;
    }
    return true;
}

// --- NETTOYAGE DES MOTS (Regex Séance 4) ---
function preparerMots() {
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput && delimInput.value ? delimInput.value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- CONCORDANCIER (Tableau 3 colonnes - Séance 10) ---
function concordancier() {
    if (!estPret()) return;
    
    const poleInput = document.getElementById('pôle') || document.getElementById('pole');
    const pole = poleInput ? poleInput.value.trim() : "";
    
    if (!pole) {
        alert("Erreur : Il manque le pôle pour le concordancier !");
        return;
    }

    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#ddd;'><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";

    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole.toLowerCase()) {
            // Contextes de 3 mots (Séance 10)
            const g = mots.slice(Math.max(0, i - 3), i).join(" ");
            const d = mots.slice(i + 1, i + 4).join(" ");
            html += `<tr><td style='text-align:right;'>${g}</td><td style='text-align:center; color:red; font-weight:bold;'>${m}</td><td>${d}</td></tr>`;
        }
    });
    html += "</table>";
    zone.innerHTML = html;
}

// --- GRAPHE (Chartist.js - Séance 11) ---
function genererGraphe() {
    if (!estPret()) return;

    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);

    // On prépare la zone pour Chartist
    document.getElementById('affichageDroit').innerHTML = '<h3>Fréquences</h3><div id="chart" class="ct-chart ct-golden-section"></div>';

    new Chartist.Pie('#chart', {
        labels: top.map(x => x[0]),
        series: top.map(x => x[1])
    }, {
        width: '100%',
        height: '350px'
    });
}

// --- KUJUJ (Fonction personnalisée - Séance 11) ---
function kujuj() {
    if (!estPret()) return;
    const mots = preparerMots();
    alert("Mode /kujuj/ activé !");
    // Transformation : MAJUSCULE + juj
    const res = mots.map(m => m.toUpperCase() + "juj").join(" ");
    document.getElementById('affichageDroit').innerHTML = "<h3>Kujuj</h3><p>" + res + "</p>";
}

// --- DICTIONNAIRE ---
function dictionnaire() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);

    let html = "<h3>Top 10</h3><ul>";
    tri.forEach(([m, f]) => { html += `<li><b>${m}</b> : ${f}</li>`; });
    document.getElementById('affichageDroit').innerHTML = html + "</ul>";
}
