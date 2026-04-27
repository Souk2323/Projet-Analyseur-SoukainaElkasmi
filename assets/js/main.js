// Variables globales pour stocker les données du fichier
let texteAnalyse = "";
let lignesTexte = [];

// --- 1. CHARGEMENT DU FICHIER ---
// Assure-toi que ton HTML a un input avec id="fileInput"
document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        texteAnalyse = event.target.result;
        // On stocke les lignes pour le GREP (Séance 9)
        lignesTexte = texteAnalyse.split(/\n/).filter(l => l.trim().length > 0);
        
        // On affiche un message dans un élément dédié pour confirmer
        // Assure-toi d'avoir un élément avec la classe 'cadre-message' dans ton HTML
        const cadreMessage = document.querySelector('.cadre-message'); 
        if (cadreMessage) {
            cadreMessage.innerHTML = "<h3>Fichier chargé</h3><p>Nombre de lignes : " + lignesTexte.length + "</p>";
        } else {
            alert("Fichier chargé : " + lignesTexte.length + " lignes.");
        }
        alert("Fichier prêt pour l'analyse !");
    };
    reader.readAsText(file);
});

// --- 2. FONCTION DE SÉCURITÉ ---
function estPret() {
    if (!texteAnalyse) {
        alert("Veuillez d'abord sélectionner un fichier .txt !");
        return false;
    }
    return true;
}

// --- 3. NETTOYAGE DES MOTS ---
function preparerMots() {
    // Assure-toi que ton HTML a un input avec id="delims"
    const delimiteurs = document.getElementById('delims').value || " ,;.'!?-";
    // Échappe les caractères spéciaux pour la regex
    const delimiteursEchappes = delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp("[" + delimiteursEchappes + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

// --- 4. LES ACTIONS DES BOUTONS ---

// Assure-toi d'avoir des boutons avec les IDs correspondants dans ton HTML

// SEGMENTATION
document.getElementById('segmentationBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const mots = preparerMots();
    // Assure-toi d'avoir un élément pour afficher le résultat, par exemple avec la classe 'cadre-resultat'
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = "<h3>Segmentation</h3><p>" + mots.join(" | ") + "</p>";
    } else {
        alert("Segmentation : " + mots.join(" | "));
    }
});

// DICTIONNAIRE
document.getElementById('dictionnaireBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { 
        let mot = m.toLowerCase(); 
        freq[mot] = (freq[mot] || 0) + 1; 
    });
    const tri = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);

    let html = "<h3>Dictionnaire (Top 10)</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    tri.forEach(([m, f]) => { 
        html += `<tr><td style="padding: 5px;">${m}</td><td style="padding: 5px;">${f}</td></tr>`; 
    });
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = html + "</table>";
    } else {
        // Affiche dans une alerte si le cadre n'est pas trouvé
        let tableHtml = "Dictionnaire (Top 10):\n";
        tri.forEach(([m, f]) => { tableHtml += `${m}: ${f}\n`; });
        alert(tableHtml);
    }
});

// GREP (Séance 9)
document.getElementById('grepBtn').addEventListener('click', function() {
    if (!estPret()) return;
    // Assure-toi que ton HTML a un input avec id="pole"
    const pôle = document.getElementById('pole').value.trim();
    if (!pôle) { 
        alert("Veuillez entrer un mot dans le champ PÔLE pour le GREP."); 
        return; 
    }
    
    const regex = new RegExp(pôle, "gi");
    const resultats = lignesTexte.filter(ligne => ligne.match(regex));
    
    let html = `<h3>GREP (${resultats.length} lignes trouvées)</h3><div style='text-align:left; font-size:10px; max-height: 300px; overflow-y: auto;'>`;
    resultats.forEach(l => {
        // Met en évidence le mot trouvé en rouge
        html += l.replace(regex, (match) => `<span style="color:red; font-weight:bold;">${match}</span>`) + "<br><hr style='margin: 5px 0;'>";
    });
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = html + "</div>";
    } else {
        alert("Résultats GREP : " + resultats.length + " lignes correspondent.");
    }
});

