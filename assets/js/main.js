let texteBase = "";

document.getElementById('fileInput').onchange = function(e) {
    let reader = new FileReader();
    reader.onload = function() {
        texteBase = reader.result;
        document.getElementById('affichageGauche').value = texteBase;
    };
    reader.readAsText(e.target.files[0]);
};

document.getElementById('btnBonjour').onclick = () => alert("Bonjour Soukaina !");

document.getElementById('btnSegmentation').onclick = () => {
    let delim = document.getElementById('delims').value;
    let regex = new RegExp(delim, "g");
    let mots = texteBase.split(regex).filter(m => m.length > 0);
    document.getElementById('affichageDroit').innerText = mots.join(" | ");
    document.getElementById('stats').innerText = "Nombre de formes : " + mots.length;
};
