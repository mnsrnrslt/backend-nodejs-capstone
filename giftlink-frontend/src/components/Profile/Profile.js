import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { setUserName } = useAppContext();
  const [name, setName] = useState(sessionStorage.getItem('name') || '');
  const [email] = useState(sessionStorage.getItem('email') || '');
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!sessionStorage.getItem('auth-token')) {
      navigate('/app/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`,
          'Email': email,
        },
        body: JSON.stringify({ name: name }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const json = await response.json();
      sessionStorage.setItem('name', json.userName);
      sessionStorage.setItem('auth-token', json.authtoken);
      setUserName(json.userName);
      setEditMode(false);
      setMessage('Name changed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="card p-4 auth-card">
      <h2 className="mb-3">Profile</h2>
      <p><strong>Email:</strong> {email}</p>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label className="form-label">Name</label>
          <input className="form-control mb-3" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="btn btn-primary me-2">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <p><strong>Name:</strong> {name}</p>
          <button className="btn btn-outline-primary" onClick={() => setEditMode(true)}>Edit</button>
        </>
      )}
      {message && <div className="alert alert-info mt-3 mb-0">{message}</div>}
    </div>
  );
}
