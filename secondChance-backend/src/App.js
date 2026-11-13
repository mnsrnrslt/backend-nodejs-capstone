import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import MainPage from './components/MainPage/MainPage';
import DetailsPage from './components/DetailsPage/DetailsPage';
import SearchPage from './components/SearchPage/SearchPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import Profile from './components/Profile/Profile';

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<MainPage />} />
          <Route path="/app/product/:productId" element={<DetailsPage />} />
          <Route path="/app/search" element={<SearchPage />} />
          <Route path="/app/login" element={<LoginPage />} />
          <Route path="/app/register" element={<RegisterPage />} />
          <Route path="/app/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
