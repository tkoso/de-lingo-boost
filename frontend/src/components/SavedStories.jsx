import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SavedStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8080/api/stories/saved', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setStories(response.data);
      } catch (err) {
        setError(err.response?.data || 'Error fetching saved stories');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStories();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2>Saved Stories</h2>
      <Button variant="primary" onClick={() => navigate('/')}>
        Back to Home
      </Button>
      {stories.length === 0 ? (
        <p>No saved stories.</p>
      ) : (
        stories.map((story) => (
          <Card key={story.id} className="mb-3">
            <Card.Header>{story.level} Story</Card.Header>
            <Card.Body>
              <Card.Text style={{ whiteSpace: 'pre-line' }}>
                {story.content}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">
                Generated at: {new Date(story.createdAt).toLocaleString()}
              </small>
            </Card.Footer>
          </Card>
        ))
      )}
    </div>
  );
};

export default SavedStories;
