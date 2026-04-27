let texteAnalyse = "";

// 1. Chargement du fichier (Essentiel pour remplir la zone de gauche)
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        // On affiche le texte brut à gauche (comme sur la photo de ta collègue)
        document.getElementById('affichageGauche').innerText = texteAnalyse;
        
        const cadre = document.querySelector('.cadre-bonjour');
        if(cadre) cadre.innerText = "Fichier prêt !";
    };
    reader.readAsText(file);
});

// 2. Préparation des mots (Segmentation de base)
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

// --- LES FONCTIONS DES BOUTONS ---

function segmenter() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    // Affiche les mots séparés par un espace dans la zone de droite
    document.getElementById('affichageDroit').innerText = mots.join(" ");
}

function kujuj() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    alert("Mode /kujuj/ activé !");
    // Règle : Mot en majuscule + UJ à la fin
    const resultat = mots.map(m => m.toUpperCase() + "UJ").join(" ");
    document.getElementById('affichageDroit').innerText = resultat;
}

function grep() {
    const pole = document.getElementById('pôle').value.toLowerCase();
    if (!pole || !texteAnalyse) {
        alert("Entrez un pôle (mot à chercher) !");
        return;
    }
    // Cherche les phrases contenant le mot
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.toLowerCase().includes(pole));
    document.getElementById('affichageDroit').innerText = phrases.join("\n\n");
}

function concordancier() {
    const pole = document.getElementById('pôle').value.toLowerCase();
    const mots = preparerMots();
    if (!pole || mots.length === 0) return;

    let resultat = "";
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole) {
            const gauche = mots.slice(Math.max(0, i - 2), i).join(" ");
            const droite = mots.slice(i + 1, i + 3).join(" ");
            resultat += `${gauche} [ ${m} ] ${droite}\n`;
        }
    });
    document.getElementById('affichageDroit').innerText = resultat || "Aucune occurrence trouvée.";
}

function motsPlusLongs() {
    const mots = [...new Set(preparerMots())];
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 5);
    document.getElementById('affichageDroit').innerText = "MOTS LES PLUS LONGS :\n" + tri.map(m => `- ${m} (${m.length} l.)`).join("\n");
}

function genererGraphe() {
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { freq[m.toLowerCase()] = (freq[m.toLowerCase()] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);
    
    let graph = "GRAPHIQUE DE FRÉQUENCE :\n";
    top.forEach(([m, f]) => {
        graph += `${m.padEnd(12)} | ${"#".repeat(f)} (${f})\n`;
    });
    document.getElementById('affichageDroit').innerText = graph;
}
