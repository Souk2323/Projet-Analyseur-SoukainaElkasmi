// Variables globales pour stocker les données (Séance 9)
let texteAnalyse = "";
let lignesTexte = [];

// --- CHARGEMENT DU FICHIER ---
// Cette fonction s'exécute dès que tu choisis "essai.txt"
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        // Stockage des lignes non vides pour les erreurs et traitements
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        
        // Affichage dans la zone de gauche
        document.getElementById('affichageGauche').innerText = texteAnalyse;
        alert("Fichier chargé ! " + lignesTexte.length + " lignes détectées.");
    };
    reader.readAsText(file);
});

// --- FONCTION DE NETTOYAGE (Séance 4) ---
function preparerMots() {
    if (!texteAnalyse) {
        alert("Erreur : Charge d'abord le fichier essai.txt !");
        return [];
    }
    const delimiteurs = document.getElementById('delims').value || " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- ACTION : KUJUJ (Ta fonction perso) ---
function kujuj() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    
    alert("Mode /kujuj/ activé !");
    // Règle : MAJUSCULE + juj
    const resultat = mots.map(m => m.toUpperCase() + "juj").join(" ");
    document.getElementById('affichageDroit').innerHTML = "<h3>Résultat Kujuj</h3><p>" + resultat + "</p>";
}

// --- ACTION : GRAPHE (Séance 11 - Camembert) ---
function genererGraphe() {
    const mots = preparerMots();
    if (mots.length === 0) return;

    // Calcul des fréquences pour le top 5
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);

    // Préparation de la zone pour Chartist
    document.getElementById('affichageDroit').innerHTML = '<h3>Mots fréquents</h3><div id="chart" class="ct-chart ct-golden-section" style="height:300px;"></div>';

    // Création du graphique Chartist
    new Chartist.Pie('#chart', {
        labels: top.map(x => x[0]),
        series: top.map(x => x[1])
    });
}

// --- ACTION : CONCORDANCIER (Séance 10 - 3 colonnes) ---
function concordancier() {
    const pôle = document.getElementById('pôle').value.trim();
    const mots = preparerMots();
    if (!pôle || mots.length === 0) {
        alert("Entrez un mot dans la case Pôle !");
        return;
    }

    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#f2f2f2;'><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";

    mots.forEach((m, i) => {
        if (m.toLowerCase() === pôle.toLowerCase()) {
            const g = mots.slice(Math.max(0, i - 2), i).join(" ");
            const d = mots.slice(i + 1, i + 3).join(" ");
            html += `<tr><td style='text-align:right;'>${g}</td><td style='text-align:center; color:red; font-weight:bold;'>${m}</td><td>${d}</td></tr>`;
        }
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}
