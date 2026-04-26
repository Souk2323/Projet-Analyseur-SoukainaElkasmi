let texte = "";

// Charger fichier
document.getElementById('fileInput').onchange = function(e) {
    let reader = new FileReader();
    reader.onload = function() {
        texte = reader.result;
        document.getElementById('affichageGauche').value = texte;
    };
    reader.readAsText(e.target.files[0]);
};

// Bonjour
document.getElementById('btnBonjour').onclick = () => alert("Bonjour Soukaina !");

// Segmentation (Consigne Page 13)
document.getElementById('btnSegmentation').onclick = () => {
    let d = document.getElementById('delims').value;
    let re = new RegExp(d, "g");
    let mots = texte.split(re).filter(m => m.length > 0);
    document.getElementById('affichageDroit').innerText = mots.join(" | ");
    document.getElementById('stats').innerText = "Nombre de formes : " + mots.length;
};
