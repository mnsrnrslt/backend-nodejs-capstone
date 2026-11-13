import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <h1>SecondChance</h1>
      <p className="tagline">Give your unused items a second chance!</p>
      <p className="description">
        Give away household items you no longer need and find free furniture,
        kitchenware and more from people nearby. Less waste, more happy homes.
      </p>
      <button className="btn btn-lg btn-primary px-5" onClick={() => navigate('/app')}>
        Get Started
      </button>
    </div>
  );
}
