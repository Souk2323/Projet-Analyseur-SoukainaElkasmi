// --- 1. DICTIONNAIRE (Tableau de fréquence) ---
function dictionnaire() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0 || !zone) return;

    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const tri = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);

    // On crée le tableau HTML
    let html = "<table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr><th>Token</th><th>Fréquence</th></tr>";
    tri.forEach(([m, f]) => {
        html += `<tr><td>${m}</td><td style='text-align:center;'>${f}</td></tr>`;
    });
    html += "</table>";
    
    zone.innerHTML = html; // .innerHTML est obligatoire pour les tableaux
}

// --- 2. GRAPHE (Le Camembert) ---
function genererGraphe() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0 || !zone) return;

    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const labels = top.map(x => x[0]);
    const datas = top.map(x => x[1]);

    // Utilisation de l'API pour l'image du graphe
    const chartUrl = `https://quickchart.io/chart?c={type:'pie',data:{labels:['${labels.join("','")}'],datasets:[{data:[${datas.join(",")}]}]}}`;

    zone.innerHTML = `<img src="${chartUrl}" style='width:100%; max-width:350px; background:white;'>`;
}

// --- 3. NB PHRASES ---
function nombrePhrases() {
    const zone = document.getElementById('affichageDroit');
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    zone.innerHTML = "Il y a " + n + " phrases dans ce texte.";
}

// --- 4. MOTS LES PLUS LONGS (Tableau) ---
function motsPlusLongs() {
    const zone = document.getElementById('affichageDroit');
    const mots = [...new Set(preparerMots())];
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 10);

    let html = "<table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => {
        html += `<tr><td>${m}</td><td style='text-align:center;'>${m.length}</td></tr>`;
    });
    html += "</table>";
    zone.innerHTML = html;
}

// --- 5. CONCORDANCIER (Tableau 3 colonnes) ---
function concordancier() {
    const zone = document.getElementById('affichageDroit');
    const pole = document.getElementById('pôle').value.toLowerCase();
    const mots = preparerMots();
    if (!pole || !zone) return;

    let html = "<table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr><th>Gauche</th><th>Pôle</th><th>Droite</th></tr>";
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
