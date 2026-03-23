// ============================================================
// app.js — Point d'entrée CyberShield
// ============================================================

// S'assure que le DOM est chargé avant d'attacher les événements
document.addEventListener('DOMContentLoaded', () => {

    // --- Module mot de passe ---
    const passwordInput  = document.getElementById('password-input');
    const strengthBar    = document.getElementById('strength-bar');
    const scoreDisplay   = document.getElementById('score-value');
    const labelDisplay   = document.getElementById('strength-label');
    const entropyDisplay = document.getElementById('entropy-value');

    // Écouteur d'événement pour l'input du mot de passe
    // Utilisation de 'input' pour une mise à jour en temps réel
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const pwd      = e.target.value;
            const analysis = analyzePassword(pwd);

            // Mise à jour de la barre (smooth transition grâce au CSS)
            strengthBar.style.width           = analysis.score + '%';
            strengthBar.style.backgroundColor = analysis.label.color;

            // Mise à jour des textes
            scoreDisplay.textContent   = analysis.score;
            labelDisplay.textContent   = analysis.label.text;
            labelDisplay.style.color   = analysis.label.color;
            entropyDisplay.textContent = analysis.entropy;

            console.log('Analyse CyberShield :', analysis);
        });
    }

    // --- Navigation par onglets ---
    const tabs     = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.module-card');

    // idMap permet de faire correspondre le data-module au vrai id de section
    // (nécessaire car la section password a l'id "password-analyzer")
    const idMap = {
        password:  'password-analyzer',
        cipher:    'cipher',
        phishing:  'phishing',
        dashboard: 'dashboard'
    };

    const showSection = (moduleName) => {
        sections.forEach((section) => {
            section.classList.toggle('hidden', section.id !== idMap[moduleName]);
        });
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((btn) => btn.classList.remove('active'));
            tab.classList.add('active');
            showSection(tab.dataset.module);
        });
    });

    // --- Module phishing ---
    const phishingBtn = document.getElementById('phishing-analyze-btn');

    if (phishingBtn) {
        phishingBtn.addEventListener('click', () => {
            const emailObject = {
                sender:  document.getElementById('phishing-sender').value.trim(),
                subject: document.getElementById('phishing-subject').value.trim(),
                body:    document.getElementById('phishing-body').value.trim()
            };

            const result = analyzeEmail(emailObject);

            // Affichage du bloc résultat
            const resultBox = document.getElementById('phishing-result');
            resultBox.classList.remove('hidden');
            resultBox.style.backgroundColor = result.level.bg;
            resultBox.style.borderColor     = result.level.color;

            // Score + barre
            document.getElementById('phishing-score-value').textContent = result.score;
            const bar = document.getElementById('phishing-bar');
            bar.style.width           = result.score + '%';
            bar.style.backgroundColor = result.level.color;

            // Cercle score
            const circle = document.querySelector('.phishing-score-circle');
            circle.style.borderColor = result.level.color;
            circle.style.color       = result.level.color;

            // Badge niveau
            const badge = document.getElementById('phishing-level-label');
            badge.textContent          = result.level.text;
            badge.style.backgroundColor = result.level.bg;
            badge.style.color          = result.level.color;
            badge.style.border         = `1px solid ${result.level.color}`;

            // Raisons
            const list = document.getElementById('phishing-reasons');
            list.innerHTML = '';
            result.reasons.forEach(reason => {
                const li = document.createElement('li');
                li.textContent = reason;
                list.appendChild(li);
            });

            console.log('Analyse phishing :', result);
        });
    }

});