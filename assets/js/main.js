// Remplace ta fonction dictionnaire par celle-ci
function dictionnaire() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    
    let freq = {};
    mots.forEach(m => freq[m] = (freq[m] || 0) + 1);
    
    let html = "<h3>Token / Fréquence</h3><table border='1' style='width:100%; border-collapse:collapse;'><tr><th>Token</th><th>Fréquence</th></tr>";
    // On affiche les 10 premiers mots
    Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10).forEach(([mot, compte]) => {
        html += `<tr><td>${mot}</td><td>${compte}</td></tr>`;
    });
    html += "</table>";
    
    document.getElementById('affichageDroit').innerHTML = html;
}

// Ajoute ou remplace la fonction pour les mots les plus longs
function motsPlusLongs() {
    const mots = [...new Set(preparerMots())];
    if (mots.length === 0) return;
    
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 7);
    
    let html = "<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse;'><tr><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => {
        html += `<tr><td>${m}</td><td>${m.length}</td></tr>`;
    });
    html += "</table>";
    
    document.getElementById('affichageDroit').innerHTML = html;
}
