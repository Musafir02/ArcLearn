import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { guides } from '../lib/loadGuide';
import { useProgressStore } from '../store/progress';

const langKeys = ['python', 'javascript', 'java', 'c', 'cpp', 'rust', 'go', 'csharp', 'php', 'typescript', 'kotlin', 'dart', 'swift', 'html', 'css', 'sql', 'react'];
const frameworkKeys = ['nextjs', 'vue', 'angular', 'express', 'django', 'flask', 'fastapi', 'springboot', 'tailwind'];
const toolKeys = ['git', 'github', 'docker', 'linux', 'cicd'];
const aiKeys = ['machine-learning', 'deep-learning', 'nlp', 'computer-vision', 'agentic-ai', 'generative-ai'];

const displayName = (key) => {
  const map = {
    javascript: 'JavaScript',
    python: 'Python',
    csharp: 'C#',
    cpp: 'C++',
    typescript: 'TypeScript',
    sql: 'SQL',
    html: 'HTML',
    css: 'CSS',
    react: 'React',
    java: 'Java',
    c: 'C',
    rust: 'Rust',
    go: 'Go',
    kotlin: 'Kotlin',
    dart: 'Dart',
    swift: 'Swift',
    php: 'PHP',
    nextjs: 'Next.js',
    vue: 'Vue.js',
    angular: 'Angular',
    express: 'Express.js',
    django: 'Django',
    flask: 'Flask',
    fastapi: 'FastAPI',
    springboot: 'Spring Boot',
    tailwind: 'Tailwind CSS',
    git: 'Git',
    github: 'GitHub',
    docker: 'Docker',
    linux: 'Linux & Bash CLI',
    cicd: 'CI/CD',
    'machine-learning': 'Machine Learning',
    'deep-learning': 'Deep Learning',
    'nlp': 'Natural Language Processing',
    'computer-vision': 'Computer Vision',
    'agentic-ai': 'Agentic AI',
    'generative-ai': 'Generative AI',
  };
  return map[key] || key;
};

function Home() {
  const navigate = useNavigate();
  const completedTopics = useProgressStore((state) => state.completedTopics);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('languages');

  const getStats = (lang) => {
    const topics = guides[lang] || [];
    const total = topics.length;
    const completed = topics.filter((t) => completedTopics[`${lang}/${t.topic}`]).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  };

  const handleStart = (lang) => {
    const topics = guides[lang] || [];
    if (topics.length > 0) {
      const incomplete = topics.find((t) => !completedTopics[`${lang}/${t.topic}`]);
      const targetTopic = incomplete ? incomplete.topic : topics[0].topic;
      navigate(`/learn/${lang}/${targetTopic}`);
    }
  };

  const getKeys = () => {
    if (activeTab === 'languages') return langKeys;
    if (activeTab === 'frameworks') return frameworkKeys;
    if (activeTab === 'tools') return toolKeys;
    if (activeTab === 'ai') return aiKeys;
    return [];
  };

  const filteredKeys = getKeys().filter((key) => {
    return displayName(key).toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="home-container">
      <div className="hero">
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
        <button className={`home-tab ${activeTab === 'languages' ? 'active' : ''}`} onClick={() => { setActiveTab('languages'); setSearchQuery(''); }}>Languages</button>
        <button className={`home-tab ${activeTab === 'frameworks' ? 'active' : ''}`} onClick={() => { setActiveTab('frameworks'); setSearchQuery(''); }}>Frameworks</button>
        <button className={`home-tab ${activeTab === 'tools' ? 'active' : ''}`} onClick={() => { setActiveTab('tools'); setSearchQuery(''); }}>Tools</button>
        <button className={`home-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => { setActiveTab('ai'); setSearchQuery(''); }}>AI</button>
      </div>

      <div className="languages-grid">
        {filteredKeys.map((key) => {
          const { total, completed, percentage } = getStats(key);
          return (
            <div key={key} className="lang-card" onClick={() => handleStart(key)}>
              <div className="lang-card-title">
                {displayName(key)}
                <span>→</span>
              </div>
              <div className="lang-card-desc">
                Learn core syntax, dynamic execution flow, standard data structures, and functions in {displayName(key)}.
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

      {filteredKeys.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '24px' }}>
          No {activeTab} found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

export default Home;
