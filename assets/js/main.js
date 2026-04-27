// Variables globales
let texteAnalyse = "";
let lignesTexte = [];

// --- 1. CHARGEMENT DU FICHIER ---
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        
        // Affichage des statistiques initiales (sous le cadre rose)
        const cadreMessage = document.querySelector('.cadre-message'); 
        if (cadreMessage) {
            cadreMessage.innerHTML = `
                <p>Fichier chargé avec succès</p>
                <p>Nombre de tokens : ${preparerMots().length}</p>
                <p>Nombre de lignes : ${lignesTexte.length}</p>
            `;
        }
        
        // Affiche le texte brut dans la zone de gauche
        const zoneTexte = document.getElementById('affichage-texte-cv');
        if (zoneTexte) zoneTexte.innerText = texteAnalyse;
    };
    reader.readAsText(file);
});

// --- 2. SÉCURITÉ & NETTOYAGE ---
function estPret() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord sélectionner un fichier .txt !");
        return false;
    }
    return true;
}

function preparerMots() {
    // Récupère les délimiteurs de l'utilisateur
    const delimInput = document.getElementById('delims').value || " ,;.'!?-";
    const escaped = delimInput.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp("[" + escaped + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- 3. ACTIONS (DICTIONNAIRE & CONCORDANCIER) ---

// DICTIONNAIRE : Génère un tableau propre
document.getElementById('dictionnaireBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { 
        let mot = m.toLowerCase(); 
        freq[mot] = (freq[mot] || 0) + 1; 
    });
    
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);

    let html = "<h3>Mots les plus fréquents</h3><table class='tableau-prof'>";
    html += "<tr><th>Token</th><th>Fréquence</th></tr>";
    tri.forEach(([m, f]) => { 
        html += `<tr><td>${m}</td><td>${f}</td></tr>`; 
    });
    document.getElementById('cadre-resultat-analyse').innerHTML = html + "</table>";
});

// CONCORDANCIER : Rendu exact (Gauche | Pôle | Droit)
document.getElementById('concordancierBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const pole = document.getElementById('pole').value.trim();
    if (!pole) return alert("Entrez un mot dans PÔLE !");

    const mots = preparerMots();
    let html = "<h3>Concordancier</h3><table class='tableau-prof'>";
    html += "<tr><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr>";
    
    let trouve = false;
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole.toLowerCase()) {
            trouve = true;
            const gauche = mots.slice(Math.max(0, i-5), i).join(" ");
            const droit = mots.slice(i+1, i+6).join(" ");
            html += `<tr>
                        <td class='text-right'>${gauche}</td>
                        <td class='text-center pole-rouge'><b>${m}</b></td>
                        <td class='text-left'>${droit}</td>
                    </tr>`;
        }
    });
    
    document.getElementById('cadre-resultat-analyse').innerHTML = trouve ? html + "</table>" : "<p>Mot non trouvé.</p>";
});

// MOTS LES PLUS LONGS
document.getElementById('motsLongsBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const motsUniques = [...new Set(preparerMots())];
    const tri = motsUniques.sort((a, b) => b.length - a.length).slice(0, 10);
    
    let html = "<h3>Mots les plus longs</h3><table class='tableau-prof'>";
    html += "<tr><th>Mot</th><th>Longueur</th></tr>";
    tri.forEach(m => {
        html += `<tr><td>${m}</td><td>${m.length}</td></tr>`;
    });
    document.getElementById('cadre-resultat-analyse').innerHTML = html + "</table>";
});

// NOMBRE DE PHRASES
document.getElementById('nbPhrasesBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    document.getElementById('cadre-resultat-analyse').innerHTML = `<p class='phrase-compte'>Il y a <b>${n}</b> phrases dans ce texte.</p>`;
});
