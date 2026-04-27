// 1. Fonction pour le mode KUJUJ (Consigne : ajouter "uj" à la fin de chaque mot)
function kujuj() {
    const mots = preparerMots();
    const affichage = document.getElementById('affichageDroit');
    
    alert("Mode /kujuj/ activé !");

    if (mots.length > 0) {
        // On met en majuscule et on ajoute "UJ" à la fin de chaque mot
        const resultat = mots.map(m => m.toUpperCase() + "UJ").join(" ");
        affichage.innerHTML = "<h3>Résultat Kujuj :</h3><p>" + resultat + "</p>";
    }
}

// 2. Fonction GREP (Chercher des phrases contenant le pôle)
function grep() {
    const poleValue = document.getElementById('pôle').value.toLowerCase();
    const affichage = document.getElementById('affichageDroit');
    
    if (!poleValue || !texteAnalyse) {
        alert("Entrez un pôle et chargez un fichier !");
        return;
    }

    // On découpe en phrases et on garde celles qui contiennent le pôle
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.toLowerCase().includes(poleValue));
    
    if (phrases.length > 0) {
        affichage.innerHTML = "<h3>Résultat GREP pour '" + poleValue + "' :</h3><ul>" + 
            phrases.map(p => "<li>" + p.trim() + "</li>").join("") + "</ul>";
    } else {
        affichage.innerHTML = "<p>Aucune occurrence trouvée pour ce pôle.</p>";
    }
}

// 3. Fonction CONCORDANCIER (Pôle au centre avec contexte)
function concordancier() {
    const poleValue = document.getElementById('pôle').value.toLowerCase();
    const affichage = document.getElementById('affichageDroit');
    const mots = preparerMots();

    if (!poleValue || mots.length === 0) return;

    let html = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse; font-family:monospace;'>";
    
    mots.forEach((m, i) => {
        if (m.toLowerCase() === poleValue) {
            const gauche = mots.slice(Math.max(0, i - 3), i).join(" ");
            const droite = mots.slice(i + 1, i + 4).join(" ");
            html += `<tr>
                <td style='text-align:right; width:45%;'>${gauche}</td>
                <td style='text-align:center; width:10%; color:red;'><b>${m}</b></td>
                <td style='text-align:left; width:45%;'>${droite}</td>
            </tr>`;
        }
    });

    html += "</table>";
    affichage.innerHTML = html;
}

// 4. Fonction MOTS LONGS
function motsPlusLongs() {
    const mots = [...new Set(preparerMots())]; // On enlève les doublons
    const affichage = document.getElementById('affichageDroit');

    // On trie par longueur décroissante et on prend les 10 premiers
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 10);

    let html = "<h3>Les 10 mots les plus longs</h3><ol>";
    tri.forEach(m => {
        html += `<li>${m} (${m.length} lettres)</li>`;
    });
    html += "</ol>";
    affichage.innerHTML = html;
}

// 5. Fonction GRAPHE (Simulé avec des barres HTML pour que ce soit "fait main")
function genererGraphe() {
    const mots = preparerMots();
    const affichage = document.getElementById('affichageDroit');
    
    let freq = {};
    mots.forEach(m => { freq[m.toLowerCase()] = (freq[m.toLowerCase()] || 0) + 1; });

    const topMots = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);

    let html = "<h3>Graphique des fréquences (Top 5)</h3>";
    topMots.forEach(([m, f]) => {
        const largeur = f * 30; // On ajuste la taille de la barre
        html += `<div style="margin:5px 0;">
            <span style="display:inline-block; width:80px;">${m}</span>
            <div style="display:inline-block; background:blue; height:15px; width:${largeur}px;"></div>
            <span> (${f})</span>
        </div>`;
    });
    affichage.innerHTML = html;
}
