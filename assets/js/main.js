function process(action) {
    const fileInput = document.getElementById('fileInput');
    const resultArea = document.getElementById('result-area');
    
    if (!fileInput.files[0]) {
        alert("Veuillez d'abord choisir un fichier .txt");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        let result = "";

        switch(action) {
            case 'Nb phrases':
                const count = text.split(/[.!?]/).length - 1;
                result = `Nombre de phrases détectées : ${count}`;
                break;
            case 'Segmentation':
                result = `Texte segmenté : ${text.split(' ').join(' | ')}`;
                break;
            case 'Mots longs':
                const minLength = document.getElementById('length').value;
                const longWords = text.split(/\s+/).filter(word => word.length > minLength);
                result = `Mots de plus de ${minLength} caractères : ${[...new Set(longWords)].join(', ')}`;
                break;
            default:
                result = `Action "${action}" exécutée sur le texte de ${text.length} caractères.`;
        }

        resultArea.innerHTML = `<strong>Résultat (${action}) :</strong> <p>${result}</p>`;
    };

    reader.readAsText(fileInput.files[0]);
}
