// ============================================================
// quiz.js — Moteur du Quiz CyberShield
// ============================================================

// ── Constantes ───────────────────────────────────────────────
const QUIZ_QUESTION_COUNT = 10;
const QUIZ_TIMER_SECONDS  = 20;
const STREAK_THRESHOLD    = 3;
const STREAK_BONUS        = 1.5;   // +50%
const MAX_SCORES_SAVED    = 5;
const POINTS_PER_QUESTION = 100;

// ── État global du quiz ──────────────────────────────────────
let quizState = {
    questions:      [],
    currentIndex:   0,
    score:          0,
    streak:         0,
    timerInterval:  null,
    timeLeft:       QUIZ_TIMER_SECONDS,
    categoryErrors: {},
    answered:       false
};

// ============================================================
// 1. SÉLECTION ALÉATOIRE DES QUESTIONS
// ============================================================

/** Mélange un tableau (Fisher-Yates) sans répétition */
function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/** Construit un pool plat de toutes les questions avec leur niveau */
function buildQuestionPool() {
    // .filter() : garde uniquement les niveaux valides
    const levels = Object.keys(questions).filter(lvl => Array.isArray(questions[lvl]));

    // .map() : ajoute la propriété level sur chaque question
    return levels.flatMap(level =>
        questions[level].map(q => ({ ...q, level }))
    );
}

/** Sélectionne 10 questions aléatoires sans répétition */
function selectRandomQuestions() {
    return shuffleArray(buildQuestionPool()).slice(0, QUIZ_QUESTION_COUNT);
}

// ============================================================
// 2. TIMER
// ============================================================

