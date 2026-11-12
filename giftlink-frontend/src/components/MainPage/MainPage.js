import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

export const formatDate = (timestamp) => {
  // date_added is stored in seconds, JS Date expects milliseconds
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const conditionClass = (condition) =>
  condition === 'New' ? 'bg-success' : condition === 'Like New' ? 'bg-primary' : 'bg-secondary';

export default function MainPage() {
  const [gifts, setGifts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch(`${urlConfig.backendUrl}/api/gifts`);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setGifts(data);
      } catch (e) {
        setError('Could not load gifts: ' + e.message);
      }
    };
    fetchGifts();
  }, []);

  return (
    <div>
      <h2 className="mb-4">Available gifts</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {gifts.map((gift) => (
          <div className="col-md-4 mb-4" key={gift.id}>
            <div className="card gift-card h-100" onClick={() => navigate(`/app/product/${gift.id}`)}>
              <img src={gift.image} className="card-img-top" alt={gift.name} />
              <div className="card-body">
                <h5 className="card-title">{gift.name}</h5>
                <span className={`badge ${conditionClass(gift.condition)}`}>{gift.condition}</span>
                <p className="card-text text-muted mt-2 mb-0">{formatDate(gift.date_added)}</p>
              </div>
              <div className="card-footer bg-white">
                <button className="btn btn-outline-primary btn-sm w-100">View details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
