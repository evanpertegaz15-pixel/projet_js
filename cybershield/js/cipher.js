/**
 * Permet de chiffrer une chaîne de caractères avec un décalage par chiffre.
 * @param {string} message = le message à chiffrer
 * @param {number} decalage = le décalage à appliquer pour chiffrer le message
 */
const cesar = (message, decalage) => {
    let resultat = ""
    const alphabetMaj = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const alphabetMin = "abcdefghijklmnopqrstuvwxyz"
    for (let lettre of message) {
        if (alphabetMaj.includes(lettre)) {
            const index = (alphabetMaj.indexOf(lettre) + decalage) % 26
            resultat += alphabetMaj[index]
        } else if (alphabetMin.includes(lettre)) {
            const index = (alphabetMin.indexOf(lettre) + decalage) % 26
            resultat += alphabetMin[index]
        } else {
            resultat += lettre
        }
    }
    const sortie = document.querySelector("#cipher-output")
    if (sortie) sortie.textContent = resultat
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
    const tableauForceBrute = document.querySelector("#cipher-results")
    if (!tableauForceBrute) return
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

if (typeof document !== 'undefined') {
    const message = document.querySelector("#cipher-input")
    const decalage = document.querySelector("#shift-input")
    const boutonChiffrer = document.querySelector("#encrypt-btn")
    const boutonForceBrute = document.querySelector("#decrypt-btn")
    boutonChiffrer.addEventListener("click", () => {
        cesar(message.value, Number(decalage.value))
    })
    boutonForceBrute.addEventListener("click", () => {
        const messageChiffre = document.querySelector("#cipher-output").textContent
        const resultats = forceBrute(messageChiffre)
        remplirTableau(resultats)
    })
}

if (typeof module !== 'undefined') {
    module.exports = { cesar, forceBrute, remplirTableau };
}