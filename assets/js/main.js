/**
 * PROJET LZML021 - Analyseur de texte
 * Auteur : Soukaina
 * Documentation : Séance 11 - Code commenté et structuré
 */

// --- VARIABLES GLOBALES (Séance 9) ---
let texteAnalyse = "";
let lignesTexte = []; // Stockage par lignes pour le GREP

/**
 * 1. CHARGEMENT DU FICHIER
 * Déclanché lors de la sélection d'un fichier .txt
 */
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        // Séance 9 : Stockage des lignes non vides
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        
        // Mise à jour de l'interface
        const cadre = document.querySelector('.cadre-bonjour');
        if (cadre) cadre.innerText = "Fichier chargé avec succès ! (" + lignesTexte.length + " lignes)";
        alert("Fichier prêt pour l'analyse.");
    };
    reader.readAsText(file);
});

/**
 * 2. FONCTIONS OUTILS (Garde & Nettoyage)
 */
function estPret() {
    if (!texteAnalyse) {
        alert("ERREUR : Aucun fichier chargé. Veuillez sélectionner un .txt"); // Séance 9
        return false;
    }
    return true;
}

function preparerMots() {
    const delimiteurs = document.getElementById('delims').value || " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

/**
 * 3. ACTIONS PRINCIPALES
 */

// SEGMENTATION : Affiche tous les mots séparés (Séance 7)
function segmenter() {
    if (!estPret()) return;
    const mots = preparerMots();
    document.querySelector('.cadre-bonjour').innerHTML = "<h3>Segmentation</h3><p>" + mots.join(" | ") + "</p>";
}

// DICTIONNAIRE : Top 10 des fréquences (Séance 8)
function dictionnaire() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);

    let html = "<h3>Dictionnaire</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#555; color:white;'><th>Mot</th><th>Fréq.</th></tr>";
    tri.forEach(([m, f]) => { html += `<tr><td>${m}</td><td>${f}</td></tr>`; });
    document.querySelector('.cadre-bonjour').innerHTML = html + "</table>";
}

// GREP : Recherche par ligne avec coloration (Séance 9)
function grep() {
    if (!estPret()) return;
    const pôle = document.getElementById('pole').value.trim();
    if (!pôle) { alert("ERREUR : Paramètre 'PÔLE' manquant pour le GREP."); return; }

    const regex = new RegExp(pôle, "gi");
    const resultats = lignesTexte.filter(l => l.match(regex));
    
    let html = `<h3>GREP (${resultats.length} lignes)</h3><div style='text-align:left; font-size:0.8em;'>`;
    resultats.forEach(l => {
        // Coloration en rouge des empans reconnus (Consigne Séance 9)
        const ligneColoree = l.replace(regex, (match) => `<span style="color:red; font-weight:bold;">${match}</span>`);
        html += `<p style="border-bottom:1px solid #ddd;">${ligneColoree}</p>`;
    });
    document.querySelector('.cadre-bonjour').innerHTML = html + "</div>";
}

// CONCORDANCIER : Tableau ergonomique à 3 colonnes (Séance 10)
function concordancier() {
    if (!estPret()) return;
    const pôle = document.getElementById('pole').value.trim();
    if (!pôle) { alert("ERREUR : Veuillez renseigner le mot à chercher (PÔLE)."); return; }

    const mots = preparerMots();
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse; font-size:0.85em;'>";
    html += "<tr style='background:#eee;'><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";
    
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pôle.toLowerCase()) {
            const g = mots.slice(Math.max(0, i-3), i).join(" ");
            const d = mots.slice(i+1, i+4).join(" ");
            html += `<tr>
                <td style='text-align:right;'>${g}</td>
                <td style='text-align:center; color:red; font-weight:bold;'>${m}</td>
                <td style='text-align:left;'>${d}</td>
            </tr>`;
        }
    });
    document.querySelector('.cadre-bonjour').innerHTML = html + "</table>";
}

// GRAPHE : Interface graphique avec Chartist.js (Séance 11)
function genererGraphe() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);

    // Préparation du conteneur
    document.querySelector('.cadre-bonjour').innerHTML = '<h3>Fréquences (Top 5)</h3><div id="chart" class="ct-chart ct-golden-section" style="height:250px;"></div>';
    
    // Création du Pie Chart (Séance 11)
    new Chartist.Pie('#chart', {
        labels: top.map(x => x[0]),
        series: top.map(x => x[1])
    }, {
        chartPadding: 30,
        labelOffset: 50,
        labelDirection: 'explode'
    });
}

// /KUJUJ/ : Fonction personnalisée (Majuscules + suffixe)
function kujuj() {
    if (!estPret()) return;
    alert("Mode /kujuj/ activé !");
    const mots = preparerMots();
    const res = mots.map(m => m.toUpperCase() + "juj").join(" ");
    document.querySelector('.cadre-bonjour').innerHTML = "<h3>Transformation Kujuj</h3><p style='font-family:monospace;'>" + res + "</p>";
}

// ANALYSE : Nombre de phrases et mots longs
function nombrePhrases() {
    if (!estPret()) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    document.querySelector('.cadre-bonjour').innerHTML = `<h3>Statistiques</h3><p>Le texte contient environ <b>${n}</b> phrases.</p>`;
}

function motsPlusLongs() {
    if (!estPret()) return;
    const mots = [...new Set(preparerMots())];
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 10);
    document.querySelector('.cadre-bonjour').innerHTML = "<h3>Mots les plus longs</h3><ol><li>" + tri.join("</li><li>") + "</li></ol>";
}
