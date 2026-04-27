let texte = "";

/* Charger fichier */
document.getElementById("fileInput").addEventListener("change", function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        texte = e.target.result;
        document.getElementById("resultat").innerText = "Fichier chargé ✔";
    };

    reader.readAsText(file);
});

/* Segmentation */
function segmentation() {
    let delim = document.getElementById("delim").value;
    let regex = new RegExp("[" + delim + "\\s]+");
    let mots = texte.split(regex);

    document.getElementById("resultat").innerText = mots.join(" | ");
}

/* Dictionnaire */
function dictionnaire() {
    let mots = texte.toLowerCase().split(/\W+/);
    let unique = [...new Set(mots)];

    document.getElementById("resultat").innerText =
        "Nombre de mots différents : " + unique.length + "\n\n" +
        unique.join(", ");
}

/* Nb phrases */
function nbPhrases() {
    let phrases = texte.split(/[.!?]+/).filter(p => p.trim() !== "");

    document.getElementById("resultat").innerText =
        "Nombre de phrases : " + phrases.length;
}

/* Mots longs */
function motsLongs() {
    let longueur = document.getElementById("longueur").value;
    let mots = texte.split(/\W+/);
    let longs = mots.filter(m => m.length >= longueur);

    document.getElementById("resultat").innerText =
        longs.join(", ");
}

/* Boutons */
document.getElementById("bonjour").onclick = () => alert("Bonjour !");
document.getElementById("help").onclick = () =>
    alert("Charge un fichier .txt puis clique sur un bouton.");
