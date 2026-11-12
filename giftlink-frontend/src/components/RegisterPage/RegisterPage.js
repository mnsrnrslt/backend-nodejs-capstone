import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showerr, setShowerr] = useState('');

  const navigate = useNavigate();
  const { setIsLoggedIn, setUserName } = useAppContext();

  const handleRegister = async () => {
    setShowerr('');
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }),
      });

      const json = await response.json();

      if (json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', firstName);
        sessionStorage.setItem('email', json.email);
        setIsLoggedIn(true);
        setUserName(firstName);
        navigate('/app');
      }

      if (json.error) {
        // Show the server message as is (e.g. "Email id already exists")
        setShowerr(json.error);
      }
    } catch (e) {
      setShowerr('Error fetching details: ' + e.message);
    }
  };

  return (
    <div className="card p-4 auth-card">
      <h2 className="text-center mb-4">Register</h2>

      <label htmlFor="firstName" className="form-label">First name</label>
      <input id="firstName" type="text" className="form-control mb-3" value={firstName}
        onChange={(e) => setFirstName(e.target.value)} />

      <label htmlFor="lastName" className="form-label">Last name</label>
      <input id="lastName" type="text" className="form-control mb-3" value={lastName}
        onChange={(e) => setLastName(e.target.value)} />

      <label htmlFor="email" className="form-label">Email</label>
      <input id="email" type="email" className="form-control mb-1" value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <div className="text-danger-small mb-3">{showerr}</div>

      <label htmlFor="password" className="form-label">Password</label>
      <input id="password" type="password" className="form-control mb-4" value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
      <p className="text-center mb-0">
        Already a member? <Link to="/app/login">Login</Link>
      </p>
    </div>
  );
}
