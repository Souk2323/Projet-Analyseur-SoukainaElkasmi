let texteGlobal = "";

// Charger le fichier
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        texteGlobal = event.target.result;
        document.getElementById('resultats').innerHTML = "<p>Fichier chargé avec succès !</p>";
    };
    reader.readAsText(file);
});

// Fonction pour compter les phrases
function nombrePhrases() {
    if (!texteGlobal) return alert("Chargez un fichier d'abord");
    const phrases = texteGlobal.split(/[.!?]+/).filter(p => p.trim().length > 0);
    document.getElementById('resultats').innerHTML = `<h3>Il y a ${phrases.length} phrases dans ce texte.</h3>`;
}

// Fonction de segmentation simple
function segmenter() {
    if (!texteGlobal) return alert("Chargez un fichier d'abord");
    const mots = texteGlobal.split(/\s+/);
    document.getElementById('resultats').innerHTML = `<h3>Nombre de mots (tokens) : ${mots.length}</h3>`;
}

// Les autres fonctions (Dico, Concordancier) peuvent être ajoutées ici
