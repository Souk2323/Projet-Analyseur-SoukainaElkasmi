// 1. FONCTION SEGMENTER (Affiche les mots un par un)
function segmenter() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    if (mots.length === 0) return;

    // On affiche les mots séparés par un simple espace
    zone.innerHTML = "<h3>Segmentation :</h3><p>" + mots.join(" ") + "</p>";
}

// 2. FONCTION KUJUJ (La règle : MAJUSCULE + UJ à la fin)
function kujuj() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');

    alert("Mode /kujuj/ activé !"); // Ton alerte qui s'affiche sur la photo

    if (mots.length > 0) {
        // Pour chaque mot, on met en grand et on ajoute UJ
        const resultat = mots.map(m => m.toUpperCase() + "UJ").join(" ");
        zone.innerHTML = "<h3>Résultat Kujuj :</h3><p>" + resultat + "</p>";
    }
}

// 3. FONCTION GREP (Cherche le mot tapé dans la case "Pôle")
function grep() {
    const motCherche = document.getElementById('pôle').value.toLowerCase();
    const zone = document.getElementById('affichageDroit');
    
    if (!motCherche || !texteAnalyse) {
        alert("Tape un mot dans la case Pôle !");
        return;
    }

    // On cherche les phrases qui contiennent le mot
    const phrases = texteAnalyse.split(/[.!?]+/).filter(p => p.toLowerCase().includes(motCherche));
    
    if (phrases.length > 0) {
        zone.innerHTML = "<h3>Résultat GREP :</h3><ul>" + 
            phrases.map(p => "<li>" + p.trim() + "</li>").join("") + "</ul>";
    } else {
        zone.innerHTML = "Pas de résultat pour : " + motCherche;
    }
}

// 4. FONCTION CONCORDANCIER (Le mot au centre)
function concordancier() {
    const motCherche = document.getElementById('pôle').value.toLowerCase();
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');

    if (!motCherche || mots.length === 0) return;

    let tableau = "<h3>Concordancier</h3><table border='1' style='width:100%; border-collapse:collapse;'>";
    mots.forEach((m, i) => {
        if (m.toLowerCase() === motCherche) {
            const avant = mots.slice(Math.max(0, i - 2), i).join(" ");
            const apres = mots.slice(i + 1, i + 3).join(" ");
            tableau += `<tr><td align='right'>${avant}</td><td align='center'><b>${m}</b></td><td>${apres}</td></tr>`;
        }
    });
    tableau += "</table>";
    zone.innerHTML = tableau;
}

// 5. FONCTION MOTS LONGS
function motsPlusLongs() {
    const mots = [...new Set(preparerMots())]; // Enlève les doublons
    const zone = document.getElementById('affichageDroit');
    
    // Trie par taille et prend les 10 premiers
    const tri = mots.sort((a, b) => b.length - a.length).slice(0, 10);
    
    zone.innerHTML = "<h3>Mots les plus longs :</h3><ul>" + 
        tri.map(m => `<li>${m} (${m.length} lettres)</li>`).join("") + "</ul>";
}

// 6. FONCTION GRAPHE (Simple avec des caractères)
function genererGraphe() {
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');
    let freq = {};
    mots.forEach(m => { freq[m.toLowerCase()] = (freq[m.toLowerCase()] || 0) + 1; });

    const top = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 5);
    
    let barres = "<h3>Fréquences (Top 5)</h3>";
    top.forEach(([m, f]) => {
        barres += `<p>${m} : ${"█".repeat(f)} (${f})</p>`;
    });
    zone.innerHTML = barres;
}
