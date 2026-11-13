import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn, userName, setUserName } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('email');
    setIsLoggedIn(false);
    setUserName('');
    navigate('/app/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2d3a8c' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">SecondChance</Link>
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/app">Gifts</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/app/search">Search</Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/app/profile">Welcome, {userName}</Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm ms-2 mt-1" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/app/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/app/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
