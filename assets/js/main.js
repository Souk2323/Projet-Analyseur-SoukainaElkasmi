let texteAnalyse = "";

// --- CHARGEMENT DU FICHIER ---
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        const gauche = document.getElementById('affichageGauche');
        if(gauche) gauche.innerText = texteAnalyse;
        alert("Fichier chargé avec succès !");
    };
    reader.readAsText(file);
});

// --- NETTOYAGE DES MOTS ---
function preparerMots() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord charger un fichier .txt");
        return [];
    }
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput && delimInput.value ? delimInput.value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- 1. SEGMENTER (Affichage propre) ---
function segmenter() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0) return;
    zone.innerHTML = "<h3>Segmentation</h3><p style='line-height:1.8;'>" + mots.join(" ") + "</p>";
}

// --- 2. KUJUJ (Règle : MAJUSCULE + juj) ---
function kujuj() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    alert("Mode /kujuj/ activé !");
    if (mots.length > 0) {
        // Ajoute "juj" à la fin de CHAQUE mot
        const resultat = mots.map(m => m.toUpperCase() + "juj").join(" ");
        zone.innerHTML = "<h3>Résultat Kujuj</h3><p style='line-height:1.8;'>" + resultat + "</p>";
    }
}

// --- 3. GRAPHE (Vrai Camembert comme le prof) ---
function genererGraphe() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0) return;
    
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);
    
    const labels = top.map(x => x[0]);
    const datas = top.map(x => x[1]);

    // Génération automatique du camembert via QuickChart
    const chartUrl = `https://quickchart.io/chart?c={type:'pie',data:{labels:['${labels.join("','")}'],datasets:[{data:[${datas.join(",")}]}]}}`;

    zone.innerHTML = `<h3>Mots les plus fréquents</h3><div style="text-align:center;"><img src="${chartUrl}" style="width:100%; max-width:400px; background:white; padding:10px; border-radius:10px; border:1px solid #ccc;"></div>`;
}

// --- 4. DICTIONNAIRE (Tableau) ---
function dictionnaire() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0) return;
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 8);

    let html = "<h3>Dictionnaire</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#555; color:white;'><th>Token</th><th>Fréquence</th></tr>";
    tri.forEach(([m, f]) => { html += `<tr><td>${m}</td><td style='text-align:center;'>${f}</td></tr>`; });
    html += "</table>";
    zone.innerHTML = html;
}

// --- 5. NOMBRE DE PHRASES ---
function nombrePhrases() {
    const zone = document.getElementById('affichageDroit');
    if (!texteAnalyse) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    zone.innerHTML = `<h3>Analyse</h3><p>Il y a <b>${n}</b> phrases dans ce texte.</p>`;
}

// --- 6. MOTS LES PLUS LONGS ---
function motsPlusLongs() {
    const mots = [...new Set(preparerMots())];
    const zone = document.getElementById('affichageDroit');
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 7);

    let html = "<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#555; color:white;'><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => { html += `<tr><td>${m}</td><td style='text-align:center;'>${m.length}</td></tr>`; });
    html += "</table>";
    zone.innerHTML = html;
}

// --- 7. CONCORDANCIER ---
function concordancier() {
    const pole = document.getElementById('pôle').value.toLowerCase();
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (!pole || mots.length === 0) return;

    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#555; color:white;'><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole) {
            const g = mots.slice(Math.max(0, i-2), i).join(" ");
            const d = mots.slice(i+1, i+3).join(" ");
            html += `<tr><td style='text-align:right;'>${g}</td><td style='text-align:center; color:red;'><b>${m}</b></td><td>${d}</td></tr>`;
        }
    });
    html += "</table>";
    zone.innerHTML = html;
}
