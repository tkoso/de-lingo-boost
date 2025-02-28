import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert, Spinner, Card, Form } from 'react-bootstrap';
import './styles.css'

const splitSentences = (text) => {
  // we will be splitting on sentence endings followed by whitespace
  return text.split(/(?<=[.!?])\s+/);
};

function App() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState('');
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const [hoveredSentence, setHoveredSentence] = useState(-1);

  const fetchStory = async (level) => {
    if (!topic.trim()) {
      setError('please enter a topic!');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/stories/generate?level=${level}&topic=${encodeURIComponent(topic)}`);
      setStory(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch story');
    } finally {
      setLoading(false);
    }
  };

  const renderTextWithHighlights = (text) => {
    const sentences = splitSentences(text);
    
    return sentences.map((sentence, index) => (
      <span
        key={index}
        className="sentence"
        onMouseEnter={() => setHoveredSentence(index)}
        onMouseLeave={() => setHoveredSentence(-1)}
        style={{
          backgroundColor: hoveredSentence === index ? '#f1e99f' : 'transparent',
          transition: 'background-color 0.2s ease',
        }}
      >
        {sentence}{' '}
      </span>
    ));
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">🇩🇪 de-lingo-app</h1>

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
                  {renderTextWithHighlights(story.content, false)}
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
                  {renderTextWithHighlights(story.translation, true)}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted">
                Generated at: {new Date(story.createdAt).toLocaleString()}
              </Card.Footer>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;