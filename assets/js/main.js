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
        
        // On change le texte du bouton "Bonjour" ou du cadre pour confirmer
        document.querySelector('.cadre-bonjour').innerHTML = "Fichier chargé ! (" + lignesTexte.length + " lignes)";
        alert("Fichier prêt pour l'analyse !");
    };
    reader.readAsText(file);
});

// --- 2. FONCTIONS OUTILS ---
function estPret() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord sélectionner un fichier .txt !");
        return false;
    }
    return true;
}

function preparerMots() {
    const delimiteurs = document.getElementById('delims').value || " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- 3. LES ACTIONS DES BOUTONS (Appelées par ton HTML) ---

function segmenter() {
    if (!estPret()) return;
    const mots = preparerMots();
    alert("Segmentation : \n" + mots.join(" | "));
}

function dictionnaire() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { 
        let mot = m.toLowerCase(); 
        freq[mot] = (freq[mot] || 0) + 1; 
    });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);
    
    let message = "TOP 10 DES MOTS :\n";
    tri.forEach(([m, f]) => { message += m + " : " + f + "\n"; });
    alert(message);
}

function grep() {
    if (!estPret()) return;
    const pôle = document.getElementById('pole').value.trim();
    if (!pôle) return alert("Entrez un mot dans PÔLE");
    
    const regex = new RegExp(pôle, "gi");
    const resultats = lignesTexte.filter(ligne => ligne.match(regex));
    alert("Lignes trouvées : " + resultats.length + "\n\n" + resultats.slice(0,5).join("\n"));
}

function concordancier() {
    if (!estPret()) return;
    const pôle = document.getElementById('pole').value.trim();
    if (!pôle) return alert("Entrez un mot dans PÔLE");

    const mots = preparerMots();
    let resultats = "";
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pôle.toLowerCase()) {
            const avant = mots.slice(Math.max(0, i-3), i).join(" ");
            const apres = mots.slice(i+1, i+4).join(" ");
            resultats += avant + " [" + m + "] " + apres + "\n";
        }
    });
    alert(resultats || "Aucune occurrence trouvée.");
}

function kujuj() {
    if (!estPret()) return;
    const mots = preparerMots();
    const res = mots.slice(0, 20).map(m => m.toUpperCase() + "juj").join(" ");
    alert("Version Kujuj (début) : \n" + res);
}

function nombrePhrases() {
    if (!estPret()) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    alert("Il y a environ " + n + " phrase(s).");
}

function motsPlusLongs() {
    if (!estPret()) return;
    const motsUniques = [...new Set(preparerMots())];
    const tri = motsUniques.sort((a, b) => b.length - a.length).slice(0, 10);
    alert("Les 10 mots les plus longs : \n" + tri.join("\n"));
}

function genererGraphe() {
    if (!estPret()) return;
    alert("Fonction Graphe : Assurez-vous d'avoir une zone <div id='chart'> dans votre HTML pour afficher le graphique.");
}
