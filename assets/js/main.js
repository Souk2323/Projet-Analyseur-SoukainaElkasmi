// Variable globale pour stocker le contenu du fichier
let texteAnalyse = "";

// 1. Gestion du fichier (Assure-toi que ton input a id="fileInput")
document.addEventListener('change', function(e) {
    if (e.target && e.target.type === 'file') {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            texteAnalyse = event.target.result;
            // Affiche le texte brut à gauche (cherche l'id de ta zone gauche)
            const zoneGauche = document.getElementById('affichageGauche');
            if (zoneGauche) zoneGauche.innerText = texteAnalyse;
            alert("Fichier chargé avec succès !");
        };
        reader.readAsText(file);
    }
});

// 2. Fonction de découpage (utilisée par tous les boutons)
function preparerMots() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord sélectionner un fichier .txt");
        return [];
    }
    const delim = document.getElementById('delims') ? document.getElementById('delims').value : " ,;.'!?-";
    const regex = new RegExp("[" + delim.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- LES ACTIONS ---

// SEGMENTATION (Texte simple à droite)
function segmenter() {
    const mots = preparerMots();
    document.getElementById('affichageDroit').innerHTML = "<h3>Segmentation</h3><p>" + mots.join(" | ") + "</p>";
}

// DICTIONNAIRE (Tableau comme sur ta photo)
function dictionnaire() {
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    
    const tri = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
    
    let html = "<h3>Dictionnaire (Top 10)</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#eee;'><th>Token</th><th>Fréquence</th></tr>";
    tri.forEach(([m, f]) => {
        html += `<tr><td>${m}</td><td style='text-align:center;'>${f}</td></tr>`;
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}

// GREP (Recherche par mot)
function grep() {
    const pole = document.getElementById('pôle').value.toLowerCase();
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.toLowerCase().includes(pole));
    document.getElementById('affichageDroit').innerHTML = "<h3>Résultat GREP</h3><p>" + phrases.join("<br><br>") + "</p>";
}

// CONCORDANCIER (Tableau 3 colonnes comme ta collègue)
function concordancier() {
    const pole = document.getElementById('pôle').value.toLowerCase();
    const mots = preparerMots();
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#eee;'><th>Contexte Gauche</th><th>Pôle</th><th>Contexte Droit</th></tr>";
    
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole) {
            const g = mots.slice(Math.max(0, i-2), i).join(" ");
            const d = mots.slice(i+1, i+3).join(" ");
            html += `<tr><td style='text-align:right;'>${g}</td><td style='text-align:center; color:red;'><b>${m}</b></td><td>${d}</td></tr>`;
        }
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}

// KUJUJ (La règle demandée)
function kujuj() {
    const mots = preparerMots();
    alert("Mode /kujuj/ activé !");
    const res = mots.map(m => m.toUpperCase() + "uj").join(" ");
    document.getElementById('affichageDroit').innerHTML = "<h3>Résultat Kujuj</h3><p>" + res + "</p>";
}

// NB PHRASES
function nombrePhrases() {
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    document.getElementById('affichageDroit').innerHTML = `<h3>Statistiques</h3><p>Il y a <b>${n}</b> phrases dans ce texte.</p>`;
}

// MOTS LES PLUS LONGS (Tableau comme sur ta photo 6)
function motsPlusLongs() {
    const mots = [...new Set(preparerMots())];
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 8);
    
    let html = "<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#eee;'><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => {
        html += `<tr><td>${m}</td><td style='text-align:center;'>${m.length}</td></tr>`;
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}

// GRAPHE (L'image Camembert comme sur ta photo 3)
function genererGraphe() {
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
    
    const labels = top.map(x => x[0]);
    const datas = top.map(x => x[1]);
    
    const url = `https://quickchart.io/chart?c={type:'pie',data:{labels:['${labels.join("','")}'],datasets:[{data:[${datas.join(",")}]}]}}`;
    document.getElementById('affichageDroit').innerHTML = `<h3>Top Fréquences</h3><img src="${url}" style="width:100%; max-width:350px; display:block; margin:auto;">`;
}
