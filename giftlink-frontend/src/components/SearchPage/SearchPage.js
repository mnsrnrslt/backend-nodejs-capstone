import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
const conditions = ['New', 'Like New', 'Older'];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [ageRange, setAgeRange] = useState(6);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const queryParams = new URLSearchParams({
      name: searchQuery,
      age_years: ageRange,
      category: category,
      condition: condition,
    }).toString();

    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/search?${queryParams}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data);
      setSearched(true);
    } catch (e) {
      console.error('Failed to fetch search results:', e);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2 className="mb-4">Search gifts</h2>
        <div className="card p-3 mb-4">
          <label className="form-label">Category</label>
          <select className="form-select mb-3" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="form-label">Condition</label>
          <select className="form-select mb-3" value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="">All</option>
            {conditions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className="form-label">Less than {ageRange} years</label>
          <input
            type="range"
            className="form-range mb-3"
            min="1"
            max="10"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>

        {searched && results.length === 0 && (
          <div className="alert alert-info">No gifts found. Try other filters.</div>
        )}

        {results.map((gift) => (
          <div key={gift.id} className="card mb-3">
            <div className="row g-0">
              <div className="col-4">
                <img src={gift.image} alt={gift.name} className="img-fluid rounded-start" />
              </div>
              <div className="col-8">
                <div className="card-body">
                  <h5 className="card-title">{gift.name}</h5>
                  <p className="card-text">{gift.description.slice(0, 100)}...</p>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/app/product/${gift.id}`)}>
                    View more
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
