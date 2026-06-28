import React from 'react';

function Card({ title, description, image, action, sentiment }) {
  const sentimentClass = {
    positive: 'sentiment-positive',
    neutral: 'sentiment-neutral',
    negative: 'sentiment-negative',
  }[sentiment] || 'sentiment-positive';

  return (
    <div className="review-card">
      {image && <img src={image} alt={title} />}
      <div className="review-card-body">
        {sentiment && (
          <span className={`sentiment-badge ${sentimentClass}`}>
            {sentiment === 'positive' ? '😊 Positive' : sentiment === 'negative' ? '😞 Negative' : '😐 Neutral'}
          </span>
        )}
        <h5 className="review-card-title">{title}</h5>
        <p className="review-card-text">{description}</p>
        {action && (
          <button className="card-btn" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
