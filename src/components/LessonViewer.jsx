import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Quiz from './Quiz';
import { useProgressStore } from '../store/progress';
import { guides } from '../lib/loadGuide';

function LessonViewer({ topicData }) {
  const navigate = useNavigate();
  const markCompleted = useProgressStore((state) => state.markCompleted);
  const [copied, setCopied] = useState(false);

  if (!topicData) {
    return null;
  }

  const { title, language, topic, order, content, codeExample, quiz, nextTopic, prevTopic } = topicData;

  const totalTopics = guides[language] ? guides[language].length : 1;

  const handleQuizComplete = () => {
    markCompleted(language, topic);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langTopics = guides[language] || [];
  const prevTopicData = langTopics.find((t) => t.topic === prevTopic);
  const nextTopicData = langTopics.find((t) => t.topic === nextTopic);

  return (
    <main key={topic}>
      <div className="eyebrow">
        {language} — lesson {order} of {totalTopics}
      </div>
      <h1>{title}</h1>
      <div className="markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      {codeExample && (
        <div className="codeblock-wrapper">
          <div className="codeblock">
            <pre><code>{codeExample}</code></pre>
          </div>
          <div className="code-actions">
            <button className="btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {quiz && quiz.length > 0 && (
        <Quiz quizData={quiz} onComplete={handleQuizComplete} />
      )}

      <div className="footer-nav">
        {prevTopic ? (
          <span className="nav-link" onClick={() => navigate(`/learn/${language}/${prevTopic}`)}>
            ← {prevTopicData ? prevTopicData.title : prevTopic}
          </span>
        ) : (
          <span className="nav-link" onClick={() => navigate('/')}>
            ← home
          </span>
        )}

        {nextTopic ? (
          <span className="nav-link next" onClick={() => navigate(`/learn/${language}/${nextTopic}`)}>
            next: {nextTopicData ? nextTopicData.title : nextTopic} →
          </span>
        ) : (
          <span className="nav-link next" onClick={() => navigate('/')}>
            finish & return home →
          </span>
        )}
      </div>
    </main>
  );
}

export default LessonViewer;