// CONCORDANCIER (Séance 10)
document.getElementById('concordancierBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const pôle = document.getElementById('pole').value.trim();
    if (!pôle) { 
        alert("Veuillez entrer un mot dans le champ PÔLE pour le Concordancier."); 
        return; 
    }

    const mots = preparerMots();
    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; font-size:10px; border-collapse:collapse;'>";
    let trouve = false;
    mots.forEach((m, i) => {
        if (m.toLowerCase() === pôle.toLowerCase()) {
            trouve = true;
            const motsAvant = mots.slice(Math.max(0, i-3), i).join(" ");
            const motsApres = mots.slice(i+1, i+4).join(" ");
            html += `<tr>
                        <td align='right' style='padding: 3px;'>${motsAvant}</td>
                        <td align='center' style='color:red; padding: 3px;'><b>${m}</b></td>
                        <td style='padding: 3px;'>${motsApres}</td>
                    </tr>`;
        }
    });
    
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        if (trouve) {
            cadreResultat.innerHTML = html + "</table>";
        } else {
            cadreResultat.innerHTML = "<h3>Concordancier</h3><p>Le mot '" + pôle + "' n'a pas été trouvé.</p>";
        }
    } else {
        if (trouve) alert("Concordancier trouvé pour '" + pôle + "'.");
        else alert("Le mot '" + pôle + "' n'a pas été trouvé.");
    }
});

// KUJUJ (Fonction perso)
document.getElementById('kujujBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const mots = preparerMots();
    const res = mots.map(m => m.toUpperCase() + "juj").join(" ");
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = "<h3>Résultat Kujuj</h3><p>" + res + "</p>";
    } else {
        alert("Résultat Kujuj : " + res);
    }
});

// NOMBRE DE PHRASES
document.getElementById('nbPhrasesBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const n = texteAnalyse.split(/[.!?]+/).filter(p => p.trim().length > 0).length;
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = `<h3>Analyse</h3><p>Il y a <b>${n}</b> phrase(s).</p>`;
    } else {
        alert("Nombre de phrases : " + n);
    }
});

// MOTS LES PLUS LONGS
document.getElementById('motsLongsBtn').addEventListener('click', function() {
    if (!estPret()) return;
    // Utilise un Set pour obtenir des mots uniques avant de trier
    const motsUniques = [...new Set(preparerMots())];
    const tri = motsUniques.sort((a, b) => b.length - a.length).slice(0, 10); // Prend les 10 plus longs
    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = "<h3>Mots les plus longs</h3><p>" + tri.join(", ") + "</p>";
    } else {
        alert("Mots les plus longs : " + tri.join(", "));
    }
});

// GRAPHE (Séance 11 - Chartist)
// Assure-toi d'inclure la librairie Chartist dans ton HTML
// <script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
// <link rel="stylesheet" href="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
document.getElementById('grapheBtn').addEventListener('click', function() {
    if (!estPret()) return;
    const mots = preparerMots();
    let freq = {};
    mots.forEach(m => { 
        let mot = m.toLowerCase(); 
        freq[mot] = (freq[mot] || 0) + 1; 
    });
    // Prend les 5 mots les plus fréquents pour le graphe
    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);

    const cadreResultat = document.querySelector('.cadre-resultat');
    if (cadreResultat) {
        cadreResultat.innerHTML = '<h3>Graphe des mots les plus fréquents</h3><div id="chart" class="ct-chart ct-golden-section" style="height:200px;"></div>';
        
        // Vérifie si Chartist est disponible avant de créer le graphique
        if (typeof Chartist !== 'undefined') {
            new Chartist.Pie('#chart', {
                labels: top.map(x => x[0]),
                series: top.map(x => x[1])
            });
        } else {
            cadreResultat.innerHTML += "<p style='color:red;'>Erreur : Librairie Chartist non chargée.</p>";
        }
    } else {
        alert("Pour voir le graphe, assurez-vous d'avoir un élément pour l'afficher (ex: <div class='cadre-resultat'>) et la librairie Chartist chargée.");
    }
});

