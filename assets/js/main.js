// Variables globales
var texteAnalyse = "";
var lignesTexte = [];

// Délimiteurs et stopwords
var delimiteurs = "`/*~|&#@=~:?%*$(){}[];+-*/`";
var stopwords = ["de","le","la","les","à","et","des","un","une","du","que","en","l","que","qu","d","s","se","ne","n","ce","me","sa"];

// Chargement du fichier
document.getElementById('fileInput').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        lignesTexte = texteAnalyse.split(/\n/).filter(function(l) { return l.trim().length > 0; });
        var nbTokens = preparerMotsBruts().length;
        document.querySelector('.cadre-bonjour').innerHTML = "<p>Fichier chargé avec succès<br>Nombre de tokens : " + nbTokens + "<br>Nombre de lignes : " + lignesTexte.length + "</p>";
    };
    reader.readAsText(file);
});

// Fonction garde
function estPret() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord sélectionner un fichier .txt !");
        return false;
    }
    return true;
}

// Préparation des mots (tous les tokens)
function preparerMotsBruts() {
    var delimEchappes = delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var regex = new RegExp("[" + delimEchappes + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(function(m) { return m.length > 0; });
}

// Préparation des mots (sans stopwords)
function preparerMots() {
    return preparerMotsBruts().filter(function(m) {
        return !stopwords.includes(m.toLowerCase());
    });
}

// Affichage dans le cadre bonjour
function afficher(html) {
    document.querySelector('.cadre-bonjour').innerHTML = html;
}

// Segmentation
function segmenter() {
    if (!estPret()) return;
    var mots = preparerMots();
    afficher("<h3>Segmentation</h3><p>" + mots.join(" | ") + "</p>");
}

// Nombre de phrases
function nombrePhrases() {
    if (!estPret()) return;
    var phrases = texteAnalyse.split(/[.!?]+/).filter(function(p) { return p.trim().length > 0; });
    afficher("<h3>Nombre de phrases</h3><p>" + phrases.length + "</p>");
}

// Dictionnaire (mots les plus fréquents)
function dictionnaire() {
    if (!estPret()) return;
    var mots = preparerMots();
    var freq = {};
    mots.forEach(function(m) {
        freq[m] = (freq[m] || 0) + 1;
    });
    var tri = Object.entries(freq).sort(function(a, b) { return b[1] - a[1]; });
    var html = "<h3>Mots les plus fréquents</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    tri.forEach(function(item) {
        html += "<tr><td>" + item[0] + "</td><td>" + item[1] + "</td></tr>";
    });
    html += "</table>";
    afficher(html);
}

// Mots les plus longs
function motsPlusLongs() {
    if (!estPret()) return;
    var motsUniques = [...new Set(preparerMots())];
    var tri = motsUniques.sort(function(a, b) { return b.length - a.length; }).slice(0, 10);
    var html = "<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(function(m) {
        html += "<tr><td>" + m + "</td><td>" + m.length + "</td></tr>";
    });
    html += "</table>";
    afficher(html);
}

// GREP
function grep() {
    if (!estPret()) return;
    var pole = document.getElementById('pole').value.trim();
    if (!pole) {
        alert("Veuillez entrer un mot dans le champ PÔLE.");
        return;
    }
    var regex = new RegExp(pole, "gi");
    var resultats = [];
    lignesTexte.forEach(function(ligne) {
        if (regex.test(ligne)) {
            resultats.push(ligne);
        }
        regex.lastIndex = 0;
    });
    var html = "<h3>GREP</h3><p>" + resultats.length + " ligne(s) trouvée(s)</p>";
    resultats.forEach(function(l) {
        regex.lastIndex = 0;
        html += l.replace(regex, function(m) { return "<span style='color:red;'>" + m + "</span>"; }) + "<hr>";
    });
    afficher(html);
}

// Concordancier
function concordancier() {
    if (!estPret()) return;
    var pole = document.getElementById('pole').value.trim();
    if (!pole) {
        alert("Veuillez entrer un mot dans le champ PÔLE.");
        return;
    }
    var mots = preparerMotsBruts();
    var html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr>";
    var trouve = false;
    mots.forEach(function(m, i) {
        if (m.toLowerCase() === pole.toLowerCase()) {
            trouve = true;
            var gauche = mots.slice(Math.max(0, i-3), i).join(" ");
            var droit = mots.slice(i+1, i+4).join(" ");
            html += "<tr><td style='text-align:right;'>" + gauche + "</td><td style='color:red; text-align:center;'><b>" + m + "</b></td><td>" + droit + "</td></tr>";
        }
    });
    html += "</table>";
    if (trouve) {
        afficher(html);
    } else {
        afficher("<h3>Concordancier</h3><p>Le mot '" + pole + "' n'a pas été trouvé.</p>");
    }
}

// /kujuj/
function kujuj() {
    if (!estPret()) return;
    var mots = preparerMotsBruts();
    var resultat = mots.map(function(m) { return m + "juj"; }).join(" ");
    afficher("<h3>/kujuj/</h3><p>" + resultat + "</p>");
}

// Graphe camembert
function genererGraphe() {
    if (!estPret()) return;
    var mots = preparerMots();
    var freq = {};
    mots.forEach(function(m) {
        var mot = m.toLowerCase();
        freq[mot] = (freq[mot] || 0) + 1;
    });
    var top = Object.entries(freq).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 7);
    afficher("<h3>graphecamembert-Pie chart</h3><div id='chart' class='ct-chart' style='height:250px; width:250px; margin:auto;'></div>");
    setTimeout(function() {
        new Chartist.Pie('#chart', {
            labels: top.map(function(x) { return x[0]; }),
            series: top.map(function(x) { return x[1]; })
        }, {
            donut: false,
            showLabel: true
        });
    }, 100);
}
