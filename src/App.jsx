import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Search from './pages/Search';
import { guides } from './lib/loadGuide';

function NavigateToFirstTopic() {
  const { language } = useParams();
  const topics = guides[language] || [];
  if (topics.length > 0) {
    return <Navigate to={`/learn/${language}/${topics[0].topic}`} replace />;
  }
  return <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/learn/:language" element={<NavigateToFirstTopic />} />
        <Route path="/learn/:language/:topic" element={<Learn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
