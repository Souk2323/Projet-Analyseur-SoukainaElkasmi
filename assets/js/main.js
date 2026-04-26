var texteSource = "";

// Charger le fichier
document.getElementById('fileInput').onchange = function(e) {
    var lecteur = new FileReader();
    lecteur.onload = function() {
        texteSource = lecteur.result;
        document.getElementById('affichageGauche').value = texteSource;
    };
    lecteur.readAsText(e.target.files[0]);
};

// Dire bonjour
document.getElementById('btnBonjour').onclick = function() {
    alert("Bonjour Soukaina !");
};

// Faire la segmentation
document.getElementById('btnSegmentation').onclick = function() {
    var d = document.getElementById('delims').value;
    var expression = new RegExp(d, "g");
    
    var mots = texteSource.split(expression).filter(function(m) {
        return m.length > 0;
    });
    
    document.getElementById('affichageDroit').innerText = mots.join(" | ");
    document.getElementById('stats').innerText = "Nombre de formes : " + mots.length;
};

// Faire le dictionnaire
document.getElementById('btnDico').onclick = function() {
    var d = document.getElementById('delims').value;
    var expression = new RegExp(d, "g");
    var mots = texteSource.toLowerCase().split(expression).filter(function(m) {
        return m.length > 0;
    });
    
    var dico = {};
    for (var i = 0; i < mots.length; i++) {
        var mot = mots[i];
        dico[mot] = (dico[mot] || 0) + 1;
    }
    
    var texteDico = "DICTIONNAIRE :\n\n";
    for (var cle in dico) {
        texteDico += cle + " : " + dico[cle] + "\n";
    }
    document.getElementById('affichageDroit').innerText = texteDico;
};
