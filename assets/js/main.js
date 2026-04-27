:javascript
function afficherResultats() {
    const resultatDiv = document.getElementById('resultats');
    if (resultatDiv) {
        resultatDiv.innerHTML = "<p>Voici tes résultats !</p>";
    } else {
        console.error("La div pour les résultats n'existe pas !");
    }
}

const bouton = document.getElementById('monBouton');
if (bouton) {
    bouton.addEventListener('click', afficherResultats);
} else {
    console.error("Le bouton 'monBouton' n'a pas été trouvé !");
}
```

