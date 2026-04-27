// Variable globale pour stocker le texte et les lignes (Séance 9)
let texteAnalyse = "";
let lignesTexte = [];

// --- CHARGEMENT DU FICHIER ---
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        // On stocke les lignes non vides (Séance 9)
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        
        document.getElementById('affichageGauche').innerText = texteAnalyse;
        alert("Fichier chargé : " + lignesTexte.length + " lignes détectées.");
    };
    reader.readAsText(file);
});

// --- FONCTION DE SÉCURITÉ (GARDE) ---
function verifierFichierCharge() {
    if (!texteAnalyse) {
        alert("Erreur : Il faut d'abord charger un fichier !"); [span_1](start_span)[span_2](start_span)// Séance 9[span_1](end_span)[span_2](end_span)
        return false;
    }
    return true;
}

// --- NETTOYAGE DES MOTS ---
function preparerMots() {
    const delimiteurs = document.getElementById('delims').value || " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- 1. SÉQUENCE 10 : LE CONCORDANCIER ---
function concordancier() {
    if (!verifierFichierCharge()) return;

    const pôle = document.getElementById('pôle').value.trim();
    if (!pôle) {
        alert("Le pôle n'est pas renseigné !"); [span_3](start_span)// Séance 9[span_3](end_span)
        return;
    }

    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    
    [span_4](start_span)[span_5](start_span)// Tableau à 3 colonnes pour une lecture ergonomique (Séance 10)[span_4](end_span)[span_5](end_span)
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#f2f2f2;'><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr>";

    mots.forEach((m, i) => {
        if (m.toLowerCase() === pôle.toLowerCase()) {
            const gauche = mots.slice(Math.max(0, i - 3), i).join(" ");
            const droite = mots.slice(i + 1, i + 4).join(" ");
            
            html += `<tr>
                <td style='text-align:right; width:40%;'>${gauche}</td>
                <td style='text-align:center; color:red; font-weight:bold; width:20%;'>${m}</td>
                <td style='text-align:left; width:40%;'>${droite}</td>
            </tr>`;
        }
    });
    html += "</table>";
    zone.innerHTML = html;
}

// --- 2. SÉQUENCE 11 : LE GRAPHE (CHARTIST) ---
function genererGraphe() {
    if (!verifierFichierCharge()) return;

    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    
    const topMots = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
    
    [span_6](start_span)// Préparation pour Chartist (Séance 11)[span_6](end_span)
    document.getElementById('affichageDroit').innerHTML = '<h3>Fréquences</h3><div id="monGraphe" class="ct-chart ct-golden-section"></div>';
    
    new Chartist.Pie('#monGraphe', {
        labels: topMots.map(x => x[0]),
        series: topMots.map(x => x[1])
    }, {
        width: '100%',
        height: '400px'
    });
}

// --- 3. FONCTIONNALITÉ PERSO : KUJUJ ---
function kujuj() {
    if (!verifierFichierCharge()) return;
    
    alert("Mode /kujuj/ activé !");
    const mots = preparerMots();
    [span_7](start_span)// Transformation en Majuscule + "juj" (Séance 11 - Exemples)[span_7](end_span)
    const resultat = mots.map(m => m.toUpperCase() + "juj").join(" ");
    document.getElementById('affichageDroit').innerHTML = "<h3>Kujuj</h3><p>" + resultat + "</p>";
}

// --- 4. DICTIONNAIRE ---
function dictionnaire() {
    if (!verifierFichierCharge()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);

    let html = "<h3>Top 10 Mots</h3><ul>";
    tri.forEach(([m, f]) => { html += `<li>${m} : ${f}</li>`; });
    document.getElementById('affichageDroit').innerHTML = html + "</ul>";
}