// Bouton "Afficher l'aide"
document.getElementById('afficherAideBtn').addEventListener('click', function() {
    alert("Pour utiliser cet outil : \n1. Sélectionnez un fichier .txt. \n2. Entrez vos délimiteurs si nécessaire (par défaut : , ; . ' ! ? -). \n3. Entrez un mot dans 'PÔLE' pour les fonctions GREP et Concordancier. \n4. Cliquez sur les boutons pour lancer les analyses.");
});

// Bouton "Bonjour" (juste pour montrer que ça marche, peut être lié à un autre événement)
document.getElementById('bonjourBtn').addEventListener('click', function() {
    const cadreMessage = document.querySelector('.cadre-message');
    if (cadreMessage) {
        cadreMessage.innerHTML = "<h3>Message</h3><p>Bonjour ! Prêt pour l'analyse.</p>";
    } else {
        alert("Bonjour !");
    }
});
```

Ce que j'ai corrigé et ajouté :

1.  Gestion des IDs pour les éléments HTML : J'ai supposé que tes boutons et champs de saisie dans le HTML ont des IDs spécifiques (comme `fileInput`, `delims`, `pole`, `segmentationBtn`, `dictionnaireBtn`, etc.). J'ai ajouté des commentaires pour te rappeler de vérifier ça dans ton fichier HTML.
2.  Affichage des résultats : J'ai supposé que tu as un endroit dans ton HTML pour afficher les résultats (par exemple, une `div` avec la classe `cadre-resultat` ou `cadre-message`). Si cet élément existe, le résultat s'affichera dedans. Sinon, une `alert` s'affichera pour te montrer le résultat. C'est plus sympa d'avoir une zone dédiée pour les résultats sur la page elle-même.
3.  Encodage des délimiteurs : Dans `preparerMots()`, j'ai amélioré l'échappement des caractères spéciaux dans les délimiteurs pour que la Regex fonctionne correctement même avec des symboles comme `.` ou `?`.
4.  Mode GREP : Ajout d'une vérification pour s'assurer que le champ "PÔLE" n'est pas vide avant de lancer le GREP.
5.  Mode Concordancier : Ajout d'une vérification pour le champ "PÔLE" et un message si le mot recherché n'est pas trouvé. J'ai aussi ajouté des styles pour mieux présenter le tableau.
6.  Mode Mots Longs : J'ai utilisé `new Set()` pour m'assurer que je ne compte pas deux fois le même mot si le fichier est très répétitif, et j'ai limité à 10 mots.
7.  Mode Graphe : Ajout d'une vérification pour s'assurer que la librairie Chartist est bien chargée avant de tenter de créer le graphe.
8.  Boutons d'aide et "Bonjour" : J'ai ajouté des `addEventListener` pour les boutons "Afficher l'aide" et "Bonjour" en supposant qu'ils ont des IDs correspondants.

Pour que ce code fonctionne, tu devras créer le fichier HTML correspondant qui inclut :

*   Un `<input type="file" id="fileInput">` pour choisir le fichier.
*   Des `<input type="text">` avec les IDs `delims` et `pole`.
*   Des `<button>` avec les IDs : `segmentationBtn`, `dictionnaireBtn`, `grepBtn`, `concordancierBtn`, `kujujBtn`, `nbPhrasesBtn`, `motsLongsBtn`, `grapheBtn`, `afficherAideBtn`, `bonjourBtn`.
*   Une `div` (par exemple `<div class="cadre-resultat"></div>`) pour afficher les résultats des analyses.
*   Une autre `div` (par exemple `<div class="cadre-message"></div>`) pour les messages de chargement ou le bouton bonjour.
*   Si tu veux le graphe, il faut aussi inclure les liens vers la librairie [Chartist.js](https://gionkunz.github.io/chartist-js/) dans ton `<head>` HTML :
    ```html
    <script src="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.css">
    ```

