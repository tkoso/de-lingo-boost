import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`submitting ${isLogin ? 'login' : 'signup'}`);
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Login</Form.Label>
          <Form.Control
            type="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
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