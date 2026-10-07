import { useState } from 'react';
import { Link } from 'react-router-dom';
import { guidesOutline } from '../lib/loadGuide';
import { useProgressStore } from '../store/progress';
import { displayName } from '../lib/displayName';

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
  let activeSection = null;
  let activeSubsection = null;

  activeOutline.forEach((entry) => {
    if (entry.type === 'group') {
      const hasActive = entry.items.some((item) => item.topic === activeTopic);
      if (hasActive) {
        activeGroup = entry.name;
      }
    } else if (entry.type === 'section') {
      entry.subsections.forEach(sub => {
        const hasActive = sub.items.some(item => item.topic === activeTopic);
        if (hasActive) {
          activeSection = entry.name;
          activeSubsection = `${entry.name}-${sub.title}`;
        }
      });
    }
  });

  const isExpanded = (groupName, defaultActive) => {
    if (userExpanded[groupName] !== undefined) {
      return userExpanded[groupName];
    }
    return defaultActive === groupName;
  };

  const toggleGroup = (groupName) => {
    setUserExpanded((prev) => {
      // Find the current state
      let currentState = prev[groupName];
      if (currentState === undefined) {
        currentState = (activeGroup === groupName || activeSection === groupName || activeSubsection === groupName);
      }
      return {
        ...prev,
        [groupName]: !currentState
      };
    });
  };

  return (
    <aside>
      <Link to="/" className="brand">
        Arc<span>Learn</span>
      </Link>

      <div className="sidebar-header">
        {activeLanguage ? `${displayName(activeLanguage)} Tutorial` : 'Tutorial'}
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
        } else if (entry.type === 'group') {
          const { name, title, items } = entry;
          const expanded = isExpanded(name, activeGroup);
          const hasActiveChild = items.some((item) => item.topic === activeTopic);
          return (
            <div key={name} className="section-container">
              <div
                className={`section-header ${hasActiveChild ? 'active-group' : ''}`}
                onClick={() => toggleGroup(name)}
              >
                <span>{title}</span>
                <span className={`arrow ${expanded ? 'expanded' : ''}`}>▼</span>
              </div>
              {expanded && (
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
        } else if (entry.type === 'section') {
          const { name, title, subsections } = entry;
          const sectionExpanded = isExpanded(name, activeSection);
          const hasActiveSub = activeSection === name;
          return (
            <div key={name} className="section-container">
              <div
                className={`section-header ${hasActiveSub ? 'active-group' : ''}`}
                onClick={() => toggleGroup(name)}
              >
                <span style={{fontWeight: 'bold', fontSize: '1.05em'}}>{title}</span>
                <span className={`arrow ${sectionExpanded ? 'expanded' : ''}`}>▼</span>
              </div>
              {sectionExpanded && (
                <div className="section-items" style={{marginLeft: '4px'}}>
                  {subsections.map(sub => {
                    const subKey = `${name}-${sub.title}`;
                    const subExpanded = isExpanded(subKey, activeSubsection);
                    const hasActiveChild = sub.items.some(item => item.topic === activeTopic);
                    return (
                      <div key={subKey} className="subsection-container">
                        <div
                          className={`section-header subsection-header ${hasActiveChild ? 'active-group' : ''}`}
                          onClick={() => toggleGroup(subKey)}
                          style={{paddingTop: '6px', paddingBottom: '6px', fontSize: '0.95em', color: 'var(--text-light)'}}
                        >
                          <span>{sub.title}</span>
                          <span className={`arrow ${subExpanded ? 'expanded' : ''}`} style={{fontSize: '0.8em'}}>▼</span>
                        </div>
                        {subExpanded && (
                          <div className="section-items">
                            {sub.items.map(item => (
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
                  })}
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
