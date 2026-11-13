import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState('');

  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('auth-token');
  const { setIsLoggedIn, setUserName } = useAppContext();

  // Already logged in -> go straight to the main page
  useEffect(() => {
    if (sessionStorage.getItem('auth-token')) {
      navigate('/app');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Client-side validation before calling the API
    if (!EMAIL_REGEX.test(email)) {
      setIncorrect('Please enter a valid email address');
      return;
    }

    try {
      const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const json = await res.json();

      if (json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', json.userName);
        sessionStorage.setItem('email', json.userEmail);
        setIsLoggedIn(true);
        setUserName(json.userName);
        navigate('/app');
      } else {
        setEmail('');
        setPassword('');
        setIncorrect(json.error || 'Wrong password. Try again.');
        setTimeout(() => setIncorrect(''), 3000);
      }
    } catch (err) {
      setIncorrect('Error fetching details: ' + err.message);
    }
  };

  return (
    <div className="card p-4 auth-card">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email" className="form-label">Email</label>
        <input id="email" type="email" className="form-control mb-3" value={email}
          onChange={(e) => { setEmail(e.target.value); setIncorrect(''); }} />

        <label htmlFor="password" className="form-label">Password</label>
        <input id="password" type="password" className="form-control mb-1" value={password}
          onChange={(e) => { setPassword(e.target.value); setIncorrect(''); }} />
        <div className="text-danger-small mb-3">{incorrect}</div>

        <button type="submit" className="btn btn-primary w-100 mb-3">Login</button>
      </form>
      <p className="text-center mb-0">
        New here? <Link to="/app/register">Register</Link>
      </p>
    </div>
  );
}
