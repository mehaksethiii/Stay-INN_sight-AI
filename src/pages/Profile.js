import React, { useState, useEffect } from 'react';
import { API_URL, getAuthHeaders } from '../utils/api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to load profile.');
      }
      setProfile(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #fef9f4 0%, #f5ede0 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '3rem 2.5rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 40px rgba(62, 36, 16, 0.15)',
    border: '1px solid #e8d5bc',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
  };

  const avatarStyle = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c8845a, #6b3f20)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.2rem',
    fontWeight: 'bold',
    margin: '0 auto 1.5rem auto',
    boxShadow: '0 4px 15px rgba(200, 132, 90, 0.4)',
  };

  const badgeStyle = (provider) => ({
    display: 'inline-block',
    padding: '0.35rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: provider === 'google' ? '#e8f0fe' : '#fef9f4',
    color: provider === 'google' ? '#1a73e8' : '#6b3f20',
    border: provider === 'google' ? '1px solid #d2e3fc' : '1px solid #e8d5bc',
    marginTop: '0.5rem',
  });

  const detailGroupStyle = {
    textAlign: 'left',
    marginTop: '2rem',
    borderTop: '1px solid #e8d5bc',
    paddingTop: '1.5rem',
  };

  const detailItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '0.95rem',
  };

  const labelStyle = {
    color: '#9e7b60',
    fontWeight: '600',
    flex: '1',
  };

  const valueStyle = {
    color: '#3e2410',
    fontWeight: '700',
    flex: '2',
    textAlign: 'right',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#c8845a' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: '#6b4c35', marginTop: '1rem', fontWeight: 600 }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{ ...cardStyle, maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h4 style={{ color: '#c62828', marginBottom: '1rem' }}>Error Loading Profile</h4>
          <p style={{ color: '#6b4c35', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={fetchProfile}
            style={{
              background: 'linear-gradient(135deg, #c8845a, #6b3f20)',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '25px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const initials = profile?.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const creationDate = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'N/A';

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={avatarStyle}>
          {initials}
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 'bold', color: '#3e2410', marginBottom: '0.2rem' }}>
          {profile?.name}
        </h3>
        <p style={{ color: '#9e7b60', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{profile?.email}</p>
        <span style={badgeStyle(profile?.provider)}>
          {profile?.provider === 'google' ? '🔑 Google Sign-In' : '✉️ Password Account'}
        </span>

        <div style={detailGroupStyle}>
          <div style={detailItemStyle}>
            <span style={labelStyle}>User ID</span>
            <span style={{ ...valueStyle, fontSize: '0.85rem', fontFamily: 'monospace', color: '#6b4c35' }}>
              {profile?._id}
            </span>
          </div>
          <div style={detailItemStyle}>
            <span style={labelStyle}>Registration Date</span>
            <span style={valueStyle}>{creationDate}</span>
          </div>
          <div style={detailItemStyle}>
            <span style={labelStyle}>Account Status</span>
            <span style={{ ...valueStyle, color: '#2e7d32' }}>✅ Active</span>
          </div>
        </div>

        <button
          onClick={() => window.history.back()}
          style={{
            background: 'none',
            border: '2px solid #c8845a',
            color: '#c8845a',
            padding: '0.6rem 2rem',
            borderRadius: '25px',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '2rem',
            transition: 'all 0.2s',
            width: '100%',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#c8845a'; e.target.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.target.style.background = 'none'; e.target.style.color = '#c8845a'; }}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}

export default Profile;
