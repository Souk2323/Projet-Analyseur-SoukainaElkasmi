// --- VARIABLES GLOBALES ---
let texteAnalyse = "";

// --- 1. CONNEXION AUTOMATIQUE (Sécurité) ---
// Ce bloc force le chargement du fichier si l'écouteur d'événement ne marche pas
const fileInput = document.getElementById('fileInput');
if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            texteAnalyse = event.target.result;
            if(document.getElementById('affichageGauche')) {
                document.getElementById('affichageGauche').innerText = texteAnalyse;
            }
            alert("Fichier " + file.name + " prêt pour le test !");
        };
        reader.readAsText(file);
    });
}

// --- 2. FONCTION DE DÉCOUPAGE ---
function preparerMots() {
    if (!texteAnalyse) {
        alert("Erreur : Chargez d'abord le fichier essai.txt !");
        return [];
    }
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput && delimInput.value ? delimInput.value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- 3. TOUTES LES ACTIONS (CORRIGÉES) ---

function segmenter() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length > 0 && zone) {
        zone.innerHTML = "<h3>Segmentation</h3><p>" + mots.join(" ") + "</p>";
    }
}

function kujuj() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    alert("Mode /kujuj/ activé !");
    if (mots.length > 0 && zone) {
        // La règle exacte : MAJUSCULE + juj
        const res = mots.map(m => m.toUpperCase() + "juj").join(" ");
        zone.innerHTML = "<h3>Résultat Kujuj</h3><p>" + res + "</p>";
    }
}

function dictionnaire() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0 || !zone) return;
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 8);
    let html = "<h3>Dictionnaire</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#555; color:white;'><th>Token</th><th>Fréquence</th></tr>";
    tri.forEach(([m, f]) => { html += `<tr><td>${m}</td><td>${f}</td></tr>`; });
    html += "</table>";
    zone.innerHTML = html;
}

function genererGraphe() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0 || !zone) return;
    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);
    const labels = top.map(x => x[0]);
    const datas = top.map(x => x[1]);
    const chartUrl = `https://quickchart.io/chart?c={type:'pie',data:{labels:['${labels.join("','")}'],datasets:[{data:[${datas.join(",")}]}]}}`;
    zone.innerHTML = `<h3>Mots les plus fréquents</h3><img src="${chartUrl}" style="width:100%; max-width:400px; background:white;">`;
}

function nombrePhrases() {
    const zone = document.getElementById('affichageDroit');
    if (!texteAnalyse || !zone) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    zone.innerHTML = `<h3>Analyse</h3><p>Il y a <b>${n}</b> phrases dans ce texte.</p>`;
}

function motsPlusLongs() {
    const mots = [...new Set(preparerMots())];
    const zone = document.getElementById('affichageDroit');
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 7);
    let html = "<h3>Mots les Plus Longs</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    html += "<tr style='background:#555; color:white;'><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => { html += `<tr><td>${m}</td><td>${m.length}</td></tr>`; });
    html += "</table>";
    zone.innerHTML = html;
}

function concordancier() {
    const poleElement = document.getElementById('pôle') || document.getElementById('pole');
    const pole = poleElement ? poleElement.value.toLowerCase() : "";
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (!pole || mots.length === 0 || !zone) return;
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole) {
            const g = mots.slice(Math.max(0, i-2), i).join(" ");
            const d = mots.slice(i+1, i+3).join(" ");
            html += `<tr><td>${g}</td><td style='color:red;'><b>${m}</b></td><td>${d}</td></tr>`;
        }
    });
    html += "</table>";
    zone.innerHTML = html;
}
