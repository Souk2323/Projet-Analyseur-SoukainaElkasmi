body {
    background-color: #d4cc00; /* Fond jaune */
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin: 0;
}

#bloc-cv {
    background-color: #e2e1b9;
    width: 90%;
    max-width: 800px;
    border: 2px solid black;
    display: flex;
    padding: 20px;
    margin-bottom: 20px;
}

.photo-cv img {
    width: 120px;
    border: 1px solid black;
}

.grand-titre {
    color: white;
    font-size: 3em;
    text-shadow: 2px 2px #a388e5, 4px 4px #5a3d8c;
}

#bloc-analyseur {
    background-color: #c499a6; /* Rose */
    width: 90%;
    max-width: 800px;
    border: 2px solid black;
    padding: 20px;
    text-align: center;
    box-shadow: 10px 10px 0px #5a3d8c;
}

.badge { background-color: #8b5fb0; color: white; padding: 2px 5px; font-size: 0.8em; }

.cadre-bonjour {
    border: 3px solid #1a5e4d;
    color: #1a5e4d;
    padding: 5px 15px;
    display: inline-block;
    border-radius: 10px;
    margin: 15px 0;
    font-weight: bold;
}

.boutons-actions button {
    background-color: #c9d6a3;
    border: 1px solid black;
    margin: 4px;
    padding: 8px;
    font-weight: bold;
    cursor: pointer;
}

/* Style du pied de page et du lien Sorbonne */
footer {
    margin-top: 40px;
    padding: 20px;
    text-align: center;
}

footer a {
    color: #5a3d8c;
    text-decoration: none;
    font-weight: bold;
    border-bottom: 2px solid #5a3d8c;
}

footer a:hover {
    color: white;
    background-color: #5a3d8c;
}

table { width: 100%; border-collapse: collapse; background: white; margin-top: 15px; }
th, td { border: 1px solid black; padding: 8px; text-align: center; }
