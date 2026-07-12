import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LessonViewer from '../components/LessonViewer';
import { guides } from '../lib/loadGuide';

function Learn() {
  const { language, topic } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const contentContainerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const container = contentContainerRef.current;
    if (container) {
      setTimeout(() => {
        container.scrollTop = 0;
      }, 0);
    }
    setIsSidebarOpen(false);
  }, [language, topic]);

  const langTopics = guides[language] || [];
  const activeTopicData = langTopics.find((t) => t.topic === topic);

  return (
    <div className="app-container">
      <Sidebar activeLanguage={language} activeTopic={topic} />
      
      <div className="learn-content-container" ref={contentContainerRef}>
        <div className="mobile-breadcrumb">
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            ☰
          </button>
          <div className="mobile-brand" onClick={() => navigate('/')}>
            Arc<span>Learn</span>
          </div>
          <div style={{ width: 24 }}></div>
        </div>

        <LessonViewer topicData={activeTopicData} />
      </div>

      {isSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}>
          <div className="mobile-sidebar-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-sidebar-header">
              <button className="mobile-sidebar-close" onClick={() => setIsSidebarOpen(false)}>
                ✕
              </button>
            </div>
            <Sidebar activeLanguage={language} activeTopic={topic} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Learn;
