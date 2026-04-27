// Fonction pour le Dictionnaire (Tableau 2 colonnes)
function dictionnaire() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0 || !zone) return;

    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);

    let html = "<table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background-color:#f2f2f2;'><th>Token</th><th>Fréquence</th></tr>";
    tri.forEach(([m, f]) => {
        html += `<tr><td>${m}</td><td style='text-align:center;'>${f}</td></tr>`;
    });
    html += "</table>";
    zone.innerHTML = html;
}

// Fonction pour le Graphe (Le fameux Camembert)
function genererGraphe() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0 || !zone) return;
    
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 8);
    
    const labels = top.map(x => x[0]);
    const datas = top.map(x => x[1]);

    // On utilise l'URL QuickChart pour générer l'image du camembert
    const url = `https://quickchart.io/chart?c={type:'pie',data:{labels:['${labels.join("','")}'],datasets:[{data:[${datas.join(",")}]}]}}`;
    
    zone.innerHTML = `<h3>Mots les plus fréquents</h3><img src="${url}" style="width:100%; max-width:400px; display:block; margin:auto; background:white; padding:10px;">`;
}

// Fonction Nb Phrases
function nombrePhrases() {
    if (!texteAnalyse) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    document.getElementById('affichageDroit').innerHTML = `<p style='font-size:1.2em; padding:20px;'>Il y a <b>${n}</b> phrases dans ce texte.</p>`;
}

// Fonction Mots les plus longs (Tableau)
function motsPlusLongs() {
    const mots = [...new Set(preparerMots())];
    const zone = document.getElementById('affichageDroit');
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 7);

    let html = "<table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background-color:#f2f2f2;'><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => {
        html += `<tr><td>${m}</td><td style='text-align:center;'>${m.length}</td></tr>`;
    });
    html += "</table>";
    zone.innerHTML = html;
}
