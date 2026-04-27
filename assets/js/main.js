function concordancier() {
    // 1. On récupère le mot tapé dans la case "Pôle"
    const poleElement = document.getElementById('pôle') || document.getElementById('pole');
    const pole = poleElement ? poleElement.value.trim() : "";
    const mots = preparerMots();
    const zone = document.getElementById('affichageDroit');

    // Sécurité : on vérifie que le pôle et le texte existent
    if (!pole || mots.length === 0) {
        alert("Entrez un mot dans la case Pôle !");
        return;
    }

    // 2. On crée la structure du tableau comme sur la photo
    let html = "<h3>Concordancier</h3>";
    html += "<table border='1' style='width:100%; border-collapse:collapse; font-family:sans-serif;'>";
    html += "<tr style='background:#f2f2f2;'><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr>";

    // 3. On parcourt les mots pour trouver le pôle
    mots.forEach((m, i) => {
        // Recherche insensible à la casse
        if (m.toLowerCase() === pole.toLowerCase()) {
            [span_3](start_span)// On récupère 2-3 mots avant et après pour le contexte[span_3](end_span)
            const contexteGauche = mots.slice(Math.max(0, i - 3), i).join(" ");
            const contexteDroit = mots.slice(i + 1, i + 4).join(" ");

            [span_4](start_span)// On ajoute la ligne au tableau[span_4](end_span)
            html += `<tr>
                <td style='text-align:right; padding:5px; width:40%;'>${contexteGauche}</td>
                <td style='text-align:center; color:red; font-weight:bold; padding:5px; width:20%;'>${m}</td>
                <td style='text-align:left; padding:5px; width:40%;'>${contexteDroit}</td>
            </tr>`;
        }
    });

    html += "</table>";

    // 4. On affiche tout dans la zone de droite
    if (zone) {
        zone.innerHTML = html;
    } else {
        alert("Erreur : Zone d'affichage introuvable.");
    }
}
