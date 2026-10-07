import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { guides } from '../lib/loadGuide';
import { useProgressStore } from '../store/progress';
import { TOPICS, TABS, displayName, topicDesc } from '../lib/displayName';

function Home() {
  const navigate = useNavigate();
  const completedTopics = useProgressStore((state) => state.completedTopics);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('languages');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const getStats = (lang) => {
    const topics = guides[lang] || [];
    const total = topics.length;
    const completed = topics.filter((t) => completedTopics[`${lang}/${t.topic}`]).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  const handleStart = (lang) => {
    navigate(`/roadmap/${lang}`);
  };

  const tabKeys = useMemo(() => {
    const allKeys = Object.entries(TOPICS)
      .filter(([, v]) => v.tab === activeTab)
      .map(([k]) => k);
    if (!searchQuery.trim()) return allKeys;
    return allKeys.filter((key) =>
      displayName(key).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  return (
    <div className="home-container">
      <div className="hero" style={{ position: 'relative' }}>
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode} 
          style={{ position: 'absolute', right: 0, top: 0, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
          title="Toggle Dark Mode"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <h1>Arc<span>Learn</span></h1>
        <p>Learn programming languages step-by-step with interactive coding sandboxes and instant checkpoints.</p>
      </div>

      <div className="search-bar-wrapper">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-topics-btn" onClick={() => navigate('/search')}>
          Search Topics
        </button>
      </div>

      <div className="home-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`home-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setSearchQuery(''); }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="languages-grid">
        {tabKeys.map((key) => {
          const { total, completed, percentage } = getStats(key);
          return (
            <div key={key} className="lang-card" onClick={() => handleStart(key)}>
              <div className="lang-card-title">
                {displayName(key)}
                <span>→</span>
              </div>
              <div className="lang-card-desc">
                {topicDesc(key)}
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
              </div>
              <div className="progress-text">
                <span>{percentage}% completed</span>
                <span>{completed}/{total} lessons</span>
              </div>
            </div>
          );
        })}
      </div>

      {tabKeys.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '24px' }}>
          No {activeTab} found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}

export default Home;
