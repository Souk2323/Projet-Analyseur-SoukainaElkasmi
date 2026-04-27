// 1. LE NOMBRE DE PHRASES
function nombrePhrases() {
    if (!texteAnalyse) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    document.getElementById('affichageDroit').innerHTML = 
        `<div style="font-family:monospace; padding:20px; font-size:1.2em;">
            Il y a <strong>${n}</strong> phrases dans ce texte.
         </div>`;
}

// 2. LE DICTIONNAIRE (Tableau comme sur ta photo)
function dictionnaire() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });

    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 8);

    let html = `<h3>Dictionnaire</h3><table border='1' style='width:100%; border-collapse:collapse; background:rgba(255,255,255,0.1);'>
                <tr style='background:#555; color:white;'><th>Token</th><th>Fréquence</th></tr>`;
    tri.forEach(([m, f]) => {
        html += `<tr><td style='padding:5px;'>${m}</td><td style='padding:5px; text-align:center;'>${f}</td></tr>`;
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}

// 3. LES MOTS LES PLUS LONGS (Tableau)
function motsPlusLongs() {
    const mots = [...new Set(preparerMots())];
    if (mots.length === 0) return;
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 7);

    let html = `<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse;'>
                <tr style='background:#555; color:white;'><th>Mot</th><th>Longueur</th></tr>`;
    tri.forEach(m => {
        html += `<tr><td style='padding:5px;'>${m}</td><td style='padding:5px; text-align:center;'>${m.length}</td></tr>`;
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}

// 4. LE GRAPHE (Vrai Camembert avec QuickChart comme sur ton image)
function genererGraphe() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);
    
    const labels = top.map(x => x[0]);
    const datas = top.map(x => x[1]);

    // On utilise l'API QuickChart pour faire le camembert exact
    const chartUrl = `https://quickchart.io/chart?c={type:'pie',data:{labels:['${labels.join("','")}'],datasets:[{data:[${datas.join(",")}]}]}}`;

    document.getElementById('affichageDroit').innerHTML = `
        <h3>Mots les plus fréquents</h3>
        <div style="text-align:center;">
            <img src="${chartUrl}" style="width:100%; max-width:400px; background:white; padding:10px; border-radius:10px;">
        </div>`;
}

// 5. LE CONCORDANCIER (Tableau 3 colonnes)
function concordancier() {
    const pole = document.getElementById('pôle').value.toLowerCase();
    const mots = preparerMots();
    if (!pole || mots.length === 0) return;

    let html = `<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse; font-size:0.9em;'>
                <tr style='background:#555; color:white;'><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr>`;
    
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole) {
            const g = mots.slice(Math.max(0, i-3), i).join(" ");
            const d = mots.slice(i+1, i+4).join(" ");
            html += `<tr><td style='text-align:right;'>${g}</td><td style='text-align:center; color:red;'><b>${m}</b></td><td>${d}</td></tr>`;
        }
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}
