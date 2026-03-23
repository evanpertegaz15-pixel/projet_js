// Exemple d'intégration DOM
const passwordInput = document.getElementById('password-input'); // Assurez-vous d'avoir cet ID dans index.html
const progressBar = document.getElementById('strength-bar');

if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
        const analysis = analyzePassword(e.target.value);
        const entropyElement = document.getElementById('entropy-value');
        if (entropyElement) {
            entropyElement.textContent = analysis.entropy;
        }
        
        // Mise à jour visuelle (barre de progression)
        if (progressBar) {
            progressBar.style.width = `${Math.min(analysis.score, 100)}%`;
            progressBar.style.backgroundColor = analysis.label.color;
        }
        
        console.log("Analyse actuelle :", analysis);
    });
}
// js/app.js

document.addEventListener('DOMContentLoaded', () => { // S'assure que le DOM est chargé avant d'attacher les événements
    const passwordInput = document.getElementById('password-input');
    const strengthBar = document.getElementById('strength-bar');
    const scoreDisplay = document.getElementById('score-value');
    const labelDisplay = document.getElementById('strength-label');
    const entropyDisplay = document.getElementById('entropy-value');
/*
    // Écouteur d'événement pour l'input du mot de passe
    // Utilisation de 'input' pour une mise à jour en temps réel (Contrainte technique) [cite: 51]
    
*/
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const pwd = e.target.value;
            const analysis = analyzePassword(pwd);

            // Mise à jour de la barre (Smooth transition grâce au CSS)
            strengthBar.style.width = analysis.score + "%";
            strengthBar.style.backgroundColor = analysis.label.color;

            // Mise à jour des textes
            scoreDisplay.textContent = analysis.score;
            labelDisplay.textContent = analysis.label.text;
            labelDisplay.style.color = analysis.label.color;
            entropyDisplay.textContent = analysis.entropy;

            console.log("Analyse CyberShield :", analysis);
        });
    }

    // Gestion de la navigation par onglets
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.module-card');

    const showSection = (moduleName) => {
        sections.forEach((section) => {
            section.classList.toggle('hidden', section.id !== moduleName);
        });
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((btn) => btn.classList.remove('active'));
            tab.classList.add('active');

            const moduleName = tab.dataset.module;
            showSection(moduleName);
        });
    });
});