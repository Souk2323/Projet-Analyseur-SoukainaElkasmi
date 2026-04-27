// ============================================================
// VARIABLES GLOBALES
// ============================================================
let texteAnalyse = "";
let lignesTexte = [];

// ============================================================
// CONFIGURATION FIXE (identique au prof)
// ============================================================
const DELIMITEURS_PROF = "`/*~|&#@=~:?%*$(){}[];+-*/`";
const STOPWORDS_PROF = ["de","le","la","les","à","et","des","un","une","du","que","en","l","que","qu","d","s","se","ne","n","ce","me","sa"];

// Zone d'affichage des résultats (on utilise la classe .cadre-bonjour déjà existante)
function afficherResultat(html) {
    const cadreBonjour = document.querySelector('.cadre-bonjour');
    if (cadreBonjour) {
        cadreBonjour.innerHTML = html;
    }
}

// ============================================================
// CHARGEMENT DU FICHIER (reste sur l'ID fileInput)
// ============================================================
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        const nbTokens = preparerMotsBruts().length;
        
        // Message de confirmation dans .cadre-bonjour
        afficherResultat("<p style='color:green;'><strong>Fichier chargé avec succès</strong><br>Nombre de tokens : " + nbTokens + "<br>Nombre de lignes : " + lignesTexte.length + "</p>");
    };
    reader.readAsText(file);
});

// ============================================================
// FONCTION DE SÉCURITÉ
// ============================================================
function estPret() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord sélectionner un fichier .txt !");
        return false;
    }
    return true;
}

// ============================================================
// PRÉPARATION DES MOTS
// ============================================================
function preparerMotsBruts() {
    const delimiteursEchappes = DELIMITEURS_PROF.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp("[" + delimiteursEchappes + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

function preparerMots() {
    return preparerMotsBruts().filter(m => !STOPWORDS_PROF.includes(m.toLowerCase()));
}

// ============================================================
// FONCTIONS APPELEES PAR LES ONCLICK DU HTML
// ============================================================

// SEGMENTATION (sans stopwords)
function segmenter() {
    if (!estPret()) return;
    const mots = preparerMots();
    afficherResultat("<h3>Segmentation</h3><p>" + mots.join(" | ") + "</p>");
}

// NOMBRE DE PHRASES
function nombrePhrases() {
    if (!estPret()) return;
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0);
    afficherResultat("<h3>Nombre de phrases</h3><p><strong>" + phrases.length + "</strong></p>");
}

// DICTIONNAIRE (tous les tokens, avec stopwords)
function dictionnaire() {
    if (!estPret()) return;
    const mots = preparerMotsBruts();
    let freq = {};
    mots.forEach(m => { 
        let mot = m.toLowerCase(); 
        freq[mot] = (freq[mot] || 0) + 1; 
    });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 15);

    let html = "<h3>Mots les plus fréquents</h3><table border='1' style='width:100%; border-collapse:collapse; font-size:11px;'>";
    html += "<tr><th>Token</th><th>Fréquence</th></tr>";
    tri.forEach(([m, f]) => { 
        html += "<tr><td>" + m + "</td><td>" + f + "</td></tr>"; 
    });
    html += "</table>";
    afficherResultat(html);
}

// MOTS LES PLUS LONGS (sans stopwords, uniques)
function motsPlusLongs() {
    if (!estPret()) return;
    const motsUniques = [...new Set(preparerMots())];
    const tri = motsUniques.sort((a, b) => b.length - a.length).slice(0, 10);

    let html = "<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse; font-size:11px;'>";
    html += "<tr><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => {
        html += "<tr><td>" + m + "</td><td>" + m.length + "</td></tr>";
    });
    html += "</table>";
    afficherResultat(html);
}

// GREP
function grep() {
    if (!estPret()) return;
    const pole = document.getElementById('pole').value.trim();
    if (!pole) { 
        alert("Veuillez entrer un mot dans le champ PÔLE pour le GREP."); 
        return; 
    }

    const regex = new RegExp(pole, "gi");
    const resultats = lignesTexte.filter(ligne => {
        const test = regex.test(ligne);
        regex.lastIndex = 0;
        return test;
    });
    
    let html = "<h3>GREP</h3><p><strong>" + resultats.length + " ligne(s) trouvée(s)</strong></p>";
    html += "<div style='text-align:left; max-height:300px; overflow-y:auto; font-size:11px;'>";
    resultats.forEach(l => {
        regex.lastIndex = 0;
        html += l.replace(regex, (match) => "<span style='color:red; font-weight:bold;'>" + match + "</span>") + "<br><hr>";
    });
    html += "</div>";
    afficherResultat(html);
}

// CONCORDANCIER (stopwords INCLUS)
function concordancier() {
    if (!estPret()) return;
    const pole = document.getElementById('pole').value.trim();
    if (!pole) { 
        alert("Veuillez entrer un mot dans le champ PÔLE pour le Concordancier."); 
        return; 
    }

    const mots = preparerMotsBruts();
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse; font-size:10px;'>";
    html += "<tr><th>Contexte gauche</th><th style='color:red;'>Pôle</th><th>Contexte droit</th></tr>";
    let trouve = false;

    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole.toLowerCase()) {
            trouve = true;
            const gauche = mots.slice(Math.max(0, i-3), i).join(" ");
            const droit = mots.slice(i+1, i+4).join(" ");
            html += "<tr>";
            html += "<td style='text-align:right; padding:3px;'>" + gauche + "</td>";
            html += "<td style='text-align:center; color:red; font-weight:bold; padding:3px;'>" + m + "</td>";
            html += "<td style='text-align:left; padding:3px;'>" + droit + "</td>";
            html += "</tr>";
        }
    });
    html += "</table>";

    if (trouve) {
        afficherResultat(html);
    } else {
        afficherResultat("<h3>Concordancier</h3><p>Le mot '" + pole + "' n'a pas été trouvé.</p>");
    }
}

// /KUJUJ/ (mise en évidence du pôle)
function kujuj() {
    if (!estPret()) return;
    const pole = document.getElementById('pole').value.trim();
    if (!pole) {
        alert("Veuillez entrer un mot dans le champ PÔLE pour /kujuj/.");
        return;
    }
    const mots = preparerMotsBruts();
    const res = mots.map(m => {
        if (m.toLowerCase() === pole.toLowerCase()) {
            return "<span style='color:red; font-weight:bold;'>" + m + "</span>";
        } else {
            return m;
        }
    }).join(" ");
    
    afficherResultat("<h3>/kujuj/</h3><p style='font-size:12px;'>" + res + "</p>");
}

// GRAPHE CAMEMBERT (stopwords filtrés)
function genererGraphe() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { 
        let mot = m.toLowerCase(); 
        freq[mot] = (freq[mot] || 0) + 1; 
    });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);

    const html = "<h3>graphecamembert-Pie chart</h3><div id='chart' class='ct-chart ct-golden-section' style='height:200px;'></div>";
    afficherResultat(html);

    // Petit délai pour que le DOM soit mis à jour avant de créer le graphique
    setTimeout(function() {
        if (typeof Chartist !== 'undefined') {
            new Chartist.Pie('#chart', {
                labels: top.map(x => x[0]),
                series: top.map(x => x[1])
            }, {
                donut: true,
                donutWidth: 50,
                showLabel: true
            });
        } else {
            document.getElementById('chart').innerHTML = "<p style='color:red;'>Erreur : Librairie Chartist non chargée.</p>";
        }
    }, 100);
}
