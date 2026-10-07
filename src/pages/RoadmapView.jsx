import { useParams, useNavigate, Link } from 'react-router-dom';
import { guidesOutline } from '../lib/loadGuide';
import { displayName } from '../lib/displayName';
import { useProgressStore } from '../store/progress';

function RoadmapView() {
  const { language } = useParams();
  const navigate = useNavigate();
  const completedTopics = useProgressStore((state) => state.completedTopics);
  
  const outline = guidesOutline[language] || [];
  
  if (outline.length === 0) {
    return (
      <div className="home-container">
        <h2>Roadmap not found</h2>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="roadmap-view-container">
      <div className="roadmap-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <h1>{displayName(language)}</h1>
        <p>Follow the path below to master {displayName(language)}.</p>
      </div>
      
      <div className="roadmap-graph">
        <div className="center-line"></div>
        {outline.map((section, idx) => {
          if (section.type !== 'section') return null;
          
          const isLeft = idx % 2 === 0;
          
          // Get all items under this section
          let allItems = [];
          if (section.subsections) {
            section.subsections.forEach(sub => {
              if (sub.items) allItems.push(...sub.items);
            });
          }

          return (
            <div key={idx} className={`roadmap-node-container ${isLeft ? 'left-branch' : 'right-branch'}`}>
              <div className="center-node">
                {section.title}
              </div>
              
              {allItems.length > 0 && (
                <div className="branch-content">
                  <div className="connector-line"></div>
                  <div className="topics-grid">
                    {allItems.map(item => {
                      const isCompleted = completedTopics[`${language}/${item.topic}`];
                      return (
                        <Link 
                          key={item.topic} 
                          to={`/learn/${language}/${item.topic}`}
                          className={`topic-card ${isCompleted ? 'completed' : ''}`}
                        >
                          {isCompleted && <span className="checkmark">✓</span>}
                          {item.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoadmapView;
