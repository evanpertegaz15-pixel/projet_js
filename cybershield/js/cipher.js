/**
 * Permet de chiffrer une chaîne de caractères avec un décalage par chiffre.
 * @param {string} message = le message à chiffrer
 * @param {number} decalage = le décalage à appliquer pour chiffrer le message
 */
const cesar = (message, decalage) => {
    let resultat = ""
    for (let lettre of message) {
        resultat += cesarLettre(lettre, decalage)
    }
    const sortie = document.querySelector("#cipher-output")
    if (sortie) sortie.textContent = resultat
}

/**
 * Chiffre une lettre avec un décalage donné.
 * @param {string} lettre = la lettre à chiffrer
 * @param {number} decalage = le décalage à appliquer
 * @returns {string} = la lettre chiffrée
 */
const cesarLettre = (lettre, decalage) => {
    const alphabetMaj = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const alphabetMin = "abcdefghijklmnopqrstuvwxyz"
    if (alphabetMaj.includes(lettre)) {
        const index = (alphabetMaj.indexOf(lettre) + decalage) % 26
        return alphabetMaj[index]
    } else if (alphabetMin.includes(lettre)) {
        const index = (alphabetMin.indexOf(lettre) + decalage) % 26
        return alphabetMin[index]
    } else {
        return lettre
    }
}

/**
 * Renvoie un tableau des possibilités de déchiffrement par force brute d'une chaîne de caractères.
 * @param {string} chaine = la chaîne à déchiffrer
 * @return {Array} = un tableau des possibilités de déchiffrement
 */
const forceBrute = (chaine) => {
    let resultat = []
    const alphabetMaj = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
    const alphabetMin = "abcdefghijklmnopqrstuvwxyz".split('')
    const tabChaine = chaine.split('')
    const tabIndex = []
    for (let i = 0; i < tabChaine.length; i++) {
        let trouve = false
        for (let j = 0; j < alphabetMaj.length; j++) {
            if (tabChaine[i] == alphabetMaj[j] || tabChaine[i] == alphabetMin[j]) {
                tabIndex.push(j)
                trouve = true
                break
            }
        }
        if (!trouve) {
            tabIndex.push(null)
        }
    }
    for (let k = 1; k < 26; k++) {
        resultat[k-1] = ""
        for (let l = 0; l < tabIndex.length; l++) {
            if (tabIndex[l] === null) {
                resultat[k-1] += tabChaine[l]
                continue
            }
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

/**
 * Applique le chiffrement de Vigenère à une chaîne de caractères avec une clé donnée.
 * @param {string} message = le message à chiffrer
 * @param {string} cle = la clé de chiffrement
 * @returns {string} = le message chiffré
 */
const vigenere = (message, cle) => {
    let resultat = ""
    let indexCle = 0
    for (let lettre of message) {
        if (!/[a-zA-Z]/.test(lettre)) {
            resultat += lettre
            continue
        }
        const lettreCle = cle[indexCle % cle.length]
        const decalage = lettreCle.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0)
        resultat += cesarLettre(lettre, decalage)
        indexCle++
    }
    const sortie = document.querySelector("#cipher-output-vigenere")
    if (sortie) sortie.textContent = resultat
}

if (typeof document !== 'undefined') {
    const message = document.querySelector("#cipher-input")
    const decalage = document.querySelector("#shift-input")
    const boutonChiffrer = document.querySelector("#encrypt-btn")
    const boutonForceBrute = document.querySelector("#decrypt-btn")
    const messageVigenere = document.querySelector("#cipher-input-vigenere")
    const cleVigenere = document.querySelector("#vigenere-key")
    const boutonVigenere = document.querySelector("#vigenere-encrypt-btn")
    boutonChiffrer.addEventListener("click", () => {
        cesar(message.value, Number(decalage.value))
    })
    boutonForceBrute.addEventListener("click", () => {
        const messageChiffre = document.querySelector("#cipher-output").textContent
        const resultats = forceBrute(messageChiffre)
        remplirTableau(resultats)
    })
    boutonVigenere.addEventListener("click", () => {
        vigenere(messageVigenere.value, cleVigenere.value)
    })
}

if (typeof module !== 'undefined') {
    module.exports = { cesar, forceBrute, remplirTableau };
}