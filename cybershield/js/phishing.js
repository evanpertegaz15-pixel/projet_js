// ============================================================
// phishing.js — Module Détecteur de Phishing — CyberShield
// ============================================================

const phishingRules = {
    urgencyKeywords: [
        'urgent', 'immédiatement', 'immediatement', 'expire dans', 'action requise',
        'votre compte sera suspendu', 'vérifiez maintenant', 'verifiez maintenant',
        'répondez rapidement', 'répondez vite', 'délai de 24h', 'délai de 48h',
        'dans les plus brefs délais', 'sans délai', 'dernière chance',
        'compte bloqué', 'compte suspendu', 'accès restreint'
    ],

    suspiciousDomains: [
        'paypa1.com', 'amaz0n.fr', 'noreply-security.tk', 'secure-login.ml',
        'account-update.ga', 'verify-paypal.com', 'amazon-support.net',
        'apple-id-support.com', 'microsoft-alert.com', 'google-security.info',
        'banque-securite.tk', 'credit-agricol.ml', 'laposte-secure.ga',
        '.tk', '.ml', '.ga', '.cf', '.gq'
    ],

    redFlags: [
        'cliquez ici', 'connexion sécurisée', 'mot de passe expiré',
        'vous avez gagné', 'félicitations', 'felicitations',
        'vérifiez votre identité', 'confirmez vos informations',
        'saisir vos coordonnées bancaires', 'numéro de carte',
        'code secret', 'code pin', 'rib', 'iban',
        'lien ci-dessous', 'accédez à votre compte',
        'mise à jour obligatoire', 'alerte de sécurité'
    ],

    legitimateSenders: [
        '@impots.gouv.fr', '@pole-emploi.fr', '@assurance-maladie.fr',
        '@caf.fr', '@ameli.fr', '@service-public.fr', '@finances.gouv.fr',
        '@education.gouv.fr', '@dgfip.finances.gouv.fr'
    ],

    suspiciousPatterns: [
        // Chiffres remplaçant des lettres : paypa1, amaz0n
        /[a-z]+[0-9]+[a-z]+/i,
        // Tirets suspects dans un domaine ex: secure-paypal-login.com
        /[a-z]+-[a-z]+-[a-z]+\.[a-z]{2,}/i,
        // Sous-domaines trompeurs : paypal.attacker.com
        /paypal|amazon|apple|google|microsoft|netflix|facebook|instagram/i
    ]
};

// ============================================================
// analyzeEmail — Fonction principale d'analyse
// Retourne { score, level, reasons }
// ============================================================
function analyzeEmail(emailObject) {
    const { sender = '', subject = '', body = '' } = emailObject;
    const fullText = (subject + ' ' + body).toLowerCase();
    const senderLower = sender.toLowerCase();

    let score = 0;
    const reasons = [];

    // ── 1. Expéditeur légitime → score négatif (bonus de confiance) ──
    const isLegitimate = phishingRules.legitimateSenders.some(domain =>
        senderLower.endsWith(domain)
    );
    if (isLegitimate) {
        score -= 20;
        reasons.push('✅ L\'expéditeur correspond à un domaine gouvernemental reconnu.');
    }

    // ── 2. Domaine suspect dans l'expéditeur ──
    const suspiciousDomain = phishingRules.suspiciousDomains.find(domain =>
        senderLower.includes(domain)
    );
    if (suspiciousDomain) {
        score += 30;
        reasons.push(`🚨 Domaine expéditeur suspect détecté : "${suspiciousDomain}"`);
    }

    // ── 3. Patterns suspects dans l'adresse (chiffres dans domaine, sous-domaines) ──
    const matchedPatterns = phishingRules.suspiciousPatterns.filter(pattern =>
        pattern.test(senderLower)
    );
    if (matchedPatterns.length > 0) {
        score += 20;
        reasons.push('⚠️ L\'adresse expéditeur contient des caractères ou structures inhabituels (ex: chiffres remplaçant des lettres).');
    }

    // ── 4. Mots-clés d'urgence dans objet + corps ──
    const foundUrgency = phishingRules.urgencyKeywords.filter(keyword =>
        fullText.includes(keyword.toLowerCase())
    );
    if (foundUrgency.length > 0) {
        const pts = Math.min(foundUrgency.length * 10, 30);
        score += pts;
        reasons.push(`⚠️ ${foundUrgency.length} mot(s) d'urgence détecté(s) : "${foundUrgency.slice(0, 3).join('", "')}"`);
    }

    // ── 5. Red flags (appels à l'action suspects) ──
    const foundRedFlags = phishingRules.redFlags.filter(flag =>
        fullText.includes(flag.toLowerCase())
    );
    if (foundRedFlags.length > 0) {
        const pts = Math.min(foundRedFlags.length * 8, 25);
        score += pts;
        reasons.push(`🚩 ${foundRedFlags.length} signal(aux) d'alarme trouvé(s) : "${foundRedFlags.slice(0, 3).join('", "')}"`);
    }

    // ── 6. Vérification que TOUS les champs sont remplis ──
    const allFieldsFilled = [sender, subject, body].every(field => field.trim().length > 0);
    if (!allFieldsFilled) {
        reasons.push('ℹ️ Analyse partielle : certains champs sont vides.');
    }

    // ── 7. Absence totale de contenu suspect → probablement légitime ──
    const noThreat = foundUrgency.length === 0 && foundRedFlags.length === 0 && !suspiciousDomain;
    if (noThreat && !isLegitimate) {
        reasons.push('✅ Aucun indicateur de phishing évident détecté dans ce message.');
    }

    // ── Clamp du score entre 0 et 100 ──
    score = Math.max(0, Math.min(100, score));

    return {
        score,
        level: getPhishingLevel(score),
        reasons
    };
}

// ============================================================
// getPhishingLevel — Retourne le niveau de menace
// ============================================================
function getPhishingLevel(score) {
    if (score >= 70) {
        return {
            text:  '🔴 Phishing probable',
            color: '#ef4444',
            bg:    'rgba(239,68,68,0.08)'
        };
    } else if (score >= 40) {
        return {
            text:  '🟠 Suspect',
            color: '#f59e0b',
            bg:    'rgba(245,158,11,0.08)'
        };
    } else {
        return {
            text:  '🟢 Probablement légitime',
            color: '#22c55e',
            bg:    'rgba(34,197,94,0.08)'
        };
    }
}