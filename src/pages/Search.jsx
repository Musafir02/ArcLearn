import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchIndex } from '../lib/loadGuide';
import { useProgressStore } from '../store/progress';

function Search() {
  const navigate = useNavigate();
  const completedTopics = useProgressStore((state) => state.completedTopics);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.content?.toLowerCase().includes(q) ||
        t.codeExample?.toLowerCase().includes(q)
    );
  }, [query]);

  const stripMarkdown = (str) =>
    str
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/^###?\s*/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^[-*]\s+/gm, '')
      .replace(/^>\s+/gm, '')
      .replace(/\|/g, ' ')
      .replace(/---+/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

  const getSnippet = (text) => {
    if (!text) return '';
    const clean = stripMarkdown(text);
    const idx = clean.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return clean.slice(0, 160) + '...';
    const start = Math.max(0, idx - 50);
    const end = Math.min(clean.length, idx + 100);
    return (start > 0 ? '...' : '') + clean.slice(start, end) + (end < clean.length ? '...' : '');
  };

  const grouped = useMemo(() => {
    const map = {};
    results.forEach((t) => {
      const key = t.displayLanguage || t.language;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [results]);

  return (
    <div className="home-container">
      <div className="hero" style={{ marginBottom: 40 }}>
        <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Arc<span>Learn</span> <span style={{ fontSize: '0.6em', color: 'var(--text-muted)' }}>Search</span>
        </h1>
        <p>Search across all topics, guides, and code examples.</p>
      </div>

      <div className="search-bar-wrapper" style={{ maxWidth: 640 }}>
        <input
          type="text"
          placeholder="Search topics, concepts, code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          autoFocus
        />
      </div>

      {query.trim() && results.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 40 }}>
          No results found for "{query}"
        </div>
      )}

      {Object.entries(grouped).map(([guideName, topics]) => (
        <div key={guideName} style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: 'Source Serif 4, serif', fontSize: 22, marginBottom: 12 }}>{guideName}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topics.map((t) => (
              <div
                key={`${t.language}/${t.topic}`}
                className="search-result-card"
                onClick={() => navigate(`/learn/${t.language}/${t.topic}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{t.title}</span>
                  <span style={{
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--text-muted)',
                    background: 'var(--surface-2)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    textTransform: 'lowercase'
                  }}>
                    {t.category}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {getSnippet(t.content)}
                </div>
                {completedTopics[`${t.language}/${t.topic}`] && (
                  <span style={{
                    fontSize: 11,
                    color: 'var(--success)',
                    fontFamily: 'JetBrains Mono, monospace',
                    marginTop: 4,
                    display: 'inline-block'
                  }}>
                    ✓ completed
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {!query.trim() && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 60 }}>
          Type to search across all {searchIndex.length} topics
        </div>
      )}
    </div>
  );
}

export default Search;