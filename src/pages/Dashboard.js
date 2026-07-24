import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { API_URL, getAuthHeaders } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

function Dashboard() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Editing state
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ guestName: '', reviewText: '', experienceType: '' });
  const [updating, setUpdating] = useState(false);

  // Deleting state
  const [deletingId, setDeletingId] = useState(null);

  // Create form state
  const [form, setForm] = useState({
    guestName: '',
    reviewText: '',
    experienceType: '',
  });

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/reviews`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch reviews.');
      }
    } catch (err) {
      setError('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Create Review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to add review.');
        setSubmitting(false);
        return;
      }
      setReviews(prev => [data.data, ...prev]);
      setForm({ guestName: '', reviewText: '', experienceType: '' });
      setShowForm(false);
      setSuccessMsg('✅ Review submitted and analyzed with AI!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError('Failed to add review.');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleStartEdit = (review) => {
    setEditingReview(review);
    setEditForm({
      guestName: review.guestName || '',
      reviewText: review.reviewText || '',
      experienceType: review.theme || review.experienceType || '',
    });
  };

  // Submit Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingReview) return;
    setUpdating(true);
    try {
      const res = await fetch(`${API_URL}/api/reviews/${editingReview._id || editingReview.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to update review.');
        setUpdating(false);
        return;
      }
      setReviews(prev => prev.map(r => ((r._id || r.id) === (editingReview._id || editingReview.id) ? data.data : r)));
      setEditingReview(null);
      setSuccessMsg('✅ Review updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError('Failed to update review.');
    } finally {
      setUpdating(false);
    }
  };

  // Delete Review
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${API_URL}/api/reviews/${deletingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok || res.status === 204) {
        setReviews(prev => prev.filter(r => (r._id || r.id) !== deletingId));
        setSuccessMsg('🗑️ Review deleted successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete review.');
      }
    } catch (err) {
      setError('Failed to delete review.');
    } finally {
      setDeletingId(null);
    }
  };

  // Memoized Filtered & Searched List
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesSentiment = filter === 'all' || r.sentiment === filter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (r.guestName && r.guestName.toLowerCase().includes(q)) ||
        (r.reviewText && r.reviewText.toLowerCase().includes(q)) ||
        (r.theme && r.theme.toLowerCase().includes(q));
      return matchesSentiment && matchesSearch;
    });
  }, [reviews, filter, searchQuery]);

  const sentimentColor = { positive: '#2e7d32', neutral: '#f57f17', negative: '#c62828' };
  const sentimentBg = { positive: '#e8f5e9', neutral: '#fff8e1', negative: '#fce4ec' };

  const inputStyle = {
    width: '100%', padding: '0.65rem 1rem', borderRadius: '10px',
    border: '1px solid #e8d5bc', background: '#fef9f4',
    color: '#3e2410', fontSize: '0.9rem', outline: 'none',
  };

  return (
    <div className="container my-5 px-3">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#3e2410', margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ color: '#6b4c35', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
            Welcome back, <strong>{user?.name?.split(' ')[0] || 'Manager'}</strong>! Manage and inspect guest reviews in real-time.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: 'linear-gradient(135deg, #c8845a, #6b3f20)',
            color: '#fff', border: 'none', padding: '0.65rem 1.6rem',
            borderRadius: '25px', fontWeight: 700, cursor: 'pointer',
            fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(107, 63, 32, 0.2)'
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Review'}
        </button>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.8rem 1.2rem', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 600, border: '1px solid #c8e6c9', boxShadow: '0 2px 8px rgba(46,125,50,0.1)' }}>
          {successMsg}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{ background: '#fce4ec', color: '#c62828', borderRadius: '12px', padding: '0.8rem 1.2rem', marginBottom: '1.5rem', border: '1px solid #ffcdd2' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Add Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fef9f4', border: '1px solid #e8d5bc', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 8px 30px rgba(62,36,16,0.08)' }}>
          <h5 style={{ color: '#3e2410', marginBottom: '1.25rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
            ✨ Submit New Guest Review
          </h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label style={{ color: '#6b4c35', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.35rem' }}>Guest Name *</label>
              <input style={inputStyle} value={form.guestName} onChange={e => setForm({ ...form, guestName: e.target.value })} placeholder="e.g. Priya Sharma" required />
            </div>
            <div className="col-md-6">
              <label style={{ color: '#6b4c35', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.35rem' }}>Type of Experience</label>
              <select style={inputStyle} value={form.experienceType} onChange={e => setForm({ ...form, experienceType: e.target.value })}>
                <option value="">-- Auto Detect Theme --</option>
                {['food', 'host', 'location', 'cleanliness', 'value', 'experience'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label style={{ color: '#6b4c35', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.35rem' }}>Guest Review *</label>
              <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} value={form.reviewText} onChange={e => setForm({ ...form, reviewText: e.target.value })} placeholder="Paste the guest review here... AI will analyze sentiment and theme automatically." required />
            </div>
            <div className="col-12 d-flex align-items-center flex-wrap gap-2">
              <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(135deg, #c8845a, #6b3f20)', color: '#fff', border: 'none', padding: '0.65rem 2rem', borderRadius: '25px', fontWeight: 700, cursor: 'pointer' }}>
                {submitting ? '🤖 AI Classifying...' : '🔍 Submit & Analyze'}
              </button>
              <span style={{ fontSize: '0.82rem', color: '#9e7b60' }}>AI automatically categorizes sentiment and suggested responses.</span>
            </div>
          </div>
        </form>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(62, 36, 16, 0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '1rem'
        }}>
          <form onSubmit={handleUpdate} style={{
            background: '#fef9f4', borderRadius: '20px', maxWidth: '540px',
            width: '100%', padding: '2rem', border: '1px solid #e8d5bc',
            boxShadow: '0 20px 50px rgba(62,36,16,0.25)'
          }}>
            <h5 style={{ color: '#3e2410', fontWeight: 700, marginBottom: '1.25rem', fontFamily: "'Playfair Display', serif" }}>
              ✏️ Edit Review
            </h5>
            <div className="mb-3">
              <label style={{ color: '#6b4c35', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.35rem' }}>Guest Name</label>
              <input style={inputStyle} value={editForm.guestName} onChange={e => setEditForm({ ...editForm, guestName: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label style={{ color: '#6b4c35', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.35rem' }}>Experience Category</label>
              <select style={inputStyle} value={editForm.experienceType} onChange={e => setEditForm({ ...editForm, experienceType: e.target.value })}>
                {['food', 'host', 'location', 'cleanliness', 'value', 'experience'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label style={{ color: '#6b4c35', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.35rem' }}>Review Text</label>
              <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} value={editForm.reviewText} onChange={e => setEditForm({ ...editForm, reviewText: e.target.value })} required />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" onClick={() => setEditingReview(null)} style={{ background: '#f5ede0', color: '#6b3f20', border: '1px solid #e8d5bc', padding: '0.5rem 1.2rem', borderRadius: '20px', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={updating} style={{ background: 'linear-gradient(135deg, #c8845a, #6b3f20)', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '20px', fontWeight: 700, cursor: 'pointer' }}>
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Review?"
        message="Are you sure you want to delete this guest review? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

      {/* Filter and Search Controls */}
      <div className="row g-2 mb-4 align-items-center">
        <div className="col-md-6 col-12 d-flex gap-2 flex-wrap">
          {['all', 'positive', 'neutral', 'negative'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.4rem 1.1rem', borderRadius: '20px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', background: filter === f ? 'linear-gradient(135deg, #c8845a, #6b3f20)' : '#f5ede0', color: filter === f ? '#fff' : '#6b3f20', transition: 'all 0.2s' }}>
              {f === 'all' ? 'All Reviews' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="col-md-6 col-12">
          <input
            type="text"
            placeholder="🔎 Search by guest, text, or theme..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, background: '#fff' }}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#c8845a', width: '2.5rem', height: '2.5rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#6b4c35', marginTop: '1rem', fontWeight: 600 }}>Fetching live reviews from API...</p>
        </div>
      )}

      {/* Main Content Area: Table / Empty State */}
      {!loading && (
        filteredReviews.length === 0 ? (
          <EmptyState
            title={searchQuery || filter !== 'all' ? "No Matching Reviews" : "No Reviews Yet"}
            message={searchQuery || filter !== 'all' ? `No reviews found for filter "${filter}" and search "${searchQuery}". Try resetting filters or search query.` : "Your database is empty. Add your first guest review to test live CRUD operations!"}
            actionText={searchQuery || filter !== 'all' ? "Reset Filters" : "+ Add First Review"}
            onAction={searchQuery || filter !== 'all' ? () => { setFilter('all'); setSearchQuery(''); } : () => setShowForm(true)}
          />
        ) : (
          <div style={{ borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 25px rgba(62,36,16,0.08)', border: '1px solid #e8d5bc' }}>
            <div className="table-responsive">
              <table className="table mb-0 align-middle" style={{ background: '#fef9f4' }}>
                <thead style={{ background: 'linear-gradient(135deg, #3e2410, #6b3f20)', color: '#f5ede0' }}>
                  <tr>
                    <th style={{ padding: '1rem', border: 'none' }}>#</th>
                    <th style={{ padding: '1rem', border: 'none' }}>Guest</th>
                    <th style={{ padding: '1rem', border: 'none', minWidth: '220px' }}>Review</th>
                    <th style={{ padding: '1rem', border: 'none' }}>Sentiment</th>
                    <th style={{ padding: '1rem', border: 'none' }}>Theme</th>
                    <th style={{ padding: '1rem', border: 'none', minWidth: '200px' }}>Response</th>
                    <th style={{ padding: '1rem', border: 'none', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((review, index) => {
                    const id = review._id || review.id;
                    return (
                      <tr key={id} style={{ borderBottom: '1px solid #e8d5bc' }}>
                        <td style={{ padding: '1rem', color: '#6b4c35', fontWeight: 600 }}>{index + 1}</td>
                        <td style={{ padding: '1rem', fontWeight: 700, color: '#3e2410' }}>{review.guestName}</td>
                        <td style={{ padding: '1rem', color: '#6b4c35', lineHeight: 1.5 }}>{review.reviewText}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, background: sentimentBg[review.sentiment] || '#fff8e1', color: sentimentColor[review.sentiment] || '#f57f17' }}>
                            {review.sentiment === 'positive' ? '😊' : review.sentiment === 'negative' ? '😞' : '😐'} {review.sentiment}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: '#6b4c35', textTransform: 'capitalize', fontWeight: 600 }}>{review.theme || 'experience'}</td>
                        <td style={{ padding: '1rem', color: '#6b4c35', fontStyle: 'italic', fontSize: '0.85rem' }}>{review.response || 'N/A'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleStartEdit(review)}
                              title="Edit Review"
                              style={{ background: '#f5ede0', border: '1px solid #e8d5bc', borderRadius: '8px', color: '#6b3f20', padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => setDeletingId(id)}
                              title="Delete Review"
                              style={{ background: '#fce4ec', border: '1px solid #ffcdd2', borderRadius: '8px', color: '#c62828', padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Dashboard;
