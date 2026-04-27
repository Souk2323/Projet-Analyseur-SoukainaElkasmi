// On s'assure que le code utilise les bons IDs de ton image
function preparerMots() {
    if (!texteAnalyse) {
        alert("Choisis d'abord un fichier .txt !");
        return [];
    }
    // On utilise les délimiteurs par défaut si l'élément 'delims' n'existe pas
    const delimInput = document.getElementById('delims');
    const delimiteurs = delimInput && delimInput.value ? delimInput.value : " ,;.'!?-";
    const regex = new RegExp("[" + delimiteurs.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s]+", "g");
    return texteAnalyse.split(regex).filter(m => m.length > 0);
}

function segmenter() { 
    const mots = preparerMots();
    const zoneAffichage = document.getElementById('affichageDroit');
    
    if (mots.length > 0) {
        // On crée une version "propre" pour l'affichage
        let contenu = "<h3>Segmentation :</h3><p>";
        contenu += mots.join(" | "); // Sépare les mots par une barre verticale
        contenu += "</p>";
        zoneAffichage.innerHTML = contenu;
    }
}

function kujuj() {
    // 1. On prépare les mots
    const mots = preparerMots();
    const zoneAffichage = document.getElementById('affichageDroit');

    // 2. L'alerte que l'on voit sur ta photo
    alert("Mode /kujuj/ activé !"); 

    // 3. On remplace le tableau de fréquence par le texte Kujuj
    if (mots.length > 0) {
        // .map transform chaque mot en majuscule, .join les colle avec un éclair
        const texteFinal = mots.map(m => m.toUpperCase()).join(" - ");
        
        zoneAffichage.innerHTML = `
            <div style="background: #222; color: #00FF00; padding: 15px; border: 2px solid #00FF00; font-family: monospace;">
                <h2 style="margin-top:0;">SYSTÈME KUJUJ</h2>
                <p style="word-break: break-all;">${texteFinal}</p>
            </div>
        `;
    }
}

// Fonction pour le bouton GREP (si tu en as besoin)
function grep() {
    const motRecherche = prompt("Quel mot cherchez-vous ?");
    if (!motRecherche || !texteAnalyse) return;
    
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.toLowerCase().includes(motRecherche.toLowerCase()));
    const zoneAffichage = document.getElementById('affichageDroit');
    
    if (phrases.length > 0) {
        zoneAffichage.innerHTML = `<h3>Résultats pour "${motRecherche}" :</h3><ul>` + 
            phrases.map(p => `<li>${p.trim()}</li>`).join("") + `</ul>`;
    } else {
        zoneAffichage.innerHTML = "<p>Aucun résultat trouvé.</p>";
    }
}
