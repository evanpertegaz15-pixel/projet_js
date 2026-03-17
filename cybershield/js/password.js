// Liste noire des mots de passe courants (22 entrées fournies)
const BLACKLIST = [
    "admin", "123456", "password", "12345678", "666666", "111111", 
    "1234567", "qwerty", "siteadmin", "administrator", "root", 
    "123123", "123321", "1234567890", "letmein123", "test123", 
    "demo123", "pass123", "123qwe", "qwe123", "654321", "loveyou", "adminadmin123"
];

/**
 * Analyse la robustesse d'un mot de passe sans utiliser de RegEx complexes.
 * @param {string} password - Le mot de passe à tester.
 * @returns {object} Évaluation complète (score, critères, force).
 */
function analyzePassword(password) {
    let score = 0;
    const stats = {
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSymbol: false,
        isBlacklisted: BLACKLIST.includes(password.toLowerCase()),
        length: password.length
    };

    const symbols = "!@#$%^&*()_+-=[]{}|;':\",./<>? ";
    let R = 0; // Taille de l'alphabet (Range) 

    // Parcours avec for...of (Contrainte technique) [cite: 51]
    for (const char of password) {
        if (char >= 'A' && char <= 'Z') stats.hasUpper = true;
        else if (char >= 'a' && char <= 'z') stats.hasLower = true;
        else if (char >= '0' && char <= '9') stats.hasNumber = true;
        else if (symbols.includes(char)) stats.hasSymbol = true;
    }

    // Calcul de R (taille de l'alphabet utilisé) 
    if (stats.hasLower) R += 26;
    if (stats.hasUpper) R += 26;
    if (stats.hasNumber) R += 10;
    if (stats.hasSymbol) R += symbols.length;

    // Calcul de l'entropie (L * log2(R)) 
    // Math.log2(R) donne le nombre de bits par caractère
    const entropy = (R > 0 && password.length > 0) 
        ? (password.length * Math.log2(R)) 
        : 0;

    // Barème officiel de l'énoncé [cite: 53]
    if (password.length > 8) score += (password.length - 8) * 2;
    if (stats.hasUpper) score += 15;
    if (stats.hasNumber) score += 15;
    if (stats.hasSymbol) score += 20;
    if (!stats.isBlacklisted && password.length > 0) score += 20;

    return {
        score: Math.min(score, 100),
        stats: stats,
        entropy: entropy.toFixed(2), // On arrondit à 2 décimales pour l'affichage [cite: 58]
        label: getStrengthLabel(score, stats.isBlacklisted)
    };
}

/**
 * Détermine le libellé de force et la couleur associée.
 */
function getStrengthLabel(score, isBlacklisted) {
    if (isBlacklisted) return { text: "Blacklisté", color: "black" };
    if (score < 30) return { text: "Faible", color: "red" };
    if (score < 60) return { text: "Moyen", color: "orange" };
    return { text: "Fort", color: "green" };
}
// À la toute fin de js/password.js
if (typeof module !== 'undefined') {
    module.exports = { analyzePassword };
}