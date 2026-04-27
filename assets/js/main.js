```javascript
// Assure-toi que cette fonction est dans ton fichier JavaScript global,
// et que les IDs des boutons et des zones d'affichage correspondent.

// GRAPHE (Séance 11 - Chartist) - Version améliorée
document.getElementById('grapheBtn').addEventListener('click', function() {
    if (!estPret()) return; // Vérifie si un fichier est chargé

    const mots = preparerMots(); // Récupère les mots nettoyés
    let freq = {}; // Objet pour stocker la fréquence de chaque mot

    // Compte la fréquence de chaque mot
    mots.forEach(m => { 
        let mot = m.toLowerCase(); // Met tout en minuscules pour un comptage exact
        freq[mot] = (freq[mot] || 0) + 1; 
    });

    // Trie les mots par fréquence et sélectionne les 5 plus fréquents
    const top5Mots = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Sélectionne l'élément où afficher le graphe
    const cadreResultat = document.querySelector('.cadre-resultat'); 

    if (cadreResultat) {
        // Crée le HTML pour le graphe, avec un conteneur spécifique pour Chartist
        cadreResultat.innerHTML = '<h3>Top 5 des mots les plus fréquents</h3><div id="chart-container" class="ct-chart ct-golden-section" style="height:250px; margin: 0 auto;"></div>';
        
        // Vérifie si la librairie Chartist est bien chargée
        if (typeof Chartist !== 'undefined') {
            // Crée le graphique circulaire (Pie Chart)
            new Chartist.Pie('#chart-container', {
                labels: top5Mots.map(item => item[0]), // Les mots eux-mêmes comme labels
                series: top5Mots.map(item => item[1])  // Leur fréquence comme données
            }, {
                // Options pour personnaliser le style du graphique
                donut: true, // Fait un graphique en forme de donut (anneau)
                donutSolid: true, // Rend le donut plein
                startAngle: 270, // Commence le premier segment à 270 degrés (en haut)
                labelInterpolationFnc: function(value) {
                    // Affiche le mot et sa fréquence
                    return value + ' (' + top5Mots.find(item => item[0] === value)[1] + ')';
                }
            });
        } else {
            // Message d'erreur si Chartist n'est pas chargé
            cadreResultat.innerHTML += "<p style='color:red; margin-top:10px;'>Erreur : La librairie Chartist.js n'a pas été trouvée. Impossible d'afficher le graphe.</p>";
        }
    } else {
        // Message dans une alerte si le conteneur pour le graphe n'existe pas
        alert("Pour afficher le graphe, veuillez vous assurer qu'un élément avec la classe 'cadre-resultat' est présent dans votre HTML.");
    }
});
```

