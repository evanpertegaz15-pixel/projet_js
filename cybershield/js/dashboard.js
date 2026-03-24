const API_KEY = '73aca9d9e9c3421787d861101152a8ec';
const API_URL = `https://newsapi.org/v2/everything?q=cybersecurity&language=fr&pageSize=10&sortBy=publishedAt&apiKey=${API_KEY}`;

let allArticles = [];

async function fetchArticles() {
  try {
    console.log('🔄 NewsAPI appelée...');
    
    const res = await fetch(API_URL);
    console.log('Status:', res.status);
    
    if (!res.ok) {
      throw new Error(`Erreur ${res.status}`);
    }
    
    const data = await res.json();
    console.log('✅ Articles:', data.articles.length);
    
    // NewsAPI → data.articles[]
    allArticles = data.articles || [];
    
    renderArticles(allArticles);
    updateAlertLevel(allArticles);
    
  } catch (err) {
    console.error('❌ Erreur:', err);
    // Mock data si API down
    allArticles = [
      {title: "Test cybersecurity", source: {name: "Demo"}, description: "Article test", url: "#"}
    ];
    renderArticles(allArticles);
  }
}

function renderArticles(articles) {
  const container = document.getElementById('dashboard-articles');
  container.innerHTML = '';
  
  articles.slice(0, 10).forEach(article => {
    const card = document.createElement('div');
    card.style.cssText = `
      border: 1px solid #ddd; padding: 16px; margin: 8px 0; 
      border-radius: 8px; background: #f9f9f9;
    `;
    
    card.innerHTML = `
      <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${article.title}</h3>
      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">
        <strong>${article.source?.name || 'Source'}</strong>
      </p>
      <p style="margin: 0 0 12px 0; color: #555; font-size: 14px;">
        ${article.description || 'Pas de résumé disponible'}
      </p>
      <a href="${article.url}" target="_blank" style="color: #0066cc; text-decoration: none;">
        Lire l'article →
      </a>
    `;
    container.appendChild(card);
  });
}

function updateAlertLevel(articles) {
  const alertEl = document.getElementById('alert-level');
  const criticalWords = ['ransomware', 'breach', 'attaque', 'attack', 'leak', 'vulnérabilité'];
  let criticalCount = 0;
  
  articles.forEach(article => {
    const text = (article.title + ' ' + (article.description || '')).toLowerCase();
    if (criticalWords.some(word => text.includes(word))) criticalCount++;
  });
  
  const level = criticalCount >= 3 ? '🔴 ÉLEVÉ' : 
                criticalCount >= 1 ? '🟡 MOYEN' : '🟢 FAIBLE';
  alertEl.textContent = level;
}

// Recherche en temps réel
document.addEventListener('DOMContentLoaded', () => {
  fetchArticles();
  
  const searchInput = document.getElementById('search-input');
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allArticles.filter(article => {
      const text = (article.title + ' ' + (article.description || '')).toLowerCase();
      return text.includes(query);
    });
    renderArticles(filtered);
    updateAlertLevel(filtered);
  });
});