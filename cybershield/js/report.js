// js/report.js
const generateSecurityReport = () => {
    // Récupération des données persistées
    const quizScores = JSON.parse(localStorage.getItem('quizScores')) || [];
    const avgQuizScore = quizScores.length > 0 
        ? (quizScores.reduce((a, b) => a + b, 0) / quizScores.length).toFixed(1) 
        : "N/A";

    const lastPwd = JSON.parse(localStorage.getItem('lastPassword')) || { score: 0, label: "Non testé" };
    const phishingStats = JSON.parse(localStorage.getItem('phishingStats')) || { total: 0, detected: 0 };
    
    const phishingRate = phishingStats.total > 0 
        ? ((phishingStats.detected / phishingStats.total) * 100).toFixed(0) 
        : 0;

    const reportData = {
        date: new Date().toLocaleString(),
        summary: {
            quizScore: avgQuizScore,
            passwordStrength: lastPwd.label,
            emailsAnalyzed: phishingStats.total,
            phishingRate: phishingRate + "%"
        },
        recommendations: []
    };

    // Recommandations dynamiques
    if (lastPwd.score < 50) reportData.recommendations.push("Améliorez la complexité de vos mots de passe.");
    if (phishingStats.total > 0 && phishingRate > 30) reportData.recommendations.push("Attention : vous identifiez beaucoup d'e-mails comme suspects, restez vigilant.");

    return reportData;
};

// Fonction d'export JSON demandée (Blob + URL.createObjectURL) 
const exportToJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberShield_Rapport.json`;
    link.click();
    URL.revokeObjectURL(url);
};

window.reportModule = { generateSecurityReport, exportToJSON };