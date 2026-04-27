// On garde la même logique de découpage
function preparerMots() {
    if (!texteAnalyse) {
        alert("Veuillez choisir un fichier .txt d'abord !");
        return [];
    }
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput && delimInput.value ? delimInput.value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// Pour le bouton SEGMENTATION
function segmenter() {
    const mots = preparerMots();
    const affichage = document.getElementById('affichageDroit'); // La zone de droite
    
    if (mots.length > 0) {
        // On affiche les mots séparés par un espace, tout simplement
        affichage.innerHTML = "<h3>Texte segmenté :</h3>" + mots.join(" ");
    }
}

// Pour ton bouton KUJUJ (On reste sobre pour le prof)
function kujuj() {
    const mots = preparerMots();
    const affichage = document.getElementById('affichageDroit');

    alert("Mode /kujuj/ activé !");

    if (mots.length > 0) {
        // On met en majuscules et on sépare par un tiret
        const resultat = mots.map(m => m.toUpperCase()).join(" - ");
        affichage.innerHTML = "<h3>Résultat Kujuj :</h3>" + resultat;
    }
}

// Pour le bouton GREP (si c'est "action 2" ou "action 3")
function grep() {
    const pôle = document.getElementById('pôle').value; // On récupère le mot du champ "Pôle"
    const affichage = document.getElementById('affichageDroit');
    
    if (!pôle || !texteAnalyse) return;

    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.toLowerCase().includes(pôle.toLowerCase()));
    
    if (phrases.length > 0) {
        affichage.innerHTML = "<h3>Résultat GREP :</h3>" + phrases.join("<br><br>");
    } else {
        affichage.innerHTML = "Aucun résultat pour : " + pôle;
    }
}
