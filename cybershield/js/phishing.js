// ============================================================
// phishing.js — Module Détecteur de Phishing — CyberShield
// ============================================================

const phishingRules = {

    urgencyKeywords: [
        'urgent', 'urgence',
        'immédiatement', 'immediatement',
        'expire dans', 'expirera',
        'action requise', 'action immédiate',
        'votre compte sera suspendu', 'sera suspendu',
        'compte suspendu', 'compte bloqué', 'compte bloque',
        'vérifiez maintenant', 'verifiez maintenant',
        'répondez rapidement', 'répondez vite',
        'délai de 24h', 'délai de 48h', '24 heures', '48 heures',
        'dans les plus brefs délais', 'sans délai',
        'dernière chance', 'derniere chance',
        'accès restreint', 'accès limité',
        'activité suspecte', 'activite suspecte',
        'problème de sécurité', 'probleme de securite',
        'votre compte a été',
        'si aucune action'
    ],

    // Domaines génériques utilisés à la place d'un domaine professionnel
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
        'vous avez gagné', 'vous avez gagne',
        'félicitations', 'felicitations',
        'vérifiez votre identité', 'verifiez votre identite',
        'confirmez vos informations', 'confirmer vos informations',
        'saisir vos coordonnées bancaires',
        'numéro de carte', 'numero de carte',
        'code secret', 'code pin',
        'accédez à votre compte', 'accedez a votre compte',
        'mise à jour obligatoire', 'mise a jour obligatoire',
        'alerte de sécurité', 'alerte de securite',
        'cliquez sur le lien',
        'http://'
    ],

    // Patterns d'URL suspects dans le corps du message
    suspiciousUrlPatterns: [
        /http:\/\/(?!localhost)/i,                              // HTTP non sécurisé
        /https?:\/\/[a-z0-9-]*[0-9]+[a-z0-9-]*\.[a-z]{2,}/i, // chiffres dans le domaine
        /https?:\/\/([a-z]+-){2,}[a-z0-9]+\.[a-z]{2,}/i,     // tirets multiples
        /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i,    // adresse IP directe
        /bit\.ly|tinyurl|t\.co|ow\.ly|goo\.gl/i               // URL raccourcies
    ],

    // Patterns suspects dans l'adresse expéditeur
    suspiciousAddressPatterns: [
        /[a-z]+[0-9]+[a-z]+@/i,            // chiffres dans la partie locale
        /paypal|amazon|apple|google|microsoft|netflix|facebook|instagram/i, // usurpation
        /[a-z]+-[a-z]+-[a-z]+@/i,          // tirets excessifs
        /[_]{1,}/i,                         // underscores (ex: Suport.tecnique_Ecole)
        /suport|tecnique|noreply-/i         // fautes d'orthographe typiques
    ],

    legitimateSenders: [
        '@impots.gouv.fr', '@pole-emploi.fr', '@assurance-maladie.fr',
        '@caf.fr', '@ameli.fr', '@service-public.fr', '@finances.gouv.fr',
        '@education.gouv.fr', '@dgfip.finances.gouv.fr'
    ]
};

// ============================================================
// analyzeEmail — Fonction principale d'analyse
// Retourne { score, level, reasons }
// ============================================================
function analyzeEmail(emailObject) {
    const { sender = '', subject = '', body = '' } = emailObject;
    const fullText  = (subject + ' ' + body).toLowerCase();
    const senderLow = sender.toLowerCase();

    let score = 0;
    const reasons = [];

    // ── 1. Expéditeur gouvernemental reconnu → bonus confiance ──
    const isLegitimate = phishingRules.legitimateSenders.some(d => senderLow.endsWith(d));
    if (isLegitimate) {
        score -= 20;
        reasons.push('✅ Expéditeur correspondant à un domaine gouvernemental reconnu.');
    }

    // ── 2. Domaine générique (gmail, outlook…) pour prétendu "service officiel" ──
    const usesGenericDomain = phishingRules.genericEmailDomains.some(d => senderLow.includes(d));
    if (usesGenericDomain) {
        score += 20;
        reasons.push('⚠️ L\'expéditeur utilise un service mail grand public (outlook, gmail…) au lieu d\'un domaine professionnel.');
    }

    // ── 3. Domaine clairement suspect ──
    const suspiciousDomain = phishingRules.suspiciousDomains.find(d => senderLow.includes(d));
    if (suspiciousDomain) {
        score += 30;
        reasons.push(`🚨 Domaine expéditeur suspect détecté : "${suspiciousDomain}"`);
    }

    // ── 4. Patterns anormaux dans l'adresse email ──
    const matchedAddrPatterns = phishingRules.suspiciousAddressPatterns.filter(p => p.test(senderLow));
    if (matchedAddrPatterns.length > 0) {
        score += 20;
        reasons.push('🚨 Adresse expéditeur anormale : fautes d\'orthographe, underscores ou structure inhabituelle (ex: "Suport.tecnique_…").');
    }

    // ── 5. Mots-clés d'urgence ──
    const foundUrgency = phishingRules.urgencyKeywords.filter(kw => fullText.includes(kw.toLowerCase()));
    if (foundUrgency.length > 0) {
        const pts = Math.min(foundUrgency.length * 8, 35);
        score += pts;
        reasons.push(`⚠️ ${foundUrgency.length} indicateur(s) d'urgence détecté(s) : "${foundUrgency.slice(0, 3).join('", "')}"`);
    }

    // ── 6. Red flags / appels à l'action suspects ──
    const foundRedFlags = phishingRules.redFlags.filter(f => fullText.includes(f.toLowerCase()));
    if (foundRedFlags.length > 0) {
        const pts = Math.min(foundRedFlags.length * 10, 30);
        score += pts;
        reasons.push(`🚩 ${foundRedFlags.length} signal(aux) d'alarme : "${foundRedFlags.slice(0, 3).join('", "')}"`);
    }

    // ── 7. URL suspecte dans le corps ──
    const foundBadUrl = phishingRules.suspiciousUrlPatterns.find(p => p.test(body));
    if (foundBadUrl) {
        score += 25;
        reasons.push('🚨 URL suspecte détectée : domaine avec chiffres/tirets multiples, ou lien non sécurisé (http://).');
    }

    // ── 8. Aucune menace détectée ──
    const noThreat = foundUrgency.length === 0 && foundRedFlags.length === 0
                     && !suspiciousDomain && !foundBadUrl
                     && !usesGenericDomain && matchedAddrPatterns.length === 0;
    if (noThreat && !isLegitimate) {
        reasons.push('✅ Aucun indicateur de phishing évident détecté dans ce message.');
    }

    // ── Champs vides ──
    const allFilled = [sender, subject, body].every(f => f.trim().length > 0);
    if (!allFilled) {
        reasons.push('ℹ️ Analyse partielle : certains champs sont vides.');
    }

    score = Math.max(0, Math.min(100, score));

    return { score, level: getPhishingLevel(score), reasons };
}

// ============================================================
// getPhishingLevel
// ============================================================
function getPhishingLevel(score) {
    if (score >= 70) {
        return { text: '🔴 Phishing probable',     color: '#ef4444', bg: 'rgba(239,68,68,0.08)' };
    } else if (score >= 40) {
        return { text: '🟠 Suspect',               color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' };
    } else {
        return { text: '🟢 Probablement légitime', color: '#22c55e', bg: 'rgba(34,197,94,0.08)'  };
    }
}