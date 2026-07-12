import { useState } from 'react';
import { Link } from 'react-router-dom';
import { guidesOutline, guideTitles } from '../lib/loadGuide';
import { useProgressStore } from '../store/progress';

function Sidebar({ activeLanguage, activeTopic }) {
  const completedTopics = useProgressStore((state) => state.completedTopics);
  const [userExpanded, setUserExpanded] = useState({});

  const getDotClass = (lang, topicName) => {
    if (completedTopics[`${lang}/${topicName}`]) {
      return 'dot done';
    }
    if (activeLanguage === lang && activeTopic === topicName) {
      return 'dot progress';
    }
    return 'dot todo';
  };

  const activeOutline = guidesOutline[activeLanguage] || [];
  
  let activeGroup = null;
  activeOutline.forEach((entry) => {
    if (entry.type === 'group') {
      const hasActive = entry.items.some((item) => item.topic === activeTopic);
      if (hasActive) {
        activeGroup = entry.name;
      }
    }
  });

  const isGroupExpanded = (groupName) => {
    if (userExpanded[groupName] !== undefined) {
      return userExpanded[groupName];
    }
    return activeGroup === groupName;
  };

  const toggleGroup = (groupName) => {
    setUserExpanded((prev) => ({
      ...prev,
      [groupName]: !isGroupExpanded(groupName)
    }));
  };

  return (
    <aside>
      <Link to="/" className="brand">
        Arc<span>Learn</span>
      </Link>

      <div className="sidebar-header">
        {activeLanguage ? `${guideTitles[activeLanguage] || activeLanguage.toUpperCase()} TUTORIAL` : 'TUTORIAL'}
      </div>

      {activeOutline.map((entry) => {
        if (entry.type === 'flat') {
          const { item } = entry;
          return (
            <Link
              key={item.topic}
              to={`/learn/${activeLanguage}/${item.topic}`}
              className={`topic ${activeTopic === item.topic ? 'active' : ''}`}
            >
              <span className={getDotClass(activeLanguage, item.topic)}></span>
              {item.title}
            </Link>
          );
        } else {
          const { name, title, items } = entry;
          const isExpanded = isGroupExpanded(name);
          const hasActiveChild = items.some((item) => item.topic === activeTopic);
          return (
            <div key={name} className="section-container">
              <div
                className={`section-header ${hasActiveChild ? 'active-group' : ''}`}
                onClick={() => toggleGroup(name)}
              >
                <span>{title}</span>
                <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
              </div>
              {isExpanded && (
                <div className="section-items">
                  {items.map((item) => (
                    <Link
                      key={item.topic}
                      to={`/learn/${activeLanguage}/${item.topic}`}
                      className={`topic nested ${activeTopic === item.topic ? 'active' : ''}`}
                    >
                      <span className={getDotClass(activeLanguage, item.topic)}></span>
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }
      })}
    </aside>
  );
}

export default Sidebar;
