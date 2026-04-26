let texteBrut = "";

// Lire le fichier texte
document.getElementById('fileInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        texteBrut = event.target.result;
        document.getElementById('affichageGauche').value = texteBrut;
    };
    reader.readAsText(e.target.files[0]);
});

// Bonjour
document.getElementById('btnBonjour').onclick = () => alert("Bonjour Soukaina !");

// Segmentation
document.getElementById('btnSegmentation').onclick = () => {
    const d = document.getElementById('delims').value;
    const re = new RegExp(d, "g");
    const tokens = texteBrut.split(re).filter(t => t.length > 0);
    document.getElementById('affichageDroit').innerText = tokens.join(" | ");
    document.getElementById('stats').innerText = "Nombre de formes : " + tokens.length;
};

// Dictionnaire (Fréquences)
document.getElementById('btnDictionnaire').onclick = () => {
    const d = document.getElementById('delims').value;
    const re = new RegExp(d, "g");
    const tokens = texteBrut.toLowerCase().split(re).filter(t => t.length > 0);
    let dico = {};
    tokens.forEach(t => dico[t] = (dico[t] || 0) + 1);
    let res = "DICTIONNAIRE :\n";
    for(let k in dico) res += k + " (" + dico[k] + ")\n";
    document.getElementById('affichageDroit').innerText = res;
};
