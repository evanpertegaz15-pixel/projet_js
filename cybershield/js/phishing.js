// ============================================================
// phishing.js — Module Détecteur de Phishing — CyberShield
// ============================================================

const phishingRules = {
    urgencyKeywords: [
        'urgent', 'urgence', 'immédiatement', 'immediatement',
        'expire dans', 'expirera', 'action requise', 'action immédiate',
        'votre compte sera suspendu', 'sera suspendu', 'compte suspendu',
        'compte bloqué', 'compte bloque', 'vérifiez maintenant',
        'verifiez maintenant', 'répondez rapidement', 'répondez vite',
        'délai de 24h', 'délai de 48h', '24 heures', '48 heures',
        'dans les plus brefs délais', 'sans délai', 'dernière chance',
        'derniere chance', 'accès restreint', 'accès limité',
        'activité suspecte', 'activite suspecte', 'problème de sécurité',
        'probleme de securite', 'votre compte a été', 'si aucune action'
    ],

    genericEmailDomains: [
        '@outlook.com', '@gmail.com', '@yahoo.com',
        '@hotmail.com', '@free.fr', '@orange.fr', '@laposte.net'
    ],

    suspiciousDomains: [
        '.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.click', '.link',
        'paypa1.com', 'amaz0n.fr', 'amaz0n.com',
        'noreply-security', 'secure-login', 'account-update',
        'verify-paypal', 'amazon-support', 'apple-id-support',
        'microsoft-alert', 'google-security',
        'banque-securite', 'credit-agricol', 'laposte-secure'
    ],

    redFlags: [
        'cliquez ici', 'cliquez ci-dessous', 'lien ci-dessous',
        'connexion sécurisée', 'connexion securisee',
        'mot de passe expiré', 'mot de passe expire',
        'vous avez gagné', 'vous avez gagne', 'félicitations',
        'felicitations', 'vérifiez votre identité', 'verifiez votre identite',
        'confirmez vos informations', 'confirmer vos informations',
        'saisir vos coordonnées bancaires', 'numéro de carte',
        'numero de carte', 'code secret', 'code pin',
        'accédez à votre compte', 'accedez a votre compte',
        'mise à jour obligatoire', 'mise a jour obligatoire',
        'alerte de sécurité', 'alerte de securite',
        'cliquez sur le lien', 'http://'
    ],

    suspiciousUrlPatterns: [
        /http:\/\/(?!localhost)/i,
        /https?:\/\/[a-z0-9-]*[0-9]+[a-z0-9-]*\.[a-z]{2,}/i,
        /https?:\/\/([a-z]+-){2,}[a-z0-9]+\.[a-z]{2,}/i,
        /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i,
        /bit\.ly|tinyurl|t\.co|ow\.ly|goo\.gl/i
    ],

    suspiciousAddressPatterns: [
        /[a-z]+[0-9]+[a-z]+@/i,
        /paypal|amazon|apple|google|microsoft|netflix|facebook|instagram/i,
        /[a-z]+-[a-z]+-[a-z]+@/i,
        /[_]{1,}/i,
        /suport|tecnique|noreply-/i
    ],

    legitimateSenders: [
        '@impots.gouv.fr', '@pole-emploi.fr', '@assurance-maladie.fr',
        '@caf.fr', '@ameli.fr', '@service-public.fr', '@finances.gouv.fr',
        '@education.gouv.fr', '@dgfip.finances.gouv.fr'
    ]
};

function analyzeEmail(emailObject) {
    const { sender = '', subject = '', body = '' } = emailObject;
    const fullText  = (subject + ' ' + body).toLowerCase();
    const senderLow = sender.toLowerCase();

    let score = 0;
    const reasons = [];

    // --- Logique de détection ---
    const isLegitimate = phishingRules.legitimateSenders.some(d => senderLow.endsWith(d));
    if (isLegitimate) { score -= 20; reasons.push('✅ Expéditeur gouvernemental reconnu.'); }

    const usesGenericDomain = phishingRules.genericEmailDomains.some(d => senderLow.includes(d));
    if (usesGenericDomain) { score += 20; reasons.push('⚠️ Service mail grand public utilisé.'); }

    const suspiciousDomain = phishingRules.suspiciousDomains.find(d => senderLow.includes(d));
    if (suspiciousDomain) { score += 30; reasons.push(`🚨 Domaine suspect : "${suspiciousDomain}"`); }

    const matchedAddrPatterns = phishingRules.suspiciousAddressPatterns.filter(p => p.test(senderLow));
    if (matchedAddrPatterns.length > 0) { score += 20; reasons.push('🚨 Adresse expéditeur anormale.'); }

    const foundUrgency = phishingRules.urgencyKeywords.filter(kw => fullText.includes(kw.toLowerCase()));
    if (foundUrgency.length > 0) { score += Math.min(foundUrgency.length * 8, 35); reasons.push(`⚠️ Urgence détectée.`); }

    const foundRedFlags = phishingRules.redFlags.filter(f => fullText.includes(f.toLowerCase()));
    if (foundRedFlags.length > 0) { score += Math.min(foundRedFlags.length * 10, 30); reasons.push(`🚩 Signaux d'alarme trouvés.`); }

    const foundBadUrl = phishingRules.suspiciousUrlPatterns.find(p => p.test(body));
    if (foundBadUrl) { score += 25; reasons.push('🚨 URL suspecte détectée.'); }

    // --- Calcul Final ---
    const finalScore = Math.max(0, Math.min(100, score));
    const result = { score: finalScore, level: getPhishingLevel(finalScore), reasons };

    // --- SAUVEGARDE POUR LE RAPPORT ---
    let stats = JSON.parse(localStorage.getItem('phishingStats')) || { total: 0, detected: 0 };
    stats.total++;
    if (result.score > 50) stats.detected++;
    localStorage.setItem('phishingStats', JSON.stringify(stats));
    window.reportModule.updateDashboard();

    return result; // Retourne l'objet complet
}

function getPhishingLevel(score) {
    if (score >= 70) return { text: '🔴 Phishing probable', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' };
    if (score >= 40) return { text: '🟠 Suspect', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' };
    return { text: '🟢 Probablement légitime', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' };
}
