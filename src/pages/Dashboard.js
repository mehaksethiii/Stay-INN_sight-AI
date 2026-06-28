import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    guestName: '',
    reviewText: '',
    experienceType: '',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/reviews');
      const data = await res.json();
      setReviews(data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reviews. Make sure the backend is running.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setReviews([...reviews, data.data]);
      setForm({ guestName: '', reviewText: '', experienceType: '' });
      setShowForm(false);
      setSuccessMsg('Review added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError('Failed to add review.');
    }
    setSubmitting(false);
  };

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.sentiment === filter);

  const sentimentColor = { positive: '#2e7d32', neutral: '#f57f17', negative: '#c62828' };
  const sentimentBg = { positive: '#e8f5e9', neutral: '#fff8e1', negative: '#fce4ec' };

  const inputStyle = {
    width: '100%', padding: '0.6rem 1rem', borderRadius: '8px',
    border: '1px solid #e8d5bc', background: '#fef9f4',
    color: '#3e2410', fontSize: '0.9rem', outline: 'none',
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#3e2410' }}>
            Dashboard
          </h1>
          <p style={{ color: '#6b4c35' }}>Live guest reviews from the API.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: 'linear-gradient(135deg, #c8845a, #6b3f20)',
            color: '#fff', border: 'none', padding: '0.6rem 1.5rem',
            borderRadius: '25px', fontWeight: 700, cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Review'}
        </button>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.8rem 1.2rem', borderRadius: '10px', marginBottom: '1rem', fontWeight: 600 }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Add Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fef9f4', border: '1px solid #e8d5bc', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
          <h5 style={{ color: '#3e2410', marginBottom: '1.5rem', fontWeight: 700 }}>Add New Review</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label style={{ color: '#6b4c35', fontWeight: 600, fontSize: '0.85rem' }}>Guest Name *</label>
              <input style={inputStyle} value={form.guestName} onChange={e => setForm({ ...form, guestName: e.target.value })} placeholder="e.g. Priya Sharma" required />
            </div>
            <div className="col-md-6">
              <label style={{ color: '#6b4c35', fontWeight: 600, fontSize: '0.85rem' }}>Type of Experience</label>
              <select style={inputStyle} value={form.experienceType} onChange={e => setForm({ ...form, experienceType: e.target.value })}>
                <option value="">-- Auto Detect --</option>
                {['food', 'host', 'location', 'cleanliness', 'value', 'experience'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label style={{ color: '#6b4c35', fontWeight: 600, fontSize: '0.85rem' }}>Guest Review *</label>
              <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} value={form.reviewText} onChange={e => setForm({ ...form, reviewText: e.target.value })} placeholder="Paste the guest review here... AI will classify sentiment automatically." required />
            </div>
            <div className="col-12">
              <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(135deg, #c8845a, #6b3f20)', color: '#fff', border: 'none', padding: '0.6rem 2rem', borderRadius: '25px', fontWeight: 700, cursor: 'pointer' }}>
                {submitting ? 'Classifying...' : '🔍 Classify & Submit'}
              </button>
              <span style={{ marginLeft: '1rem', fontSize: '0.82rem', color: '#9e7b60' }}>Sentiment & response will be auto-generated</span>
            </div>
          </div>
        </form>
      )}

      {/* Filter buttons */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {['all', 'positive', 'neutral', 'negative'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.4rem 1.2rem', borderRadius: '20px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', background: filter === f ? 'linear-gradient(135deg, #c8845a, #6b3f20)' : '#f5ede0', color: filter === f ? '#fff' : '#6b3f20', transition: 'all 0.2s' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#c8845a' }} role="status"><span className="visually-hidden">Loading...</span></div>
          <p style={{ color: '#6b4c35', marginTop: '1rem' }}>Fetching reviews from API...</p>
        </div>
      )}

      {error && (
        <div style={{ background: '#fce4ec', color: '#c62828', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>⚠️ {error}</div>
      )}

      {!loading && !error && (
        <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(62,36,16,0.1)' }}>
          <table className="table mb-0" style={{ background: '#fef9f4' }}>
            <thead style={{ background: 'linear-gradient(135deg, #3e2410, #6b3f20)', color: '#f5ede0' }}>
              <tr>
                <th style={{ padding: '1rem', border: 'none' }}>#</th>
                <th style={{ padding: '1rem', border: 'none' }}>Guest</th>
                <th style={{ padding: '1rem', border: 'none' }}>Review</th>
                <th style={{ padding: '1rem', border: 'none' }}>Sentiment</th>
                <th style={{ padding: '1rem', border: 'none' }}>Theme</th>
                <th style={{ padding: '1rem', border: 'none' }}>Suggested Response</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((review, index) => (
                <tr key={review.id} style={{ borderBottom: '1px solid #e8d5bc' }}>
                  <td style={{ padding: '1rem', color: '#6b4c35' }}>{index + 1}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#3e2410' }}>{review.guestName}</td>
                  <td style={{ padding: '1rem', color: '#6b4c35', maxWidth: '250px' }}>{review.reviewText}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, background: sentimentBg[review.sentiment], color: sentimentColor[review.sentiment] }}>
                      {review.sentiment === 'positive' ? '😊' : review.sentiment === 'negative' ? '😞' : '😐'} {review.sentiment}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#6b4c35', textTransform: 'capitalize' }}>{review.theme}</td>
                  <td style={{ padding: '1rem', color: '#6b4c35', fontStyle: 'italic', fontSize: '0.88rem' }}>{review.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-4" style={{ background: '#fef9f4', color: '#9e7b60' }}>No reviews found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
