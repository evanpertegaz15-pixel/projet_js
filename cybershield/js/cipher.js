/**
 * Permet de chiffrer une chaîne de caractères avec un décalage par chiffre.
 * @param {string} message = le message à chiffrer
 * @param {number} decalage = le décalage à appliquer pour chiffrer le message
 */
const cesar = (message, decalage) => {
    let resultat = ""
    const alphabet = /[a-zA-Z]/ // ASCII -> A-Z = 65-90 ; a-z = 97-122
    const tabMessage = message.split('') // transforme la chaîne en tableau
    let chaineValide = true
    if ((decalage >= 1) && (decalage <= 25)) {
        for (character of tabMessage) {
            if (!character.match(alphabet)) {
                chaineValide = false
                break
            }
        }
        if (chaineValide) {
            for (character of tabMessage) {
                resultat += String.fromCharCode(character.charCodeAt(0) + decalage) // utilisation du code ASCII
            }
        }
    }
    document.querySelector("#message_chiffre").textContent = resultat
}

/**
 * Renvoie un tableau des possibilités de déchiffrement par force brute d'une chaîne de caractères.
 * @param {string} chaine = la chaîne à déchiffrer
 */
const forceBrute = (chaine) => {
    let resultat = []
    const alphabetMaj = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
    const alphabetMin = "abcdefghijklmnopqrstuvwxyz".split('')
    const tabChaine = chaine.split('')
    const tabIndex = []
    for (let i = 0; i < tabChaine.length; i++) {
        for (let j = 0; j < alphabetMaj.length; j++) {
            if (tabChaine[i] == alphabetMaj[j] || tabChaine[i] == alphabetMin[j]) {
                tabIndex.push(j)
                break
            }
        }
    }
    for (let k = 1; k < 26; k++) {
        resultat[k-1] = ""
        for (let l = 0; l < tabIndex.length; l++) {
            const index = (tabIndex[l] - (k % 26) + 26) % 26
            if (alphabetMaj.includes(tabChaine[l])) {
                resultat[k-1] += alphabetMaj[index]
            } else if (alphabetMin.includes(tabChaine[l])) {
                resultat[k-1] += alphabetMin[index]
            }
        }
    }
    return resultat
}

/**
 * Remplit le tableau avec les possibilités de déchiffrement.
 * @param {Array} tableau = le tableau à remplir
 */
const remplirTableau = (tableau) => {
    tableauForceBrute.innerHTML = ""
    tableau.forEach((ligne, i) => {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.textContent = i + 1;
        const td2 = document.createElement("td");
        td2.textContent = ligne;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tableauForceBrute.appendChild(tr);
    });
}

const message = document.querySelector("#message_a_chiffrer")
const decalage = document.querySelector("#decalage")
const bouton = document.querySelector("#bouton_chiffrer")
const tableauForceBrute = document.querySelector("#tableau_force_brute")

bouton.addEventListener("click", () => {
    cesar(message.value, Number(decalage.value));
    const tableau = forceBrute(document.querySelector("#message_chiffre").textContent);
    remplirTableau(tableau);
});