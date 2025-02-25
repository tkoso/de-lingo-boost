import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert, Spinner, Card } from 'react-bootstrap';

function App() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const fetchStory = async (level) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/stories/generate?level=${level}`);
      setStory(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch story');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">🇩🇪 de-lingo-app</h1>
      
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
        <Card>
          <Card.Body>
            <Card.Title>{story.level} Story</Card.Title>
            <Card.Text>
              {story.content}
            </Card.Text>
            <Card.Footer className="text-muted">
              Generated at: {new Date(story.createdAt).toLocaleString()}
            </Card.Footer>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default App;