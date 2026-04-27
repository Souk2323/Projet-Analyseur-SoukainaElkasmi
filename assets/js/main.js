// Récupère les éléments dont on aura besoin
const fileInput = document.getElementById('fileInput');
const delimsInput = document.getElementById('delims');
const poleInput = document.getElementById('pole');
const longueurInput = document.getElementById('longueur');
// Assure-toi que ce sélecteur correspond exactement au champ stopwords dans ton HTML
const stopwordsInput = document.querySelector('input[value="de,le,la,les,à,et,des,un,ur"]'); 

let fileContent = ''; // Pour stocker le contenu du fichier lu

// Fonction pour lire le contenu du fichier sélectionné
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fileContent = e.target.result;
            console.log("Fichier lu avec succès.");
        };
        reader.readAsText(file);
    }
});

// --- Fonctions des boutons ---

function segmenter() {
    if (!fileContent) {
        alert("Veuillez d'abord sélectionner un fichier.");
        return;
    }
    const delims = delimsInput.value.split(''); 
    const pole = poleInput.value;
    const longueur = parseInt(longueurInput.value, 10);
    
    console.log("--- Segmentation ---");
    console.log("Contenu du fichier :", fileContent.substring(0, 100) + "..."); 
    console.log("Délimiteurs :", delims);
    console.log("Pôle :", pole);
    console.log("Longueur :", longueur);
    
    alert("Fonction Segmentation appelée. Vérifiez la console pour les détails.");
}

function dictionnaire() {
    if (!fileContent) {
        alert("Veuillez d'abord sélectionner un fichier.");
        return;
    }
    console.log("--- Dictionnaire ---");
    console.log("Contenu du fichier :", fileContent.substring(0, 100) + "...");
    alert("Fonction Dictionnaire appelée. Vérifiez la console pour les détails.");
}

function grep() {
    if (!fileContent) {
        alert("Veuillez d'abord sélectionner un fichier.");
        return;
    }
    const pole = poleInput.value; 
    console.log("--- GREP ---");
    console.log("Contenu du fichier :", fileContent.substring(0, 100) + "...");
    console.log("Terme de recherche (Pôle) :", pole);
    alert("Fonction GREP appelée. Vérifiez la console pour les détails.");
}

function concordancier() {
    if (!fileContent) {
        alert("Veuillez d'abord sélectionner un fichier.");
        return;
    }
    console.log("--- Concordancier ---");
    console.log("Contenu du fichier :", fileContent.substring(0, 100) + "...");
    alert("Fonction Concordancier appelée. Vérifiez la console pour les détails.");
}

function kujuj() {
    console.log("--- /kujuj/ ---");
    if (fileContent && fileContent.includes('/kujuj/')) {
        console.log("Le motif '/kujuj/' a été trouvé dans le fichier.");
        alert("Le motif '/kujuj/' a été trouvé !");
    } else {
        console.log("Le motif '/kujuj/' n'a pas été trouvé.");
        alert("Le motif '/kujuj/' n'a pas été trouvé.");
    }
}

function nombrePhrases() {
    if (!fileContent) {
        alert("Veuillez d'abord sélectionner un fichier.");
        return;
    }
    const phrases = fileContent.split(/[.!?]+/);
    const nbPhrases = phrases.filter(phrase => phrase.trim() !== '').length;
    
    console.log("--- Nombre de Phrases ---");
    console.log("Nombre total de phrases :", nbPhrases);
    alert(`Nombre de phrases détectées : ${nbPhrases}`);
}

function motsPlusLongs() {
    if (!fileContent) {
        alert("Veuillez d'abord sélectionner un fichier.");
        return;
    }
    const longueur = parseInt(longueurInput.value, 10);
    const delims = delimsInput.value.split('');
    const stopwords = stopwordsInput.value.split(','); 

    let cleanedText = fileContent.toLowerCase();
    delims.forEach(delim => {
        cleanedText = cleanedText.replace(new RegExp(delim.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), ' ');
    });
    
    let words = cleanedText.split(/\s+/).filter(word => word.length > 0);

    const longWords = words.filter(word => !stopwords.includes(word) && word.length > longueur);
    
    console.log("--- Mots plus longs que " + longueur + " ---");
    console.log("Mots trouvés :", longWords);
    alert("Mots les plus longs (" + longueur + " caractères) trouvés : " + longWords.join(', '));
}

function genererGraphe() {
    if (!fileContent) {
        alert("Veuillez d'abord sélectionner un fichier.");
        return;
    }
    console.log("--- Génération de Graphe ---");
    console.log("Contenu du fichier :", fileContent.substring(0, 100) + "...");
    
    const delims = delimsInput.value.split('');
    const stopwords = stopwordsInput.value.split(',');

    let cleanedText = fileContent.toLowerCase();
    delims.forEach(delim => {
        cleanedText = cleanedText.replace(new RegExp(delim.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), ' ');
    });
    let words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    
    let wordCounts = {};
    words.forEach(word => {
        if (!stopwords.includes(word)) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
    });

    const sortedWords = Object.entries(wordCounts).sort(([, a], [, b]) => b - a);
    const dataForChart = sortedWords.slice(0, 10); 

    const labels = dataForChart.map(item => item[0]);
    const series = [dataForChart.map(item => item[1])];

    console.log("Données pour le graphe :", { labels, series });

    const chartContainer = document.getElementById('chart'); 
    if (chartContainer) {
        chartContainer.innerHTML = ''; // Vide le conteneur

        // Assure-toi que Chartist.js est bien chargé avant d'appeler ceci.
        // Tu l'as déjà dans ton <head> avec la balise <script>.
        new Chartist.Bar('.ct-chart', { 
          labels: labels,
          series: series
        }, {
          distributeSeries: true
        });
        alert("Graphe généré. Vérifiez la console.");
    } else {
        alert("Conteneur de graphe non trouvé dans le HTML. Impossible de générer le graphe.");
        console.error("Conteneur de graphe (div#chart) non trouvé dans le HTML.");
    }
}
```

