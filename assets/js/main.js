let texteAnalyse = "";

// --- CHARGEMENT DU FICHIER ---
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        document.getElementById('affichageGauche').innerText = texteAnalyse;
        alert("Fichier chargé ! Vous pouvez maintenant cliquer sur les boutons.");
    };
    reader.readAsText(file);
});

// Fonction pour nettoyer le texte
function preparerMots() {
    if (!texteAnalyse) {
        alert("ERREUR : Chargez d'abord le fichier essai.txt !");
        return [];
    }
    const delimiteurs = document.getElementById('delims').value || " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- ACTION 1 : SEGMENTER ---
function segmenter() {
    const mots = preparerMots();
    if (mots.length > 0) {
        document.getElementById('affichageDroit').innerHTML = "<h3>Segmentation</h3><p>" + mots.join(" | ") + "</p>";
    }
}

// --- ACTION 2 : KUJUJ (Mot + juj) ---
function kujuj() {
    const mots = preparerMots();
    if (mots.length > 0) {
        const resultat = mots.map(m => m.toUpperCase() + "juj").join(" ");
        document.getElementById('affichageDroit').innerHTML = "<h3>Résultat Kujuj</h3><p>" + resultat + "</p>";
    }
}

// --- ACTION 3 : CONCORDANCIER (3 colonnes) ---
function concordancier() {
    const pole = (document.getElementById('pôle') || document.getElementById('pole')).value.trim();
    const mots = preparerMots();
    if (!pole || mots.length === 0) {
        alert("Entrez un mot dans la case Pôle !");
        return;
    }

    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#ddd;'><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";
    
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole.toLowerCase()) {
            const g = mots.slice(Math.max(0, i-3), i).join(" ");
            const d = mots.slice(i+1, i+4).join(" ");
            html += `<tr><td style='text-align:right;'>${g}</td><td style='text-align:center; color:red; font-weight:bold;'>${m}</td><td>${d}</td></tr>`;
        }
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}

// --- ACTION 4 : GRAPHE (Chartist) ---
function genererGraphe() {
    const mots = preparerMots();
    if (mots.length === 0) return;

    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);

    document.getElementById('affichageDroit').innerHTML = '<h3>Graphe des fréquences</h3><div id="chart" class="ct-chart ct-golden-section"></div>';
    
    new Chartist.Pie('#chart', {
        labels: top.map(x => x[0]),
        series: top.map(x => x[1])
    });
}