function startTimer() {
    clearInterval(quizState.timerInterval);
    quizState.timeLeft = QUIZ_TIMER_SECONDS;
    updateTimerDisplay();

    quizState.timerInterval = setInterval(() => {
        quizState.timeLeft--;
        updateTimerDisplay();
        if (quizState.timeLeft <= 0) {
            clearInterval(quizState.timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(quizState.timerInterval);
}

function updateTimerDisplay() {
    const el = document.getElementById('quiz-timer');
    if (!el) return;
    el.textContent = quizState.timeLeft;
    el.style.color = quizState.timeLeft <= 5  ? '#ef4444'
                   : quizState.timeLeft <= 10 ? '#f59e0b'
                   : '#22c55e';
}

function handleTimeout() {
    if (quizState.answered) return;
    quizState.answered = true;
    quizState.streak   = 0;
    const q = quizState.questions[quizState.currentIndex];
    trackError(q);
    showAnswerFeedback(null, q.reponse, q.explication, 0);
}

// ============================================================
// 3. CALCUL DU SCORE
// ============================================================

function calculatePoints(timeLeft, streakActive) {
    const timeBonus = Math.round((timeLeft / QUIZ_TIMER_SECONDS) * 50);
    let   pts       = POINTS_PER_QUESTION + timeBonus;
    if (streakActive) pts = Math.round(pts * STREAK_BONUS);
    return pts;
}

// ============================================================
// 4. SUIVI DES ERREURS PAR CATÉGORIE
// ============================================================

function trackError(question) {
    const cat = question.level || 'inconnu';
    quizState.categoryErrors[cat] = (quizState.categoryErrors[cat] || 0) + 1;
}

// ============================================================
// 5. AFFICHAGE D'UNE QUESTION
// ============================================================

function renderQuestion() {
    const q        = quizState.questions[quizState.currentIndex];
    const total    = quizState.questions.length;
    const progress = Math.round((quizState.currentIndex / total) * 100);

    document.getElementById('quiz-progress-bar').style.width       = progress + '%';
    document.getElementById('quiz-question-counter').textContent   =
        `Question ${quizState.currentIndex + 1} / ${total}`;
    document.getElementById('quiz-score-display').textContent      = quizState.score;
    document.getElementById('quiz-streak-display').textContent     =
        quizState.streak >= STREAK_THRESHOLD ? `🔥 ×${quizState.streak}` : quizState.streak;

    const levelMap = { facile: '🟢 Facile', moyen: '🟡 Moyen', difficile: '🔴 Difficile' };
    document.getElementById('quiz-level-badge').textContent = levelMap[q.level] || q.level;
    document.getElementById('quiz-question-text').textContent = q.question;

    // Options — génère les boutons
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, idx) => {
        const btn       = document.createElement('button');
        btn.className   = 'quiz-option-btn';
        btn.textContent = opt;
        btn.dataset.idx = idx;
        btn.addEventListener('click', () => handleAnswer(idx));
        optionsContainer.appendChild(btn);
    });

    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('quiz-next-btn').classList.add('hidden');

    quizState.answered = false;
    startTimer();
}

// ============================================================
// 6. GESTION DE LA RÉPONSE
// ============================================================

function handleAnswer(selectedIdx) {
    if (quizState.answered) return;
    quizState.answered = true;
    stopTimer();

    const q         = quizState.questions[quizState.currentIndex];
    const isCorrect = selectedIdx === q.reponse;
    let   pts       = 0;

    if (isCorrect) {
        quizState.streak++;
        pts              = calculatePoints(quizState.timeLeft, quizState.streak >= STREAK_THRESHOLD);
        quizState.score += pts;
    } else {
        quizState.streak = 0;
        trackError(q);
    }

    document.getElementById('quiz-score-display').textContent = quizState.score;
    showAnswerFeedback(selectedIdx, q.reponse, q.explication, pts);
}

function showAnswerFeedback(selected, correct, explication, points) {
    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.disabled = true;
        const idx    = parseInt(btn.dataset.idx);
        if (idx === correct)                          btn.classList.add('correct');
        else if (idx === selected && selected !== correct) btn.classList.add('incorrect');
    });

    const feedbackEl = document.getElementById('quiz-feedback');
    feedbackEl.classList.remove('hidden', 'feedback-correct', 'feedback-incorrect', 'feedback-timeout');

    if (selected === null) {
        feedbackEl.classList.add('feedback-timeout');
        feedbackEl.innerHTML = `⏱️ Temps écoulé !<br><small>${explication}</small>`;
    } else if (selected === correct) {
        const streakMsg = quizState.streak >= STREAK_THRESHOLD ? ` 🔥 Streak ×${quizState.streak} !` : '';
        feedbackEl.classList.add('feedback-correct');
        feedbackEl.innerHTML = `✅ Bonne réponse ! +${points} pts${streakMsg}<br><small>${explication}</small>`;
    } else {
        feedbackEl.classList.add('feedback-incorrect');
        feedbackEl.innerHTML = `❌ Mauvaise réponse.<br><small>${explication}</small>`;
    }

    document.getElementById('quiz-next-btn').classList.remove('hidden');
}

// ============================================================
// 7. QUESTION SUIVANTE / FIN
// ============================================================

function nextQuestion() {
    quizState.currentIndex++;
    if (quizState.currentIndex >= quizState.questions.length) {
        endQuiz();
    } else {
        renderQuestion();
    }
}

// ============================================================
// 8. FIN DU QUIZ & RÉSULTATS
// ============================================================

function endQuiz() {
    stopTimer();
    const scoreData = saveScore(quizState.score);
    renderResults(quizState.score, scoreData.rank, scoreData.topScores);
}

function buildRecommendations() {
    const recs = {
        facile:    '📘 Revoyez les bases : phishing, mots de passe et réseaux Wi-Fi.',
        moyen:     '📗 Approfondissez : HTTPS, permissions d\'apps et stockage cloud.',
        difficile: '📕 Niveau avancé : DNS poisoning, moindre privilège et chiffrement côté client.'
    };

    // .filter() : catégories avec au moins une erreur
    const failed = Object.keys(quizState.categoryErrors)
        .filter(cat => quizState.categoryErrors[cat] > 0);

    if (failed.length === 0) return ['🏆 Parfait ! Aucune erreur. Vous maîtrisez tous les niveaux.'];

    // .map() : transforme chaque catégorie en conseil
    return failed.map(cat => recs[cat] || `Révisez la catégorie : ${cat}`);
}

