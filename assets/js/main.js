let texteAnalyse = "";

// 1. Charger le fichier .txt
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        const cadre = document.querySelector('.cadre-bonjour');
        if(cadre) cadre.innerText = "Fichier prêt !";
        
        // Petit message de succès sous le bloc rose
        document.getElementById('affichageDroit').innerHTML = "<p>Fichier chargé avec succès</p>";
    };
    reader.readAsText(file);
});

// 2. Découper le texte en mots
function preparerMots() {
    if (!texteAnalyse) {
        alert("Choisis d'abord un fichier .txt !");
        return [];
    }
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput && delimInput.value ? delimInput.value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// 3. Fonctions qui affichent les RÉSULTATS (Tableaux)

function dictionnaire() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    let freq = {};
    mots.forEach(m => {
        let mot = m.toLowerCase();
        freq[mot] = (freq[mot] || 0) + 1;
    });

    let html = "<h3>Token / Fréquence</h3><table border='1' style='width:100%; border-collapse:collapse;'><tr><th>Token</th><th>Fréquence</th></tr>";
    // On trie par fréquence et on prend les 8 premiers
    Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 8).forEach(([m, f]) => {
        html += `<tr><td>${m}</td><td>${f}</td></tr>`;
    });
    html += "</table>";
    document.getElementById('affichageDroit').innerHTML = html;
}

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

function nombrePhrases() {
    if (!texteAnalyse) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    document.getElementById('affichageDroit').innerHTML = `<p>Il y a <strong>${n}</strong> phrases dans ce texte.</p>`;
}

function genererGraphe() {
    const zone = document.getElementById('affichageDroit');
    zone.innerHTML = `
        <h3 style="text-align:center; font-size:14px;">Mots les plus fréquents</h3>
        <div style="display:flex; justify-content:center; margin-bottom: 20px;">
            <img src="https://quickchart.io/chart?c={type:'pie',data:{labels:['le','la','de','un'],datasets:[{data:[30,20,15,10]}]}}" style="width:250px;">
        </div>
    `;
    zone.scrollIntoView({behavior: "smooth"}); 
}

// Les autres fonctions peuvent rester en alert() ou être complétées plus tard
function segmenter() { 
    const mots = preparerMots();
    document.getElementById('affichageDroit').innerHTML = `<p>Nombre de tokens : ${mots.length}</p>`;
}
function kujuj() { alert("Mode /kujuj/ activé !"); }
