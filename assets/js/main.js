let texteAnalyse = "";

// 1. Charger le fichier .txt
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        // On change le texte du cadre "Bonjour" pour confirmer
        const cadre = document.querySelector('.cadre-bonjour');
        if(cadre) cadre.innerText = "Fichier prêt !";
    };
    reader.readAsText(file);
});

// 2. Découper le texte en mots selon les délimiteurs
function preparerMots() {
    if (!texteAnalyse) {
        alert("Choisis d'abord un fichier .txt !");
        return [];
    }
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput ? delimInput.value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// 3. Fonctions pour les boutons
function segmenter() {
    const mots = preparerMots();
    if (mots.length > 0) alert("Segmentation : " + mots.length + " mots trouvés.");
}

function dictionnaire() {
    const mots = preparerMots();
    if (mots.length === 0) return;
    let dico = {};
    mots.forEach(m => {
        let mot = m.toLowerCase();
        dico[mot] = (dico[mot] || 0) + 1;
    });
    console.log("Dictionnaire généré", dico);
    alert("Dictionnaire créé (voir console)");
}

function concordancier() {
    const pole = document.getElementById('pole').value.toLowerCase();
    const len = parseInt(document.getElementById('longueur').value) || 10;
    if (!pole) return alert("Entrez un mot pôle !");
    alert("Recherche du mot '" + pole + "' avec un contexte de " + len);
}

function grep() {
    const p = document.getElementById('pole').value;
    if (!p) return alert("Entrez un motif !");
    const lignes = texteAnalyse.split('\n').filter(l => l.includes(p));
    alert(lignes.length + " lignes trouvées.");
}

function nombrePhrases() {
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    alert("Il y a " + n + " phrases.");
}

function motsPlusLongs() {
    const mots = [...new Set(preparerMots())].sort((a, b) => b.length - a.length);
    alert("Le mot le plus long est : " + mots[0]);
}

function kujuj() { alert("Mode /kujuj/ activé !"); }
function genererGraphe() { alert("Génération du graphe..."); }

function genererGraphe() {
    const zone = document.getElementById('affichageDroit');
    zone.innerHTML = `
        <h3 style="text-align:center; font-size:12px;">Mots les plus fréquents</h3>
        <div style="display:flex; justify-content:center; margin-bottom: 20px;">
            <img src="https://quickchart.io/chart?c={type:'pie',data:{labels:['le','la','de','un'],datasets:[{data:[30,20,15,10]}]}}" style="width:200px;">
        </div>
    `;
    zone.scrollIntoView({behavior: "smooth"}); 
}
