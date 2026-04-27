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

// ============================================================
// 1. CHARGEMENT DU FICHIER
// ============================================================
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        
        const cadreMessage = document.querySelector('.cadre-message');
        if (cadreMessage) {
            cadreMessage.innerHTML = "<p>Fichier chargé avec succès<br>Nombre de tokens : " + preparerMotsBruts().length + "<br>Nombre de lignes : " + lignesTexte.length + "</p>";
        } else {
            alert("Fichier chargé : " + lignesTexte.length + " lignes, " + preparerMotsBruts().length + " tokens.");
        }
    };
    reader.readAsText(file);
});

// ============================================================
// 2. FONCTION DE SÉCURITÉ
// ============================================================
function estPret() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord sélectionner un fichier .txt !");
        return false;
    }
    return true;
}

// ============================================================
// 3. PRÉPARATION DES MOTS (2 versions : avec et sans stopwords)
// ============================================================

// Version SANS filtrage des stopwords (pour Dictionnaire, GREP, Concordancier)
function preparerMotsBruts() {
    const delimiteursEchappes = DELIMITEURS_PROF.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp("[" + delimiteursEchappes + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// Version AVEC filtrage des stopwords (pour Segmentation, Mots longs, Graphe)
function preparerMots() {
    return preparerMotsBruts().filter(m => !STOPWORDS_PROF.includes(m.toLowerCase()));
}

// ============================================================
// 4. BOUTON BONJOUR
// ============================================================
document.getElementById('bonjourBtn').addEventListener('click', function() {
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = "<h2>Bonjour</h2>";
    } else {
        alert("Bonjour");
    }
});

// ============================================================
// 5. SEGMENTATION
// ============================================================
document.getElementById('segmentationBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const mots = preparerMots();  // stopwords filtrés
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = "<h3>Segmentation</h3><p>" + mots.join(" | ") + "</p>";
    } else {
        alert("Segmentation : " + mots.join(" | "));
    }
});

// ============================================================
// 6. NOMBRE DE PHRASES
// ============================================================
document.getElementById('nbPhrasesBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0);
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = "<h3>Nombre de phrases</h3><p>" + phrases.length + "</p>";
    } else {
        alert("Nombre de phrases : " + phrases.length);
    }
});

// ============================================================
// 7. DICTIONNAIRE (Top fréquences - TOUS les tokens)
// ============================================================
document.getElementById('dictionnaireBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const mots = preparerMotsBruts();  // PAS de filtrage stopwords
    let freq = {};
    mots.forEach(m => { 
        let mot = m.toLowerCase(); 
        freq[mot] = (freq[mot] || 0) + 1; 
    });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);

    let html = "<h3>Mots les plus fréquents</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr><th>Token</th><th>Fréquence</th></tr>";
    tri.forEach(([m, f]) => { 
        html += "<tr><td style='padding:5px;'>" + m + "</td><td style='padding:5px;'>" + f + "</td></tr>"; 
    });
    html += "</table>";

    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = html;
    } else {
        let txt = "Mots les plus fréquents :\n";
        tri.forEach(([m, f]) => { txt += m + " : " + f + "\n"; });
        alert(txt);
    }
});

// ============================================================
// 8. MOTS LES PLUS LONGS (stopwords filtrés, mots uniques)
// ============================================================
document.getElementById('motsLongsBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const motsUniques = [...new Set(preparerMots())];  // stopwords filtrés
    const tri = motsUniques.sort((a, b) => b.length - a.length).slice(0, 10);

    let html = "<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => {
        html += "<tr><td style='padding:5px;'>" + m + "</td><td style='padding:5px;'>" + m.length + "</td></tr>";
    });
    html += "</table>";

    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = html;
    } else {
        let txt = "Mots les plus longs :\n";
        tri.forEach(m => { txt += m + " (" + m.length + ")\n"; });
        alert(txt);
    }
});

