// Variables globales pour stocker les données du fichier
let texteAnalyse = "";
let lignesTexte = [];

// --- 1. CHARGEMENT DU FICHIER ---
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        // On stocke les lignes pour le GREP (Séance 9)
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        
        // On affiche un message dans le cadre "Bonjour" pour confirmer
        const cadre = document.querySelector('.cadre-bonjour');
        if (cadre) cadre.innerText = "Fichier chargé : " + lignesTexte.length + " lignes.";
        alert("Fichier prêt !");
    };
    reader.readAsText(file);
});

// --- 2. FONCTION DE SÉCURITÉ ---
function estPret() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord sélectionner un fichier .txt !");
        return false;
    }
    return true;
}

// --- 3. NETTOYAGE DES MOTS ---
function preparerMots() {
    const delimiteurs = document.getElementById('delims').value || " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- 4. LES ACTIONS DES BOUTONS ---

// SEGMENTATION
function segmenter() {
    if (!estPret()) return;
    const mots = preparerMots();
    document.querySelector('.cadre-bonjour').innerHTML = "<h3>Segmentation</h3><p>" + mots.join(" | ") + "</p>";
}

// DICTIONNAIRE
function dictionnaire() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);

    let html = "<h3>Dictionnaire (Top 10)</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    tri.forEach(([m, f]) => { html += `<tr><td>${m}</td><td>${f}</td></tr>`; });
    document.querySelector('.cadre-bonjour').innerHTML = html + "</table>";
}

// GREP (Séance 9)
function grep() {
    if (!estPret()) return;
    const pôle = document.getElementById('pole').value.trim();
    if (!pôle) { alert("Entrez un mot dans PÔLE"); return; }
    
    const regex = new RegExp(pôle, "gi");
    const resultats = lignesTexte.filter(ligne => ligne.match(regex));
    
    let html = `<h3>GREP (${resultats.length} lignes)</h3><div style='text-align:left; font-size:10px;'>`;
    resultats.forEach(l => {
        html += l.replace(regex, (match) => `<span style="color:red; font-weight:bold;">${match}</span>`) + "<br><hr>";
    });
    document.querySelector('.cadre-bonjour').innerHTML = html + "</div>";
}

// CONCORDANCIER (Séance 10)
function concordancier() {
    if (!estPret()) return;
    const pôle = document.getElementById('pole').value.trim();
    if (!pôle) { alert("Entrez un mot dans PÔLE"); return; }

    const mots = preparerMots();
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; font-size:10px;'>";
    
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pôle.toLowerCase()) {
            const g = mots.slice(Math.max(0, i-3), i).join(" ");
            const d = mots.slice(i+1, i+4).join(" ");
            html += `<tr><td align='right'>${g}</td><td align='center' style='color:red;'><b>${m}</b></td><td>${d}</td></tr>`;
        }
    });
    document.querySelector('.cadre-bonjour').innerHTML = html + "</table>";
}

// KUJUJ (Fonction perso)
function kujuj() {
    if (!estPret()) return;
    alert("Mode /kujuj/ activé !");
    const mots = preparerMots();
    const res = mots.map(m => m.toUpperCase() + "juj").join(" ");
    document.querySelector('.cadre-bonjour').innerHTML = "<h3>Résultat Kujuj</h3><p>" + res + "</p>";
}

// NOMBRE DE PHRASES
function nombrePhrases() {
    if (!estPret()) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    document.querySelector('.cadre-bonjour').innerHTML = `<h3>Analyse</h3><p>Il y a <b>${n}</b> phrases.</p>`;
}

// MOTS LES PLUS LONGS
function motsPlusLongs() {
    if (!estPret()) return;
    const mots = [...new Set(preparerMots())];
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 10);
    document.querySelector('.cadre-bonjour').innerHTML = "<h3>Mots longs</h3><p>" + tri.join(", ") + "</p>";
}

// GRAPHE (Séance 11 - Chartist)
function genererGraphe() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);

    document.querySelector('.cadre-bonjour').innerHTML = '<h3>Graphe</h3><div id="chart" class="ct-chart ct-golden-section" style="height:200px;"></div>';
    
    new Chartist.Pie('#chart', {
        labels: top.map(x => x[0]),
        series: top.map(x => x[1])
    });
}
