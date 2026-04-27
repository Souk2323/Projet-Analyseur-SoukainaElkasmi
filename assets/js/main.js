const fs = require('fs');

// Fonction pour lire le fichier et retourner le contenu sous forme de tableau de mots
function dictionnaire(nomFichier) {
  try {
    // Lecture synchronisée du fichier en UTF-8
    const data = fs.readFileSync(nomFichier, 'utf8');
    // Séparation du contenu en mots, en supprimant les espaces et retours à la ligne
    const mots = data.split(/\s+/).filter(mot => mot.length > 0);
    return mots;
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier :", err);
    return [];
  }
}

// Exemple d'utilisation
const nomFichier = 'dico.txt'; // Nom du fichier à adapter
const listeMots = dictionnaire(nomFichier);
console.log(listeMots);

// Gestion des inputs (exemple simple)
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Entrez un mot : ', mot => {
  if (listeMots.includes(mot)) {
    console.log('Le mot est dans le dictionnaire.');
  } else {
    console.log('Le mot n\'est pas dans le dictionnaire.');
  }
  readline.close();
});
```