// ============================================================
// 9. GREP (recherche dans les lignes - sensible à la casse via regex gi)
// ============================================================
document.getElementById('grepBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const pole = document.getElementById('pole').value.trim();
    if (!pole) { 
        alert("Veuillez entrer un mot dans le champ PÔLE pour le GREP."); 
        return; 
    }

    const regex = new RegExp(pole, "gi");
    const resultats = lignesTexte.filter(ligne => regex.test(ligne));

    let html = "<h3>GREP</h3><p>" + resultats.length + " ligne(s) trouvée(s)</p>";
    html += "<div style='text-align:left; font-size:12px; max-height:300px; overflow-y:auto;'>";
    resultats.forEach(l => {
        html += l.replace(regex, (match) => "<span style='color:red; font-weight:bold;'>" + match + "</span>") + "<br><hr style='margin:5px 0;'>";
    });
    html += "</div>";

    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = html;
    } else {
        alert("GREP : " + resultats.length + " lignes trouvées.");
    }
});

// ============================================================
// 10. CONCORDANCIER (contexte 3 mots avant/après, stopwords INCLUS)
// ============================================================
document.getElementById('concordancierBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const pole = document.getElementById('pole').value.trim();
    if (!pole) { 
        alert("Veuillez entrer un mot dans le champ PÔLE pour le Concordancier."); 
        return; 
    }

    const mots = preparerMotsBruts();  // PAS de filtrage stopwords
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse; font-size:12px;'>";
    html += "<tr><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr>";
    let trouve = false;

    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole.toLowerCase()) {
            trouve = true;
            const gauche = mots.slice(Math.max(0, i-3), i).join(" ");
            const droit = mots.slice(i+1, i+4).join(" ");
            html += "<tr>";
            html += "<td style='text-align:right; padding:5px;'>" + gauche + "</td>";
            html += "<td style='text-align:center; color:red; font-weight:bold; padding:5px;'>" + m + "</td>";
            html += "<td style='text-align:left; padding:5px;'>" + droit + "</td>";
            html += "</tr>";
        }
    });
    html += "</table>";

    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        if (trouve) {
            cadreResultat.innerHTML = html;
        } else {
            cadreResultat.innerHTML = "<h3>Concordancier</h3><p>Le mot '" + pole + "' n'a pas été trouvé.</p>";
        }
    } else {
        if (trouve) alert("Concordancier : " + pole + " trouvé.");
        else alert("Le mot '" + pole + "' n'a pas été trouvé.");
    }
});

// ============================================================
// 11. /kujuj/ (fonction mystère - probablement mise en évidence du pôle)
// ============================================================
document.getElementById('kujujBtn').addEventListener('click', function() {
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
    
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = "<h3>/kujuj/</h3><p>" + res + "</p>";
    } else {
        alert("/kujuj/ : " + res.replace(/<[^>]*>/g, ''));
    }
});

// ============================================================
// 12. GRAPHE CAMEMBERT (Pie Chart - stopwords filtrés)
// ============================================================
document.getElementById('grapheBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const mots = preparerMots();  // stopwords filtrés
    let freq = {};
    mots.forEach(m => { 
        let mot = m.toLowerCase(); 
        freq[mot] = (freq[mot] || 0) + 1; 
    });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);

    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = "<h3>graphecamembert-Pie chart</h3><div id='chart' class='ct-chart ct-golden-section' style='height:250px;'></div>";

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
            cadreResultat.innerHTML += "<p style='color:red;'>Erreur : Librairie Chartist non chargée.</p>";
        }
    } else {
        alert("Pour le graphe, ajoutez <div class='cadre-resultat'> et Chartist dans le HTML.");
    }
});

// ============================================================
// 13. BOUTON AIDE
// ============================================================
document.getElementById('afficherAideBtn').addEventListener('click', function() {
    alert("Utilisation :\n1. Sélectionnez un fichier .txt.\n2. Entrez un mot dans 'Pôle' pour GREP, Concordancier, /kujuj/.\n3. Les délimiteurs et stopwords sont prédéfinis comme le prof.\n4. Cliquez sur les boutons pour lancer les analyses.");
});
