let texteAnalyse = "";

// 1. CHARGEMENT DU FICHIER (Indispensable pour que le reste marche)
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        // Affiche à gauche pour vérifier que le fichier est lu
        const gauche = document.getElementById('affichageGauche');
        if(gauche) gauche.innerText = texteAnalyse;
        alert("Fichier " + file.name + " bien chargé !");
    };
    reader.readAsText(file);
});

// 2. MÉTHODE DE DÉCOUPAGE COMMUNE
function preparerMots() {
    if (!texteAnalyse) {
        alert("Attention : Aucun fichier n'est chargé !");
        return [];
    }
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput && delimInput.value ? delimInput.value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// 3. LES FONCTIONS DES BOUTONS (Même méthode d'affichage partout)

function segmenter() {
    const mots = preparerMots();
    if (mots.length > 0) {
        document.getElementById('affichageDroit').innerText = mots.join(" ");
    }
}

function kujuj() {
    const mots = preparerMots();
    if (mots.length > 0) {
        alert("Mode /kujuj/ activé !");
        // Règle : MOTS EN MAJUSCULES + uj
        const res = mots.map(m => m.toUpperCase() + "uj").join(" ");
        document.getElementById('affichageDroit').innerText = res;
    }
}

function grep() {
    const pole = document.getElementById('pôle').value.toLowerCase();
    if (!pole) { alert("Entre un mot dans la case Pôle !"); return; }
    
    // Découpage en phrases et recherche du mot
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.toLowerCase().includes(pole));
    document.getElementById('affichageDroit').innerText = phrases.join("\n\n");
}

function concordancier() {
    const pole = document.getElementById('pôle').value.toLowerCase();
    const mots = preparerMots();
    if (!pole || mots.length === 0) return;

    let lignes = "";
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pole) {
            // Prend 2 mots avant et 2 mots après
            const contexte = mots.slice(i-2, i).join(" ") + " [" + m + "] " + mots.slice(i+1, i+3).join(" ");
            lignes += contexte + "\n";
        }
    });
    document.getElementById('affichageDroit').innerText = lignes || "Aucun résultat.";
}

function motsPlusLongs() {
    const mots = [...new Set(preparerMots())]; // Enlève les doublons
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 10);
    document.getElementById('affichageDroit').innerText = "TOP 10 MOTS LONGS :\n\n" + tri.join("\n");
}

function genererGraphe() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    
    let freq = {};
    mots.forEach(m => { freq[m.toLowerCase()] = (freq[m.toLowerCase()] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);
    
    let rendu = "FRÉQUENCES (Top 5) :\n\n";
    top.forEach(([m, f]) => {
        rendu += m + " : " + "█".repeat(f) + " (" + f + ")\n";
    });
    document.getElementById('affichageDroit').innerText = rendu;
}
