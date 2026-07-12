const modules = import.meta.glob('../../guide/**/*.json', { eager: true });
const outlines = import.meta.glob('../../guide/*/*/guide.json', { eager: true });

const guides = {};
const guidesOutline = {};

const schemas = {};
for (const path in outlines) {
  const parts = path.split('/');
  const guideIndex = parts.indexOf('guide');
  const category = parts[guideIndex + 1];
  const language = parts[guideIndex + 2];
  schemas[language] = outlines[path].default;
}

const rawTopics = {};
for (const path in modules) {
  if (path.endsWith('guide.json')) {
    continue;
  }
  const content = modules[path].default;
  const parts = path.split('/');
  const guideIndex = parts.indexOf('guide');
  const category = parts[guideIndex + 1];
  const language = parts[guideIndex + 2];
  const group = parts[parts.length - 2] !== language ? parts[parts.length - 2] : null;
  const topic = parts[parts.length - 1].replace('.json', '');

  if (!rawTopics[language]) {
    rawTopics[language] = {};
  }
  rawTopics[language][topic] = {
    ...content,
    topic,
    language,
    category,
    group
  };
}

for (const lang in schemas) {
  const schema = schemas[lang];
  const flatGuides = [];
  const outlineList = [];
  
  if (!rawTopics[lang]) {
    continue;
  }

  schema.outline.forEach((entry) => {
    if (entry.type === 'flat') {
      const topicDetails = rawTopics[lang][entry.topic];
      if (topicDetails) {
        flatGuides.push(topicDetails);
        outlineList.push({
          type: 'flat',
          item: topicDetails
        });
      }
    } else if (entry.type === 'group') {
      const groupItems = [];
      entry.topics.forEach((topicName) => {
        const topicDetails = rawTopics[lang][topicName];
        if (topicDetails) {
          flatGuides.push(topicDetails);
          groupItems.push(topicDetails);
        }
      });
      outlineList.push({
        type: 'group',
        name: entry.folder,
        title: entry.title,
        items: groupItems
      });
    }
  });

  for (let i = 0; i < flatGuides.length; i++) {
    flatGuides[i].order = i + 1;
    flatGuides[i].prevTopic = i > 0 ? flatGuides[i - 1].topic : '';
    flatGuides[i].nextTopic = i < flatGuides.length - 1 ? flatGuides[i + 1].topic : '';
  }

  guides[lang] = flatGuides;
  guidesOutline[lang] = outlineList;
}

const displayName = (key) => {
  const map = {
    javascript: 'JavaScript', python: 'Python', csharp: 'C#', cpp: 'C++',
    typescript: 'TypeScript', sql: 'SQL', html: 'HTML', css: 'CSS',
    react: 'React', java: 'Java', c: 'C', rust: 'Rust', go: 'Go',
    kotlin: 'Kotlin', dart: 'Dart', swift: 'Swift', php: 'PHP',
    nextjs: 'Next.js', vue: 'Vue.js', angular: 'Angular', express: 'Express.js',
    django: 'Django', flask: 'Flask', fastapi: 'FastAPI', springboot: 'Spring Boot',
    tailwind: 'Tailwind CSS', git: 'Git', github: 'GitHub', docker: 'Docker',
    linux: 'Linux & Bash CLI', cicd: 'CI/CD',
    'machine-learning': 'Machine Learning',
    'deep-learning': 'Deep Learning',
    'nlp': 'Natural Language Processing',
    'computer-vision': 'Computer Vision',
    'agentic-ai': 'Agentic AI',
    'generative-ai': 'Generative AI',
    'dsa': 'Data Structures & Algorithms',
    'sysdesign': 'System Design',
    'api': 'API Design',
    'database': 'Database Design',
    'cybersec': 'Cybersecurity',
    'ethicalhacking': 'Ethical Hacking',
    'owasp': 'OWASP Top 10',
    'crypto': 'Cryptography',
  };
  return map[key] || key;
};

const searchIndex = Object.values(guides).flat().map((t) => ({
  ...t,
  displayLanguage: displayName(t.language),
}));

const guideTitles = {};
for (const lang in schemas) {
  guideTitles[lang] = schemas[lang]?.title || lang;
}

export { guides, guidesOutline, searchIndex, guideTitles };
