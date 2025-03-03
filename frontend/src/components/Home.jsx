import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert, Spinner, Card, Form } from 'react-bootstrap';
import '../styles.css'
import GermanStory from './GermanStory';
import EnglishStory from './EnglishStory';
import TranslationTooltip from './TranslationTooltip';
import Quiz from './Quiz';
import { Link } from 'react-router-dom';




function Home() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState('');
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const [hoveredSentence, setHoveredSentence] = useState(-1);
  const [clickedWord, setClickedWord] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [cachedTranslations, setCachedTranslations] = useState(() => {
    const saved = localStorage.getItem('translations');
    return saved ? new Map(JSON.parse(saved)) : new Map();
  });
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.clickable-word')) {
        setClickedWord(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleWordClick = (e, cleanWord, translation) => {
    const rect = e.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY + rect.height,
    });
    setClickedWord({ word: cleanWord, translation });
  }

  const fetchStory = async (level) => {
    if (!topic.trim()) {
      setError('please enter a topic!');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/stories/generate?level=${level}&topic=${encodeURIComponent(topic)}`
        ,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  
          }
        }
      );
      setShowResults(false);
      setSelectedAnswers({});
      setStory(response.data);
      console.log(response.data.wordTranslations)

      // updating of cache
      const newTranslations = JSON.parse(response.data.wordTranslations);
      const newCache = new Map(cachedTranslations);
      newTranslations.words.forEach(word => {
        newCache.set(word.de.toLowerCase(), word.en);
      });
      localStorage.setItem('translations', JSON.stringify([...newCache]));
      setCachedTranslations(newCache);
    } catch (err) {
      setError(err.message || 'Failed to fetch story');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => {
      const newAnswers = { ...prev };
      if (prev[questionIndex] === answer) {
        delete newAnswers[questionIndex];
      } else {
        newAnswers[questionIndex] = answer;
      }
      return newAnswers;
    })
  };

  const toggleResults = () => setShowResults(!showResults);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-4">🇩🇪 de-lingo-app</h1>
        { username ? (
          <div>
            <span className="me-2">Welcome, {username}!</span>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
        <Link to="/login" className="btn btn-success px-4 fw-bold">Login</Link>
        )}
      </div>

      <Form.Group className="mb-3">
        <Form.Label>Topic</Form.Label>
        <Form.Control
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter story topic (e.g. Space travel, German culture)"
          disabled={loading}
        />
      </Form.Group>
      
      <div className="d-flex gap-2 mb-4">
        {levels.map(level => (
          <Button
            key={level}
            style={{
              backgroundColor: level.startsWith('A') ? '#ff69b4' : level.startsWith('B') ? '#9900cc' : '#33cccc',
              borderColor: 'transparent',
            }}
            variant="primary"
            onClick={() => fetchStory(level)}
            disabled={loading}
          >
            {level}
          </Button>
        ))}
      </div>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger">
          Error: {error}
        </Alert>
      )}

      {story && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <Card className="h-100 border-primary">
              <Card.Header className="bg-primary text-white">German Version</Card.Header>
              <Card.Body>
                <Card.Title>{story.level} Story</Card.Title>
                <Card.Text style={{ whiteSpace: 'pre-line' }}>
                  <GermanStory
                    text={story.content}
                    wordTranslations={story.wordTranslations}
                    cachedTranslations={cachedTranslations}
                    onWordClick={handleWordClick}
                    hoveredSentence={hoveredSentence}
                    setHoveredSentence={setHoveredSentence}
                  />
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted">
                Generated at: {new Date(story.createdAt).toLocaleString()}
              </Card.Footer>
            </Card>
          </div>

          <div className="col-md-6 mb-3">
            <Card className="h-100 border-success">
              <Card.Header className="bg-success text-white">English Translation</Card.Header>
              <Card.Body>
                <Card.Title>{story.level} Translation</Card.Title>
                <Card.Text style={{ whiteSpace: 'pre-line' }}>
                  <EnglishStory
                    text={story.translation}
                    hoveredSentence={hoveredSentence}
                    setHoveredSentence={setHoveredSentence}
                  />
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted">
                Generated at: {new Date(story.createdAt).toLocaleString()}
              </Card.Footer>
            </Card>
          </div>
        </div>
      )}

      {clickedWord && clickedWord.translation && (
        <TranslationTooltip
          word={clickedWord.word}
          translation={clickedWord.translation}
          tooltipPosition={tooltipPosition}
          onClose={() => setClickedWord(null)}
        />
      )}

      {story?.questions && (
        <Quiz
          questions={JSON.parse(story.questions).questions}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={handleAnswerSelect}
          showResults={showResults}
          onShowResults={toggleResults}
        />
      )}

      <div className="text-center mt-4 mb-2 text-muted small">
        <hr className="w-50 mx-auto" />
        Friendly reminder: stories are generated by AI language models.
        Therefore there might be some occasional imperfections!
      </div>
    </div>
  );
}

export default Home;