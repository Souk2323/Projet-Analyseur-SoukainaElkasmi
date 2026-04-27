let texteAnalyse = "";

// Chargement du fichier
const fileInput = document.getElementById('fileInput');
if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            texteAnalyse = event.target.result;
            const gauche = document.getElementById('affichageGauche');
            if(gauche) gauche.innerText = texteAnalyse;
            console.log("Fichier chargé !");
            alert("Fichier prêt !");
        };
        reader.readAsText(file);
    });
}

function preparerMots() {
    if (!texteAnalyse) {
        alert("Charge d'abord le fichier !");
        return [];
    }
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput && delimInput.value ? delimInput.value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// ACTION : KUJUJ
function kujuj() {
    console.log("Bouton Kujuj cliqué");
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length > 0 && zone) {
        const res = mots.map(m => m.toUpperCase() + "juj").join(" ");
        zone.innerHTML = "<h3>Kujuj</h3><p>" + res + "</p>";
    }
}

// ACTION : GRAPHE (Version Chartist du prof)
function genererGraphe() {
    console.log("Bouton Graphe cliqué");
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0 || !zone) return;

    let freq = {};
    mots.forEach(m => { let mot = m.toLowerCase(); freq[mot] = (freq[mot] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);

    zone.innerHTML = '<h3>Graphe</h3><div id="chart" class="ct-chart ct-golden-section"></div>';
    
    // On vérifie si Chartist est bien chargé
    if (typeof Chartist !== 'undefined') {
        new Chartist.Pie('#chart', {
            labels: top.map(x => x[0]),
            series: top.map(x => x[1])
        });
    } else {
        zone.innerHTML += "<p style='color:red;'>Erreur : Chartist n'est pas chargé dans le HTML.</p>";
    }
}
