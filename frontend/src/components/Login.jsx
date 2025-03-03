import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("test");
      const url = `http://localhost:8080/api/auth/${isLogin ? 'login' : 'register'}`;

      const response = await axios.post(url, {
        username,
        password,
      });
      console.log("im here");
      console.log(response);

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        navigate('/');
      } else {
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      }

    } catch (err) {
      setError(err.response?.data || 'An error occurred');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need to create an account?' : 'Already have an account?'}
          </Button>
        </div>
      </Form>
      <div className="mt-3">
        <Link to="/" className="text-decoration-none">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;