// ============================================================
//  Module 3 — Détecteur de Phishing
//  CyberShield — SecureNova
// ============================================================

const phishingRules = {
    urgencyKeywords: [
        'urgent', 'immédiatement', 'expire dans', 'action requise',
        'votre compte sera suspendu', 'vérifiez maintenant',
        'répondez immédiatement', 'délai expiré', 'dernière chance',
        'votre accès sera bloqué', 'confirmer maintenant'
    ],
    suspiciousDomains: [
        'paypa1.com', 'amaz0n.fr', 'noreply-security.tk',
        'secure-login.xyz', 'verify-account.ml', 'banque-alerte.cf',
        'apple-id-verify.com', 'microsoft-support.net', 'google-security.info'
    ],
    redFlags: [
        'cliquez ici', 'connexion sécurisée', 'mot de passe expiré',
        'vous avez gagné', 'félicitations', 'vérifiez votre identité',
        'mettez à jour vos informations', 'votre compte a été compromis',
        'connectez-vous maintenant', 'offre exclusive', 'cadeau gratuit'
    ],
    legitimateSenders: [
        '@impots.gouv.fr', '@pole-emploi.fr', '@ameli.fr',
        '@service-public.fr', '@caf.fr', '@education.gouv.fr'
    ]
};

/**
 * Analyse un e-mail et retourne un score de suspicion (0-100) + les raisons.
 * @param {{ sender: string, subject: string, body: string }} emailObject
 * @returns {{ score: number, reasons: string[], verdict: string, color: string }}
 */
function analyzeEmail(emailObject) {
    const { sender = '', subject = '', body = '' } = emailObject;
    const fullText = (subject + ' ' + body).toLowerCase();
    const senderLower = sender.toLowerCase();

    let score = 0;
    const reasons = [];

    // --- 1. Vérification expéditeur légitime (.every sur domaines légitimes) ---
    const isLegitimate = phishingRules.legitimateSenders.some(domain =>
        senderLower.endsWith(domain)
    );
    if (isLegitimate) {
        // Expéditeur officiel connu → score réduit (mais pas à 0, on continue l'analyse)
        score -= 20;
        reasons.push('✅ Expéditeur identifié comme source légitime connue');
    }

    // --- 2. Domaine suspect dans l'expéditeur (.find) ---
    const suspiciousDomainFound = phishingRules.suspiciousDomains.find(domain =>
        senderLower.includes(domain)
    );
    if (suspiciousDomainFound) {
        score += 40;
        reasons.push(`🚨 Domaine suspect détecté : ${suspiciousDomainFound}`);
    }

    // --- 3. Mots-clés d'urgence (.filter) ---
    const urgencyFound = phishingRules.urgencyKeywords.filter(keyword =>
        fullText.includes(keyword.toLowerCase())
    );
    if (urgencyFound.length > 0) {
        score += urgencyFound.length * 10;
        reasons.push(`⚠️ Langage d'urgence détecté : "${urgencyFound.join('", "')}"`);
    }

    // --- 4. Red flags (.filter) ---
    const redFlagsFound = phishingRules.redFlags.filter(flag =>
        fullText.includes(flag.toLowerCase())
    );
    if (redFlagsFound.length > 0) {
        score += redFlagsFound.length * 8;
        reasons.push(`🚩 Expressions suspectes : "${redFlagsFound.join('", "')}"`);
    }

    // --- 5. Vérification que TOUS les critères de sécurité sont absents (.every) ---
    const securityCriteria = [
        !senderLower.includes('noreply'),
        !fullText.includes('cliquez ici'),
        !fullText.includes('urgent')
    ];
    const allSecure = securityCriteria.every(criterion => criterion === true);
    if (!allSecure) {
        score += 5;
        reasons.push('⚠️ Plusieurs critères de sécurité de base ne sont pas respectés');
    }

    // --- 6. Lien suspect (http:// au lieu de https://) ---
    if (fullText.includes('http://')) {
        score += 15;
        reasons.push('🔓 Lien non sécurisé (http://) détecté dans le message');
    }

    // --- 7. Expéditeur no-reply générique ---
    if (senderLower.startsWith('noreply') || senderLower.startsWith('no-reply')) {
        score += 10;
        reasons.push('📧 Expéditeur "no-reply" générique (impossible de répondre)');
    }

    // --- Clamp score entre 0 et 100 ---
    score = Math.max(0, Math.min(100, score));

    // --- Verdict ---
    let verdict, color;
    if (score < 30) {
        verdict = 'Sûr';
        color = 'green';
    } else if (score < 60) {
        verdict = 'Suspect';
        color = 'orange';
    } else {
        verdict = 'Phishing probable';
        color = 'red';
    }

    if (reasons.length === 0) {
        reasons.push('✅ Aucun élément suspect détecté');
    }

    return { score, reasons, verdict, color };
}

if (typeof module !== 'undefined') {
    module.exports = { analyzeEmail, phishingRules };
}