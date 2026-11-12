import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { urlConfig } from '../../config';
import { formatDate, conditionClass } from '../MainPage/MainPage';

export default function DetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Details are only for logged-in users
    const authToken = sessionStorage.getItem('auth-token');
    if (!authToken) {
      navigate('/app/login');
      return;
    }

    const fetchGift = async () => {
      try {
        const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Gift not found' : `HTTP error: ${response.status}`);
        }
        const data = await response.json();
        setGift(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
    window.scrollTo(0, 0);
  }, [productId, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!gift) return <div>Gift not found</div>;

  return (
    <div>
      <button className="btn btn-link px-0 mb-3" onClick={() => navigate(-1)}>&larr; Back</button>
      <div className="card p-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <img src={gift.image} alt={gift.name} className="details-image" />
          </div>
          <div className="col-md-6">
            <h2>{gift.name}</h2>
            <p><strong>Category:</strong> {gift.category}</p>
            <p>
              <strong>Condition:</strong>{' '}
              <span className={`badge ${conditionClass(gift.condition)}`}>{gift.condition}</span>
            </p>
            <p><strong>Date added:</strong> {formatDate(gift.date_added)}</p>
            <p><strong>Age (years):</strong> {gift.age_years}</p>
            <p><strong>Description:</strong> {gift.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
