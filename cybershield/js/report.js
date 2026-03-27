/**
 * js/report.js 
 * Gestionnaire central du Tableau de Bord et des Rapports
 */

const reportModule = {
    // 1. MISE À JOUR DU DASHBOARD (ACCUEIL) - Séance 4 Partie A
    updateDashboard: function() {
        console.log("Chargement des données du tableau de bord...");

        // Récupération des données avec les clés utilisées dans les autres modules
        const quizScores = JSON.parse(localStorage.getItem('cybershield_quiz_scores')) || [];
        const lastPwd = JSON.parse(localStorage.getItem('lastPassword')) || { label: "N/A" };
        const phishStats = JSON.parse(localStorage.getItem('phishingStats')) || { total: 0, detected: 0 };

        // Calcul du score moyen (persisté) [cite: 141]
        // Dans report.js -> updateDashboard
        const avgQuiz = quizScores.length > 0 
            ? Math.round(quizScores.reduce((acc, s) => acc + (s.score || 0), 0) / quizScores.length) 
            : 0;
                
        // Calcul du taux de phishing [cite: 143]
        const phishRate = phishStats.total > 0 
            ? Math.round((phishStats.detected / phishStats.total) * 100) 
            : 0;

        // Mise à jour des éléments du DOM [cite: 140, 141, 142, 143]
        const elQuiz = document.getElementById('dash-quiz-avg');
        const elPwd = document.getElementById('dash-pwd-strength');
        const elPhishCount = document.getElementById('dash-phishing-count');
        const elPhishRate = document.getElementById('dash-phishing-rate');

        if (elQuiz) elQuiz.textContent = avgQuiz;
        if (elPwd) elPwd.textContent = lastPwd.label;
        if (elPhishCount) elPhishCount.textContent = phishStats.total;
        if (elPhishRate) elPhishRate.textContent = phishRate;
    },

    // 2. GÉNÉRATION DES DONNÉES DU RAPPORT (MODALE) - Séance 4 Partie B
    generateSecurityReport: function() {
        const quizScores = JSON.parse(localStorage.getItem('cybershield_quiz_scores')) || [];
        const lastPwd = JSON.parse(localStorage.getItem('lastPassword')) || { label: 'Non testé', score: 0 };
        const phishStats = JSON.parse(localStorage.getItem('phishingStats')) || { total: 0, detected: 0 };
        
        const avgQuiz = quizScores.length > 0 
            ? Math.round(quizScores.reduce((acc, s) => acc + s.score, 0) / quizScores.length) 
            : 0;

        // Structure de l'objet rapport pour le modal [cite: 146, 147]
        const report = {
            date: new Date().toLocaleString('fr-FR'),
            summary: {
                scoreMoyenQuiz: avgQuiz + "/100",
                forceDernierPassword: lastPwd.label,
                emailsAnalyses: phishStats.total,
                menacesDetectees: phishStats.detected
            },
            recommendations: []
        };

        // Logique de recommandations dynamiques [cite: 119, 146]
        if (avgQuiz < 50) {
            report.recommendations.push("Connaissances théoriques faibles : Refaites quelques sessions de Quiz.");
        }
        if (lastPwd.score < 60) {
            report.recommendations.push("Sécurité des comptes : Utilisez des phrases de passe plus longues et des symboles.");
        }
        if (phishStats.total < 3) {
            report.recommendations.push("Entraînement Phishing : Testez plus d'emails pour affiner votre intuition.");
        }
        if (report.recommendations.length === 0) {
            report.recommendations.push("Excellent travail ! Votre niveau de vigilance est optimal.");
        }

        return report;
    },

    // 3. EXPORTATION JSON (Blob + URL.createObjectURL) [cite: 152]
    exportToJSON: function(data) {
        try {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `CyberShield_Rapport_${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erreur lors de l'export JSON:", error);
        }
    }
};

// Exposition globale pour les autres modules [cite: 37, 43]
window.reportModule = reportModule;

// Initialisation au chargement du DOM [cite: 53, 139]
document.addEventListener('DOMContentLoaded', () => {
    if (window.reportModule) {
        window.reportModule.updateDashboard();
    }
});