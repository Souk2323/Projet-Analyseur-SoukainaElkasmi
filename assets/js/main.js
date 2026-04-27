// --- 1. FONCTION KUJUJ (Majuscule + uj) ---
function kujuj() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    alert("Mode /kujuj/ activé !");
    if (mots.length > 0 && zone) {
        const res = mots.map(m => m.toUpperCase() + "uj").join(" ");
        zone.innerHTML = "<h3>Résultat Kujuj :</h3><p>" + res + "</p>";
    }
}

// --- 2. DICTIONNAIRE (Tableau comme le prof) ---
function dictionnaire() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0 || !zone) return;

    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const tri = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // On crée le tableau HTML directement en JS
    let html = "<h3>Dictionnaire</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#f2f2f2;'><th>Token</th><th>Fréquence</th></tr>";
    tri.forEach(([m, f]) => {
        html += `<tr><td>${m}</td><td style='text-align:center;'>${f}</td></tr>`;
    });
    html += "</table>";
    zone.innerHTML = html;
}

// --- 3. GRAPHE (Le Camembert avec l'URL QuickChart) ---
function genererGraphe() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0 || !zone) return;

    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const labels = top.map(x => x[0]);
    const datas = top.map(x => x[1]);

    // Cette URL crée l'image du camembert automatiquement
    const chartUrl = `https://quickchart.io/chart?c={type:'pie',data:{labels:['${labels.join("','")}'],datasets:[{data:[${datas.join(",")}]}]}}`;

    zone.innerHTML = `<h3>Fréquences</h3><div style='text-align:center;'><img src="${chartUrl}" style='width:100%; max-width:350px; background:white; padding:10px;'></div>`;
}

// --- 4. NOMBRE DE PHRASES ---
function nombrePhrases() {
    const zone = document.getElementById('affichageDroit');
    if (!texteAnalyse || !zone) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    zone.innerHTML = `<h3>Analyse</h3><p>Il y a <b>${n}</b> phrases dans ce texte.</p>`;
}

// --- 5. MOTS LES PLUS LONGS (Tableau) ---
function motsPlusLongs() {
    const zone = document.getElementById('affichageDroit');
    const mots = [...new Set(preparerMots())];
    if (mots.length === 0 || !zone) return;
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 7);

    let html = "<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#f2f2f2;'><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => {
        html += `<tr><td>${m}</td><td style='text-align:center;'>${m.length}</td></tr>`;
    });
    html += "</table>";
    zone.innerHTML = html;
}