function renderResults(score, rank, topScores) {
    document.getElementById('quiz-game').classList.add('hidden');
    document.getElementById('quiz-results').classList.remove('hidden');

    const maxScore = QUIZ_QUESTION_COUNT * Math.round((POINTS_PER_QUESTION + 50) * STREAK_BONUS);
    const pct      = Math.min(100, Math.round((score / maxScore) * 100));

    document.getElementById('result-score').textContent    = score;
    document.getElementById('result-rank').textContent     = `#${rank} sur ${topScores.length} session(s)`;
    document.getElementById('result-progress').style.width = pct + '%';

    // Recommandations
    const recEl = document.getElementById('result-recommendations');
    recEl.innerHTML = buildRecommendations().map(r => `<li>${r}</li>`).join('');

    // Top 5 — .sort() déjà appliqué dans saveScore, .map() pour le HTML
    const topEl = document.getElementById('result-top-scores');
    topEl.innerHTML = topScores
        .map((s, i) => `<li class="${i === rank - 1 ? 'current-score' : ''}">#${i + 1} — ${s.score} pts <small>(${s.date})</small></li>`)
        .join('');
}

// ============================================================
// 9. PERSISTANCE localStorage
// ============================================================

function saveScore(score) {
    const key = 'cybershield_quiz_scores';
    let scores = [];

    try {
        scores = JSON.parse(localStorage.getItem(key)) || [];
    } catch { scores = []; }

    const entry = {
        score,
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    };

    scores.push(entry);

    // .sort() : classement décroissant par score
    scores.sort((a, b) => b.score - a.score);

    const topScores = scores.slice(0, MAX_SCORES_SAVED);

    // JSON.stringify pour la persistance
    localStorage.setItem(key, JSON.stringify(topScores));

    // .find() : retrouve le rang du score actuel
    const rank = topScores.findIndex(s => s.score === score && s.date === entry.date) + 1;

    return { rank: rank || topScores.length, topScores };
}

function loadTopScores() {
    try {
        return JSON.parse(localStorage.getItem('cybershield_quiz_scores')) || [];
    } catch { return []; }
}

// ============================================================
// 10. DÉMARRAGE
// ============================================================

function startQuiz() {
    quizState = {
        questions:      selectRandomQuestions(),
        currentIndex:   0,
        score:          0,
        streak:         0,
        timerInterval:  null,
        timeLeft:       QUIZ_TIMER_SECONDS,
        categoryErrors: {},
        answered:       false
    };

    document.getElementById('quiz-start').classList.remove('hidden');
    document.getElementById('quiz-start').classList.add('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-game').classList.remove('hidden');

    renderQuestion();
}

// ============================================================
// 11. INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('quiz-start-btn')?.addEventListener('click', startQuiz);
    document.getElementById('quiz-next-btn')?.addEventListener('click', nextQuestion);
    document.getElementById('quiz-restart-btn')?.addEventListener('click', startQuiz);

    // Pré-affichage du top scores sur l'écran d'accueil
    const topScores = loadTopScores();
    const previewEl = document.getElementById('quiz-scores-preview');
    if (previewEl && topScores.length > 0) {
        previewEl.innerHTML = '<strong>🏆 Meilleurs scores :</strong><ul>'
            + topScores.map((s, i) => `<li>#${i + 1} — ${s.score} pts (${s.date})</li>`).join('')
            + '</ul>';
        previewEl.classList.remove('hidden');
    let scores = JSON.parse(localStorage.getItem('quizScores')) || [];
    scores.push(currentScore);
    localStorage.setItem('quizScores', JSON.stringify(scores));
    }
});